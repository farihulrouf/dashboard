const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const { ObjectId } = mongoose.Schema;
const {answerSchema} = require("./DiscussionAnswer");

var discussionSchema = mongoose.Schema({
    title: {type: String, required: "Discussion title is required"},
    body: {type: String, required: "Discussion body is required"},
    postedOn: {type: ObjectId, ref: "Course", required: "Discussion posted on is required"},
    creator: {type: ObjectId, ref: "User", required: "Discussion creator is required"},
    votes: {
        total: {type: Number, default: 0},
        voters: [{type: ObjectId, ref: "User"}]
    },
    answers: {
        total: {type: Number, default: 0},
        mostRelevant: [{type: answerSchema}]
    }
}, {timestamps: true})


module.exports = mongoose.model("Discussion", discussionSchema);