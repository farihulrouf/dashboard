const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

// const attachmentSchema = new mongoose.Schema({
//   key: {type: String},
//   name: {type: String},
//   size: {type: Number},
//   type: {type: String},
//   url: {type: String}
// })

const questionPoolSchema = new Schema(
  {
    difficultyLabel: {type: String, required: true},
    type: {type: String},
    question: {type: String, required: true},
    courseId: {type: ObjectId, ref: "Course"},
    multipleChoices: [{type: String, required: true}],
    solution: {type: String, required: true},
    tag: [{type: String, required: false}],
    attachments: [{type: ObjectId, ref: "Attachment"}],
    playbackTimes: {type: Number, required: true},
    correctScore: {type: Number, required: true},
    wrongScore: {type: Number, required: true}
  },
  {
    timestamps: true,
  }
);

const Exercise = mongoose.model("QuestionPool", questionPoolSchema);
module.exports = Exercise;