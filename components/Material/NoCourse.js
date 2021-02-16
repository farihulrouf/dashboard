import React from "react";
import { Grid } from "@material-ui/core";
import { ErrorOutline } from "@material-ui/icons";

const NoCourse = () => {
  return (
    <Grid className="no-course">
      <ErrorOutline />
      <h4>No Courses Found</h4>
    </Grid>
  );
};

export default NoCourse;
