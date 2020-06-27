const express = require("express");
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");
const courseController = require("../controllers/courseController");

const router = express.Router();

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

// router.post(
//   "/api/posts/:postId/comment",
//   authController.checkAuth,
//   postController.validateComment,
//   catchErrors(postController.createComment)
// )
// router.post(
//   "/api/posts/new/:userId",
//   authController.checkAuth
//   postController.uploadImage,
//   catchErrors(postController.resizeImage),
//   catchErrors(postController.addPost)
// );

module.exports = router;