const mongoose = require("mongoose");
const { diff } = require("jimp");
const Exam = mongoose.model("Exam");
const AnswerSheet = mongoose.model("AnswerSheet");
const QuestionPool = mongoose.model("QuestionPool");
const { ObjectId } = mongoose.Types;

exports.addNewExam = async (req, res) => {
  const questionPools = req.body.questionPools;
  const numberOfProblems = req.body.numberOfProblems;
  const name = req.body.name;
  const duration = Number(req.body.duration);
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;

  const exam = new Exam({
    questionPools,
    numberOfProblems,
    name,
    duration,
    startTime,
    endTime,
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

exports.addQuestionPoolToExam = async (req, res) => {
  const difficultyLabel = req.body.difficultyLabel;
  const question = req.body.question;
  const multipleChoices = req.body.multipleChoices;
  const courseId = ObjectId(req.body.course);
  const solution = req.body.solution;
  const type = req.body.type;

  Exam.findById(req.params.id)
    .then((exam) => {
      const newQuestionPool = new QuestionPool({
        difficultyLabel,
        question,
        multipleChoices,
        courseId,
        solution,
        type,
      });

      newQuestionPool.save().then((questionPool) => {
        questionPools = exam.questionPools;
        questionPools.push(questionPool.id);
        exam.questionPools = questionPools;

        exam
          .save()
          .then(() => {
            Exam.findById(req.params.id)
              .then((preloadedExam) => {
                res.json(preloadedExam);
              })
              .catch((err) => res.Status(400).json("Error " + err));
          })
          .catch((err) => res.Status(400).json("Error " + err));
      });
    })
    .catch((err) => res.Status(400).json("Error " + err));
};

exports.startExam = async (req, res) => {
  Exam.findById(req.params.id)
    .then((exam) => {
      currentDate = new Date();
      if (exam.startTime <= currentDate <= exam.endTime) {
        var diffMinutes = getDateDiffInMinutes(exam.startTime, exam.endTime);
        if (diffMinutes == exam.duration) {
          var dateStart = Date.now();
          var dateSubmission = exam.endTime;
          var type = "exam";
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
                exam: exam,
                answerSheet: result,
              })
            )
            .catch((err) => res.Status(400).json("Error: " + err));
            return;
        } else {
          var dateStart = Date.now();
          var dateSubmission = Date.now() + exam.duration * 60 * 1000;
          var type = "exam";
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
                exam: exam,
                answerSheet: result,
              })
            )
            .catch((err) => res.Status(400).json("Error: " + err));
            return;
        }
        return;
      } else {
        if (currentDate > exam.endTime) {
          res.json("Waktu pengerjaan ujian sudah habis");
        } else {
          res.json("Waktu pengerjaan ujian belum dimulai");
        }
      }
    })
    .catch((err) => res.Status(400).json("Error " + err));
};

function getDateDiffInMinutes(d1, d2) {
  var diff = d2 - d1;
  diffMinnutes = diff / (60 * 1000);
  return Math.round(diffMinnutes);
}
