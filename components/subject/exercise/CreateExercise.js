
import { List, ListItem, Button } from "@material-ui/core";
import Image from 'next/image'
import React from "react";
import XLSX from "xlsx";
import { createMultipleExercise } from "../../../lib/api";
import Dropzone from 'react-dropzone';
import ExerciseUploadErrorDialog from "./ExerciseUploadErrorDialog";

class CreateExercise extends React.Component{

    TYPE_CELL           = 'C2'
    EXERCISE_NAME_CELL  = 'C3'
    DESCRIPTION_CELL    = 'C4'

    FIRST_QUESTION_DATA_ROW    = 6
    NUMBER_QUESTION_COLUMN     = 'B'
    PROBLEM_QUESTION_COLUMN    = 'C'
    MEDIA_QUESTION_COLUMN      = 'D'
    PLAYBACK_QUESTION_COLUMN   = 'E'
    OPTIONS_QUESTION_COLUMN    = 'F'
    ANSWER_QUESTION_COLUMN     = 'G'
    CORRECT_QUESTION_COLUMN    = 'H'
    WRONG_QUESTION_COLUMN      = 'I'
    DIFFICULTY_QUESTION_COLUMN = 'J'


    constructor(props){
        super(props)
        this.showErrorDialog = this.showErrorDialog.bind(this)
        this.state={
            exercises: [],
            fileNames: [],
            errorByFile: {}, // {fileName: errors}
            showErrors: false
        }
    
    }
  
    handleDrop(e) {
        e.stopPropagation(); e.preventDefault();
        var fileList = e.dataTransfer.files
        let newFileNames = this.state.fileNames
        for(let i = 0; i<fileList.length; i++){
            var reader = new FileReader()
            reader.onload = (e) => this.getExercise(e,fileList[i].name)
            reader.readAsArrayBuffer(fileList[i])
            newFileNames.push([fileList[i].name])
        }
        this.setState({fileNames:newFileNames})
    }

    onFilesSelected(e){
        let fileList = e.target.files;
        let newFileNames = this.state.fileNames
        for(let i = 0; i<fileList.length; i++){
            var reader = new FileReader()
            reader.onload = (e) => this.getExercise(e, fileList[i].name)
            reader.readAsArrayBuffer(fileList[i])
            newFileNames.push([fileList[i].name])
        }
        this.setState({fileNames:newFileNames})
    }

    getExercise = (e, fileName) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let questionPools = []
        let index = 0
        let errors = []
        
        while(index != null){
            let numberCell = this.getCellValue(worksheet, this.NUMBER_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + index))
            if(numberCell){
                questionPools.push(this.getQuestionPool(worksheet, index, errors))
                index++
            }else {
                index = undefined
            }
        }

        let {exercises, errorByFile} = this.state
        exercises.push({
            name : this.getCellValue(worksheet, this.EXERCISE_NAME_CELL),
            description : this.getCellValue(worksheet, this.DESCRIPTION_CELL),
            numberOfQuestions : questionPools.length,
            questionPools : questionPools,
            courseId: this.props.courseId,
            avarageScore: 0,
            studentPass: 0            
        })
        if(errors.length) errorByFile[fileName] = errors // {fileName: [errors]}
        this.setState({exercises: exercises, errorByFile: errorByFile, showErrors: Object.keys(errorByFile).length>0})
    }

    getQuestionPool(worksheet, number, errors){
        let multipleChoiceString = this.getCellValue(worksheet, this.OPTIONS_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number));
        let multipleChoices = [];
        let regex = /(".*?"|[^";]+)(?=\s*;|\s*$)/g
        if(typeof multipleChoiceString === 'string'){
            multipleChoices = multipleChoiceString.match(regex);
            multipleChoices = multipleChoices.map(e => (e.toString().replace(/(^"|"$)/g,'').trim().toLowerCase()))
        }else{
            multipleChoices = [multipleChoiceString.toString().replace(/(^"|"$)/g,'')]
        }
        
        const rowNumber = this.FIRST_QUESTION_DATA_ROW + number
        let solutionString = this.getCellValue(worksheet, this.ANSWER_QUESTION_COLUMN + rowNumber);
        let solutions = []
        if(typeof solutionString === 'string'){
            solutions = solutionString.match(regex);
            solutions = solutions.map(e => (e.toString().replace(/(^"|"$)/g,'').trim().toLowerCase()))
        }else{
            solutions = [solutionString.toString().replace(/(^"|"$)/g,'')]
        }
        if(!solutions.reduce((prev,curr)=> (prev && multipleChoices.includes(curr)),true)){
            //Answer doesn't exist in options array
            const message = `${solutions} not in ${multipleChoices} as answer options`
            errors.push({rowNumber: rowNumber, message: message})
        }

        return {
            courseId: this.props.courseId,
            difficultyLabel: this.getCellValue(worksheet, this.DIFFICULTY_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            question: this.getCellValue(worksheet, this.PROBLEM_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            multipleChoices: multipleChoices,
            solution: solutions,
            type: 'exercise',
            //tag: 'No Tag',
            attachments : this.getAttachment(this.getCellValue(worksheet, this.MEDIA_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number))),
            playbackTimes: this.getCellValue(worksheet, this.PLAYBACK_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            correctScore: this.getCellValue(worksheet, this.CORRECT_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
            wrongScore: this.getCellValue(worksheet, this.WRONG_QUESTION_COLUMN + (this.FIRST_QUESTION_DATA_ROW + number)),
        }
    }

    getAttachment(cellValue){
        let attachments = []
        if(!!cellValue){
            let attachmentsURLs = cellValue.match(/(".*?"|[^\s";][^";]+[^\s";])(?=\s*;|\s*$)/g)
            attachmentsURLs.forEach(attachmentsURL => {
                attachments.push({ url: attachmentsURL})
            });
        }
        return attachments
    }

    getCellValue(worksheet, cellAddress){
        let cell = worksheet[cellAddress]
        return (cell ? cell.v : undefined);
    }

    uploadExercises(){
        createMultipleExercise(this.props.courseId,this.state.exercises)
        .then(result=>this.props.changeTabPage(this.props.tabIndex, 'ExerciseList'))
        .catch(error=>{
            if(!!error.response)alert(error.response.data)
            else alert(error.message)
        })
    }

    showErrorDialog(e, open){
        e.preventDefault();
        this.setState({showErrors: open})
    }

    render(){
        const {errorByFile, showErrors} = this.state;

        return(
            <div className="subject-exercise-create">
                <Image src="/images/close_icon.svg" height={25} width={25} onClick={()=>this.props.changeTabPage(this.props.tabIndex, 'ExerciseList')}/>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <h2>Create Exercise</h2>
                    <p>Guidance</p>
                </div>
                
                <h3>Upload Exercise File(s)</h3>
                <p>Download sample exercise file <a href="/excel/Sample-Exercise.xlsx">here</a>, then upload your exercise file</p>
                {Object.keys(errorByFile).length > 0 && 
                <p>
                    You have some <a href="#" style={{color: 'red'}} onClick={(e)=>this.showErrorDialog(e,true)}>errors</a> in your uploaded file.
                    Please <b>correct your files</b> and <b>reupload your files</b>.
                </p>}
                <ExerciseUploadErrorDialog open={showErrors} setOpen={this.showErrorDialog} errors={errorByFile} />
                <List className="file-container">
                    {
                        this.state.fileNames.map((fileName)=>(
                            <ListItem key={fileName} className="file-item"><p className="text-file-item">{fileName}</p></ListItem>
                        ))
                    }
                    {
                        this.state.fileNames.length === 0 && (
                            <div style={{display: "flex", flex: 1, minHeight:400 , flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <Dropzone className="file-container">
                                    {({getRootProps, getInputProps}) => (
                                    <div {...getRootProps()}>    
                                        <input {...getInputProps()} />
                                        <div onDrop={(e)=>this.handleDrop(e)} style={{display: "flex", flex: 1, minHeight:100 , flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                            <Image src="/images/upload_icon.svg" height={100} width={100} />
                                            <h4>Drag and Drop File</h4>
                                            <h4>or</h4>
                                        </div>
                                    </div>
                                    )}
                                </Dropzone>
                                <label htmlFor="browse"><h4 style={{textDecorationLine: "underline", color: "#3F51B5"}}>Browse</h4></label>
                                <input multiple id="browse" type="file" onChange={this.onFilesSelected.bind(this)}/>
                            </div>
                        )
                    }
                </List>
                {!Object.keys(errorByFile).length && <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <Button
                        onClick={this.uploadExercises.bind(this)}
                        style={{width: 165, height: 50, marginTop: 21, marginBottom: 34}} 
                        variant="contained" color="primary">
                            UPLOAD
                    </Button>
                </div>}
            </div>
        )
    }
}

export default CreateExercise;