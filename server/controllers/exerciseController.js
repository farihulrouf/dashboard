const mongoose = require("mongoose");
const Exercise = mongoose.model("Exercise");

exports.fetchAllExercise = async (req, res) => {
  Exercise.find()
    .then((exercises) => res.json(exercises))
    .catch((err) => res.Status(400).json("Error :" + err));
};

exports.fetchSingleExercise = async (req, res) => {
  Exercise.findById(req.params.id)
  .then(exercise => res.json(exercise))
  .catch(err => res.Status(400).json('Error '+err))
};

exports.deleteExercise = async (req, res) => {
  Exercise.findByIdAndDelete(req.params.id)
  .then(exercise => res.json(exercise))
  .catch(err => res.Status(400).json('Error '+err))
}

exports.updateExercise = async (req, res) => {
  Exercise.findById(req.params.id) 
  .then( exercise => {
    exercise.questionType = req.body.questionType;
    exercise.difficulty = req.body.difficulty;
    exercise.numberOfQuestions = Number(req.body.numberOfQuestions);
    exercise.timeLimit = Number(req.body.timeLimit);

    exercise.save()
    .then(() => res.json('Exercise Updated!'))
    .catch(err => res.Status(400).json('Error '+ err));
  })
  .catch(err => res.Status(400).json('Error '+ err));
}

exports.addNewExercises = async (req, res) => {
  const questionType = req.body.questionType;
  const difficulty = req.body.difficulty;
  const questionPool = req.body.questionPool;
  const numberOfQuestions = Number(req.body.numberOfQuestions);
  const timeLimit = Number(req.body.timeLimit);

  const newExercise = new Exercise({
    questionType,
    difficulty,
    questionPool,
    numberOfQuestions,
    timeLimit,
  });

  newExercise
    .save()
    .then(() => res.json("Exercise saved!"))
    .catch((err) => res.Status(400).json("Error: " + err));
};
