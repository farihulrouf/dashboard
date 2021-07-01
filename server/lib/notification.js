const {sendNotification, sendEmail} = require("../rabbitmq")
const mongoose = require("mongoose")
const User = mongoose.model("User")
const Course = mongoose.model("Course")
const DiscussionAnswer = mongoose.model("DiscussionAnswer")
const {NOTIFICATION: {TARGET}, EMAIL_TEMPLATE} = require("../../constant")

const sendAppNotification = (notification) => {
  if (!notification._doc.isExist){
    sendNotification(process.env.NOTIFICATION_OUTGOING_EXCHANGE,notification);
  }
}

const sendEmailNotification = (notification) => {
  if (!notification._doc.isExist){
    sendEmailAsync(notification)
    .then(val => {
      return
    })
    .catch(err => {
      console.log(err.message)
      return
    })
  }
  return
}

const sendEmailAsync = async (notification) => {
  const {course, additionalObject} = await getNotificationObject(notification)
  const targets = await getNotificationTargetEmails(notification.target, course, additionalObject)

  const dev = process.env.NODE_ENV !== "production";
  const port = process.env.PORT || 3000;
  const ROOT_URL = dev ? `http://localhost:${port}` : process.env.PRODUCTION_URL;
  
  for (let i = 0; i < targets.length; i++) {
    sendEmail(
      process.env.EMAIL_EXCHANGE,
      {
        ...targets[i]._doc,
        template: EMAIL_TEMPLATE.NOTIFICATION,
        link: ROOT_URL + notification.url,
        subject: "You have a Notification",
        message: notification.message
      }
    )
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
    case "Payment":
      course = await Course.findById(additionalObject.course)
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
    else if(target[i] === TARGET.PAYMENT_CREATOR){
      targetId.push(additionalObject.user)
    }
  }

  return targetId
}

const getNotificationTargetEmails = async (target, course, additionalObject) => {
  let targetUsers = getNotificationTargets(target, course, additionalObject)
  return await User.find(
    {_id : {$in : targetUsers.map(user => user._id)}},
    'name email'
  )
}

const populateEmailTemplate = (template, object) => {
  const names = Object.keys(object);
  const vals = Object.values(object);
  return new Function(...names, `return \`${template}\`;`)(...vals);
}

module.exports = {
  sendAppNotification,
  sendEmailNotification,
  getNotificationObject, 
  getNotificationTargets, 
  getNotificationTargetEmails, 
  populateEmailTemplate
}