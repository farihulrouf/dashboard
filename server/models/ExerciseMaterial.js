const mongoose = require("mongoose");
const { string } = require("prop-types");
const Schema = mongoose.Schema;

const exerciseMaterialSchema = new Schema(
  {
    difficultyLabel: {type: String, required: true},
    question: {type: String, required: true},
    multipleChoices: {
        a: {type: String, required: true},
        b: {type: String, required: true},
        c: {type: String, required: true},
        d: {type: String, required: true},
        e: {type: String}
    },
  },
  {
    timestamps: true,
  }
);

const Exercise = mongoose.model("ExerciseMaterial", exerciseMaterialSchema);
module.exports = Exercise;