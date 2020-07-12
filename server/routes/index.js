const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const exerciseController = require("../controllers/exerciseController");
const postController = require("../controllers/postController");
const courseController = require("../controllers/courseController");
const exerciseMaterialController = require("../controllers/exerciseMaterialController");
const problemStatementController = require("../controllers/problemStatementController");
const fileController = require("../controllers/fileController")
const examController = require("../controllers/examController")
const multer = require('multer');
const {uuid} = require('uuidv4');
const fs = require('fs');

const router = express.Router();
const DIR = 'static/documents/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      if(!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true })
      cb(null, DIR);
  },
  filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, uuid() + '-' + fileName)
  }
});

upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      if (file.mimetype == "application/pdf" || file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Only .pdf .png, .jpg and .jpeg format allowed!'));
      }
  }
});

/* Error handler for async / await functions */
const catchErrors = fn => {
  return function(req, res, next) {
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
 * EXERCISES ROUTES /api/exercises
 */
router.get("/api/exercises/:id", exerciseController.fetchSingleExercise);
router.put("/api/exercises/:id", exerciseController.updateExercise);
router.get("/api/exercises", exerciseController.fetchAllExercise);
router.post("/api/exercises", exerciseController.addNewExercises);

/** 
 * EXERCISE MATERIALS ROUTES
 */
router.post("/api/exercise-materials", exerciseMaterialController.addNewExerciseMaterials)
router.get("/api/exercise-materials", exerciseMaterialController.fetchAllExerciseSchema)
router.get("/api/exercise-materials/:id", exerciseMaterialController.fetchSingleExerciseMaterial);
router.put("/api/exercise-materials/:id", exerciseMaterialController.updateExerciseMaterial);

/**
 * PROBLEM STATEMENTS ROUTES
 */
router.put("/api/problem-statements/:id",problemStatementController.updateProblemStatement);
router.get("/api/problem-statements/:id",problemStatementController.fetchSingleProblemStatement);

/**
 * EXAM ROUTES
 */
router.post("/api/exams",examController.addNewExam);
router.get("/api/exams/:id", examController.fetchSingleExam)


/**
 * COURSE ROUTES /api/courses
 */


router.get(
  "/api/courses/:courseId/posts",
  authController.checkAuth,
  catchErrors(courseController.getPosts)
)

router.param(
  "courseId",
  courseController.getCourseById
);


//Unregistered user can see courses and course info
router.get(
  "/api/courses",
  authController.checkAuth,
  catchErrors(courseController.getCourses)
);

router.get(
  "/api/courses/:courseId",
  catchErrors(courseController.getCourse)
);

router.post(
  "/api/courses/:courseId/posts/create",
  authController.checkAuth,
  courseController.validatePost,
  catchErrors(courseController.createCoursePost),
  catchErrors(courseController.getPosts)
)

/**
 * POST ROUTES /api/posts
 */
router.param(
  "postId",
  postController.getPostById
);

router.put(
  "/api/posts/:postId/like",
  authController.checkAuth,
  catchErrors(postController.likeAPost)
);

router.post(
  "/api/posts/:postId/comment",
  authController.checkAuth,
  postController.validateComment,
  catchErrors(postController.createComment)
)

// router.post(
//   "/api/posts/new/:userId",
//   authController.checkAuth
//   postController.uploadImage,
//   catchErrors(postController.resizeImage),
//   catchErrors(postController.addPost)
// );


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