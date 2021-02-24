
import { List, ListItem, Button } from "@material-ui/core";
import React from "react";
import XLSX from "xlsx";
import { createMultipleExercise } from "../../../lib/api";
class CreateExercise extends React.Component{

    TYPE_CELL       = 'C2'
    DIFFICULTY_CELL  = 'C3'
    TIME_LIMIT_CELL   = 'C4'

    FIRST_QUESTION_DATA_ROW  = 6
    NUMBER_QUESTION_COLUMN   = 'B'
    PROBLEM_QUESTION_COLUMN  = 'C'
    MEDIA_QUESTION_COLUMN    = 'D'
    PLAYBACK_QUESTION_COLUMN = 'E'
    OPTIONS_QUESTION_COLUMN  = 'F'
    ANSWER_QUESTION_COLUMN   = 'G'
    CORRECT_QUESTION_COLUMN  = 'H'
    WRONG_QUESTION_COLUMN    = 'I'

    state={
        exercises: [],
        fileNames: []
    }

    onFilesSelected(e){
        let fileList = e.target.files;
        for(let i = 0; i<fileList.length; i++){
            var reader = new FileReader()
            reader.onload = this.getExercise
            reader.readAsArrayBuffer(fileList[i])

            let newFileNames = this.state.fileNames
            newFileNames.push([fileList[i].name])
            this.setState({fileNames:newFileNames})
        }
    }

    getExercise = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let questionPools = []
        let index = 0
        
        while(index != null){
            let numberCell = this.getCellValue(worksheet, this.NUMBER_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + index))
            if(numberCell){
                questionPools.push(this.getQuestionPool(worksheet, index))
                index++
            }else {
                index = undefined
            }
        }

        let exercises = this.state.exercises
        exercises.push({
            questionType : 'Multiple Choice',
            difficulty : "Easy",
            numberOfQuestions : questionPools.length,
            questionPools : questionPools,
            timeLimit : this.getCellValue(worksheet, this.TIME_LIMIT_CELL)
        })
        this.setState({exercises: exercises})
    }

    getQuestionPool(worksheet, number){
        return {
            difficultyLabel: "Easy",
            question: this.getCellValue(worksheet, this.PROBLEM_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            multipleChoices: this.getCellValue(worksheet, this.OPTIONS_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            solution: this.getCellValue(worksheet, this.ANSWER_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            type: 'Multiple Choice',
            tag: 'No Tag',
            //attachments : this.getCellValue(worksheet, this.MEDIA_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            playbackTimes: this.getCellValue(worksheet, this.PLAYBACK_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            correctScore: this.getCellValue(worksheet, this.CORRECT_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            wrongScore: this.getCellValue(worksheet, this.WRONG_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
        }
    }

    getCellValue(worksheet, cellAddress){
        let cell = worksheet[cellAddress]
        return (cell ? cell.v : undefined);
    }

    uploadExercises(){
        createMultipleExercise(this.props.courseId,this.state.exercises)
        .then(result=>this.props.changeTabPage(this.props.tabIndex, 'ExerciseList'))
        .catch(error=>console.log('error',error))
    }

    render(){
        console.log('exercises state', this.state.exercises)
        console.log('this.props.courseId', this.props.courseId)
        return(
            <div className="subject-exercise-create">
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <h2>Create Exercise</h2>
                    <p>Guidance</p>
                </div>
                
                <h3>Upload Exercise File(s)</h3>
                <p>Download sample exercise file <a href="/images/profile.jpg">here</a>, then upload your exercise file</p>
                <List className="file-container">
                    {
                        this.state.fileNames.map((fileName)=>(
                            <ListItem key={fileName} className="file-item"><p className="text-file-item">{fileName}</p></ListItem>
                        ))
                    }
                    {
                        this.state.fileNames.length === 0 && (
                            <div style={{display: "flex", flex: 1, minHeight:400 , flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <h4>Drag and Drop File</h4>
                                <h4>or</h4>
                                <label for="browse"><h4 style={{textDecorationLine: "underline"}}>Browse</h4></label>
                                <input id="browse" type="file" onChange={this.onFilesSelected.bind(this)}/>
                            </div>
                        )
                    }
                </List>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <Button
                        onClick={this.uploadExercises.bind(this)} 
                        style={{width: 165, height: 50, marginTop: 21, marginBottom: 34}} 
                        variant="contained" color="primary">
                            UPLOAD
                    </Button>
                </div>
            </div>
        )
    }
}

export default CreateExercise;