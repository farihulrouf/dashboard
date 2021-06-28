const {sendNotification} = require("../server/rabbitmq")
const mongoose = require("mongoose")
const Course = mongoose.model("Course")
const DiscussionAnswer = mongoose.model("DiscussionAnswer")
const {NOTIFICATION: {TARGET}} = require("../constant")

const sendAppNotification = (notification) => {
  if (!notification.isExist){
    sendNotification(process.env.NOTIFICATION_OUTGOING_EXCHANGE,notification);
  }
}

const getNotificationObject = async (notification) => {
  const additionalModel = mongoose.model(notification.onModel)
  let additionalObject = await additionalModel.findById(notification.notifOn)
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
      break
    case "DiscussionAnswer":
      additionalObject = await additionalObject.populate("discussion").execPopulate()
      course = await Course.findById(additionalObject.discussion.postedOn)
      break
    default:
      break;
  }

  return {course, additionalObject}
}

const getNotificationTargets = (target, course, additionalObject) => {
  let targetId = []
  for (let i = 0; i < target.length; i++) {
    if (target[i] === TARGET.INSTRUCTORS){
      targetId.push(...course.instructors)
    }
    else if(target[i] === TARGET.STUDENTS){
      targetId.push(...course.participants)
    }
    else if(target[i] === TARGET.ORGANIZATIONS){
      targetId.push(course.creator)
    }
    else if(target[i] === TARGET.DISCUSSION_CREATOR){
      targetId.push(additionalObject.creator)
    }
    else if(target[i] === TARGET.DISCUSSION_ANSWER_CREATOR){
      targetId.push(additionalObject.creator)
    }
    else if(target[i] === TARGET.DISCUSSION_ANSWER_CREATOR_ALL){
      DiscussionAnswer.find({discussion : additionalObject._id}, (err, answers) => {
        if(!err){
          let answerGiverIds = answers.map(ans => ans.creator)
          targetId.push(...answerGiverIds)
        }
      })
    }
  }

  return targetId
}

module.exports = {sendAppNotification, getNotificationObject, getNotificationTargets}