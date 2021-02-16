const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const { ObjectId } = mongoose.Schema;

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
        topAnswers: [{type: ObjectId, ref: "DiscussionAnswer"}]
    },
    solved: {type: Boolean, default: false} //if there is an accepted answers solved is true
}, {timestamps: true})


discussionSchema.pre("find", function(next){
    this.populate(
        "answers.topAnswers",
        "creator body status votes createdAt"
    )
    next();
})

module.exports = mongoose.model("Discussion", discussionSchema);