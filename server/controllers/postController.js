const mongoose = require("mongoose");
const User = mongoose.model("Post");


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