const mongoose = require("mongoose");
const { string } = require("prop-types");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;


const exerciseMaterialSchema = new Schema(
  {
    difficultyLabel: {type: String, required: true},
    question: {type: String, required: true},
    post: {type: ObjectId, ref: "Post"},
    course: {type: ObjectId, ref: "Course"},
    multipleChoices: [{type: String, required: true}],
    question: {type: String, required: true},
    solution: {type: String, required: true},
  },
  {
    timestamps: true,
  }
);

const Exercise = mongoose.model("ExerciseMaterial", exerciseMaterialSchema);
module.exports = Exercise;