import React from "react";
import { Grid, TextField } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

const CourseSyllabus = ({ newSyllabus, setNewSyllabus, handleChange, show }) => {
    const { title, description, date } = newSyllabus;

    const handleDateChange = (date) => {
        setNewSyllabus(prev => ({
            ...prev,
            date: date
        }));
    };

    return (
        <Grid item className="create-course-syllabus">
            <TextField
                name="title"
                className="create-course-syllabus-title"
                value={title}
                disabled={show}
                onChange={handleChange}
                placeholder="Insert Title"
            />
            <TextField
                className="create-course-syllabus-description"
                multiline
                name="description"
                rowsMax={3}
                disabled={show}
                onChange={handleChange}
                value={description}
                placeholder="Insert course syllabus"
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    autoOk={true}
                    margin="normal"
                    disabled={show}
                    format="MM/dd/yyyy"
                    color="primary"
                    className="create-course-syllabus-date"
                    value={date}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
        </Grid>
    );
};

export default CourseSyllabus;
