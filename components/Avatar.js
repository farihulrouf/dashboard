import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";

const UserAvatar = ({ name, imgUrl }) => {
    const getRandomColor = (name) => {
        if (name) {
            const firstAlphabet = name.charAt(0).toLowerCase();

            const asciiCode = firstAlphabet.charCodeAt(0);

            const colorNum =
                asciiCode.toString() +
                asciiCode.toString() +
                asciiCode.toString();

            var num = Math.round(0xffffff * parseInt(colorNum));
            var r = (num >> 16) & 255;
            var g = (num >> 8) & 255;
            var b = num & 255;

            return "rgb(" + r + ", " + g + ", " + b + ", 1)";
        } else {
            return "#7A7A7A"
        }
    };

    const getInitial = (str) => {
        if (str) {
            let acronym = str
            .split(/\s/)
            .reduce((response, word) => (response += word.slice(0, 1)), "");

            return acronym.slice(0,2);
        } else return null
    };

    return (
        <Tooltip title={name ? name : ""}>
            <Avatar
                alt={getInitial(name)}
                src={imgUrl}
                style={{
                    backgroundColor: getRandomColor(name),
                    fontSize: "24px",
                }}
            >
                {getInitial(name)}
            </Avatar>
        </Tooltip>
    );
};

export default UserAvatar;
