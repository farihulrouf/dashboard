const mongoose = require("mongoose");
const Discussion = mongoose.model("Discussion");
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
        const firstError = errors.map(error => error.msg)[0];
        return res.json({status: "error", message: firstError});
    }
    next();
}

exports.getDiscussionById = (req,res,next) => {
    const {discussionId} = req.params;
    const {newAnswer} = req;
    Discussion.findById(discussionId, (err,discussion)=>{
        if(err) return res.status(404).json({status: "error", message: "Discussion not found"})
        if(!!next)
            return next();
        if(!!newAnswer) discussion._doc.newAnswer = newAnswer;
        return res.json({status: "ok", discussion: discussion})
    });
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
        }, (err,newDiscussion) => {
            if(err) return res.json({status: "error", message: err.message})
            newDiscussion._doc.newAnswer = savedAnswer;
            return  res.json({status: "ok", discussion: newDiscussion})
        })
    })
}