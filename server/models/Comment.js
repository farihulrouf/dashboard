const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const { ObjectId } = mongoose.Schema;

var commentSchema = mongoose.Schema({
    commentator: {type: ObjectId, ref: "User", required: "comment should has commentator info"},
    content: {type: String, required: "comment should has content"},
    postId: {type: ObjectId, ref: "Post", required: "comment should has post info"}
},{timestamps: true})

const autoPopulate = function(next){
    this.populate("commentator", "_id name avatar");
    next();
}

commentSchema
    .pre("findOne",autoPopulate)
    .pre("find",autoPopulate)

commentSchema.index({ postId: 1});

module.exports = mongoose.model("Comment", commentSchema);