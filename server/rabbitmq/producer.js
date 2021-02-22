const bail = (err) => {
    if (err != null){
        console.log(err);
        process.exit();
    }
    console.log("Producer connect to RABBIT")
}

let channel = null;

const producer = (conn)=>{
    channel = conn.createChannel(on_open);
    function on_open(err, ch) {
        bail(err);
        ch.assertExchange(process.env.NOTIFICATION_OUTGOING_EXCHANGE,'direct');
        ch.assertExchange(process.env.EMAIL_EXCHANGE, 'direct')
        ch.assertQueue(process.env.NOTIFICATION_QUEUE);
        ch.assertQueue(process.env.EMAIL_QUEUE)
        ch.bindQueue(process.env.NOTIFICATION_QUEUE, process.env.NOTIFICATION_OUTGOING_EXCHANGE,'notification',{},(err,ok)=>{
          if(!!err){
            console.log(err);
            process.exit();
          }
        })
        ch.bindQueue(process.env.EMAIL_QUEUE, process.env.EMAIL_EXCHANGE, 'emailservice',{},(err,ok)=>{
            if(!!err){
                console.log(err);
                process.exit();
            }
        })
    }
}


const sendNotification = (exchange,notification) => {
    channel.publish(
        exchange, 
        'notification', 
        Buffer.from(JSON.stringify({id: notification.id}))
    );
}

const sendEmail = (exchange, otp_info) => {
    const routingKey = 'emailservice'
    const content = Buffer.from(JSON.stringify(otp_info))
    channel.publish(
        exchange,
        routingKey,
        content
    );
}

module.exports = {producer, sendNotification, sendEmail};