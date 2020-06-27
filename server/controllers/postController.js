const mongoose = require("mongoose");
const Post = mongoose.model("Post");


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
  }else{
    likes.total += 1;
    likes.likedBy.push(req.user._id)
  }
  post.save((err,post)=>{
    if(!err) res.json({status: "ok", message: "like/unlike post success", post: post});
    else res.json({status: "error", message: "unable to like/unlike post"})
  })
}

// exports.validateComment = async (req,res,next,id) => {
//   req.sanitizeBody("body");
//   req
//     .checkBody("body", "Content must be between 1 and 200 characters")
//     .isLength({ min: 1, max: 200  });
//   const errors = req.validationErrors();
//   if (errors) {
//     const firstError = errors.map(error => error.msg)[0];
//     return res.json({status: "error", message: firstError});
//   }
//   next();
// }

// exports.createComment = async (req,res) => {
//   const {post} = req;
//   if(post){
//     const {comment} = Comment.new({body: req.body, postedBy: req.user._id, postedOn: post._id})
//     post.comments.push(comment)
//   }
//   res.json({status: "ok", message: "comment is created successfully"})
// }