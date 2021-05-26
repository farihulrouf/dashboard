const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const QuestionPoolAnswerSchema = new Schema({
    number: { type: Number },
    answer: [{type: String, required: true}],
    score: { type: Number },
    right: { type: Boolean},
    questionPoolId: { type: ObjectId, ref: "QuestionPool"},
    resultType: { type: String },
    resultId: { type: String }
  },
  {
    timestamps: true,
  }
);

const QuestionPoolAnswer = mongoose.model("QuestionPoolAnswer", QuestionPoolAnswerSchema);
module.exports = QuestionPoolAnswer;
