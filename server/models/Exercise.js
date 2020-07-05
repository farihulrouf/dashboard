const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exerciseSchema = new Schema(
  {
    questionType: { type: String, required: true },
    difficulty: { type: String, required: true },
    questionPool: { type: String, required: true },
    numberOfQuestions: { type: Number, required: true },
    timeLimit: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
