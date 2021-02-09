const mongoose = require("mongoose");
const BankNotification = require('../models/BankNotification');
const User = require('../models/User');
const {createSocketConsumer, disconnectConsumer} = require('./consumer')
const {producer, sendNotification} = require('./producer');

const amqplib = require("amqplib/callback_api");

const connectRabbit = (callback=null) => {
    amqplib.connect({ host: process.env.RABBIT_SERVER },(err,conn)=>{
        if(!err && !!callback) callback(conn);
    })
}

module.exports = {connectRabbit, producer, createSocketConsumer, disconnectConsumer, sendNotification}