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
                req.course._doc.isInstructor = true;
            }
        })
        return next();
    }
    next();
};

exports.getCourse = async (req,res) => {
    res.json({course: req.course})
}

exports.validatePost = (req,res,next) => {
    req.sanitizeBody("title");
    req.sanitizeBody("body");
    req.checkBody("title", "Post should have a title").notEmpty()
    req.checkBody("body","Post should have a body").notEmpty();
    req.checkBody("category","Post should have exactly one category").notEmpty();

    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.json({status: "error", message: firstError});
    }
    next();
}

exports.createCoursePost = async (req,res,next) => {
    const {title,body,category} = req.body;
    const reqFiles = [];
    let post = new Post({
        title: title, 
        body: body, 
        category: category, 
        postedOn: req.course, 
        postedBy: req.user
    })
    const url = req.protocol + '://' + req.get('host')
    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(url + '/static/documents/' + req.files[i].filename)
    }
    post.attachments = reqFiles;
    post.save((err,savedPost)=>{
        if(err){
            return res.json({status: "error", message: err.message})
        }
        next();
    })
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