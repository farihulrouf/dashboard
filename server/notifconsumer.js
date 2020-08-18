//This is an independent process
//Consume rabbit queue to process notification
//Broadcast processed notification to client socket
require("dotenv").config();
var User = require('./models/User');
var Course = require('./models/Course');
var Post = require('./models/Post');
var Comment = require('./models/Comment');
var TeacherApplication = require('./models/TeacherApplication');
var BankNotification = require('./models/BankNotification');
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
.then(() => console.log("DB connected"));

mongoose.connection.on("error", err => {
console.log(`DB connection error: ${err.message}`);
});

const bail = (err) => {
    if (err != null){
        console.log(err);
        process.exit();
    }
    console.log("RABBIT READY")
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
                            ch.assertExchange(user._id.toString(),'fanout')
                            ch.publish(user._id.toString(), '', Buffer.from(JSON.stringify(notification)))
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

    if(!bankNotif.processed){
        const Model = mongoose.model(bankNotif.onModel);
        const object = await Model.findById(bankNotif.notifOn);

        switch(bankNotif.onModel){
            case 'Course': 
                await User.updateMany(
                    {_id: object.participants}, 
                    {
                        $inc: {"notifications.total": 1, "notifications.unread": 1}, 
                        $addToSet: {"notifications.list": {bankNotification: bankNotif._id, status: 'unread'}} 
                    }
                )
                await bankNotif.update({processed: true})
                broadcast = {notification: bankNotif, users: object.participants}
                return broadcast;
            case 'Post':
                await User.updateOne(
                    {_id: object.postedBy}, 
                    {
                        $inc: {"notifications.total": 1, "notifications.unread": 1}, 
                        $addToSet: {"notifications.list": {bankNotification: bankNotif._id, status: 'unread'}} 
                    }    
                )
                await bankNotif.update({processed: true})
                broadcast = {notification: bankNotif, users: [object.postedBy]}
                return broadcast
            case 'default':
                return {}
        }
    }
    return {}
}


connectRabbit(connectRabbitCallback);