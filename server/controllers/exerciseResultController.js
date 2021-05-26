const mongoose = require("mongoose");
const ExerciseResult = mongoose.model("ExerciseResult");
const QuestionPool = mongoose.model("QuestionPool");
const QuestionPoolAnswer = mongoose.model("QuestionPoolAnswer");
const { ObjectId } = mongoose.Types;

exports.submitExerciseResult = async (req, res) => {
    const questionAnswers = req.body.questionAnswers
    const exerciseResultId = req.body.exerciseResultId
    let questionPoolAnswers = []
    let finalScore = 0 
    let rightAnswer = 0
    const checkAnswers = (questionPool,questionAnswer) => {
      let answerCorrect = true
      questionAnswer.answer.forEach(answer => {
        let result = questionPool.solution.find(solution => solution === answer)
        answerCorrect = answerCorrect && (result === answer)
      })
      return answerCorrect
    } 
    try {
      for (const questionAnswer of questionAnswers) {
        let questionPool = await QuestionPool.findById(questionAnswer.questionPoolId)
        let answerCorrect = checkAnswers(questionPool,questionAnswer)
        let questionPoolAnswer = {
          number: questionAnswer.number,
          answer: questionAnswer.answer,
          score: answerCorrect ? questionPool.correctScore : questionPool.wrongScore,
          right: answerCorrect,
          questionPoolId: questionPool.id,
          resultType: 'Exercise',
          resultId: exerciseResultId
        }
        questionPoolAnswers.push(questionPoolAnswer)
        if (answerCorrect) rightAnswer += 1
        finalScore += questionPoolAnswer.score
      }
    } catch (error) {
      console.log("QuestionPoolAnswer Creation Error - " , error)
      res.status(400).json("QuestionPoolAnswer Creation Error - " + error)
      return
    }
    
    try {
      let exerciseResult = await ExerciseResult.findById(exerciseResultId)
      exerciseResult.finalScore = finalScore
      exerciseResult.rightAnswer = rightAnswer
      await exerciseResult.save()
    } catch (error) {
      console.log("ExerciseResult Update Error - " , error.toString())
      res.status(400).json("ExerciseResult Update Error - " + error.toString())
      return
    }
    
    QuestionPoolAnswer.insertMany(questionPoolAnswers, (error,questionPoolAnswersInserted)=>{
      if(error) {
        console.log("QuestionPoolAnswer Insertion Error " , error.toString())
        res.status(400).json("QuestionPoolAnswer Insertion Error " + error)
        return
      }else{
        res.json('Exercise submitted!')
      }
    })
  }

  exports.getExerciseResults = async (req, res) => {
    let page = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    let searchKeyword = req.query.searchKeyword
    let query = {courseId: ObjectId(req.params.courseId)}
  
    if(!!searchKeyword)query.name = { $regex: searchKeyword }
    if(!!!page)page = 0
    if(!!!limit)limit = 10
  
    ExerciseResult.find(query)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .limit(limit).exec((err,result)=>{
      if(err)res.status(400).json(err)
      else res.json(result)
    })
  }