
import { List, ListItem, Button } from "@material-ui/core";
import Image from 'next/image'
import React from "react";
import XLSX from "xlsx";
import { createMultipleExam } from "../../../lib/api";
import { parse } from 'date-fns';
import Dropzone from 'react-dropzone';

class CreateExam extends React.Component{

    TYPE_CELL           = 'C2'
    NAME_CELL           = 'C3'
    DURATION_CELL       = 'C4'
    START_TIME_CELL     = 'C5'
    END_TIME_CELL       = 'C6'
    DESCRIPTION_CELL    = 'C7'

    FIRST_QUESTION_DATA_ROW  = 9
    NUMBER_QUESTION_COLUMN   = 'B'
    PROBLEM_QUESTION_COLUMN  = 'C'
    MEDIA_QUESTION_COLUMN    = 'D'
    PLAYBACK_QUESTION_COLUMN = 'E'
    OPTIONS_QUESTION_COLUMN  = 'F'
    ANSWER_QUESTION_COLUMN   = 'G'
    CORRECT_QUESTION_COLUMN  = 'H'
    WRONG_QUESTION_COLUMN    = 'I'
    DIFFICULTY_QUESTION_COLUMN = 'J'

    state={
        exams: [],
        fileNames: []
    }

    handleDrop(e) {
        e.stopPropagation(); e.preventDefault();
        var fileList = e.dataTransfer.files
        for(let i = 0; i<fileList.length; i++){
            var reader = new FileReader()
            reader.onload = this.getExercise
            reader.readAsArrayBuffer(fileList[i])
            
            let newFileNames = this.state.fileNames
            newFileNames.push([fileList[i].name])
            this.setState({fileNames:newFileNames})
        }
    }

    onFilesSelected(e){
        let fileList = e.target.files;
        for(let i = 0; i<fileList.length; i++){
            var reader = new FileReader()
            reader.onload = this.getExams
            reader.readAsArrayBuffer(fileList[i])

            let newFileNames = this.state.fileNames
            newFileNames.push([fileList[i].name])
            this.setState({fileNames:newFileNames})
        }
    }

    getExams = (e) => {
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

        let exams = this.state.exams
        let startString = this.getCellValue(worksheet, this.START_TIME_CELL)
        let endString = this.getCellValue(worksheet, this.END_TIME_CELL)
        let start = parse(startString,'dd/MM/yyyy kk.mm', new Date())
        let end = parse(endString,'dd/MM/yyyy kk.mm', new Date())
        exams.push({ 
            questionPools: questionPools,
            name: this.getCellValue(worksheet, this.NAME_CELL),
            duration: this.getCellValue(worksheet, this.DURATION_CELL),
            startTime: start,
            endTime: end,
            courseId: this.props.courseId,
            description: this.getCellValue(worksheet, this.DESCRIPTION_CELL),
            avarageScore: 0,
            studentPass: 0
        })
        this.setState({exams: exams})
    }

    getQuestionPool(worksheet, number){
        return {
            courseId: this.props.courseId,
            difficultyLabel: this.getCellValue(worksheet, this.DIFFICULTY_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            question: this.getCellValue(worksheet, this.PROBLEM_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            multipleChoices: JSON.parse(this.getCellValue(worksheet, this.OPTIONS_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number))),
            solution: this.getCellValue(worksheet, this.ANSWER_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            type: 'exam',
            //tag: 'No Tag',
            attachments : { url: this.getCellValue(worksheet, this.MEDIA_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number))},
            playbackTimes: this.getCellValue(worksheet, this.PLAYBACK_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            correctScore: this.getCellValue(worksheet, this.CORRECT_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            wrongScore: this.getCellValue(worksheet, this.WRONG_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            totalStudent: 0,
            studentPass: 0
        }
    }

    getCellValue(worksheet, cellAddress){
        let cell = worksheet[cellAddress]
        return (cell ? cell.v : undefined);
    }

    uploadExams(){
        createMultipleExam(this.props.courseId,this.state.exams)
        .then(result=>this.props.changeTabPage(this.props.tabIndex, 'ExamList'))
        .catch(error=>alert(error.response.message))
    }

    render(){
        return(
            <div className="subject-exercise-create">
                <Image src="/images/close_icon.svg" height={25} width={25} onClick={()=>this.props.changeTabPage(this.props.tabIndex, 'ExamList')}/>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <h2>Create Exams</h2>
                    <p>Guidance</p>
                </div>
                
                <h3>Upload Exam File(s)</h3>
                <p>Download sample exam file <a href="/excel/Sample-Exam.xlsx">here</a>, then upload your exam file</p>
                <Dropzone className="file-container">
                {({getRootProps, getInputProps}) => (
                    <div {...getRootProps({className: 'dropzone'})}>
                        <input {...getInputProps()} />
                        <List className="file-container">
                            {
                                this.state.fileNames.map((fileName)=>(
                                    <ListItem key={fileName} className="file-item"><p className="text-file-item">{fileName}</p></ListItem>
                                ))
                            }
                            {
                                this.state.fileNames.length === 0 && (
                                    <div onDrop={(e)=>this.handleDrop(e)} style={{display: "flex", flex: 1, minHeight:400 , flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                        <Image src="/images/upload_icon.svg" height={100} width={100} />
                                        <h4>Drag and Drop File</h4>
                                        <h4>or</h4>
                                        <label for="browse"><h4 style={{textDecorationLine: "underline"}}>Browse</h4></label>
                                        <input id="browse" type="file" onChange={this.onFilesSelected.bind(this)}/>
                                    </div>
                                )
                            }
                        </List>
                        </div>
                    )}
                </Dropzone>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <Button
                        onClick={this.uploadExams.bind(this)} 
                        style={{width: 165, height: 50, marginTop: 21, marginBottom: 34}} 
                        variant="contained" color="primary">
                            UPLOAD
                    </Button>
                </div>
            </div>
        )
    }
}

export default CreateExam;