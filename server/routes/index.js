const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const exerciseController = require("../controllers/exerciseController");
const exerciseResultController = require("../controllers/exerciseResultController");
const postController = require("../controllers/postController");
const courseController = require("../controllers/courseController");
const questionPoolController = require("../controllers/questionPoolController");
const answerSheetController = require("../controllers/answerSheetController");
const fileController = require("../controllers/fileController");
const examController = require("../controllers/examController");
const attachmentController = require("../controllers/attachmentController");
const applicationController = require("../controllers/applicationController");
const paymentController = require("../controllers/paymentController");
const discussionController = require('../controllers/discussionController');
const tagController = require('../controllers/tagController')
const roomController = require('../controllers/roomController')
const multer = require('multer');
const {uuid} = require('uuidv4');
const fs = require('fs');

const app = express();
const router = express.Router();
const DIR = "static/documents/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuid() + "-" + fileName);
  },
});

upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "application/pdf" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .pdf .png, .jpg and .jpeg format allowed!"));
    }
  },
});

/* Error handler for async / await functions */
const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/**
 * AUTH ROUTES: /api/auth
 */
router.post(
  "/api/auth/signup",
  authController.validateSignup,
  catchErrors(authController.signup)
);

router.post("/api/auth/signin", authController.signin);
router.get("/api/auth/signout", authController.signout);

router.post(
  '/api/auth/validate',
  catchErrors(authController.validateEmail)
)

//Generate new otp
router.get(
  '/api/auth/otp',
  catchErrors(authController.generateNewOTP)
)

/**
 * QUESTION POOL ROUTES
 */
router.post(
  "/api/courses/:courseId/question-pools",
  authController.checkAuth,
  questionPoolController.addNewQuestionPools
);
router.get(
  "/api/courses/:courseId/question-pools",
  authController.checkAuth,
  questionPoolController.fetchAllExerciseSchema
);
router.get(
  "/api/question-pools/:id",
  authController.checkAuth,
  questionPoolController.fetchSingleQuestionPool
);
router.put(
  "/api/question-pools/:id",
  authController.checkAuth,
  questionPoolController.updateQuestionPool
);
router.get("/api/courses/:courseId/questionpools",questionPoolController.getQuestionPools);
router.get("/api/courses/:courseId/questionpools/random",authController.checkAuth,questionPoolController.getRandomQuestionPools);

/**
 * ATTACHMENT ROUTE
 */

router.post(
  "/api/attachments",
  authController.checkAuth,
  attachmentController.createAttachment
);

router.get(
  "/api/attachments/:id",
  authController.checkAuth,
  attachmentController.fetchSingleAttachment
);

/**
 * PROBLEM STATEMENTS ROUTES
 */
router.put(
  "/api/courses/:courseId/answer-sheets/:id",
  answerSheetController.updateAnswerSheet
);
router.get(
  "/api/answer-sheets/:id",
  answerSheetController.fetchSingleAnswerSheet
);

/**
 * EXAM ROUTES
 */
router.post("/api/courses/:courseId/exams", examController.addNewExam);
router.get("/api/exams/:id", examController.fetchSingleExam);
router.post("/api/courses/:courseId/exams/:id/question-pools", examController.addQuestionPoolToExam)
router.get("/api/courses/:courseId/exams/:id/start", examController.startExam)
router.post("/api/courses/:courseId/exams/multiple", examController.addMultipleExam);
router.get("/api/courses/:courseId/exams",examController.getExams)

/**
 * EXERCISE ROUTES
 */
router.post("/api/courses/:courseId/exercises/multiple", exerciseController.addMultipleExercise);
router.get("/api/courses/:courseId/exercises", exerciseController.getExercises)

/**
 * EXERCISE RESULT ROUTES
 */
 
 router.post(
   "/api/courses/:courseId/exercise-result/submit",exerciseResultController.submitExerciseResult);
 router.get("/api/courses/:courseId/exercise-results",exerciseResultController.getExerciseResults);
 
/**
 * COURSE ROUTES /api/courses
 */

router.get(
  "/api/courses/:courseId/posts",
  // authController.checkAuth,
  catchErrors(courseController.getPosts)
);


router.param("courseId", courseController.getCourseById);

router.get(
  "/api/courses/:courseId/discussions",
  // authController.checkAuth,
  catchErrors(courseController.getDiscussions)
)

router.post(
  "/api/courses/:courseId/discussions",
  authController.checkAuth,
  discussionController.validateDiscussion,
  catchErrors(tagController.addTags),
  courseController.createCourseDiscussion,
  catchErrors(courseController.getDiscussions)
)

//Unregistered user can see courses and course info
router.get(
  "/api/courses",
  // authController.checkAuth,
  catchErrors(courseController.getCourses)
);

router.post(
  "/api/courses",
  authController.checkAuth,
  catchErrors(courseController.createCourse),
  catchErrors(tagController.addTags),
  catchErrors(courseController.getMyCourses)
);

router.get(
  "/api/courses/favourite",
  catchErrors(courseController.getFavouriteCourse)
)

router.get(
  "/api/courses/mycourses",
  authController.checkAuth,
  catchErrors(courseController.getMyCourses)
);

router.get(
  "/api/courses/joinedcourses",
  catchErrors(courseController.getJoinedCourse)
);

router.get(
  "/api/courses/:courseId",
  catchErrors(courseController.getCourse)
);

router.post(
  "/api/courses/review",
  authController.checkAuth,
  catchErrors(courseController.createReview)
)

router.put(
  "/api/courses/:courseId/edit",
  authController.checkAuth,
  courseController.updateCourse,
  catchErrors(tagController.deleteTags),
  catchErrors(tagController.addTags),
  catchErrors(courseController.getMyCourses)
)

router.get(
  "/api/courses/:courseId/requests",
  catchErrors(courseController.getCourseRequests)
);

router.put(
  "/api/courses/acceptrequest",
  catchErrors(courseController.acceptCourseRequest)
);

router.post(
  "/api/courses/:courseId/posts",
  authController.checkAuth,
  postController.validatePost,
  catchErrors(tagController.addTags),
  catchErrors(courseController.createCoursePost),
  catchErrors(courseController.getPosts)
);

/**
 * POST ROUTES /api/posts
 */
router.param("postId", postController.getPostById);

router.put(
  "/api/posts/:postId/like",
  authController.checkAuth,
  catchErrors(postController.likeAPost)
);

router.get(
  "/api/posts/:postId",
  authController.checkAuth,
  catchErrors(authController.checkPostAuth)
)

router.put(
  "/api/posts/:postId",
  authController.checkAuth,
  postController.validatePost,
  catchErrors(tagController.deleteTags),
  catchErrors(tagController.addTags),
  catchErrors(postController.updatePost)
)

router.delete(
  "/api/posts/:postId",
  authController.checkAuth,
  catchErrors(tagController.deleteTags),
  catchErrors(postController.deletePost),
  catchErrors(courseController.getPosts)
)

router.post(
  "/api/posts/:postId/comment",
  authController.checkAuth,
  postController.validateComment,
  catchErrors(postController.createComment)
);

/**
 * /api/discussions
 */
 router.param("discussionid", discussionController.getDiscussionById);

router.delete(
  '/api/discussions/:discussionid',
  authController.checkAuth,
  catchErrors(tagController.deleteTags),
  catchErrors(discussionController.deleteDiscussion),
  catchErrors(courseController.getDiscussions)
)

router.put(
  "/api/discussions/:discussionid",
  authController.checkAuth,
  discussionController.validateDiscussion,
  catchErrors(tagController.deleteTags),
  catchErrors(tagController.addTags),
  discussionController.updateDiscussion
)

router.post(
  "/api/discussions/:discussionid/answers",
  authController.checkAuth,
  discussionController.createAnswer
)

router.put(
  "/api/discussions/:discussionid/vote",
  authController.checkAuth,
  catchErrors(discussionController.voteDiscussion)
)

/**
 * USER ROUTES: /api/users
 */


router.get(
  "/api/users/me",
  authController.checkAuth, 
  (req,res)=>{
    res.json({status: "ok", user: req.user});
  }
);

router.get("/api/users/instructors", (req,res)=>{
  res.json({status: "ok", user: req.user});
});

router.get(
  "/api/users/me/notifications", 
  authController.checkAuth,
  catchErrors(userController.getMyNotifications)
)

router.put(
  '/api/users/me/notifications/:notificationId',
  authController.checkAuth,
  catchErrors(userController.readMyNotification)
)

router.get(
  "/api/users/me/myteachers",
  authController.checkAuth,
  catchErrors(userController.getMyTeachers)
);

router.param("userId", userController.getUserById);

router.get("/api/users/:userId", (req,res)=>{
  res.json({status: "ok", user: req.profile})
});

router.get(
  "/api/users",
  authController.checkAuth,
  catchErrors(userController.getUsers)
)

router.get(
  "/api/instructors",
  catchErrors(userController.getAllInstructors)
)

router.get(
  "/api/organizations",
  catchErrors(userController.getAllOrganizations)
)


router.put(
  "/api/users/updateprofile",
  authController.checkAuth,
  catchErrors(userController.updateUser)
);

/**
 * Teacher Application Routes: /api/teacher-application
 */

router.param("applicationId",applicationController.getApplicationById);

router.get(
  "/api/teacher-applications",
  authController.checkAuth,
  catchErrors(applicationController.getApplications)
)

router.post(
  "/api/teacher-applications",
  authController.checkAuth,
  catchErrors(applicationController.createApplication),
  catchErrors(userController.getUsers)
)

router.put(
  "/api/teacher-applications/:applicationId/accept",
  authController.checkAuth,
  catchErrors(applicationController.acceptRequest),
  catchErrors(applicationController.getApplications)
)

router.post(
  "/api/teacher-applications/:applicationId/reject",
  authController.checkAuth,
  catchErrors(applicationController.rejectRequest),
  catchErrors(applicationController.getApplications)
)

router.delete(
  "/api/teacher-applications/:applicationId",
  authController.checkAuth,
  catchErrors(applicationController.cancelApplication),
  catchErrors(userController.getUsers)
)

/**
 * POST ROUTES /api/files
 */

router.get(
  "/files/:filePath",
  authController.checkAuth,
  catchErrors(fileController.getPreSignedUrl)
)

router.get(
  '/archive/:postId.zip',
  authController.checkAuth,
  catchErrors(fileController.getAllPreSignedUrl)
)

router.get(
  "/course_logo/:filePath",
  catchErrors(fileController.getPreSignedUrl)
)

router.post(
  "/api/course_logo/generate-put-url",
  catchErrors(fileController.putPreSignedUrl)
)

router.post(
  "/api/files/generate-put-url",
  authController.checkAuth,
  catchErrors(fileController.putPreSignedUrl)
)

/**
 * PAYMENT Routes: /api/payment
 */
router.get(
  "/api/payment/mypayments",
  authController.checkAuth,
  catchErrors(paymentController.getMyPayment)
)


router.post(
  "/api/payment/create",
  authController.checkAuth,
  catchErrors(paymentController.createPayment)
)

router.post(
  '/api/payment/callback',
  catchErrors(paymentController.paymentCallback)
)

/**
 * Tag Routes: /api/tag
 */

router.get(
  "/api/tag",
  authController.checkAuth,
  catchErrors(tagController.getTags)
)

// router.post(
//   "/api/tag",
//   // authController.checkAuth,
//   catchErrors(tagController.addTags)
// )

// router.delete(
//   "/api/tag",
//   // authController.checkAuth,
//   catchErrors(tagController.deleteTags)
// )


/**
 * Room Routes: /api/room
 */
 router.param("roomId", roomController.getRoomById);

router.get(
  "/api/courses/:courseId/rooms",
  authController.checkAuth,
  catchErrors(roomController.getRooms)
)

router.post(
  "/api/courses/:courseId/room",
  authController.checkAuth,
  catchErrors(roomController.createRoom)
)

router.get(
  "/api/room/:roomId",
  authController.checkAuth,
  catchErrors(roomController.joinRoom)
)

module.exports = router;
