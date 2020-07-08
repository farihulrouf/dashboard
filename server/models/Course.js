const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: 'Course name is required'
        },
        logo: {
            type: String,
            default: "/static/images/course-logo.png"
        },
        about: {
            type: String,
            trim: true,
            required: 'Please fill in course description'
        },
        prerequisites: {
            type: [String],
            required: 'Course must have prerequisite info',
            validation: {validator: (prerequisite) => prerequisite.length, message: 'Course must have prerequisite info'}
        },
        materials:{
            type: [String],
            required: 'Course must have materials info',
            validation: {validator: (materials) => materials.length, message: 'Course must have materials info'}
        },
        price: {
            type: Number,
            required: 'Course should have price, input 0 for free courses',
            validation: {validator: (price)=>price>=0, message: 'Price should not be less than 0'}
        },
        instructors: [{type: ObjectId, ref: "User"}],
        participants: [{ type: ObjectId, ref: "User"}],
        posts: [{type: ObjectId, ref: "Post"}]

    },
    {timestamps: true}
)

const autoPopulate = function(next){
    this.populate("instructors", "_id name avatar linkedIn");
    this.populate("participants","_id name avatar linkedIn");
    next();
}

courseSchema
    .pre("findOne",autoPopulate)

courseSchema.index({ instructors: 1});
courseSchema.index({createdAt: 1 });

module.exports = mongoose.model("Course", courseSchema);