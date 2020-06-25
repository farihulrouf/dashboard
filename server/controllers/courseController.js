const mongoose = require("mongoose");
const Course = mongoose.model("Course");


exports.getCourses = async (req,res) => {
    const courses = await Course.find({});
    res.json(courses);
}

exports.getCourseById = async (req, res, next, id) => {
    const course = await Course.findOne({_id: id});
    req.course = course
    if(req.course && req.user){
        const {instructors} = req.course
        instructors.forEach((i)=> {
            const instructorId = mongoose.Types.ObjectId(i._id);
            if(instructorId.equals(req.user._id)){
                req.isInstructor = true;
            }
        })
        return next();
    }
    next();
};

exports.getCourse = async (req,res,next,id) => {
    res.json(!req.course ? {} : {isInstructor: !!req.isInstructor, course: req.course})
}