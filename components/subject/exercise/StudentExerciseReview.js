
import { List, ListItem, Button, Typography, Box, IconButton, Container, SvgIcon, Divider } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import Image from "next/image";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

class StudentExerciseReview extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            questionAnswerItem : [{_id:'22'},{_id:'22d'},{_id:'22w'},{_id:'22ws'}]
        }
    }

    render(){
        return(
            <Container className="subject-exercise-student-review">
                <Box className="header-close-container">
                    <IconButton aria-label="Cancel start an exercise" component="span" onClick={()=>this.props.changeTabPage(this.props.tabIndex, 'ExerciseList')}>
                        <CloseIcon className="close-icon" />
                    </IconButton>
                </Box>
                <Box className="header-title-container">
                    <Typography className="header-title">Exercise Review</Typography>
                    <Typography className="header-subtitle">20 October 2020 - 20.25</Typography>
                </Box>
                <Box className="review-summary-container">
                    <Box className="review-summary-item">
                        <Image className="review-summary-icon" src="/images/timer.svg" height={100} width={100} />
                        <Typography className="review-summary-value">30 minutes</Typography>
                        <Typography className="review-summary-label">Duration</Typography>
                    </Box>
                    <Divider style={{width: 20, backgroundColor: "white"}}></Divider>
                    <Box className="review-summary-item">
                        <Image className="review-summary-icon" src="/images/rank.svg" height={100} width={100} />
                        <Typography className="review-summary-value">Medium</Typography>
                        <Typography className="review-summary-label">Difficulty</Typography>
                    </Box>
                    <Divider style={{width: 20, backgroundColor: "white"}}></Divider>
                    <Box className="review-summary-item">
                        <Image className="review-summary-icon" src="/images/rightanswer.svg" height={100} width={100} />
                        <Typography className="review-summary-value">80 / 90</Typography>
                        <Typography className="review-summary-label">RightAnswer</Typography>
                    </Box>
                    <Divider style={{width: 20, backgroundColor: "white"}}></Divider>
                    <Box className="review-summary-item">
                        <Image className="review-summary-icon" src="/images/fscore.svg" height={100} width={100} />
                        <Typography className="review-summary-value">88.89</Typography>
                        <Typography className="review-summary-label">Final Score</Typography>
                    </Box>
                </Box>
                <List style={{paddingBottom: 40}}>
                    { this.state.questionAnswerItem.map(questionAnswerItem => (
                        <QuestionAnswerItem key={questionAnswerItem._id} questionAnswerItem={questionAnswerItem}></QuestionAnswerItem>
                    ))}
                </List>
            </Container>
        )
    }
}

class QuestionAnswerItem extends React.Component{
    render() {
        return (
            <Box className="review-question-item">
                <Box className="wrong-answer-border"></Box>
                <Box className="number-score-container">
                    <Typography className="number-score-label">Problem number</Typography>
                    <Typography className="problem-number">3</Typography>
                    <Divider style={{height: 2}} />
                    <Typography className="score-wrong">3/9</Typography>
                    <Typography className="number-score-label">Score</Typography>
                </Box>
                <Box className="question-answer-container">
                    <Typography className="question">
                        Ini contoh pertanyaan yang cukup panjang sampai lebih dari tujuh kata?
                    </Typography>
                    <Box className="right-answer-item">
                        <Typography className="choices">
                            A. Ke langit ke tujuh
                        </Typography>
                        <CheckCircleIcon className="icon-right-answer"/>
                    </Box>
                    <Box className="no-answer-item">
                        <Typography className="choices">
                            B. Ke langit ke tujuh
                        </Typography>
                    </Box>
                    <Box className="no-answer-item">
                        <Typography className="choices">
                            C. Ke langit ke tujuh
                        </Typography>
                    </Box>
                    <Box className="wrong-answer-item">
                        <Typography className="choices">
                            D. Ke langit ke tujuh
                        </Typography>
                        <CancelIcon className="icon-wrong-answer"/>
                    </Box>
                    <Box className="no-answer-item">
                        <Typography className="choices">
                            E. Ke langit ke tujuh
                        </Typography>
                    </Box>
                </Box>
            </Box>
        )
    }
}

export default StudentExerciseReview;
