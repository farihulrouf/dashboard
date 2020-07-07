const mongoose = require("mongoose");
const AnswerSheet = mongoose.model("AnswerSheet");
const ExerciseMaterial = mongoose.model("ExerciseMaterial");
mongoose.Promise = require("bluebird");

exports.updateAnswerSheet = async (req, res) => {
  AnswerSheet.findById(req.params.id)
    .then((answerSheet) => {
      answerSheet.participantSolutions = req.body.participantSolutions;

      answerSheet
        .save()
        .then((answerSheet) => {
          var jobQueries = [];
          answerSheet.participantSolutions.forEach(function (p) {
            jobQueries.push(ExerciseMaterial.findById(p.exerciseMaterialId));
          });
          return Promise.all(jobQueries);
        })
        .then((listOfJobs) => {
          var score = 0;
          var listOfProblemsAndParticipantSolutions = []
          const participantSolutions = answerSheet.participantSolutions;
          for (var i = 0; i < listOfJobs.length; i++) {
            listOfProblemsAndParticipantSolutions.push(
              {
                exerciseMaterialId: listOfJobs[i]._id,
                question: listOfJobs[i].question,
                multipleChoices: listOfJobs[i].multipleChoices,
                solution: listOfJobs[i].solution,
                participantAnswer:participantSolutions[i].answer, 
              }
            );
            if (listOfJobs[i].solution == participantSolutions[i].answer) {
              score = score + 1;
            }
          }
          var scoreProblemSolutions = {
            score: score,
            listOfProblemsAndParticipantSolutions:  listOfProblemsAndParticipantSolutions,
          }
          return scoreProblemSolutions;
        })
        .then((scoreProblemSolutions) => {
            answerSheet.score = scoreProblemSolutions.score;
            answerSheet.problemWithParticipantAnswer = scoreProblemSolutions.listOfProblemsAndParticipantSolutions
            answerSheet
            .save()
            .then((answerSheet) => {
                res.json(answerSheet)
            })
            .catch((err) => res.Status(400).json("Error " + err));
        })
        .catch((err) => res.Status(400).json("Error " + err));
    })
    .catch((err) => res.Status(400).json("Error " + err));
};

exports.fetchSingleAnswerSheet = async (req, res) => {
  AnswerSheet.findById(req.params.id)
    .then((answerSheet) => {
      res.json(answerSheet);
    })
    .catch((err) => res.Status(400).json("Error " + err));
};
