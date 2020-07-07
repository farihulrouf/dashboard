const mongoose = require("mongoose");
const ProblemStatement = mongoose.model("ProblemStatement");
const ExerciseMaterial = mongoose.model("ExerciseMaterial");
mongoose.Promise = require("bluebird");

exports.updateProblemStatement = async (req, res) => {
  ProblemStatement.findById(req.params.id)
    .then((problemStatement) => {
      problemStatement.participantSolutions = req.body.participantSolutions;

      problemStatement
        .save()
        .then((problemStatement) => {
          var jobQueries = [];
          problemStatement.participantSolutions.forEach(function (p) {
            jobQueries.push(ExerciseMaterial.findById(p.exerciseMaterialId));
          });
          return Promise.all(jobQueries);
        })
        .then((listOfJobs) => {
          var score = 0;
          var listOfProblemsAndParticipantSolutions = []
          const participantSolutions = problemStatement.participantSolutions;
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
            problemStatement.score = scoreProblemSolutions.score;
            problemStatement.problemWithParticipantAnswer = scoreProblemSolutions.listOfProblemsAndParticipantSolutions
            problemStatement
            .save()
            .then((problemStatement) => {
                res.json(problemStatement)
            })
            .catch((err) => res.Status(400).json("Error " + err));
        })
        .catch((err) => res.Status(400).json("Error " + err));
    })
    .catch((err) => res.Status(400).json("Error " + err));
};

exports.fetchSingleProblemStatement = async (req, res) => {
  ProblemStatement.findById(req.params.id)
    .then((problemStatement) => {
      res.json(problemStatement);
    })
    .catch((err) => res.Status(400).json("Error " + err));
};
