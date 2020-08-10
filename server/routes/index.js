const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const exerciseController = require("../controllers/exerciseController");
const postController = require("../controllers/postController");
const courseController = require("../controllers/courseController");
const questionPoolController = require("../controllers/questionPoolController");
const answerSheetController = require("../controllers/answerSheetController");
const fileController = require("../controllers/fileController")
const examController = require("../controllers/examController")
const applicationController = require("../controllers/applicationController");
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

/**
 * EXERCISE MATERIALS ROUTES
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

/**
 * COURSE ROUTES /api/courses
 */

router.get(
  "/api/courses/:courseId/posts",
  authController.checkAuth,
  catchErrors(courseController.getPosts)
);

router.param("courseId", courseController.getCourseById);

//Unregistered user can see courses and course info
router.post(
  "/api/courses/create",
  authController.checkAuth,
  catchErrors(courseController.createCourse),
  catchErrors(courseController.getMyCourses)
);

router.get(
  "/api/courses",
  authController.checkAuth,
  catchErrors(courseController.getCourses)
);

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

router.put(
  "/api/courses/:courseId/edit",
  authController.checkAuth,
  courseController.updateCourse,
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
  "/api/courses/:courseId/posts/create",
  authController.checkAuth,
  postController.validatePost,
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
  catchErrors(postController.updatePost)
)

router.delete(
  "/api/posts/:postId",
  authController.checkAuth,
  catchErrors(postController.deletePost),
  catchErrors(courseController.getPosts)
)

router.post(
  "/api/posts/:postId/comment",
  authController.checkAuth,
  postController.validateComment,
  catchErrors(postController.createComment)
);

// router.post(
//   "/api/posts/new/:userId",
//   authController.checkAuth
//   postController.uploadImage,
//   catchErrors(postController.resizeImage),
//   catchErrors(postController.addPost)
// );

/**
 * USER ROUTES: /api/users
 */


router.get("/api/users/me", (req,res)=>{
  res.json({status: "oke", user: req.user});
});

router.get("/api/users/me/myteachers",catchErrors(userController.getMyTeachers));

router.param("userId", userController.getUserById);

router.get("/api/users/:userId", (req,res)=>{
  res.json({status: "ok", user: req.profile})
});

router.get(
  "/api/users",
  authController.checkAuth,
  catchErrors(userController.getUsers)
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
  "/api/teacher-applications/create",
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

router.post(
  "/api/files/generate-put-url",
  authController.checkAuth,
  catchErrors(fileController.putPreSignedUrl)
)

module.exports = router;
