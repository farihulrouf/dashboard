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
          const participantSolutions = problemStatement.participantSolutions;
          for (var i = 0; i < listOfJobs.length; i++) {
            if (listOfJobs[i].solution == participantSolutions[i].answer) {
              score = score + 1;
            }
          }
          return score;
        })
        .then((score) => {
            problemStatement.score = score;

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
