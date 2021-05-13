const mongoose = require("mongoose");
const Exercise = mongoose.model("Exercise");
const QuestionPool = mongoose.model("QuestionPool");
const Attachment = mongoose.model("Attachment");
const { ObjectId } = mongoose.Types;

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

exports.addMultipleExercise = async (req, res) => {
  const exercises = req.body
  const courseId = req.params.courseId
  let newExercises = []
  const saveAllExercise = () =>{
    Exercise.insertMany(newExercises,(error, savedExercises)=>{
      if(error) res.status(400).json("Error " + error)
      else res.json(savedExercises)
    })
  }
  const saveQuestionPoolExercise = (newQPools,exercise)=>{
    QuestionPool.insertMany(newQPools, (error,questionPools)=>{
      if(error) {
        res.status(400).json("Error " + error)
        return
      }
      let questionPoolIds = []
      questionPools.forEach(questionPool=>{
        questionPoolIds.push(questionPool._id);
      })
      exercise.questionPools = questionPoolIds;
      exercise.courseId = courseId
      newExercises.push(exercise)
      if(newExercises.length == exercises.length){
        saveAllExercise()
      }
    })
  }
  exercises.forEach(exercise =>{
    let newQPools = []
    exercise.questionPools.forEach(questionPoolData=>{
      if(questionPoolData.attachments.length === 0){
        newQPools.push(questionPoolData)
        if(newQPools.length == exercise.questionPools.length){
          saveQuestionPoolExercise(newQPools,exercise)
        }
      }else{
        Attachment.insertMany(questionPoolData.attachments, (error,attachments)=>{
          if(error) {
            res.status(400).json("Error Attachment Insertion" + error)
            return
          }
          let attachmentIds = []
          attachments.forEach(attachment=>{
            attachmentIds.push(attachment._id)
          })
          questionPoolData.attachments=attachmentIds
          newQPools.push(questionPoolData)
          if(newQPools.length == exercise.questionPools.length){
            saveQuestionPoolExercise(newQPools,exercise)
          }
        })
      }
    })
  })
}

exports.getExercises = async (req, res) => {
  let page = parseInt(req.query.page)
  let limit = parseInt(req.query.limit)
  let searchKeyword = req.query.searchKeyword
  let query = {courseId: ObjectId(req.params.courseId)}

  if(!!searchKeyword)query.name = { $regex: searchKeyword }
  if(!!!page)page = 0
  if(!!!limit)limit = 10

  Exercise.find(query)
  .skip((page - 1) * limit)
  .sort({ createdAt: -1 })
  .limit(limit).exec((err,result)=>{
    if(err)res.status(400).json(err)
    else res.json(result)
  })
}