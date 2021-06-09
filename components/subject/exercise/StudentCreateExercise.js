
import { Container, Box, IconButton, Divider, RadioGroup, FormControlLabel, TextField, Radio, InputAdornment, Typography, Button } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import Router from "next/router";
import { getRandomQuestionPools } from "../../../lib/api";

class StudentCreateExercise extends React.Component{

    state={
        difficulty: 'Easy',
        numberOfQuestions: "25",
        timeLimit: "30",
        customNumberOfQuestions: "",
        customTimeLimit: ""
    }

    startExercise() {
        let difficulty = this.state.difficulty
        let numberOfQuestions = this.state.numberOfQuestions
        let timeLimit = this.state.timeLimit
        if(numberOfQuestions === "custom-number-question")numberOfQuestions = this.state.customNumberOfQuestions
        if(timeLimit === "custom-time-limit")timeLimit = this.state.customTimeLimit
        getRandomQuestionPools(this.props.courseId,difficulty,numberOfQuestions,timeLimit).then(response => {
            if (response !=null ) Router.push(`/exercises?id=${this.props.courseId}&exerciseResultId=${response.exerciseResult._id}`)
            else alert("Failed to start exercise")
        })
    }
    
    render(){
        return(
            <Container className="subject-exercise-student-create">
                <Box className="header-container">
                    <IconButton aria-label="Cancel start an exercise" component="span" onClick={()=>this.props.changeTabPage(this.props.tabIndex, 'ExerciseList')}>
                        <CloseIcon className="close-icon" />
                    </IconButton>
                </Box>
                
                <Box className="exercise-settings-container">
                    <Box className="exercise-setting-container">
                        <Typography  className="exercise-setting-type">Difficulty:</Typography>
                        <Box className="exercise-setting-option-container">
                            <RadioGroup aria-label="Difficulty" name="gender1" value={this.state.difficulty} onChange={(event)=>this.setState({difficulty: event.target.value})}>
                                <FormControlLabel value="Adaptive" control={<Radio />} label="Adaptive" />
                                <FormControlLabel value="Easy" control={<Radio />} label="Easy" />
                                <FormControlLabel value="Medium" control={<Radio />} label="Medium" />
                                <FormControlLabel value="Hard" control={<Radio />} label="Hard" />
                                <FormControlLabel value="Very Hard" control={<Radio />} label="Very Hard" />
                            </RadioGroup>
                        </Box>
                    </Box>
                    
                    <Divider className="divider"/>
                    <Box className="exercise-setting-container">
                        <Typography className="exercise-setting-type">Number of Questions:</Typography>
                        <Box className="exercise-setting-option-container">
                            <RadioGroup aria-label="Number of Questions" name="gender1" value={this.state.numberOfQuestions} onChange={(event)=>this.setState({numberOfQuestions: event.target.value})}>
                                <FormControlLabel value="5" control={<Radio />} label="5 questions" />
                                <FormControlLabel value="10" control={<Radio />} label="10 questions" />
                                <FormControlLabel value="25" control={<Radio />} label="25 questions" />
                                <FormControlLabel value="custom-number-question" control={<Radio />} label="Custom" />
                            </RadioGroup>
                            {this.state.numberOfQuestions === "custom-number-question" &&
                            <Box className="custom-option">
                                <TextField
                                    label="Custom"
                                    value={this.state.customNumberOfQuestions}
                                    onChange={(event)=>this.setState({customNumberOfQuestions: event.target.value})}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">questions</InputAdornment>,
                                    }}
                                    type="number"
                                    variant="outlined"
                                />
                            </Box>
                            }
                        </Box>
                    </Box>

                    <Divider className="divider"/>
                    <Box className="exercise-setting-container">
                        <Typography className="exercise-setting-type">Time limit:</Typography>
                        <Box className="exercise-setting-option-container">    
                            <RadioGroup aria-label="Time Limit" name="gender1" value={this.state.timeLimit} onChange={(event)=>this.setState({timeLimit: event.target.value})}>
                                <FormControlLabel value="10" control={<Radio />} label="10 minutes" />
                                <FormControlLabel value="15" control={<Radio />} label="15 minutes" />
                                <FormControlLabel value="20" control={<Radio />} label="20 minutes" />
                                <FormControlLabel value="30" control={<Radio />} label="30 minutes" />
                                <FormControlLabel value="custom-time-limit" control={<Radio />} label="Custom" />
                            </RadioGroup>
                            {this.state.timeLimit === "custom-time-limit" &&
                            <Box className="custom-option">
                                <TextField
                                    label="Custom"
                                    value={this.state.customTimeLimit}
                                    onChange={(event)=>this.setState({customTimeLimit: event.target.value})}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                                    }}
                                    type="number"
                                    variant="outlined"
                                />
                            </Box>
                            }
                        </Box>
                    </Box>

                    
                    <Button
                        style={{width: 160, height: 48}}
                        color="primary" 
                        variant="contained"
                        onClick={() => this.startExercise()}>
                            START EXERCISE
                    </Button>
                    
                </Box>
            </Container>    
        )
    }
}

export default StudentCreateExercise;