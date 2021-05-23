import React, { useState } from "react";
import { Grid, Button, Dialog } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import CreateEditCourseDialog from "./settings/CreateEditCourseDialog";

const CourseMore = ({ course, onUpdate }) => {
    const [open, setOpen] = useState(false);

    const handleDialog = () => {
        setOpen((prev) => !prev);
    };

    const { canEdit } = course;

    return (
        <Grid item className="course-more">
            <Grid className="three-dots">
                <Button onClick={handleDialog}>
                    <MoreVert />
                </Button>
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
