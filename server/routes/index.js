const express = require("express");
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");

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
 * POST ROUTES /api/posts
 */
router.param("postId", postController.getPostById);
router.put(
  "/api/posts/like",
  authController.checkAuth,
  catchErrors(postController.toggleLike)
);

router.put(
  "/api/posts/unlike",
  authController.checkAuth,
  catchErrors(postController.toggleLike)
);


router.post(
  "/api/posts/new/:userId",
  authController.checkAuth
  // postController.uploadImage,
  // catchErrors(postController.resizeImage),
  // catchErrors(postController.addPost)
);

module.exports = router;