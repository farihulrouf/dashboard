import React from "react";
import { AccountCircle } from "@material-ui/icons";
import { Grid, Avatar } from "@material-ui/core";

const InstructorItem = (props) => {
  const { data } = props;

  return (
    <Grid item container xs={2} className="instructor-container">
      <Grid className="instructor-logo" item>
        <a href={data.linkedIn}>
          <Avatar alt={data.name} src={data.avatar} className="logo" />
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
