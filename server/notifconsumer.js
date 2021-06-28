//This is an independent process
//Consume rabbit queue to process notification
//Broadcast processed notification to client socket
require("dotenv").config();
var User = require('./models/User');
var Course = require('./models/Course');
var Post = require('./models/Post');
var Discussion = require('./models/Discussion');
var DiscussionAnswer = require('./models/DiscussionAnswer');
var Tag = require('./models/Tag')
var BankNotification = require('./models/BankNotification');
const mongoose = require("mongoose");
const {connectRabbit} = require("./rabbitmq")
const {getNotificationObject, getNotificationTargets} = require("../lib/notification")

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
.then(() => console.log("Notifconsumer connected to DB"));

mongoose.connection.on("error", err => {
console.log(`DB connection error: ${err.message}`);
});

const bail = (err) => {
    if (err != null){
        console.log(err);
        process.exit();
    }
    console.log("Notifconsumer connected to RABBIT")
}

const connectRabbitCallback = (conn) => {
    const on_open = (err,ch) =>{
        bail(err);
        ch.assertQueue(process.env.NOTIFICATION_QUEUE);
        ch.consume(process.env.NOTIFICATION_QUEUE,(msg)=>{
            if(msg !== null){
                const message = JSON.parse(msg.content.toString());
                processNotification(message).then((res)=>{
                    if(Object.keys(res).length>0){
                        const {notification, users} = res;
                        users.forEach(user => {
                            ch.assertExchange(user._id.toString(),'fanout', {}, (err, ok) => {
                                if(ok){
                                    ch.publish(user._id.toString(), '', Buffer.from(JSON.stringify(notification)))
                                }
                            })
                        })
                    }
                    ch.ack(msg);
                });
            }
        })
    }
    conn.createChannel(on_open)
}

const processNotification = async (notification) => {
    const {id} = notification;
    const bankNotif = await BankNotification.findById(id);
    if(!!bankNotif && !bankNotif.processed){
        const {course, additionalObject} = await getNotificationObject(bankNotif)
        const notifTarget = getNotificationTargets(bankNotif.target, course, additionalObject)
        console.log(notifTarget)
        await User.updateMany(
            {_id: {$in : notifTarget}}, 
            {
                $inc: {"notifications.total": 1, "notifications.unread": 1}, 
                $addToSet: {"notifications.list": {bankNotification: bankNotif._id, status: 'unread'}} 
            }    
        )
        await bankNotif.update({processed: true})
        return {notification: bankNotif, users: notifTarget}
    }
    return {}
}


connectRabbit(connectRabbitCallback);