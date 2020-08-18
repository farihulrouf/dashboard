const bail = (err) => {
    if (err != null){
        console.log(err);
        process.exit();
    }
    console.log("RABBIT READY")
}

let channel = null;

const producer = (conn)=>{
    channel = conn.createChannel(on_open);
    function on_open(err, ch) {
        bail(err);
        ch.assertExchange(process.env.NOTIFICATION_OUTGOING_EXCHANGE,'direct');
        ch.assertQueue(process.env.NOTIFICATION_QUEUE);
        ch.bindQueue(process.env.NOTIFICATION_QUEUE, process.env.NOTIFICATION_OUTGOING_EXCHANGE,'notification',{},(err,ok)=>{
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

module.exports = {producer, sendNotification};