const express = require("express");
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");
const courseController = require("../controllers/courseController");
const multer = require('multer');
const {uuid} = require('uuidv4');

const router = express.Router();
const DIR = 'static/documents/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
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
  catchErrors(courseController.getCourses)
);

router.get(
  "/api/courses/:courseId",
  catchErrors(courseController.getCourse)
);

router.post(
  "/api/courses/:courseId/posts/create",
  authController.checkAuth,
  upload.array('attachments',6),
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

module.exports = router;