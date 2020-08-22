const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");
const BankNotification = mongoose.model("BankNotification");
const {sendNotification} = require("../rabbitmq");


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

    const posterId = mongoose.Types.ObjectId(req.post.postedBy._id)
    if (req.user) {
      post._doc.owned = posterId.equals(req.user._id);
      idx = post.likes.likedBy.indexOf(req.user._id);
      post._doc.isLike = idx>=0;
      return next();
    }
    next();
}

exports.likeAPost = async (req,res) => {
  const post = req.post;
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
  Post.findByIdAndUpdate(post.id, query, {new: true},(err,post)=>{
    if(!err){
      post._doc.isLike = isLike;
      //Create notification if notif exist from thumbs up and never exist before
      if(!!notification && !notification.isExist){
        sendNotification(process.env.NOTIFICATION_OUTGOING_EXCHANGE,notification);
      }
      res.json({status: "ok", message: "like/unlike post success", post: post});
    }
    else res.json({status: "error", message: "unable to like/unlike post"})
  })
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
    const {title, category, body, attachments} = req.body;
    let {post} = req;
    post.title = title, post.category = category, post.body = body, post.attachments = attachments;
    let updatedPost = await post.save()
    updatedPost._doc.owned = true;
    return res.json({status: "ok", message: "post is updated", post: updatedPost})
  }
  res.json({status: "error", message: "unauthorized"});
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
  result = await post.update({$inc: {"comments.total": 1},$push: {"comments.listComments": comment}})
  if(result.ok){
    updatedPost = await Post.findOne({_id: post._id})
    return res.json({status: "ok", message: "comment is created successfully", post: updatedPost})
  }
  res.json({status: "error", message: "unable to create comment", post: post})
}