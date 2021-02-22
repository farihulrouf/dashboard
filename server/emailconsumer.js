//This is an independent process
//Consume rabbit queue to process email service
require("dotenv").config();
var User = require('./models/User');
var Course = require('./models/Course');
var Post = require('./models/Post');
var Comment = require('./models/Comment');
var TeacherApplication = require('./models/TeacherApplication');
var BankNotification = require('./models/BankNotification');
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const {connectRabbit} = require("./rabbitmq")

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
    console.log(content)
    //content={emaiL: ex, otp: something}
    const {email, name, otp} = content;
    const body=`Hello ${name}, welcome to KLASSIQ. We glad you join us today, first of all please confirm your email.
    Here is your OTP to confirm your email <b>${otp}</b>`
    let info = await transporter.sendMail({
        from: `Admin Klassiq <${process.env.EMAIL_SERVICE_USER}>`, // sender address
        to: `${email}`, // list of receivers
        subject: "Welcome to Klassiq", // Subject line
        // text: "Hello world?", // plain text body
        html: body, // html body
    });
    console.log("Message sent: %s", info.messageId);
}

connectRabbit(connectRabbitCallback);