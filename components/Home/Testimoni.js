import React from "react";
import { Grid, Paper } from "@material-ui/core";

const Testimoni = ({ testi }) => {
  return (
    <Paper className="testi-container">
      <Grid item className="petik-container">
        <img src="images/quote.png" alt="Quotation" />
      </Grid>
      <Grid item className="comment-container">
        <h6 className="comment">{testi.comment}</h6>
      </Grid>
      <Grid container className="instructor-container">
        <Grid className="img-container">
          <img src={testi.image} alt="instructor-photo" />
        </Grid>
        <Grid className="name-container">
          <h6>{testi.name}</h6>
          <p>{testi.title}</p>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Testimoni;
