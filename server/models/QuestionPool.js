const mongoose = require("mongoose");
const { string } = require("prop-types");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;


const questionPoolSchema = new Schema(
  {
    difficultyLabel: {type: String, required: true},
    type: {type: String},
    question: {type: String, required: true},
    courseId: {type: ObjectId, ref: "Course"},
    multipleChoices: [{type: String, required: true}],
    question: {type: String, required: true},
    solution: {type: String, required: true},
  },
  {
    timestamps: true,
  }
);

const Exercise = mongoose.model("QuestionPool", questionPoolSchema);
module.exports = Exercise;