import React from "react";
import { Grid, Button } from "@material-ui/core";

const NotEnrolled = ({ enroll, price }) => {
    const valueLabelFormat = (value) => {
        const array = String(value).split("");
        const length = array.length;

        return `Rp. ${array
            .map((char, index) => {
                if (index > 0 && index % 3 === length % 3) {
                    return `.${char}`
                } else {
                    return char;
                }
            })
            .join("")},00`;
    };

    return (
        <Grid item className="post-box not-enrolled-box">
            <h3>Join the course to explore more!</h3>
            <p>
                Join now for <span>{valueLabelFormat(price)}</span>!
            </p>
            <Button className="join-btn mybtn" onClick={enroll}>
                Join Course
            </Button>
        </Grid>
    );
};

export default NotEnrolled;
