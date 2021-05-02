import React from "react";
import { Grid } from "@material-ui/core";
import Avatar from "../Avatar";

const InstructorItem = (props) => {
    const { data } = props;

    return (
        <Grid item container xs={2} className="instructor-container">
            <Grid className="instructor-logo" item>
                <a href={data.linkedIn}>
                    <Avatar name={data.name} imgUrl={data.avatar} />
                </a>
            </Grid>
            <Grid className="instructor-desc" item>
                <h6>Instructor</h6>
                <span>{data.name}</span>
            </Grid>
        </Grid>
    );
};

export default InstructorItem;
