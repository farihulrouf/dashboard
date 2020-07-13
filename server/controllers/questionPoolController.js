const mongoose = require("mongoose");
const QuestionPool = mongoose.model("QuestionPool");
const AnswerSheet = mongoose.model("AnswerSheet");
const { ObjectId } = mongoose.Types;

exports.fetchAllExerciseSchema = async (req, res) => {
  const difficultyLabel = req.query.difficultyLabel;
  const size = Number(req.query.size);
  const timeLimit = req.query.timeLimit;
  if (size != null) {
    QuestionPool.aggregate([
      { $match: { difficultyLabel: difficultyLabel } },
      { $sample: { size: size } },
      { $unset: "solution" },
    ])
      .then((questionPools) => {
        var dateStart = Date.now();
        var dateSubmission = Date.now() + timeLimit * 60 * 1000;
        var type = "exercise";
        var participantId = req.user.id;
        const newAnswerSheet = new AnswerSheet({
          dateStart,
          dateSubmission,
          type,
          participantId,
        });

        newAnswerSheet
          .save()
          .then((result) =>
            res.json({
              questionPools: questionPools,
              answerSheet: result,
            })
          )
          .catch((err) => res.Status(400).json("Error: " + err));
      })
      .catch((err) => res.Status(400).json("Error :" + err));
    return;
  }
  QuestionPool.find({ difficultyLabel: difficultyLabel })
    .select("-solution")
    .then((questionPools) => res.json(questionPools))
    .catch((err) => res.Status(400).json("Error :" + err));
};

exports.addNewQuestionPools = async (req, res) => {
  const difficultyLabel = req.body.difficultyLabel;
  const question = req.body.question;
  const multipleChoices = req.body.multipleChoices;
  const courseId = ObjectId(req.body.course);
  const solution = req.body.solution;
  const type = req.body.type;

  const newQuestionPool = new QuestionPool({
    difficultyLabel,
    question,
    multipleChoices,
    courseId,
    solution,
    type,
  });

  newQuestionPool
    .save()
    .then((result) => res.json(result))
    // .catch((err) => res.Status(400).json("Error: " + err));
};

exports.fetchSingleQuestionPool = async (req, res) => {
  QuestionPool.findById(req.params.id)
    .then((exercise) => res.json(exercise))
    .catch((err) => res.Status(400).json("Error " + err));
};

exports.deleteQuestionPool = async (req, res) => {
  QuestionPool.findByIdAndDelete(req.params.id)
    .then((exercise) => res.json(exercise))
    .catch((err) => res.Status(400).json("Error " + err));
};

exports.updateQuestionPool = async (req, res) => {
  QuestionPool.findById(req.params.id)
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
