const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const examSchema = new Schema(
  {
    questionPools: [{ type: ObjectId, ref: "QuestionPool" }],
    name: { type: String },
    duration: { type: Number },
    startTime: {type: Date},
    endTime: {type: Date},
    courseId: {type: ObjectId, ref: "Course"}
  },
  {
    timestamps: true,
  }
);

const autoPopulate = function (next) {
  this.populate("questionPools", "_id question multipleChoices question attachments tag");
  next();
};

examSchema.pre("findOne", autoPopulate);
examSchema.pre("findById", autoPopulate);
const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;