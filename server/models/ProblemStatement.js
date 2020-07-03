const mongoose = require("mongoose");
const { string } = require("prop-types");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;


const participantSolutionsSchema = new mongoose.Schema({
    exerciseMaterialId: {type: ObjectId},
    answer: {type: string}
})

const problemStatementSchema = new Schema(
  {
    participantId: {type: ObjectId, ref: "User"},
    dateStart : { type : Date },
    dateSubmission: {type: Date},
    score: {type: Number},
    participantSolutions : [{type: participantSolutionsSchema}],
  },
  {
    timestamps: true,
  }
);

const ProblemStatement = mongoose.model("ProblemStatement", problemStatementSchema);
module.exports = problemStatementSchema;