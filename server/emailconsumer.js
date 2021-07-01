//This is an independent process
//Consume rabbit queue to process email service
require("dotenv").config();
var User = require('./models/User');
var Course = require('./models/Course');
var Post = require('./models/Post');
var Comment = require('./models/Comment');
var TeacherApplication = require('./models/TeacherApplication');
var DiscussionAnswer = require('./models/DiscussionAnswer')
var BankNotification = require('./models/BankNotification');
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const {connectRabbit} = require("./rabbitmq")
const {populateEmailTemplate} = require('./lib/notification')

const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  };
  
mongoose.set('useUnifiedTopology', true);
mongoose
.connect(
    process.env.MONGO_URI,
    mongooseOptions
)
.then(() => console.log("Emailconsumer connected to DB"));


const bail = (err) => {
    if (err != null){
        console.log(err);
        process.exit();
    }
    console.log("Emailconsumer connected to RABBIT")
}

var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST,
    port: process.env.EMAIL_SERVICE_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVICE_USER, // generated ethereal user
      pass: process.env.EMAIL_SERVICE_PASSWORD, // generated ethereal password
    },
});

const connectRabbitCallback = (conn) => {
    const on_open = (err,ch) =>{
        bail(err);
        ch.assertQueue(process.env.EMAIL_EXCHANGE);
        ch.consume(process.env.EMAIL_QUEUE,(msg)=>{
            if(msg !== null){
                const message = JSON.parse(msg.content.toString());
                processEmailService(message).then(res => {
                    ch.ack(msg);
                })
            }
        })
    }
    conn.createChannel(on_open)
}

const processEmailService = async (content) => {
    const {email, subject, template} = content;
    const body = populateEmailTemplate(template, content)
    let info = await transporter.sendMail({
        from: `Admin Klassiq <${process.env.EMAIL_SERVICE_USER}>`, // sender address
        to: `${email}`, // list of receivers
        subject: `${subject}`, // Subject line
        // text: "Hello world?", // plain text body
        html: body, // html body
    });
    console.log("Message sent: %s", info.messageId);
}

connectRabbit(connectRabbitCallback);