import React from "react";
import Router, { withRouter } from "next/router";
import {
    Container,
    Typography,
    Box,
    Button,
    GridList,
    GridListTile,
    IconButton,
    Grid
} from "@material-ui/core";
import { authInitialProps } from "../../lib/auth";
import NavBar from "../../components/Navbar/NavBar";
import TimerIcon from '@material-ui/icons/Timer';
import Countdown from "react-countdown";
import { getExerciseOngoing, submitExerciseResult } from "../../lib/api";
import MathJax from "react-mathjax-preview";

class Exercise extends React.Component {
    remainingTime = 0
    questions = []
    exerciseResult = undefined

    state = {
        currentIndex : -1,
        markChanged : false,
        multipleChoices : []
    }
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { id, exerciseResultId } = this.props.router.query;
        getExerciseOngoing(id,exerciseResultId).then(data => {
            this.exerciseResult = data.exerciseResult
            let runningTime = new Date().getTime() - new Date(data.exerciseResult.createdAt).getTime()
            this.remainingTime = this.exerciseResult.timeLimit*60*1000 - runningTime
            let number = 1
            data.questionPools.forEach(questionPool => {
                if(questionPool.question != null && questionPool.multipleChoices != null){
                    let question = {
                        questionPoolId: questionPool._id,
                        number: number,
                        question: questionPool.question,
                        multipleChoices: questionPool.multipleChoices,
                        answer: [''],
                        marked: false
                    }
                    this.questions.push(question)
                    number++
                }
            })
            
            this.setState({
                currentIndex : 0
            })
        })
    }

    setAnswer(answer){
        this.questions[this.state.currentIndex].answer[0] = answer
        //console.log('this.questions[this.state.currentIndex]',this.questions[this.state.currentIndex])
    }

    submitAnswer(){
        if(this.exerciseResult != null){
            submitExerciseResult(this.props.router.query.id,{
                questionAnswers: this.questions,
                exerciseResultId: this.exerciseResult._id
            }).then(response => {
                Router.push(`/subjects?id=${this.props.router.query.id}&exerciseResultId=${this.exerciseResult._id}`)
            }).catch(error => console.log('err',error))
        }
    }

    render() {
        const { auth } = this.props;
        let question
        let choices = []

        if (!auth) window.location.href = "/signin";
        //console.log('this.state.currentIndex',this.state.currentIndex)
        if(this.state.currentIndex >= 0){
            question = this.questions[this.state.currentIndex]
            choices = question.multipleChoices
        }else if(this.state.currentIndex === -1){
            return (<NavBar auth={auth}><Container className="exercise-container"><Box className="question-container"></Box></Container></NavBar>)
        }else if(this.state.currentIndex === -2){
            return (
                <NavBar auth={auth}>
                    <Container className="exercise-container">
                        <Box className="question-container">
                            <Box className="header-container">
                                <Box className="course-number-container">
                                    <Typography className="question-number">Waktu mengerjakan telah habis, submit jawaban anda sekarang</Typography>
                                </Box>
                                <Button className="prev-next-button" variant="contained" color="primary" onClick={()=>this.submitAnswer()}>
                                    SUBMIT
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </NavBar>
            )
        }
        return (
            <NavBar auth={auth}>
                <Container className="exercise-container">
                    <Box className="question-container">
                        <Box className="header-container">
                            <Box className="course-number-container">
                                <Typography className="course-title">COURSE TITLE</Typography>
                                <Typography className="question-number">{"NO."+question.number}</Typography>
                            </Box>
                            <Box className="time-container">
                                <TimerIcon fontSize="small" color="disabled"></TimerIcon>
                                { this.state.currentIndex !== -1 &&
                                    <Countdown date={Date.now() + this.remainingTime} intervalDelay={50} precision={3} renderer={
                                     ({ hours, minutes, seconds, completed, total }) => {
                                         this.remainingTime = total
                                        if (completed) {
                                            this.setState({currentIndex: -2})
                                            return <Typography className="time">Times up!</Typography>
                                        } else {
                                            return <Typography className="time">{hours}:{minutes}:{seconds}</Typography>
                                        }
                                      }
                                    }/>
                                }
                            </Box>
                        </Box>
                        <Typography className="question">
                            <MathJax
                                math={question.question}
                                sanitizeOptions={{
                                    USE_PROFILES: { html: true, mathMl: true },
                                    ADD_TAGS: ["iframe"],
                                    ADD_ATTR: ["allowfullscreen"],
                                }}
                            />
                        </Typography>
                    </Box>
                    <Box className="non-question-container">
                        <MultipleChoices choices={choices} setAnswer={this.setAnswer.bind(this)} defaultAnswer={question.answer[0]} index={this.state.currentIndex}/>
                        <Box className="navigation-container">
                            <Box className="navigation-number-container">
                                <Typography className="navigation-number-title">Nomor</Typography>
                                <GridList cellHeight={38} cols={6}>
                                    {this.questions.map((itemQuestion) => (
                                    <GridListTile className="number" key={itemQuestion.number} cols={1}>
                                        <input style={{display: "none"}} id="icon-button-file" type="submit" />
                                        { itemQuestion.number !== (this.state.currentIndex+1) && !itemQuestion.marked && itemQuestion.answer[0] !== '' &&
                                        <label htmlFor="icon-button-file">
                                            <IconButton className="number-answered" size="small" color="primary" aria-label="upload picture" component="span" onClick={()=>this.setState({currentIndex: itemQuestion.number-1})}>
                                                <Typography>{itemQuestion.number}</Typography>
                                            </IconButton>
                                        </label>
                                        }
                                        { itemQuestion.number !== (this.state.currentIndex+1) && !itemQuestion.marked && itemQuestion.answer[0] === '' &&
                                        <label htmlFor="icon-button-file">
                                            <IconButton className="number-unanswered" size="small" color="primary" aria-label="upload picture" component="span" onClick={()=>this.setState({currentIndex: itemQuestion.number-1})}>
                                                <Typography>{itemQuestion.number}</Typography>
                                            </IconButton>
                                        </label>
                                        }
                                        { itemQuestion.number !== (this.state.currentIndex+1) && itemQuestion.marked &&
                                        <label htmlFor="icon-button-file">
                                            <IconButton className="number-marked" size="small" color="primary" aria-label="upload picture" component="span" onClick={()=>this.setState({currentIndex: itemQuestion.number-1})}>
                                                <Typography>{itemQuestion.number}</Typography>
                                            </IconButton>
                                        </label>
                                        }
                                        { itemQuestion.number === (this.state.currentIndex+1) &&
                                        <label htmlFor="icon-button-file">
                                            <IconButton className="number-selected" size="small" color="primary" aria-label="upload picture" component="span" onClick={()=>this.setState({currentIndex: itemQuestion.number-1})}>
                                                <Typography>{itemQuestion.number}</Typography>
                                            </IconButton>
                                        </label>
                                        }
                                    </GridListTile>
                                    ))}
                                </GridList>
                            </Box>
                            <Box className="navigation-option-container">
                                {!question.marked &&
                                    <Button className="mark-button" variant="outlined" color="primary" onClick={()=>{
                                        this.questions[this.state.currentIndex].marked = true
                                        this.setState({markChanged: !this.state.markChanged})
                                    }}>
                                        MARK
                                    </Button>
                                }
                                {question.marked &&
                                    <Button className="mark-button" variant="outlined" color="primary" onClick={()=>{
                                        this.questions[this.state.currentIndex].marked = false
                                        this.setState({markChanged: !this.state.markChanged})
                                    }}>
                                        UNMARK
                                    </Button>
                                }
                                
                                <Box className="navigation-prev-next-container">
                                    { this.state.currentIndex !== 0 &&
                                    <Button className="prev-next-button" variant="outlined" color="primary" onClick={()=>this.setState({currentIndex: this.state.currentIndex - 1})}>
                                        PREVIOUS
                                    </Button>
                                    }
                                    { this.state.currentIndex !== this.questions.length-1 &&
                                    <Button className="prev-next-button" variant="contained" color="primary" onClick={()=>this.setState({currentIndex: this.state.currentIndex + 1})}>
                                        NEXT
                                    </Button>
                                    }
                                    { this.state.currentIndex === this.questions.length-1 &&
                                    <Button className="prev-next-button" variant="contained" color="primary" onClick={()=>this.submitAnswer()}>
                                        SUBMIT
                                    </Button>
                                    }
                                </Box>                                
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </NavBar>   
        );
    }
}

class MultipleChoices extends React.Component{
    state = {
        answer : '',
        index : 0
    }

    componentDidUpdate(){
        if(this.state.index != this.props.index){
            this.setState({
                answer: this.props.defaultAnswer,
                index : this.props.index
            })
        }
    }

    render(){
        const { choices, setAnswer} = this.props

        return (
            <Box className="answers-container">
                {choices.map((item) => {
                    let answerStyle = "answer-item-container"
                    if(item === this.state.answer)answerStyle = "answer-item-selected-container"
                    return (
                        <Box className={answerStyle} key={choices.indexOf(item).toString()} onClick={()=>{
                            setAnswer(item)
                            this.setState({answer: item})
                        }}>
                            <Grid container className="answer-letter">
                                <Grid xs={1} item>{String.fromCharCode(65 + choices.indexOf(item))}.</Grid>
                                <Grid xs={11} item><MathJax math={item} /></Grid>
                            </Grid>           
                        </Box>
                    )  
                })}
            </Box>
        )
    }
}

Exercise.getInitialProps = authInitialProps(true);

export default withRouter(Exercise);
