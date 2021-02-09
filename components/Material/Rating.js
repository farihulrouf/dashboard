import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

const useStyles = makeStyles({
  root: {
    width: 200,
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
  },
});

function HoverRating({ rating, setRating }) {
  const [hover, setHover] = useState(-1);

  const classes = useStyles();

  const handleChange = (newValue) => {
    setRating((prev) => {
      return {
        ...prev,
        rating: newValue,
      };
    });
  };

  return (
    <div className={classes.root}>
      <Rating
        size="large"
        name="hover-feedback"
        value={rating}
        precision={0.5}
        onChange={(event, newValue) => {
          handleChange(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
      />{" "}
      {rating !== null && (
        <Box ml={2}>{labels[hover !== -1 ? hover : rating]}</Box>
      )}
    </div>
  );
}

export default HoverRating;
