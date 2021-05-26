const express = require("express");
const next = require("next");
const session = require("express-session");
const mongoose = require("mongoose");
const logger = require("morgan");
const mongoSessionStore = require("connect-mongo");
const expressValidator = require("express-validator");
const passport = require("passport");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const socketio = require("socket.io");
const passportSocketIo = require("passport.socketio");
const cookieParser = require("cookie-parser");
const http = require("http");

/* Loads all variables from .env file to "process.env" */
require("dotenv").config();
/* Require our models here so we can use the mongoose.model() singleton to reference our models across our app */
require("./models/Course");
require("./models/User");
require("./models/Exercise");
require("./models/Post");
require("./models/Comment");
require("./models/CourseRequest");
require("./models/QuestionPool");
require("./models/AnswerSheet");
require("./models/Exam");
require("./models/TeacherApplication");
require("./models/BankNotification");
require("./models/Discussion");
require("./models/Attachment")
require("./models/Payment")
require("./models/Review")
require('./models/DiscussionAnswer');
require('./models/Tag');
require('./models/ExerciseResult');
require('./models/QuestionPoolAnswer');
require('./models/Room')

const routes = require("./routes");
const { callbackify } = require("util");
const { addActiveUser, removeActiveUser, getAllActiveUsers } = require("./sockets/active_users");
const {connectRabbit, producer, createSocketConsumer, disconnectConsumer} =  require("./rabbitmq");

require("./passport");
// require('./path/to/passport/config/file')(passport);

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const ROOT_URL = dev ? `http://localhost:${port}` : process.env.PRODUCTION_URL;
const app = next({ dev });
const handle = app.getRequestHandler();

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.set('useUnifiedTopology', true);
mongoose.set('runValidators', true);
mongoose
  .connect(process.env.MONGO_URI, mongooseOptions)
  .then(() => console.log("app connected to DB"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});

app.prepare().then(() => {
  const server = express();
  const app = http.createServer(server);
  const io = socketio(app);

  if (!dev) {
    /* Helmet helps secure our app by setting various HTTP headers */
    server.use(helmet());
    /* Compression gives us gzip compression */
    server.use(compression());
  }

  server.use((req, res, next) => {
    if (process.env.NODE_ENV === "production") {
      // if (req.headers.host === 'your-app.herokuapp.com')
      //     return res.redirect(301, 'https://www.your-custom-domain.com');
      if (req.headers["x-forwarded-proto"] !== "https")
        return res.redirect("https://" + req.headers.host + req.url);
      else return next();
    } else return next();
  });

  /* Body Parser built-in to Express as of version 4.16 */
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  // server.use(express.static('static'))
  /* Express Validator will validate form data sent to the backend */
  server.use(expressValidator());
  server.use(cors());

  /* give all Next.js's requests to Next.js server */
  server.get("/_next/*", (req, res) => {
    handle(req, res);
  });

  server.get("/static/*", (req, res) => {
    handle(req, res);
  });

  const MongoStore = mongoSessionStore(session);
  const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 14 * 24 * 60 * 60, // save session for 14 days
  });

  const sessionConfig = {
    name: "next-connect.sid",
    // secret used for using signed cookies w/ the session
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    // forces the session to be saved back to the store
    resave: false,
    // don't save unmodified sessions
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14, // expires in 14 days
    },
  };

  if (!dev) {
    sessionConfig.cookie.secure = true; // serve secure cookies in production environment
    server.set("trust proxy", 1); // trust first proxy
  }

  /* Apply our session configuration to express-session */
  server.use(session(sessionConfig));

  /* Add passport middleware to set passport up */
  server.use(passport.initialize());
  server.use(passport.session());

  server.use((req, res, next) => {
    /* custom middleware to put our user data (from passport) on the req.user so we can access it as such anywhere in our app */
    res.locals.user = req.user || null;
    next();
  });

  /* morgan for request logging from client
  - we use skip to ignore static files from _next folder */
  server.use(
    logger("dev", {
      skip: (req) => req.url.includes("_next"),
    })
  );

  /* apply routes from the "routes" folder */
  server.use("/", routes);

  /* Error handling from async / await functions */
  server.use((err, req, res, next) => {
    const { status = 500, message } = err;
    res.status(status).json(message);
  });

  /* create custom routes with route params */
  server.get("/profile/:userId", (req, res) => {
    const routeParams = Object.assign({}, req.params, req.query);
    return app.render(req, res, "/profile", routeParams);
  });

  /* default route
     - allows Next to handle all other routes
     - includes the numerous `/_next/...` routes which must    be exposedfor the next app to work correctly
     - includes 404'ing on unknown routes */
  server.get("*", (req, res) => {
    handle(req, res);
  });


  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: "next-connect.sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail,
  }))

  function onAuthorizeSuccess(data, accept){
    console.log('successful connection to socket.io');
    accept(null, true);
  }
  
  function onAuthorizeFail(data, message, error, accept){
    if(error)
      throw new Error(message);
    console.log('failed connection to socket.io:', message);
    accept(null, false);
  }

  function connectRabbitCallback(conn){
    producer(conn);
    io.on('connection', (socket) => {
      console.log('connection handler running');
      const {user} = socket.request;
      let channel = null;
      if(user.logged_in !== false){
          const opt = { queue: socket.id, exchange: user.id}
          channel = createSocketConsumer(conn,opt,socket)
      }
      socket.on('disconnect',()=>{
          console.log(`${socket.id} is disconnected`);
          disconnectConsumer(channel);
      })
    })
  }

  connectRabbit(connectRabbitCallback);

  server.set('socketio', io);

  app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server listening on ${ROOT_URL}`);
  });
});
