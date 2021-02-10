const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const { ObjectId } = mongoose.Schema;


const answerSchema = mongoose.Schema({
    creator: {type: ObjectId, ref: "User"},
    content: {type: String, required: "Answer body is required"},
    status: {
        type: String, default: "none", 
        enum: ["none", "accepted"], 
        required: "Answer's status is required"
    },
    votes: {
        total: {type: Number, default: 0},
        voters: [{type: ObjectId, ref: "User"}]
    }
})

module.exports = {
    DiscussionAnswer: mongoose.model("DiscussionAnswer", answerSchema),
    answerSchema: answerSchema
}