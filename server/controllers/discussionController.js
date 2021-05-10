const mongoose = require("mongoose");
const User = require("../models/User");
const Discussion = mongoose.model("Discussion");
const Course = mongoose.model("Course");
const DiscussionAnswer = mongoose.model("DiscussionAnswer");
const {sendNotification} = require("../rabbitmq");

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
    const {title, body} = req.body;
    const tag = req.newtags;
    Discussion.findByIdAndUpdate(
        discussionid,
        {$set: {title: title, body: body, tag: tag}},
        {
          new: true, 
          populate: {
              path: "answers.topAnswers", 
              populate : {
                path : "answers.topAnswers.creator"
              }
            }
        })
        .populate("tag")
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
        discussionid, query, {new: true, populate: "answers.topAnswers"})
        .populate('tag').populate('creator').populate("answers.topAnswers.creator")
    if(!newDiscussion) 
        return res.status(404)
            .json({status: "error", message: "Discussion is not found"})
    newDiscussion._doc.isVoted = isVoted;
    newDiscussion._doc.canEdit = user.canEditDiscussion(newDiscussion);
    newDiscussion._doc.canDelete = user.canDeleteDiscussion(newDiscussion)
    res.json({status: "ok", discussion: newDiscussion})
}

exports.createAnswer = (req,res,next) => {
    const {user} = req;
    const {discussionid} = req.params;
    const {body} = req.body;
    const answer = new DiscussionAnswer({
        creator: user,
        body: body,
        discussion: discussionid
    })
    answer.save(async (err,savedAnswer) => {
        if(err) return res.json({status: "error", message: err.message});
        const sortedAnswers = await DiscussionAnswer
            .find({discussion: savedAnswer.discussion}).select("_id")
            .sort({status: 1, "votes.total": 1, createdAt: -1})
            .limit(3)
        Discussion.findByIdAndUpdate(discussionid, {
            $inc: {"answers.total": 1}, 
            $set: {"answers.topAnswers": sortedAnswers}
        }, {
            new: true, 
            populate: {
                path: "answers.topAnswers", 
            }
        })
        .populate("tag")
        .populate("creator")
        .exec( async (err,newDiscussion) => {
          
            await User.populate(newDiscussion, {path: "answers.topAnswers.creator"})
            
            if(err) return res.json({status: "error", message: err.message})
            newDiscussion._doc.newAnswer = savedAnswer;
            newDiscussion._doc.canEdit = user.canEditDiscussion(newDiscussion)
            newDiscussion._doc.canDelete = user.canDeleteDiscussion(newDiscussion)
            return  res.json({status: "ok", discussion: newDiscussion})
        }) 
    })
}