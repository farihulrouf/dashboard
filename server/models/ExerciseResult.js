const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const exerciseResultSchema = new Schema({
    finalScore: { type: Number },
    rightAnswer: { type: Number },
    totalQuestion: { type: Number },
    perfectFinalScore: { type: Number },
    timeLimit: { type: Number },
    difficulty: { type: String },
    courseId: { type: ObjectId, ref: "Course" },
    userId: { type: ObjectId, ref: "User" },
    questionPools: [{ type: ObjectId, ref: "QuestionPool"}]
  },
  {
    timestamps: true,
  }
);

const ExerciseResult = mongoose.model("ExerciseResult", exerciseResultSchema);
module.exports = ExerciseResult;
