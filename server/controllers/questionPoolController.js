const mongoose = require("mongoose");
const QuestionPool = mongoose.model("QuestionPool");
const AnswerSheet = mongoose.model("AnswerSheet");
const ExerciseResult = mongoose.model("ExerciseResult");
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

exports.fetchAllExerciseSchema = async (req, res) => {
  const difficultyLabel = req.query.difficultyLabel;
  const size = Number(req.query.size);
  const timeLimit = req.query.timeLimit;
  const courseId = ObjectId(req.params.courseId);
  if (size != null) {
    QuestionPool.aggregate([
      { $match: {$and: [{ difficultyLabel: difficultyLabel}, {courseId: courseId}]} },
      { $sample: { size: size } },
      { $unset: "solution" },
    ])
      .then((questionPools) => {
        questionPools.forEach(function (q) {
          var attachmentJobQueries = [];
          if (q.attachments) {
            q.attachments.forEach(function (a) {
              attachmentJobQueries.push(getPresignURL(a.key));
            });
            (async function () {
              const asyncFunctions = attachmentJobQueries;
              const results = await Promise.all(asyncFunctions);
              q.attachmentPresignURLs = results;
              return results;
            })();
          }
        });
        return questionPools;
      })
      .then((modifiedQuestionPools) => {
        var dateStart = Date.now();
        var dateSubmission = Date.now() + timeLimit * 60 * 1000;
        var type = "exercise";
        var participantId = req.user.id;
        const newAnswerSheet = new AnswerSheet({
          dateStart,
          dateSubmission,
          type,
          participantId,
          courseId
        });
        newAnswerSheet
          .save()
          .then((result) =>
            res.json({
              questionPools: modifiedQuestionPools,
              answerSheet: result,
            })
          )
          .catch((err) => res.Status(400).json("Error: " + err));
      })
      // .catch((err) => res.Status(400).json("Error :" + err));
    return;
  }
  QuestionPool.find({ difficultyLabel: difficultyLabel })
    .select("-solution")
    .then((questionPools) => res.json(questionPools))
    .catch((err) => res.Status(400).json("Error :" + err));
};

exports.addNewQuestionPools = async (req, res, next) => {
  const difficultyLabel = req.body.difficultyLabel;
  const question = req.body.question;
  const multipleChoices = req.body.multipleChoices;
  const courseId = ObjectId(req.params.courseId);
  const solution = req.body.solution;
  const type = req.body.type;
  const attachments = req.body.attachments;
  const tags = req.body.tags;
  const playbackTimes = req.body.playbackTimes;
  const correctScore = req.body.correctScore;
  const wrongScore = req.body.wrongScore;

  const newQuestionPool = new QuestionPool({
    difficultyLabel,
    question,
    multipleChoices,
    courseId,
    solution,
    type,
    attachments,
    tag,
    playbackTimes,
    correctScore,
    wrongScore
  });

  newQuestionPool
    .save()
    .then((result) => res.json(result))
    .catch((err) => next(err ));
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

exports.getQuestionPools = async (req, res) => {
  let page = parseInt(req.query.page)
  let limit = parseInt(req.query.limit)
  let searchKeyword = req.query.searchKeyword
  let query = {courseId: ObjectId(req.params.courseId)}

  if(!!searchKeyword)query.question = { $regex: searchKeyword }
  if(!!!page)page = 0
  if(!!!limit)limit = 10

  QuestionPool.find(query)
  .skip((page - 1) * limit)
  .sort({ createdAt: -1 })
  .limit(limit).exec((err,result)=>{
    if(err)res.status(400).json(err)
    else res.json(result)
  })
}

exports.getRandomQuestionPools = async (req, res) => {
  let limit = parseInt(req.query.limit)
  let query = {
    courseId: ObjectId(req.params.courseId),
    difficultyLabel: req.query.difficulty
    //type : 'exercise'
  }
  const timeLimit = parseInt(req.query.timeLimit)
  const userId = req.user._id
  if(!!!limit)limit = 10

  QuestionPool
  .aggregate([ {$match: query}, {$sample: {size: limit}} ])
  .exec((err,result) => {
    if (err) {
      res.status(400).json(err)
    } else {
      const finalScore = 0
      const rightAnswer = 0 
      const totalQuestion = result.length
      const perfectFinalScore = result.reduce((accumulator, questionPool) => accumulator + questionPool.correctScore, 0)
      const courseId = query.courseId
      const difficulty = query.difficultyLabel
      let questionPools = [] 
      result.forEach(questionPool => questionPools.push(questionPool._id))
      const submitted = false
      const exerciseResult = new ExerciseResult({
        finalScore,
        rightAnswer,
        totalQuestion,
        perfectFinalScore,
        timeLimit,
        difficulty,
        courseId,
        userId,
        questionPools,
        submitted
      })
      exerciseResult
      .save()
      .then((savedExerciseResult) => res.json({ questionPools: result, exerciseResult: savedExerciseResult }))
    }
  })
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
