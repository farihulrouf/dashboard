import { List, ListItem, Button, Icon, TextField, Card, CardContent, Typography, Divider, IconButton, Menu, MenuItem } from "@material-ui/core";
import React from "react";
import { getExams } from "../../../lib/api";
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { format } from 'date-fns'

class ExamList extends React.Component{
    state = {
        exams: []
    }

    componentDidMount() {
        getExams(this.props.courseId,1,10).then(result=>this.setState({exams: result}))
    }

    search(searchKeyword) {
        getExams(this.props.courseId,1,10,searchKeyword).then(result=>this.setState({exams: result}))
    }

    render(){
        const { changeTabPage, tabIndex } = this.props
        return(
            <div className="subject-exam-list">
                <div style={{display: "flex", flexDirection: "row"}}>
                    <Button
                        style={{width: 240, height: 48, padding: 12}}
                        variant="contained"
                        color="primary"
                        endIcon={<AddIcon />}
                        onClick={()=>changeTabPage(tabIndex, 'CreateExam')}
                    >
                        CREATE AN EXAM
                    </Button>
                    <form style={{flex:1, marginLeft: 22}} noValidate autoComplete="off">
                        <TextField style={{width: "100%"}} id="outlined-basic" label="Search exam" variant="outlined" onChange={(event)=>this.search(event.target.value)} />
                    </form>
                </div>
                <List>
                    {
                        this.state.exams.map((exam)=>(
                            <ExamItem key={exam._id} exam={exam}></ExamItem>
                        ))
                    }
                </List>
            </div>
        )
    }
}

export default ExamList;

class ExamItem extends React.Component{
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
            name,
            duration,
            startTime,
            endTime,
            courseId,
            description,
            avarageScore,
            studentPass,
            createdAt
        } = this.props.exam
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
                            Total Problem : {questionPools.length}
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