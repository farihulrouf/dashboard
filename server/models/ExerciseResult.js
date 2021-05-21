const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const exerciseResultSchema = new Schema({
    finalScore: { type: Number },
    rightAnswer: { type: Number },
    totalQuestion: { type: Number },
    timeLimit: { type: Number },
    difficulty: { type: String },
    courseId: { type: ObjectId, ref: "Course" },
    userId: { type: ObjectId, ref: "User" }
  },
  {
    timestamps: true,
  }
);

const ExerciseResult = mongoose.model("ExerciseResult", exerciseResultSchema);
module.exports = ExerciseResult;