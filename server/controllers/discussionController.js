const mongoose = require("mongoose");
const User = require("../models/User");
const Discussion = require("../models/Discussion")
const Course = mongoose.model("Course");
const DiscussionAnswer = mongoose.model("DiscussionAnswer");
const BankNotification = mongoose.model("BankNotification")
const {sendAppNotification} = require("../../lib/notification")

exports.validateDiscussion = (req,res,next) => {
    req.sanitize("title");
    req.sanitize("body");
    req.checkBody("title", "Discussion should have a title").notEmpty()
    req.checkBody("body","Discussion should have a body").notEmpty();
    req.checkBody("postedOn","Discussion should have course").notEmpty();
    
    const errors = req.validationErrors();
    if(errors){
        return res.status(500).json({status: "error", message: errors});
    }
    next();
}


exports.updateDiscussion = (req,res) => {
    const discussionid = req.discussion._id;
    const {title, body, tags} = req.body;
    Discussion.findByIdAndUpdate(
        discussionid,
        {$set: {title: title, body: body, tags: tags}},
        {
          new: true, 
          populate: {
              path: "answers.topAnswers", 
              populate : {
                path : "creator",
              }
            }
        })
        .populate("tags")
        .populate("creator")
        .exec((err,updatedDiscussion)=> {
            console.log(updatedDiscussion)
            if(err) return res.json({status: 'error', message: err.message})
            updatedDiscussion._doc.canEdit = true;
            updatedDiscussion._doc.canDelete = true;
            console.log(updatedDiscussion)
            res.json({status: "ok", discussion: updatedDiscussion})
        })
}

exports.deleteDiscussion = async (req, res, next) => {
  const {discussionid} = req.params;
  console.log(discussionid);
  const {user} = req
  const discussion = await Discussion.findById(discussionid);
  if (!discussion){
    return res.status(404).json({status: "error", message: "Discussion is not found"})
  }
  if(!user.canDeleteDiscussion(discussion)){
    return res.status(404).json({status: "error", message: "Cannot delete discussion"})
  }

  Discussion.findByIdAndRemove(discussionid, (err, val) =>{
    console.log(val);
    if (err){
      return res.status(404).json({status: "error", message: err.message})
    }
    if (val){
      Course.findById(val.postedOn, (err, course) => {
        req.course = course; 
        next();
      });
    }
  })

}

exports.getDiscussionById = async (req,res,next, id) => {
    const discussion = await Discussion.findOne({_id: id});
    if(!discussion){
        return res.status(404).json({status: "error", message: "Discussion not found"});
      }
    req.discussion = discussion;
    next()
}

exports.getAnswerById = async (req,res,next,id) => {
  const answer = await DiscussionAnswer.findOne({_id : id})
  if(!answer){
    return res.status(404).json({status: "error", message: "Answer not found"});
  }
  req.answer = answer
  next()
}

exports.voteDiscussion = async (req,res,next) => {
    const {user} = req;
    const {discussionid} = req.params;
    let isVoted = null;
    const votedDiscussion = await Discussion.findOne({
        _id: discussionid,
        "votes.voters": user
    })
    if(votedDiscussion){
        //unvote it
        query = {$inc: {"votes.total": -1}, $pull: {"votes.voters": user.id}}
        isVoted = false;
    }else{
        //upvote it
        query = {$inc: {"votes.total": 1}, $push: {"votes.voters": user.id}}
        isVoted = true;
    }
    const newDiscussion = await Discussion.findByIdAndUpdate(
        discussionid, query, 
        {
            new: true, 
            populate: {
                path: "answers.topAnswers", 
                populate : {
                  path : "creator",
                }
              }
        })
        .populate('tags').populate('creator')
    if(!newDiscussion) 
        return res.status(404)
            .json({status: "error", message: "Discussion is not found"})
    newDiscussion._doc.isVoted = isVoted;
    newDiscussion._doc.canEdit = await user.canEditDiscussion(newDiscussion);
    newDiscussion._doc.canDelete = await user.canDeleteDiscussion(newDiscussion)

    if(isVoted){
      const notification = await BankNotification.createVoteDiscussionNotif(user, newDiscussion)
      sendAppNotification(notification)
    }
    res.json({status: "ok", discussion: newDiscussion})
}

exports.voteAnswer = async (req, res) =>{
  const {discussion, answer, user} = req
  const isNew = false
  let isVoted = !!(answer.votes.voters.find((voter) => voter._id.toString() === user.id.toString()))
  console.log("isVoted", isVoted)
  try{
    if (isVoted){
      //unvote
      var query = {$inc: {"votes.total": -1}, $pull: {"votes.voters": user.id}}
    }
    else{
      //vote
      var query = {$inc: {"votes.total": 1}, $push: {"votes.voters": user.id}}
    }
    var updatedAnswer = await DiscussionAnswer.findOneAndUpdate({_id : answer._id}, query, {new : true})
      .populate("creator","_id name avatar linkedIn teachers isAnOrganization")
      .populate("votes.voters","_id name avatar linkedIn teachers isAnOrganization")
    const result = await discussion.updateTopAnswers(updatedAnswer, isNew)
    if(result.ok){
      var updatedDiscussion = await Discussion.findOne({_id : discussion._id})
      updatedAnswer._doc.isVoted = !isVoted;
      updatedDiscussion._doc.canEdit = await user.canEditDiscussion(updatedDiscussion)
      updatedDiscussion._doc.canDelete = await user.canDeleteDiscussion(updatedDiscussion)

      if(!isVoted){
        const notification = await BankNotification.createVoteDiscussionAnswerNotif(user, updatedDiscussion, updatedAnswer)
        sendAppNotification(notification)
      }
      return res.json({status: "ok", message: "answer is voted successfully", discussion: updatedDiscussion, answer : updatedAnswer})
    }
    return res.json({status: "error", message: "unable to vote answer", discussion})
  }catch(e){
    return res.json({status : "error", message : e.message })
  }
}

exports.createAnswer = async (req,res) => {
    const {user, discussion} = req;
    const {body} = req.body;
    const isNew = true
    try{
      const answer = await new DiscussionAnswer({
          creator: user,
          body: body,
          discussion: discussion
      }).save()
      const result = await discussion.updateTopAnswers(answer, isNew)
      if(result.ok){
        var updatedDiscussion = await Discussion.findOne({_id : discussion._id})
        updatedDiscussion._doc.newAnswer = answer;
        updatedDiscussion._doc.canEdit = await user.canEditDiscussion(updatedDiscussion)
        updatedDiscussion._doc.canDelete = await user.canDeleteDiscussion(updatedDiscussion)

        const notification = await BankNotification.createAnswerDiscussionNotif(user, updatedDiscussion)
        sendAppNotification(notification)
        return res.json({status: "ok", message: "answer is created successfully", discussion: updatedDiscussion})
      }
      return res.json({status: "error", message: "unable to create answer", discussion})
    }catch(err){
      return res.json({status:"error", message: err.message, discussion})
    }
}

exports.getMoreAnswers = async (req, res) => {
  const {discussion} = req
  var {page, limit} = req.query
  page = page ? parseInt(page) : 1
  limit = limit ? parseInt(limit) : 3

  const options = {
    skip : (page-1) * limit,
    limit,
    sort : {"votes.total" : -1, status:1, createdAt : 1}
  }
  const total = await DiscussionAnswer.countDocuments({discussion: discussion})
  const pages = Math.ceil(total/limit); 
  const answers = await DiscussionAnswer.find({discussion: discussion}, null, options)
  res.json({status : "ok", answers, page, limit,total, pages})
}