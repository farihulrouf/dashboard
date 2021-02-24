import { List, ListItem, Button, Icon, TextField } from "@material-ui/core";
import React from "react";
import { createMultipleExercise } from "../../../lib/api";
import AddIcon from '@material-ui/icons/Add';

class ExerciseList extends React.Component{
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

            </div>
        )
    }
}

export default ExerciseList;
