import React from "react";
import {Grid, Avatar} from "@material-ui/core";

const getRandomColor = (name) => {
    // get first alphabet in upper case
    const firstAlphabet = name
        .charAt(0)
        .toLowerCase();

    // get the ASCII code of the character
    const asciiCode = firstAlphabet.charCodeAt(0);

    // number that contains 3 times ASCII value of character -- unique for every
    // alphabet
    const colorNum = asciiCode.toString() + asciiCode.toString() + asciiCode.toString();

    var num = Math.round(0xffffff * parseInt(colorNum));
    var r = (num >> 16) & 255;
    var g = (num >> 8) & 255;
    var b = num & 255;

    return "rgb(" + r + ", " + g + ", " + b + ", 1)";
};

const InstructorItem = (props) => {
    const {data} = props;

    return (
        <Grid item container xs={2} className="instructor-container">
            <Grid className="instructor-logo" item>
                <a href={data.linkedIn}>
                    <Avatar
                        alt={data.name}
                        src={data.avatar}>
                        {data.name}
                    </Avatar>
                </a>
            </Grid>
            <Grid className="instructor-desc" item>
                <h6>Instructor</h6>
                <span>{data.name}</span>
            </Grid>
        </Grid>
    );
};

export {InstructorItem, getRandomColor};
