
import { List, ListItem, Button, Typography, Box, IconButton, Container, SvgIcon, Divider } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import Image from "next/image";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { getExerciseReview } from "../../../lib/api";
import MathJax from "react-mathjax-preview";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import { format } from 'date-fns'

class StudentExerciseReview extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            exerciseResult : undefined,
            questionAnswerItems : []
        }
    }

    componentDidMount() {
        getExerciseReview(this.props.courseId,this.props.exerciseResultId).then(data => {
            this.setState({
                exerciseResult: data.exerciseResult, 
                questionAnswerItems: data.questionAnswers
            })
        })
    }

    render() {
        const { exerciseResult, questionAnswerItems } = this.state
        if (exerciseResult == null) return <Container></Container>
        return(
            <Container className="subject-exercise-student-review">
                <Box className="header-close-container">
                    <IconButton aria-label="Cancel start an exercise" component="span" onClick={()=>this.props.changeTabPage(this.props.tabIndex, 'ExerciseList')}>
                        <CloseIcon className="close-icon" />
                    </IconButton>
                </Box>
                <Box className="header-title-container">
                    <Typography className="header-title">Exercise Review</Typography>
                    <Typography className="header-subtitle">{format(new Date(exerciseResult.createdAt), 'MM/dd/yyyy hh:mm')}</Typography>
                </Box>
                <Box className="review-summary-container">
                    <Box className="review-summary-item">
                        <Image className="review-summary-icon" src="/images/timer.svg" height={100} width={100} />
                        <Typography className="review-summary-value">{exerciseResult.timeLimit} minutes</Typography>
                        <Typography className="review-summary-label">Duration</Typography>
                    </Box>
                    <Divider style={{width: 20, backgroundColor: "white"}}></Divider>
                    <Box className="review-summary-item">
                        <Image className="review-summary-icon" src="/images/rank.svg" height={100} width={100} />
                        <Typography className="review-summary-value">{exerciseResult.difficulty}</Typography>
                        <Typography className="review-summary-label">Difficulty</Typography>
                    </Box>
                    <Divider style={{width: 20, backgroundColor: "white"}}></Divider>
                    <Box className="review-summary-item">
                        <Image className="review-summary-icon" src="/images/rightanswer.svg" height={100} width={100} />
                        <Typography className="review-summary-value">{exerciseResult.rightAnswer} / {exerciseResult.totalQuestion}</Typography>
                        <Typography className="review-summary-label">RightAnswer</Typography>
                    </Box>
                    <Divider style={{width: 20, backgroundColor: "white"}}></Divider>
                    <Box className="review-summary-item">
                        <Image className="review-summary-icon" src="/images/fscore.svg" height={100} width={100} />
                        <Typography className="review-summary-value">{exerciseResult.finalScore}</Typography>
                        <Typography className="review-summary-label">Final Score</Typography>
                    </Box>
                </Box>
                <List style={{paddingBottom: 40}}>
                    { questionAnswerItems.map(questionAnswerItem => (
                        <QuestionAnswerItem key={questionAnswerItems.indexOf(questionAnswerItem)} questionAnswerItem={questionAnswerItem}></QuestionAnswerItem>
                    ))}
                </List>
            </Container>
        )
    }
}

class QuestionAnswerItem extends React.Component{
    render() {
        const { question, answer } = this.props.questionAnswerItem
        return (
            <Box className="review-question-item">
                {answer.right && <Box className="right-answer-border"></Box>}
                {!answer.right && <Box className="wrong-answer-border"></Box>}
                <Box className="number-score-container">
                    <Typography className="number-score-label">Problem number</Typography>
                    <Typography className="problem-number">{answer.number}</Typography>
                    <Divider style={{height: 2}}/>
                    {answer.right && <Typography className="score-right">{answer.score}</Typography>}
                    {!answer.right && <Typography className="score-wrong">{answer.score}</Typography>}
                    <Typography className="number-score-label">Score</Typography>
                </Box>
                <Box className="question-answer-container">
                    <Typography className="question">
                        <MathJax math={question.question} 
                            onDisplay={() => Prism.highlightAll()} 
                            sanitizeOptions={{USE_PROFILES: {html: true, mathMl: true}, ADD_TAGS: ["iframe"], ADD_ATTR: ["allowfullscreen"]}}
                        />
                    </Typography>
                    <List>
                        { question.multipleChoices.map(choice => (
                            <AnswerItem key={question.multipleChoices.indexOf(choice)} choice={choice} question={question} answer={answer}></AnswerItem>
                        ))}
                    </List>
                </Box>
            </Box>
        )
    }
}

class AnswerItem extends React.Component{
    render() {
        const { choice, question, answer } = this.props
        const choiceText = String.fromCharCode(65 + question.multipleChoices.indexOf(choice)) + '. ' + choice
        return(
            <Box>
                { choice === question.solution[0] &&
                    <Box className="right-answer-item" key={choice}>
                        <Typography className="choices">
                            {choiceText}
                        </Typography>
                        { question.solution[0] === answer.answer[0] && <CheckCircleIcon className="icon-right-answer"/> }
                    </Box>
                }
                { choice === answer.answer[0] && choice !== question.solution[0] &&
                    <Box className="wrong-answer-item" key={choice}>
                        <Typography className="choices">
                            {choiceText}
                        </Typography>
                        { question.solution[0] !== answer.answer[0] && <CancelIcon className="icon-wrong-answer"/> }
                    </Box>
                }
                { choice !== question.solution[0] && choice !== answer.answer[0] &&
                    <Box className="no-answer-item">
                        <Typography className="choices">
                            {choiceText}
                        </Typography>
                    </Box>
                }
            </Box>
        )
    }
}

export default StudentExerciseReview;
