import { List, Chip, Button, Icon, TextField, Card, CardContent, Typography, Divider, IconButton, Menu, MenuItem } from "@material-ui/core";
import React from "react";
import { getExerciseResults, getExercises, getQuestionPools } from "../../../lib/api";
import CreateIcon from '@material-ui/icons/Create';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { format } from 'date-fns'

class StudentExerciseList extends React.Component{
    state = {
        exerciseResults: []
    }

    componentDidMount() {
        getExerciseResults(this.props.courseId,1,10).then(result=>this.setState({exerciseResults: result}))
    }

    search(searchKeyword) {
        getExerciseResults(this.props.courseId,1,10).then(result=>this.setState({exerciseResults: result}))
    }

    render(){
        const { changeTabPage, tabIndex } = this.props
        return(
            <div className="subject-exercise-list">
                <div style={{display: "flex", flexDirection: "row"}}>
                    <Button
                        style={{width: 240, height: 48, padding: 12}}
                        variant="contained"
                        color="primary"
                        endIcon={<CreateIcon />}
                        onClick={()=>changeTabPage(tabIndex, 'CreateExercise')}
                    >
                        START AN EXERCISE
                    </Button>
                    <form style={{flex:1, marginLeft: 22}} noValidate autoComplete="off">
                        <TextField style={{width: "100%"}} id="outlined-basic" label="Search courses" variant="outlined" onChange={(event)=>this.search(event.target.value)} />
                    </form>
                </div>
                <List>
                    {
                        this.state.exerciseResults.map((exerciseResult)=>(
                            <ExerciseResultItem key={exerciseResult._id} exerciseResult={exerciseResult} changeTabPage={changeTabPage} tabIndex={tabIndex}></ExerciseResultItem>
                        ))
                    }
                </List>
            </div>
        )
    }
}

export default StudentExerciseList;


class ExerciseResultItem extends React.Component{
    ITEM_HEIGHT = 48;

    state = {
        anchorEl: null
    }
    
    handleClick = (event) => {
        this.setState({anchorEl: event.currentTarget})
    };
    handleClose = () => {
        this.setState({anchorEl: null})
    };
    handleMenuSelected = (menuName) => {
        //if(menuName === 'Publish')this.props.openPublishPopup(this.props.exam)
        this.setState({anchorEl: null})
        if (menuName === 'Review') {
            this.props.changeTabPage(this.props.tabIndex,'ExerciseReview', this.props.exerciseResult._id)
        }
    };

    render() {
        const { 
            difficulty,
            perfectFinalScore,
            totalQuestion,
            finalScore,
            rightAnswer,
            timeLimit,
            createdAt
        } = this.props.exerciseResult

        let menu = (finalScore) => {
            return ['Review']
        }
        return (
            <Card className="item-exam">
                <CardContent className="item-exam-stats">                        
                    <Typography align="center" className="text-score">
                        {finalScore} / {perfectFinalScore}
                    </Typography>
                    <Typography align="center" className="light-label" color="textSecondary" gutterBottom>
                        Final Score
                    </Typography>
                    <Divider className="divider"/>
                    <Typography align="center" className="text-pass">
                        {rightAnswer} / {totalQuestion}
                    </Typography>
                    <Typography align="center" className="light-label" color="textSecondary" gutterBottom>
                        Right Answer
                    </Typography>
                </CardContent>
                <CardContent className="item-exam-name">                        
                    <Typography className="item-exam-name-title">
                        Difficulty Level : {difficulty}
                    </Typography>
                    
                    <Typography className="item-exam-name-desc">
                    Duration : {timeLimit} minute
                    </Typography>
                </CardContent>
                <CardContent className="item-exam-about">
                    <div style={{display:"flex",flexDirection:"row", justifyContent: "flex-end"}}>
                        <div>
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={this.handleClick}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                anchorEl={this.state.anchorEl}
                                keepMounted
                                open={Boolean(this.state.anchorEl)}
                                onClose={this.handleClose}
                                PaperProps={{
                                style: {
                                    maxHeight: this.ITEM_HEIGHT * 4.5,
                                    width: '20ch',
                                },
                                }}
                            >
                                {menu(finalScore).map((option) => (
                                <MenuItem key={option} selected={option === 'Pyxis'} onClick={()=>this.handleMenuSelected(option)}>
                                    {option}
                                </MenuItem>
                                ))}
                            </Menu>
                        </div>
                    </div>
                    
                    <Typography align="right" className="light-label" color="textSecondary">
                        Created on {format(new Date(createdAt), 'MM/dd/yyyy')}
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}