const bail = (err) => {
    if (err != null){
        console.log(err);
        process.exit();
    }
    console.log("Consumer connect to RABBIT")
}

const createSocketConsumer = (conn,options,socket)=>{
    const on_open = (err, ch)=>{
        bail(err);
        ch.assertQueue(queue, {autoDelete: true, exclusive: true});
        ch.assertExchange(exchange, 'fanout',{durable: true});
        ch.bindQueue(queue, exchange, '', {}, (err,ok)=> {
            if(!!err){
                console.log(err);
                process.exit();
            }
        })
        ch.consume(queue, function(msg) {
            if (msg !== null) {
                socket.emit('notification',msg.content.toString());
                ch.ack(msg);
            }
        });
    }

    const {queue, exchange} = options;
    var ok = conn.createChannel(on_open);
    return ok;
}

const disconnectConsumer = (ch) => {
    if(!!ch) ch.close();
}

module.exports = {createSocketConsumer, disconnectConsumer}