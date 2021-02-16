const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const exerciseSchema = new Schema(
  {
    questionType: { type: String, required: true },
    difficulty: { type: String, required: true },
    questionPools: [{ type: ObjectId, ref: "QuestionPool" }],
    numberOfQuestions: { type: Number, required: true },
    timeLimit: { type: Number, required: true },
    courseId: {type: ObjectId, ref: "Course"}
  },
  {
    timestamps: true,
  }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
