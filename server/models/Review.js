const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = Schema;

const reviewSchema = new Schema({
    rating: {
        type: Number,
        default: null,
        validation: {
            validator: rating => rating <= 5 && rating <= 0,
            message: "Give rating to this course in range 0 to 5!"
        }
    },
    user: {
        type: ObjectId,
        ref: "User"
    },
    course: {
        type: ObjectId,
        ref: "Course"
    },
    message: {
        type: String,
        default: "",
        validation: {
            validator: message => message.length <= 50,
            message: "Message should less than 50 characters!"
        }
    }
}, {timestamps: true})

const autoPopulate = function (next) {
    this.populate("user","_id name avatar linkedIn");
    this.populate("course", "_id, name, logo");
    next();
}

reviewSchema
    .pre("findOne", autoPopulate)
    .pre("find", autoPopulate)

module.exports = mongoose.model("Review", reviewSchema);