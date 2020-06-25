const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const { ObjectId } = mongoose.Schema;


var commentSchema = mongoose.Schema({
    postedBy: {type: ObjectId, ref: "User"},
    body: {type: String, trim: true, required: "Comment content is required"},
    postedOn: {type: ObjectId, ref: "Post"}
}, {timestamps: true})
commentSchema.plugin(mongoosePaginate); 

const autoPopulate = function(next){
    this.populate("postedBy", "_id name avatar");
    next();
}

commentSchema
    .pre("findOne",autoPopulate)
    .pre("find",autoPopulate)

commentSchema.index({ postedOn: 1, createdAt: 1});
module.exports = mongoose.model("Comment", commentSchema);