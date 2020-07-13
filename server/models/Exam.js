const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const examSchema = new Schema(
  {
    exerciseMaterials: [{ type: ObjectId, ref: "ExerciseMaterial" }],
    name: { type: String },
    duration: { type: Number },
    startTime: {type: Date},
    endTime: {type: Date},
  },
  {
    timestamps: true,
  }
);

const autoPopulate = function (next) {
  this.populate("exerciseMaterials", "_id question multipleChoices question");
  next();
};

examSchema.pre("findOne", autoPopulate);
examSchema.pre("findById", autoPopulate);
const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;
