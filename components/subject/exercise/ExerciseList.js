import { List, Chip, Button, Icon, TextField, Card, CardContent, Typography, Divider, IconButton, Menu, MenuItem } from "@material-ui/core";
import React from "react";
import { getExercises, getQuestionPools } from "../../../lib/api";
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { format } from 'date-fns'

class ExerciseList extends React.Component{
    state = {
        displayAsDocuments: true,
        exercises: [],
        questions: []
    }

    componentDidMount() {
        getExercises(this.props.courseId,1,10).then(result=>this.setState({exercises: result}))
        getQuestionPools(this.props.courseId,1,10).then(result=>this.setState({questions: result}))
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
                        endIcon={<AddIcon />}
                        onClick={()=>changeTabPage(tabIndex, 'CreateExercise')}
                    >
                        CREATE AN EXERCISE
                    </Button>
                    <form style={{flex:1, marginLeft: 22}} noValidate autoComplete="off">
                        <TextField style={{width: "100%"}} id="outlined-basic" label="Search courses" variant="outlined" />
                    </form>
                </div>
                <div style={{display: "flex", flexDirection: "row", justifyContent:"flex-end", marginTop: 22}}>
                    <Chip label="Documents" component="a" onClick={()=>this.setState({displayAsDocuments: !this.state.displayAsDocuments})} disabled={this.state.displayAsDocuments} clickable variant="outlined" />
                    <Chip label="Questions" component="a" onClick={()=>this.setState({displayAsDocuments: !this.state.displayAsDocuments})} disabled={!this.state.displayAsDocuments} clickable variant="outlined" style={{marginLeft:4}}/>
                </div>
                <List>
                    {this.state.displayAsDocuments &&
                        this.state.exercises.map((exercise)=>(
                            <ExerciseItem key={exercise._id} exercise={exercise}></ExerciseItem>
                        ))
                    }
                    {!this.state.displayAsDocuments &&
                        this.state.questions.map((question)=>(
                            <QuestionItem key={question._id} question={question}></QuestionItem>
                        ))
                    }
                </List>
            </div>
        )
    }
}

export default ExerciseList;


class ExerciseItem extends React.Component{
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
    render() {
        const { 
            questionPools,
            numberOfQuestions,
            name,
            description,
            courseId,
            avarageScore,
            studentPass,
            createdAt
        } = this.props.exercise
        return (
            <Card className="item-exam">
                <CardContent className="item-exam-stats">                        
                    <Typography align="center" className="text-score">
                        {avarageScore}
                    </Typography>
                    <Typography align="center" className="light-label" color="textSecondary" gutterBottom>
                        Avarage Score
                    </Typography>
                    <Divider className="divider"/>
                    <Typography align="center" className="text-pass">
                        {studentPass}
                    </Typography>
                    <Typography align="center" className="light-label" color="textSecondary" gutterBottom>
                        Student Pass
                    </Typography>
                </CardContent>
                <CardContent className="item-exam-name">                        
                    <Typography className="item-exam-name-title">
                        {name}
                    </Typography>
                    
                    <Typography className="item-exam-name-desc">
                    {description}
                    </Typography>
                </CardContent>
                <CardContent className="item-exam-about">
                    <div style={{display:"flex",flexDirection:"row", justifyContent: "flex-end"}}>
                        <Typography align="left" className="item-exam-about-problem" variant="body2" component="p">
                            Total Problem : {numberOfQuestions}
                        </Typography>
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
                                {['Statistics', 'Review'].map((option) => (
                                <MenuItem key={option} selected={option === 'Pyxis'} onClick={this.handleClose}>
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

class QuestionItem extends React.Component{
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
    render() {
        const {
            difficultyLabel,
            question,
            multipleChoices,
            courseId,
            totalStudent,
            studentPass,
            createdAt
        } = this.props.question
        return (
            <Card className="item-exam">
                <CardContent className="item-exam-stats">                        
                    <Typography align="center" className="text-score">
                        {totalStudent == 0? 0:studentPass*100/totalStudent}%
                    </Typography>
                    <Typography align="center" className="light-label" color="textSecondary" gutterBottom>
                        Succesful Rate
                    </Typography>
                    <Divider className="divider"/>
                    <Typography align="center" className="text-pass">
                        {studentPass}
                    </Typography>
                    <Typography align="center" className="light-label" color="textSecondary" gutterBottom>
                        Correct Answer
                    </Typography>
                </CardContent>
                <CardContent className="item-exam-name">                        
                    <Typography className="item-exam-name-title">
                        {question}
                    </Typography>
                    
                    <Typography className="item-exam-name-desc">
                    {multipleChoices.forEach(choice => {
                        <br/>
                        {choice}
                    })}
                    </Typography>
                </CardContent>
                <CardContent className="item-exam-about">
                    <div style={{display:"flex",flexDirection:"row", justifyContent: "flex-end"}}>
                        <Typography align="left" className="item-exam-about-problem" variant="body2" component="p">
                            {difficultyLabel}
                        </Typography>
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
                                {['Statistics', 'Review'].map((option) => (
                                <MenuItem key={option} selected={option === 'Pyxis'} onClick={this.handleClose}>
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