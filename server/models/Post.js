const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const { ObjectId } = mongoose.Schema;

const likesSchema = new mongoose.Schema({
    total: {type: Number, required: "Number of likes is required"},
    likedBy: [{type: ObjectId, ref: "User"}]
});

const commentsSchema = new mongoose.Schema({
    total: {type: Number, required: "Number of comments is required"},
    listComments: [{type: ObjectId, ref: "Comment"}]
})

var attachmentSchema = new mongoose.Schema({
    key: {type: String, required: "Attachment should has key"},
    name: {type: String, required: "Attachment name should be declared"},
    size: {type: Number, required: "Attachment size should be defined, default in (KB)"},
    type: {type: String, required: "Attachment should has type"},
    url: {type: String, required: "Attachment path is required"}
})

  
var postSchema = mongoose.Schema({
    title: {type: String, required: "Title is required", trim: true},
    likes: {type: likesSchema, default: {total: 0, likedBy: []}},
    body: {type: String, required: "Body is required"},
    category: {type: String, enum: ["Announcement","Materials","Exam"], required: "Post category is required"},
    tag : [{type:ObjectId, ref:'Tag'}],
    postedBy: {type: ObjectId, ref: "User"},
    postedOn: {type: ObjectId, ref: "Course"},
    comments: {type: commentsSchema, default: {total: 0, listComments: []}},
    attachments: [attachmentSchema]
}, {timestamps: true})
postSchema.plugin(mongoosePaginate); //For example Post.paginate(conditions,{page: 0, limit: 2, offset: 2})

const autoPopulate = function(next){
    this.populate("postedBy", "_id name avatar");
    this.populate("comments.listComments","_id content commentator createdAt")
    this.populate('tag', '_id name');
    next();
}

postSchema
    .pre("findOne",autoPopulate)
    .pre("find",autoPopulate)
    .pre("findOneAndUpdate",autoPopulate)

postSchema.index({ postedOn: 1, category: 1});
postSchema.index({ title: "text", body: "text", 'attachments.name': 'text'})

module.exports = mongoose.model("Post", postSchema);``