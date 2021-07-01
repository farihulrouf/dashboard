const mongoose = require("mongoose");
const Course = require("../models/Course");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");
const BankNotification = mongoose.model("BankNotification");
const {sendAppNotification} = require("../lib/notification");


exports.addPost = async (req, res) => {
    req.body.postedBy = req.user._id;
    const post = await new Post(req.body).save();
    await Post.populate(post, {
      path: "postedBy",
      select: "_id name avatar"
    });
    res.json(post);
};


exports.deletePost = async (req,res,next)=>{
  if(req.post._doc.owned){
    //Can delete only if creator
    try{
      const deletedPost = await req.post.remove();
      return next();
    }catch(err){
      res.json({status: "error", message: "unable to delete post"});
    }
  }
  res.json({status: "error", message: "unauthorized to delete this post"});
}

exports.getPostById = async (req,res,next,id) => {
    const post = await Post.findOne({ _id: id });
    if(!post){
      //Post not found
      return res.status(404).json({status: "error", message: "post not found"});
    }
    req.post = post;

    const posterId = mongoose.Types.ObjectId(post.postedBy._id)
    if (req.user) {
      post._doc.owned = posterId.equals(req.user._id);
      idx = post.likes.likedBy.indexOf(req.user._id);
      post._doc.isLike = idx>=0;
      post._doc.canUpdate = await req.user.canUpdatePost(post);
      post._doc.canDelete = await req.user.canDeletePost(post);
      return next();
    }
    next();
}

exports.likeAPost = async (req,res) => {
  const {post} = req;
  likes = post.likes;
  idx = likes.likedBy.indexOf(req.user._id);
  let notification = null;
  let query = {};
  if(idx >= 0){
    //Already like it, unlike it
    query = {
      $inc: {"likes.total": -1},
      $pull: {"likes.likedBy": req.user._id}
    }
    isLike = false
  }else{
    query = {
      $inc: {"likes.total": 1},
      $addToSet: {"likes.likedBy": req.user._id}
    }
    isLike = true;
    notification = await BankNotification.createLikePostNotif(req.user,post)
  }
  try{
    let postUpdated = await Post.findByIdAndUpdate(post.id, query, {new: true})
    postUpdated.likes._doc.isLike = isLike;
    postUpdated._doc.canUpdate = await req.user.canUpdatePost(postUpdated);
    postUpdated._doc.canDelete = await req.user.canDeletePost(postUpdated);
    //Create notification if notif exist from thumbs up and never exist before
    if(!!notification){
      sendAppNotification(notification)
    }
    res.json({status: "ok", message: "like/unlike post success", post: postUpdated});
  }catch(err){
    console.log(err.message)
    res.status(500).json({status: "error", message: "unable to like/unlike post"})
  }
}

exports.validatePost = (req,res,next) => {
  req.sanitizeBody("title");
  req.sanitizeBody("body");
  req.checkBody("title", "Post should have a title").notEmpty()
  req.checkBody("body","Post should have a body").notEmpty();
  req.checkBody("category","Post should have exactly one category").notEmpty();

  const errors = req.validationErrors();
  if(errors){
      const firstError = errors.map(error => error.msg)[0];
      return res.json({status: "error", message: firstError});
  }
  next();
}

exports.updatePost = async (req,res) => {
  if(req.post._doc.owned){
    //Only poster can edit his own post
    const {title, category, body, attachments, tags} = req.body;
    let {post} = req;
    post.title = title, post.category = category, post.body = body, post.attachments = attachments, post.tags = tags;
    let updatedPost = await post.save()
    updatedPost._doc.owned = true;
    updatedPost._doc.canUpdate = await req.user.canUpdatePost(updatedPost);
    updatedPost._doc.canDelete = await req.user.canDeletePost(updatedPost);

    const notification = await BankNotification.createEditPostNotif(req.user, post)
    sendAppNotification(notification)
    return res.json({status: "ok", message: "post is updated", post: updatedPost})
  }
  res.status(500).json({status: "error", message: "unauthorized"});
}


exports.validateComment = (req,res,next) => {
  req.sanitizeBody("content");
  req
    .checkBody("content", "Content must be between 1 and 200 characters")
    .isLength({ min: 1, max: 200  });
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.json({status: "error", message: firstError});
  }
  next();
}

exports.createComment = async (req,res) => {
  const {body,user,post} = req
  comment = await new Comment({content: body.content, commentator: user, post: post}).save()
  try{
    await post.updateLatestComments(comment)
    const updatedPost = await Post.findOne({_id : post._id})
    updatedPost._doc.canUpdate = await req.user.canUpdatePost(updatedPost);
    updatedPost._doc.canDelete = await req.user.canDeletePost(updatedPost);
    
    const notification = await BankNotification.createCommentPostNotif(user, post)
    sendAppNotification(notification)
    return res.json({status: "ok", message: "comment is created successfully", post:updatedPost, comment})

  }catch(err){
    res.status(500).json({status: "error", message: err.message, post: post})
  }
}

exports.getMoreComments = async (req, res) => {
  const {post} = req
  var {limit, createdAt} = req.query
  limit = limit ? parseInt(limit) : 5

  const options = {
    limit,
    sort : {createdAt : -1}
  }

  var query = {
    post : post
  }
  if(createdAt){
    query.createdAt = {$lt : new Date(createdAt) }
  }
  const total = await Comment.countDocuments(query)
  const avail = limit < total; 
  const pages = Math.ceil(total/limit)
  var comments = await Comment.find(query, null, options)
  comments = comments.reverse()
  res.json({status : "ok", comments : comments, limit,total, avail, pages})
}