const {sendNotification} = require("../server/rabbitmq")
const mongoose = require("mongoose")
const Course = mongoose.model("Course")
const {NOTIFICATION: {TARGET}} = require("../constant")

const sendAppNotification = (notification) => {
  if (!notification.isExist){
    sendNotification(process.env.NOTIFICATION_OUTGOING_EXCHANGE,notification);
  }
}

const getNotificationObject = async (notification) => {
  const additionalModel = mongoose.model(notification.onModel)
  const additionalObject = await additionalModel.findById(notification.notifOn)
  let course = null

  switch (notification.onModel) {
    case "Post":
      course = await Course.findById(additionalObject.postedOn)
      break;
    case "Course":
      course = additionalObject
      break;
    case "Discussion":
      course = await Course.findById(additionalObject.postedOn)
    default:
      break;
  }

  return {course, additionalObject}
}

const getNotificationTargets = (target, course, additionalObject) => {
  let targetId = []
  for (let i = 0; i < target.length; i++) {
    if (target[i] === TARGET.INSTRUCTORS){
      targetId = targetId.concat(course.instructors)
    }
    else if(target[i] === TARGET.STUDENTS){
      targetId = targetId.concat(course.participants)
    }
    else if(target[i] === TARGET.ORGANIZATIONS){
      targetId = targetId.push(course.creator)
    }
  }

  return targetId
}

module.exports = {sendAppNotification, getNotificationObject, getNotificationTargets}