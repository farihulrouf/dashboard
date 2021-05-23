const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Course = mongoose.model("Course");
const Post = mongoose.model("Post");
const Discussion = mongoose.model("Discussion");
const Review = mongoose.model("Review");
const CourseRequest = mongoose.model("CourseRequest");
const Payment = mongoose.model("Payment");
const User = mongoose.model('User');

exports.getCourses = async (req, res) => {
  var {
    query,
    instructor,
    organization,
    price,
    rating,
    page,
    limit,
  } = req.query;
  var match = '';

  //convert instructor query to array of objectid
  if(instructor){
    if(!Array.isArray(instructor)){
      instructor = [ObjectId(instructor)]
    }
    else{
      instructor = instructor.map((val) => ObjectId(val))
    }
  }
  if(organization){
    if(!Array.isArray(organization)){
      organization = [ObjectId(organization)]
    }
    else{
      organization = organization.map((val) => ObjectId(val))
    }
  }
  
  if(query){
    match = new RegExp(query.replace(/[^a-zA-Z ]/g, ""), "i");
  }
  const [low, high] = price;
  limit = parseInt(limit);
  page = parseInt(page);

  let filter = {
    price: {
      $gte: parseInt(low),
      $lte: parseInt(high)
    },
    rating: {
      $gte: parseInt(rating) || 0,
    },
  };

  if (query) {
    filter["$or"] = [
      {
        name: {
          $regex: match,
        },
      },
      {
        about: {
          $regex: match,
        },
      },
    ];
  }

  if (instructor) {
    filter["instructors"] = {
      $elemMatch: {
        $in: instructor,
      }
    };
  }

  if (organization) {
    filter["creator"] = {
      $in: organization,
    };
  }

  const length = await Course.countDocuments(filter);
  const avail = page * limit < length;

  let user_id = req.user ? req.user._id : ""
  console.log(filter)
  console.log("get Courses")
  let courses = await Course.aggregate([
    {$match: filter}, 
    {$lookup: 
      {from: Payment.collection.name, 
        let: {"id": "$_id"}, 
        as: 'user_payment', 
        "pipeline": [
          {$match: {$expr: 
            {$eq: ["$course","$$id"]}, 
            "user": user_id
          }},
          {$sort : {"createdAt":-1, "_id" : -1}}, 
          {$limit : 1},
          {$project: {'status': 1}}] 
      }
    },
    //populate instructors
    {$unwind : {path : "$instructors", preserveNullAndEmptyArrays: true}},
    {$lookup : {
      from : User.collection.name,
      let : {"id" : "$instructors"},
      as : "instructors",
      "pipeline" : [
        {$match : {$expr : {$eq : ["$_id", "$$id"]}}},
        {$project : {"_id":1, "name":1, "avatar":1, "linkedIn":1}}
      ]
    }},
    {$unwind : {path : "$instructors", preserveNullAndEmptyArrays: true}},
    {$group : { 
      _id : "$_id",
      instructorsDet : {$push : "$instructors"},
      doc : {$first : "$$ROOT"}
    }},
    {$sort : {"doc.createdAt" : 1}},
    {$replaceRoot:{"newRoot": {"$mergeObjects" : ["$doc", {instructors : "$instructorsDet"}]}}},
    //populate creator
    {$lookup : {
      from : User.collection.name,
      let : {"id" : "$creator"},
      as : "creator",
      "pipeline" : [
        {$match : {$expr : {$eq : ["$_id", "$$id"]}}},
        {$project : {"_id":1, "name":1, "avatar":1, "linkedIn":1, "isAnOrganization":1}}
      ]
    }},
    {$unwind : {path : "$creator", preserveNullAndEmptyArrays: true}}
  ])
  .skip(((page || 1)-1) * limit)
  .limit(limit);

  courses.forEach(function(course){
    try{
      if (req.user){
        course.isInstructor = req.user.isInstructor(course);
      }
      else{
        course.isInstructor = false;
      }
    }catch(err){
      console.log(err);
    }
  })
  console.log("finish adding isInstructor")

  // console.log(courses);
  res.json({ avail, courses });
};

exports.getFavouriteCourse = async (req, res) => {
  const courses = await Course.aggregate([
    { $sample: { size: 5 } },
    { $match: { rating: { $gte: 4, $lt: 5 } } },
  ]);

  res.json(courses);
};

exports.createCourse = async (req, res, next) => {
  const { user } = req;
  if (user.canCreateCourse()) {
    let course = new Course({
      ...req.body,
      creator: user,
      instructors: !user.isAnOrganization ? [user._id] : [] //if a private instructor, assign himself as an instructor
    });
    course.save((err, savedCourse) => {
      if (err) {
        return res.json({ status: "error", message: err });
      }
      return next();
    });
  } else {
    res.json({ status: "error", message: "unahtorized to create course" });
  }
};

exports.getCourseById = async (req, res, next, id) => {
  const course = await Course.findById(id);
  req.course = course;
  if (req.course && req.user) {
    let payment = await Payment.find({course:course._id})
    req.course._doc.enrollStatus = req.course.getStatus(payment, req.user);
    req.course._doc.isInstructor = req.user.isInstructor(course);
    return next();
  }
  next();
};

exports.getCourse = async (req, res) => {
  const course = await Course.findById(req.course.id);
  req.course = course;
  if (req.course && req.user) {
    let payment = await Payment.find({course:course._id})
    req.course._doc.enrollStatus = req.course.getStatus(payment, req.user);
    req.course._doc.isInstructor = req.user.isInstructor(course);
    return res.json({ course: req.course });
  }
};

exports.getMyCourses = async (req, res) => {
  try{
    const { user } = req;
    req.query.limit = parseInt(req.query.limit) || 4;
    req.query.page = parseInt(req.query.page) || 1;
    
    const { page, limit, query } = req.query;
    let aggParams = [];
    let filter = {}
    if(query){
      match = new RegExp(query.replace(/[^a-zA-Z ]/g, ""), "i");
      filter["$and"] = (filter["$and"] || []).concat({$or: [
        {name: {$regex: match}},
        {about: {$regex: match}}
      ]})
    }
    if(user.isAnOrganization || user.isAnInstructor){
      filter["$and"] = (filter["$and"] || []).concat({$or: [
        {creator: user._id},
        {instructors: user._id}
      ]})
      aggParams.push({$match: filter})
    }else{
      filter["participants"] = user._id
      aggParams.push({$match: filter})
    }

    aggParams.push({$lookup: {
      from: Payment.collection.name,
      let: {"id":"$_id"},
      as: 'user_payment',
      "pipeline": [{
        $match: {$expr:{$eq: ["$course","$$id"]}, "user": user._id}
      },{
        $sort: {createdAt: -1, _id: -1},
      },{
        $limit: 1
      },{
        $project: {status: 1}
      }]
    }})

    if(user){
      field = {
        isInstructor: {$in: [user._id, "$instructors._id"]},
        canEdit: {$eq: [user._id, "$creator"]},
        canDelete: {$eq: [user._id, "$creator"]}
      }
    }

    const totalData = await Course.countDocuments(filter);
    const results = await Course.aggregate([
      ...aggParams,
      {$lookup: {from : User.collection.name, localField: 'instructors', foreignField: '_id', as: 'instructors'}},
      {$sort : {"doc.createdAt" : 1}},
      {$addFields: field}
    ])
    .skip(((page || 1)-1) * limit)
    .limit(limit || 10);
    return res.json({ status: "ok", data: results, total: totalData });
  }catch(err){
    return res.json({ status: "ok", message: err.message });
  }
};

exports.createCourseDiscussion = (req,res,next) => {
  const {title, body,} = req.body;
  const {user, course, newtags} = req;
  if(!user.canCreateDiscussion(course)){
      return res.status(403).json({
          status: "error", 
          message: "Forbidden to create discussion in this course"
      });
  }
  let discussion = new Discussion({
      title: title,
      body: body,
      tag: newtags,
      postedOn: course,
      creator: user
  })
  discussion.save((err,savedDiscussion)=>{
      if(err){
          return res.json({status: "error", message: err.message})
      }
      console.log("finish adding discussion")
      next();
  })
}

exports.getCourseRequests = async (req, res) => {
  const course = req.course;
  const { page } = req.query;
  const options = {
    page: parseInt(page),
    limit: 10,
    sort: {
      createdAt: 1,
    },
  };
  const criteria = {
    course: course,
  };
  const requests = await CourseRequest.paginate(criteria, options);
  if (requests.docs) {
    res.json({ status: "ok", requests: requests.docs });
  } else {
    res.json({ status: "error" });
  }
};

exports.acceptCourseRequest = async (req, res) => {
  const { courseReqId } = req.body;
  let courseReq = await CourseRequest.findOne({ _id: courseReqId });
  courseReq.status = "joined";
  let course = await Course.findOne({ _id: courseReqId });
  // course.participants.concat()
  courseReq.save((err, request) => {
    if (!err) {
      res.json({ status: "ok", request: request });
    } else res.json({ status: "error" });
  });
};

exports.getJoinedCourse = async (req, res) => {
  const user = req.user;
  // participants: user
  const courses = await Course.find({ participants: user });
  res.json(courses);
};

exports.updateCourse = (req, res, next) => {
  const { course } = req;
  const {
    name,
    about,
    prerequisites,
    materials,
    price,
    instructors,
    logo,
    rating,
  } = req.body;
  course.name = name || course.name
  course.about = about || course.about
  course.prerequisites = prerequisites || course.prerequisites
  course.materials = materials || course.materials
  course.price = price || course.price
  course.rating = rating || course.rating
  course.instructors = instructors || course.instructors
  course.logo = logo || course.logo
  course.save((err, response) => {
    if (!err) {
      return next();
    }
    return res.json({ status: "error", error: err.message });
  });
};

// exports.validatePost = (req,res,next) => {     req.sanitizeBody("title");
// req.sanitizeBody("body");     req.checkBody("title", "Post should have a
// title").notEmpty()     req.checkBody("body","Post should have a
// body").notEmpty();     req.checkBody("category","Post should have exactly one
// category").notEmpty();     const errors = req.validationErrors(); if(errors){
//         const firstError = errors.map(error => error.msg)[0]; return
// res.json({status: "error", message: firstError});     } next(); }

exports.createCoursePost = async (req, res, next) => {
  const { title, body, category, attachments, } = req.body;
  let post = new Post({
    title: title,
    body: body,
    category: category,
    tag:req.newtags,
    postedOn: req.course,
    postedBy: req.user,
  });

  post.attachments = attachments;
  post.save((err, savedPost) => {
    if (err) {
      return res.json({ status: "error", message: err.message });
    }
    next();
  });
};

exports.getPosts = async (req, res) => {
  const courseId = req.params.courseId || req.post.postedOn;
  console.log(req.query);
  let { category, content, page, dateStart, dateEnd, creator, tag } = req.query;
  const options = {
    page: parseInt(page),
    limit: 10,
    sort: {
      createdAt: -1,
    },
  };
  const filters = [
    {
      id: 1,
      name: "Announcement",
    },
    {
      id: 2,
      name: "Materials",
    },
    {
      id: 3,
      name: "Exam",
    },
  ];

  let params = {};
  let test = {};

  if (content) {
    //Filter title
    params = {
      $text: {
        $search: `"${content}"`,
      },
    };
  }

  if (creator) {
    creator = typeof creator == "string" ? [creator] : creator;
    params.postedBy = {
      $in: creator.map((e) => ObjectId(e)),
    };
  }

  if (dateStart || dateEnd) {
    if (dateStart) {
      dateStart = new Date(dateStart);
      params.createdAt = {
        $gte: dateStart,
      };
    }

    if (dateEnd) {
      dateEnd = new Date(dateEnd);
      params.createdAt = {
        $lte: dateEnd,
      };
    }
  }

  params.postedOn = courseId;

  if (category) {
    //Filter category
    category =
      typeof category == "string"
        ? [parseInt(category)]
        : category.map((e) => parseInt(e));
    params.category = {
      $in: filters.filter((e) => category.includes(e.id)).map((e) => e.name),
    };
  }

  if(tag){
    params.tag = {
      $elemMatch : {$in : tag.map((e) => ObjectId(e._id))}
    }
  }

  console.log(params);
  // console.log(test);

  const posts = await Post.paginate(params, options);
  if(req.user){
    posts.docs.forEach((post) => {
      idx = post.likes.likedBy.indexOf(req.user._id);
      post._doc.isLike = idx >= 0 ? true : false;
      post._doc.owned = post.postedBy.id == req.user.id;
    });
  }

  if (req.user) {
    res.json({ status: "ok", posts: posts });
  } else {
    res.json({ status: "error" });
  }
};

exports.createReview = async (req, res) => {
  const { rating, user, course, message } = req.body;

  let review = new Review({
    rating: rating,
    user: user,
    course: course,
    message: message,
  });

  review.save(function (err) {
    Review.aggregate([
      { $match: { course: mongoose.Types.ObjectId(course) } },
      {
        $group: {
          _id: "$course",
          average: { $avg: "$rating" },
          count : { $sum : 1}
        },
      },
    ]).then((rating) => {
      console.log(rating);

      Course.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(rating[0]._id) },
        { 
          rating: rating[0].average.toFixed(2),
          countReview : rating[0].count
        },
        function (err, course) {
          if (err) return res.json({ status: "error", message: err.message });
          console.log(course);
        }
      );
    });

    if (err) {
      return res.json({ status: "error", message: err.message });
    }

    res.json(review);
  });
};

exports.getDiscussions = async (req,res) => {
  try {
    const {course, user} = req;
    var {page, limit} = req.query;
    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;
  
    const filter = getDiscussionFilter(req.query, course._id)
    const length = await Discussion.countDocuments(filter);
    const avail = page * limit < length;
  
    var field = {}
    if(user){
      field = {  
        isVoted: {$in: [user._id, "$votes.voters"]},
        canEdit: {$eq: [user._id, "$creator"]},
        canDelete: {$in: [user._id, ["$creator",course.creator._id]]}
      }
    }
    
    const discussions = await Discussion.aggregate([
        {$match: filter},
        {$sort: {createdAt: -1}},
        {$lookup: {from: 'discussionanswers', localField: 'answers.topAnswers', foreignField: '_id', as: 'answers.topAnswers'}},
        {$lookup: {from: 'tags', localField: 'tag', foreignField: '_id', as: 'tag'}},
        {$unwind: {path: "$answers.topAnswers", preserveNullAndEmptyArrays: true}},
        {$lookup: {from: 'users', localField: 'answers.topAnswers.creator', foreignField: '_id', as: 'answers.topAnswers.creator'}},
        {$unwind: {path: "$answers.topAnswers.creator", preserveNullAndEmptyArrays: true}}, //since it's guaranteed that the creator is only on convert from array to object by unwind
        {$group: {
          _id : "$_id",
          doc : {$first : "$$ROOT"},
          topAnswers: {$push: {$cond:[
            { $ne: ["$answers.topAnswers", {}] }, //don't add empty object - empty object exist because of unwind with preserveNullAndEmptyArrays
            "$answers.topAnswers",
            "$$REMOVE"
          ]}}
        }},
        {$replaceRoot:{"newRoot": {"$mergeObjects" : ["$doc", {answers : {total: "$doc.answers.total", topAnswers: "$topAnswers"}}]}}},
        {$addFields : field}
    ])
    .skip(((page || 1)-1) * limit)
    .limit(limit);

    res.json({status: "ok", discussions, avail});
  }catch(err){
    res.json({status:"error", message:err.message})
  }
}

const getDiscussionFilter = (params, courseId) =>{
  var {
    query,
    instructor,
    dateStart,
    dateEnd,
  } = params;

  var filter = {
    postedOn: courseId,  
  };

  if(query){
    query = new RegExp(query.replace(/[^a-zA-Z ]/g, ""), "i");
    filter["$or"] = [
      {
        title: {
          $regex: query,
        },
      },
      {
        body: {
          $regex: query,
        },
      },
    ];
  }

  if(instructor){
    if (!Array.isArray(instructor)){
      instructor = [ObjectId(instructor)]
    }else{
      instructor = instructor.map(val => ObjectId(val))
    }
    filter["creator"] = {
      $in: instructor
    }
  }

  if (dateStart) {
    dateStart = new Date(dateStart);
    filter["createdAt"] = {
      $gte: dateStart,
    };
  }

  if (dateEnd) {
    dateEnd = new Date(dateEnd);
    filter["createdAt"] = {
      $lte: dateEnd,
    };
  }
  return filter
}