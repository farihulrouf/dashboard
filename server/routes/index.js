const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const exerciseController = require("../controllers/exerciseController");

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
router.get("/api/exercises/:id", exerciseController.fetchSingleExercise);
router.put("/api/exercises/:id", exerciseController.updateExercise);
router.get("/api/exercises", exerciseController.fetchAllExercise);
router.post("/api/exercises", exerciseController.addNewExercises);
module.exports = router;