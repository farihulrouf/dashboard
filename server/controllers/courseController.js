const mongoose = require("mongoose");
const Course = mongoose.model("Course");
const Post = mongoose.model("Post");
const CourseRequest = mongoose.model("CourseRequest");

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

exports.getCoursebyInstructor = async (req,res) => {
    const instructor = req.user
    const results = await Course.find({instructors: instructor._id})
    res.json(results)
}

exports.getCourseRequests =async (req,res) => {
    const course = req.course
    const {page} = req.query;
    const options = {
        page: parseInt(page),
        limit: 10,
        sort: {createdAt: 1}
    }
    const criteria = {course : course}
    // const requests = await CourseRequest.find(criteria)
    // console.log(requests)
    const requests = await CourseRequest.paginate(criteria,options)
    if(requests.docs){
        res.json({status: "ok", requests: requests.docs});
        // console.log(requests)
    }else{
        res.json({status: "error"})
    }
}

exports.acceptCourseRequest = async(req,res) => {
    const {courseReqId} = req.body;
    let courseReq = await CourseRequest.findOne({_id: courseReqId})
    courseReq.status = "joined"
    let course = await Course.findOne({_id: courseReqId})
    // course.participants.concat()
    courseReq.save((err,request)=>{
        if(!err){
          res.json({status: "ok", request: request});
        }
        else res.json({status: "error"})
    })
}

exports.getJoinedCourse = async(req,res) => {
    const user = req.user;
    // participants: user
    const courses = await Course.find({participants: user})
    console.log(courses)
    res.json(courses)
}

// exports.validatePost = (req,res,next) => {
//     req.sanitizeBody("title");
//     req.sanitizeBody("body");
//     req.checkBody("title", "Post should have a title").notEmpty()
//     req.checkBody("body","Post should have a body").notEmpty();
//     req.checkBody("category","Post should have exactly one category").notEmpty();

//     const errors = req.validationErrors();
//     if(errors){
//         const firstError = errors.map(error => error.msg)[0];
//         return res.json({status: "error", message: firstError});
//     }
//     next();
// }

exports.createCoursePost = async (req,res,next) => {
    const {title,body,category,attachments} = req.body;
    let post = new Post({
        title: title, 
        body: body, 
        category: category, 
        postedOn: req.course, 
        postedBy: req.user
    })

    post.attachments = attachments;
    post.save((err,savedPost)=>{
        if(err){
            return res.json({status: "error", message: err.message})
        }
        next();
    })
}

exports.getPosts = async (req,res) => {
    const courseId = req.params.courseId || req.post.postedOn;
    let {category, content, page} = req.query;
    const options = {
        page: parseInt(page),
        limit: 10,
        sort: {createdAt: -1}
    }
    const filters = [
        {id: 1, name: 'Announcement'},
        {id: 2, name: 'Materials'},
        {id: 3, name: 'Exam'}
    ]

    let params = {}

    if(content){
        //Filter title
        params = {$text: { $search: `"${content}"` }}
    }

    params.postedOn = courseId;

    if(category){
        //Filter category
        category = typeof(category) == "string" ? [parseInt(category)] : category.map((e)=>parseInt(e));
        params.category = {$in: filters.filter((e)=>category.includes(e.id)).map((e)=>e.name)};
    }
    
    const posts = await Post.paginate(params,options)
    posts.docs.forEach((post)=>{
        idx = post.likes.likedBy.indexOf(req.user._id);
        post._doc.isLike = idx>=0 ? true : false;
        post._doc.owned = (post.postedBy.id == req.user.id)
    })
    if(req.user){
        res.json({status: "ok", posts: posts});
    }else{
        res.json({status: "error"})
    }
}