const mongoose = require("mongoose");
const Course = mongoose.model("Course");
const Post = mongoose.model("Post");


exports.getCourses = async (req,res) => {
    const courses = await Course.find({},'_id logo name about price');
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

exports.getPosts = async (req,res) => {
    const {courseId} = req.params;
    const {page} = req.query;
    const options = {
        page: parseInt(page),
        limit: 10,
    }
    const posts = await Post.paginate({postedOn: courseId},options)
    posts.docs.forEach((post)=>{
        idx = post.likes.likedBy.indexOf(req.user._id);
        post._doc.isLike = idx>=0 ? true : false;
    })
    if(req.user){
        res.json({status: "ok", posts: posts.docs});
    }else{
        res.json({status: "error"})
    }
}