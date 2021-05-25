
import { List, ListItem, Button, Typography, Box, IconButton, Container, SvgIcon, Divider } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import Image from "next/image";

class StudentExerciseReview extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            
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
            </Container>
        )
    }
}

export default StudentExerciseReview;
