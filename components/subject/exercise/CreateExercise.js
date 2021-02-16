
import { List, ListItem } from "@material-ui/core";
import React from "react";
class CreateExercise extends React.Component{

    state={
        exercises: []
    }

    constructor(props){
        super(props);
    }

    componentDidMount(){
        console.log('componentDidMount')
        //this.setState({exercises: [{fileName: 'Testadsf'},{fileName: 'Test2'},{fileName: 'Test3'}]})
    }

    componentDidUpdate(){
        console.log('componentDidUpdate')
    }

    render(){
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
                        this.state.exercises.map((exercise)=>(
                            <ListItem className="file-item"><p className="text-file-item">{exercise.fileName}</p></ListItem>
                        ))
                    }
                    {
                        this.state.exercises.length === 0 && (
                            <div style={{display: "flex", flex: 1, minHeight:400 , flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <h4>Drag and Drop File</h4>
                                <h4>or</h4>
                                <label for="browse"><h4 style={{textDecorationLine: "underline"}}>Browse</h4></label>
                                <input id="browse" type="file"/>
                            </div>
                        )
                    }
                </List>
            </div>
        )
    }
}

export default CreateExercise;