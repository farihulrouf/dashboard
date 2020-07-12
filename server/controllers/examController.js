const mongoose = require("mongoose");
const Exam = mongoose.model("Exam");
const AnswerSheet = mongoose.model("AnswerSheet");


exports.addNewExam = async (req, res) => {
  const exerciseMaterials = req.body.exerciseMaterials;
  const numberOfProblems = req.body.numberOfProblems;
  const name = req.body.name;
  const duration = Number(req.body.duration);

  const exam = new Exam({
    exerciseMaterials,
    numberOfProblems,
    name,
    duration, 
  });

  exam
    .save()
    .then((result) => res.json(result))
    .catch((err) => res.Status(400).json("Error: " + err));
};

exports.fetchSingleExam = async (req, res) => {
  Exam.findById(req.params.id)
    .then((exam) => {
        var dateStart = Date.now();
        var dateSubmission = Date.now() + exam.duration * 60 * 1000;
        var type = "exam";
        const newAnswerSheet = new AnswerSheet({
          dateStart,
          dateSubmission,
          type,
        });

        newAnswerSheet
          .save()
          .then((result) =>
            res.json({
              exam: exam,
              answerSheet: result,
            })
          )
          .catch((err) => res.Status(400).json("Error: " + err));
    })
    .catch((err) => res.Status(400).json("Error " + err));
};
