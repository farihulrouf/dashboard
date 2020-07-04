const mongoose = require("mongoose");
const ExerciseMaterial = mongoose.model("ExerciseMaterial");
const ProblemStatement = mongoose.model("ProblemStatement");
const { ObjectId } = mongoose.Types;

exports.fetchAllExerciseSchema = async (req, res) => {
  const difficultyLabel = req.query.difficultyLabel;
  const size = Number(req.query.size);
  const timeLimit = req.query.timeLimit;
  if (size != null) {
    ExerciseMaterial.aggregate([
      { $match: { difficultyLabel: difficultyLabel } },
      { $sample: { size: size } },
      { $unset: "solution" },
    ])
      .then((exerciseMaterials) => {
        var dateStart = Date.now();
        var dateSubmission = Date.now() + timeLimit * 60 * 1000;
        const newProblemStatement = new ProblemStatement({
          dateStart,
          dateSubmission,
        });

        newProblemStatement
          .save()
          .then((result) =>
            res.json({
              exerciseMaterials: exerciseMaterials,
              problemStatement: result,
            })
          )
          .catch((err) => res.Status(400).json("Error: " + err));
      })
      .catch((err) => res.Status(400).json("Error :" + err));
    return;
  }
  ExerciseMaterial.find({ difficultyLabel: difficultyLabel })
    .select("-solution")
    .then((exerciseMaterials) => res.json(exerciseMaterials))
    .catch((err) => res.Status(400).json("Error :" + err));
};

exports.addNewExerciseMaterials = async (req, res) => {
  const difficultyLabel = req.body.difficultyLabel;
  const question = req.body.question;
  const multipleChoices = req.body.multipleChoices;
  const post = ObjectId(req.body.post);
  const course = ObjectId(req.body.course);
  const solution = req.body.solution;

  const newExerciseMaterial = new ExerciseMaterial({
    difficultyLabel,
    question,
    multipleChoices,
    post,
    course,
    solution,
  });

  newExerciseMaterial
    .save()
    .then((result) => res.json(result))
    .catch((err) => res.Status(400).json("Error: " + err));
};

exports.fetchSingleExerciseMaterial = async (req, res) => {
  ExerciseMaterial.findById(req.params.id)
    .then((exercise) => res.json(exercise))
    .catch((err) => res.Status(400).json("Error " + err));
};

exports.deleteExerciseMaterial = async (req, res) => {
  ExerciseMaterial.findByIdAndDelete(req.params.id)
    .then((exercise) => res.json(exercise))
    .catch((err) => res.Status(400).json("Error " + err));
};

exports.updateExerciseMaterial = async (req, res) => {
  ExerciseMaterial.findById(req.params.id)
    .then((exercise) => {
      exercise.difficultyLabel = req.body.difficultyLabel;
      exercise.question = req.body.question;
      exercise.multipleChoices = req.body.multipleChoices;

      exercise
        .save()
        .then(() => res.json("Material Exercise Updated!"))
        .catch((err) => res.Status(400).json("Error " + err));
    })
    .catch((err) => res.Status(400).json("Error " + err));
};
