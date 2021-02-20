const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Course = mongoose.model("Course");
const Post = mongoose.model("Post");
const Discussion = mongoose.model("Discussion");
const Review = mongoose.model("Review");
const CourseRequest = mongoose.model("CourseRequest");

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

  const match = new RegExp(query.replace(/[^a-zA-Z ]/g, ""), "i");
  const [low, high] = price;
  limit = parseInt(limit);
  page = parseInt(page);

  let filter = {
    price: {
      $lte: high,
      $gte: low,
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
      $in: instructor,
    };
  }

  if (organization) {
    filter["creator"] = {
      $in: organization,
    };
  }

  const length = await Course.countDocuments(filter);
  const avail = page * limit < length;
  const courses = await Course.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);
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
  if (user.canCreateCourse) {
    let course = new Course({
      ...req.body,
      creator: user,
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
    req.course._doc.isInstructor = req.user.isInstructor(course);
    return next();
  }
  next();
};

exports.getCourse = async (req, res) => {
  const course = await Course.findById(req.course.id);
  req.course = course;
  if (req.course && req.user) {
    req.course._doc.isInstructor = req.user.isInstructor(course);
    return res.json({ course: req.course });
  }
};

exports.getMyCourses = async (req, res) => {
  const { user } = req;
  const results = await Course.find({
    $or: [
      {
        creator: user,
      },
      {
        instructors: user,
      },
    ],
  });
  return res.json({ status: "ok", courses: results });
};

exports.createCourseDiscussion = (req,res,next) => {
  const {title, body, tags} = req.body;
  const {user, course} = req;
  if(!user.canCreateDiscussion(course)){
      return res.status(403).json({
          status: "error", 
          message: "Forbidden to create discussion in this course"
      });
  }
  let discussion = new Discussion({
      title: title,
      body: body,
      tags: tags,
      postedOn: course,
      creator: user
  })
  discussion.save((err,savedDiscussion)=>{
      if(err){
          return res.json({status: "error", message: err.message})
      }
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
  (course.name = name),
    (course.about = about),
    (course.prerequisites = prerequisites),
    (course.materials = materials),
    (course.price = price),
    (course.rating = rating),
    (course.instructors = instructors);
  course.logo = logo;
  course.save((err, response) => {
    if (!err) {
      return next();
    }
    res.json({ status: "ok", course: response });
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
  const { title, body, category, attachments } = req.body;
  let post = new Post({
    title: title,
    body: body,
    category: category,
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
  let { category, content, page, dateStart, dateEnd, creator } = req.query;
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

  console.log(params);
  // console.log(test);

  const posts = await Post.paginate(params, options);
  posts.docs.forEach((post) => {
    idx = post.likes.likedBy.indexOf(req.user._id);
    post._doc.isLike = idx >= 0 ? true : false;
    post._doc.owned = post.postedBy.id == req.user.id;
  });
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
    const {course, user} = req;
    const discussions = await Discussion.aggregate([
        {$match: {postedOn: course._id}},
        {$addFields: {  
            isVoted: {$in: [user._id, "$votes.voters"]},
            canEdit: {$eq: [user._id, "$creator"]},
            canDelete: {$in: [user._id, ["$creator",course.creator._id]]}
        }},
        {$sort: {createdAt: -1}},
        {$lookup: {from: 'discussionanswers', localField: 'answers.topAnswers', foreignField: '_id', as: 'answers.topAnswers'}}
    ])
    res.json({status: "ok", discussions: discussions});
}