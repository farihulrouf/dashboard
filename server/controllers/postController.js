const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");


exports.addPost = async (req, res) => {
    req.body.postedBy = req.user._id;
    const post = await new Post(req.body).save();
    await Post.populate(post, {
      path: "postedBy",
      select: "_id name avatar"
    });
    res.json(post);
};

exports.getPostById = async (req,res,next,id) => {
    const post = await Post.findOne({ _id: id });
    req.post = post;

    const posterId = mongoose.Types.ObjectId(req.post.postedBy._id);
    if (req.user && posterId.equals(req.user._id)) {
      req.isPoster = true;
      return next();
    }
    next();
}

exports.likeAPost = async (req,res) => {
  const post = req.post;
  likes = post.likes;
  idx = likes.likedBy.indexOf(req.user._id);
  if(idx >= 0){
    //Already like it, unlike it
    likes.total -= 1;
    delete likes.likedBy[idx]
    isLike = false
  }else{
    likes.total += 1;
    likes.likedBy.push(req.user._id)
    isLike = true;
  }
  post.save((err,post)=>{
    if(!err){
      post._doc.isLike = isLike;
      res.json({status: "ok", message: "like/unlike post success", post: post});
    }
    else res.json({status: "error", message: "unable to like/unlike post"})
  })
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