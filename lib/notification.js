const {sendNotification} = require("../server/rabbitmq");

const sendAppNotification = (notification) => {
  if (!notification.isExist){
    sendNotification(process.env.NOTIFICATION_OUTGOING_EXCHANGE,notification);
  }
}

module.exports = {sendAppNotification}