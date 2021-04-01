const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const exerciseSchema = new Schema(
  {
    questionPools: [{ type: ObjectId, ref: "QuestionPool" }],
    numberOfQuestions: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    courseId: {type: ObjectId, ref: "Course"},
    avarageScore: { type: Number },
    studentPass: { type: Number }
  },
  {
    timestamps: true,
  }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
