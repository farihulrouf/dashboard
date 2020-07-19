const mongoose = require("mongoose");
const { diff } = require("jimp");
const Exam = mongoose.model("Exam");
const AnswerSheet = mongoose.model("AnswerSheet");
const QuestionPool = mongoose.model("QuestionPool");
const { ObjectId } = mongoose.Types;

const AWS = require("aws-sdk"); // Requiring AWS SDK.

// Configuring AWS
AWS.config = new AWS.Config({
  accessKeyId: process.env.S3_KEY, // stored in the .env file
  secretAccessKey: process.env.S3_SECRET, // stored in the .env file
  region: process.env.BUCKET_REGION, // This refers to your bucket configuration.
});

const s3 = new AWS.S3();
const Bucket = process.env.BUCKET_NAME;

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
  const attachments = req.body.attachments;

  Exam.findById(req.params.id)
    .then((exam) => {
      const newQuestionPool = new QuestionPool({
        difficultyLabel,
        question,
        multipleChoices,
        courseId,
        solution,
        type,
        attachments,
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
  Exam.findById(req.params.id).then((exam) => {
    promiseAllAttachments(exam).then((listOfJobs) => {
      exam = exam.toObject();
      var questionPools = exam.questionPools;
      questionPools.forEach((q, i) => {
        q.attachmentPresignURLs = listOfJobs[i];
      });
      exam.questionPools = questionPools;
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
          // res.json(exam);
          newAnswerSheet
            .save()
            .then((result) => {
              res.json({
                exam: exam,
                answerSheet: result,
              });
            })
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
      } else {
        if (currentDate > exam.endTime) {
          res.json("Waktu pengerjaan ujian sudah habis");
        } else {
          res.json("Waktu pengerjaan ujian belum dimulai");
        }
      }
    });
  });
  // .catch((err) => res.Status(400).json("Error " + err));
};

function getDateDiffInMinutes(d1, d2) {
  var diff = d2 - d1;
  diffMinnutes = diff / (60 * 1000);
  return Math.round(diffMinnutes);
}

function getPresignURL(key) {
  const Key = key;
  const params = {
    Bucket,
    Key,
    Expires: 120 * 60, // 2 minutes
  };

  var presignURL;

  presignURL = s3.getSignedUrl("getObject", params);
  return presignURL;
}

function promiseAllAttachments(exam) {
  var jobQuery = [];
  exam.questionPools.forEach(function (q) {
    var attachmentJobQueries = [];
    if (q.attachments) {
      q.attachments.forEach(function (a) {
        attachmentJobQueries.push(getPresignURL(a.key));
      });
      jobQuery.push(attachmentJobQueries);
    }
  });
  const promise4All = Promise.all(jobQuery.map(Promise.all.bind(Promise)));
  return promise4All;
}
