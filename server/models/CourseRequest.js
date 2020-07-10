const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

var courseRequestSchema = mongoose.Schema({
    user: {type: ObjectId, ref: "User", required: "User info required"},
    course: {type: ObjectId, ref: "Course", required: "Course info required"},
    status: {type: String, enum: ["joined","pending"], default: "pending"}
},{timestamps: true})
courseRequestSchema.plugin(mongoosePaginate);

courseRequestSchema.index({user: 1, course: 1}) //which user has pending courses
// courseRequestSchema.index({course: 1, user: 1}) //which course has pending users

module.exports = mongoose.model("CourseRequest", courseRequestSchema);