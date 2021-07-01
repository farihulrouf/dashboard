import React, { useState } from "react";
import { Grid, Button, Dialog, Popover, Paper, CircularProgress } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import CreateEditCourseDialog from "./settings/CreateEditCourseDialog";
import MuiAlert from '@material-ui/lab/Alert';
import { deleteCourse } from '../lib/api';
import { useRouter } from 'next/router'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CourseMore = ({ course, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const id = 'course-card-popover';

    const router = useRouter();

    const handleDialog = () => {
        setOpen((prev) => !prev);
    };

    const handleOption = (e) => {
        setAnchorEl((prev) => prev ? null : e.currentTarget);
    }

    const handleDeleteCourse = () => {
        setDeleteLoading(true);
        deleteCourse(course._id)
            .then((res) => {
                console.log(res);
                setSuccessMessage('Success delete course');
                setDeleteLoading(false);
                router.reload();
            })
            .catch((err) => {
                console.log(err);
                setErrorMessage('Failed to delete course');
                setDeleteLoading(false);
            })
    }

    console.log(course);

    const { canEdit, canDelete } = course;

    return (
        <Grid item className="course-more">
            {(Boolean(successMessage) || Boolean(errorMessage)) && (
                <Alert 
                    onClose={successMessage
                        ? setSuccessMessage('')
                        : setErrorMessage('')
                    } 
                    severity={successMessage ? 'success' : 'error'}
                >
                    {successMessage ? successMessage : errorMessage}
                </Alert>
            )}
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
                        {canEdit && (
                            <Button 
                            className="edit" 
                            variant="contained"
                            onClick={handleDialog}
                            >
                                Edit
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                            className="delete"
                            variant="contained"
                            onClick={handleDeleteCourse}
                            >
                                {deleteLoading ? (
                                    <CircularProgress thickness={5} size={20} className="no-margin-loading" />
                                ) : "DELETE"}
                            </Button>
                        )}
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
