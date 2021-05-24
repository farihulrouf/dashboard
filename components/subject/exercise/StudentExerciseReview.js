
import { List, ListItem, Button, Typography, Box, IconButton, Container } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';

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
                    <Typography className="header-subtitle">20 October 2020 - 20.25 (30 minutes) </Typography>
                </Box>
            </Container>
        )
    }
}

export default StudentExerciseReview;
