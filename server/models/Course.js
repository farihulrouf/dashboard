const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: 'Course name is required'
        },
        about: {
            type: String,
            trim: true,
            required: 'Please fill in course description'
        },
        prerequisites: {
            type: [String],
            required: 'Course must have prerequisite info'
        },
        price: {
            type: Number,
            required: 'Course should have price, input 0 for free courses'
        },
        instructors: [{type: ObjectId, ref: "User"}],
        participants: [{ type: ObjectId, ref: "User"}]
    },
    {timestamps: true}
)

const autoPopulate = function(next){
    this.populate("instructors", "_id name avatar");
    this.populate("participants","_id name avatar");
    next();
}

courseSchema
    .pre("findOne",autoPopulate)
    .pre("find",autoPopulate)

courseSchema.index({ instructors: 1});
courseSchema.index({createdAt: 1 });

module.exports = mongoose.model("Course", courseSchema);