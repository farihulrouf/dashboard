import React, { useState } from "react";
import { Grid, Button, Dialog, Popover, Paper } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import CreateEditCourseDialog from "./settings/CreateEditCourseDialog";

const CourseMore = ({ course, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const id = 'course-card-popover';

    const handleDialog = () => {
        setOpen((prev) => !prev);
    };

    const handleOption = (e) => {
        setAnchorEl((prev) => prev ? null : e.currentTarget);
    }

    const { canEdit } = course;

    return (
        <Grid item className="course-more">
            <Grid className="three-dots">
                <Button onClick={handleOption}>
                    <MoreVert />
                </Button>
                <Popover
                    id={id}
                    open={Boolean(anchorEl)}
                    className="discussion-answer-more-popover"
                    anchorEl={anchorEl}
                    onClose={handleOption}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Paper className="popper-option">
                        <Button 
                            className="edit" 
                            variant="contained"
                            onClick={handleDialog}
                        >
                            Edit
                        </Button>
                        <Button
                            className="delete"
                            variant="contained"
                        >
                            Delete
                        </Button>
                    </Paper>
                </Popover>
            </Grid>
            <Dialog open={open} onClose={handleDialog}>
                <Grid item className="create-course-dialog">
                    <CreateEditCourseDialog
                        handleDialog={handleDialog}
                        course={course}
                        edit={canEdit}
                        onCourseUpdated={onUpdate}
                    />
                </Grid>
            </Dialog>
        </Grid>
    );
};

export default CourseMore;
