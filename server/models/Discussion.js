const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const { ObjectId } = mongoose.Schema;

var discussionSchema = mongoose.Schema({
    title: {type: String, required: "Discussion title is required"},
    body: {type: String, required: "Discussion body is required"},
    postedOn: {type: ObjectId, ref: "Course", required: "Discussion posted on is required"},
    creator: {type: ObjectId, ref: "User", required: "Discussion creator is required"},
    tags : [{type:ObjectId, ref:'Tag'}],
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

const autoPopulate = function(next){
    this.populate(
        "answers.topAnswers",
        "creator body status votes createdAt",
    );
    this.populate('tags', '_id name');
    this.populate("creator","_id name avatar linkedIn teachers isAnOrganization");
    next();
}

discussionSchema
    .pre("findOne",autoPopulate)
    .pre("find",autoPopulate)
    .pre("findById", autoPopulate)

discussionSchema.index({ title: "text", body: "text"})

module.exports = mongoose.model("Discussion", discussionSchema);