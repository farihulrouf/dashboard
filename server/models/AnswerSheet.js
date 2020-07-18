const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;


const participantSolutionsSchema = new mongoose.Schema({
    questionPoolId: {type: ObjectId},
    answer: {type: String}
})

const problemWithParticipantAnswerSchema = new mongoose.Schema({
  questionPoolId: {type: ObjectId},
  question: {type: String},
  multipleChoices: [{type: String}],
  solution: {type: String},
  participantAnswer: {type: String},
})

const answerSheetSchema = new Schema(
  {
    participantId: {type: ObjectId, ref: "User"},
    dateStart : { type : Date },
    dateSubmission: {type: Date},
    score: {type: Number, default: 0},
    participantSolutions : [{type: participantSolutionsSchema}],
    type: {type: String},
    problemWithParticipantAnswer: [{type: problemWithParticipantAnswerSchema}],
  },
  {
    timestamps: true,
  }
);

const AnswerSheet = mongoose.model("AnswerSheet", answerSheetSchema);
module.exports = AnswerSheet;