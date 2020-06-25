const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const { ObjectId } = mongoose.Schema;

const likesSchema = new mongoose.Schema({
    total: {type: Number, required: "Number of likes must not null"},
    likedBy: [{type: ObjectId, ref: "User"}]
});

const commentsSchema = new mongoose.Schema({
    total: {type: Number, required: "Number of comments must not null"},
    comments: {type: [ObjectId], ref: "Comment",  validation: {validator: (comments)=>comments.length<=3, message: "Max comment snapshots are 3"}}
});

  
var postSchema = mongoose.Schema({
    title: {type: String, required: "Title is required", trim: true},
    likes: {type: likesSchema, default: {total: 0, likedBy: []}},
    lastComments: {type: commentsSchema, default: {total: 0, comments: []}},
    body: {type: String, required: "Body is required"},
    category: {type: String, enum: ["Announcement","Materials","Exam"], required: "Post category is required"},
    postedBy: {type: ObjectId, ref: "User"},
    postedOn: {type: ObjectId, ref: "Course"}
}, {timestamps: true})
postSchema.plugin(mongoosePaginate); //For example Post.paginate(conditions,{page: 0, limit: 2, offset: 2})

const autoPopulate = function(next){
    this.populate("postedBy", "_id name avatar");
    this.populate("comments","_id content user")
    next();
}

postSchema
    .pre("findOne",autoPopulate)
    .pre("find",autoPopulate)
    
postSchema.index({ postedOn: 1, category: 1});

module.exports = mongoose.model("Post", postSchema);