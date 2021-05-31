import React from "react";
import { Grid, Divider } from "@material-ui/core";
import { EventAvailable } from "@material-ui/icons";

export default function SyllabusItem({ item, last }) {
    const { title, description, date } = item;

    const dateString = new Date(date).toUTCString();

    return (
        <Grid item className="syllabus-item">
            <h6 className="syllabus-item-title">{title}</h6>
            <p className="syllabus-item-description">{description}</p>
            <Grid item className="syllabus-item-date">
                <EventAvailable />
                <span className="syllabus-item-date-text">
                    {dateString}
                </span>
            </Grid>
            {!last && <Divider />}
        </Grid>
    );
}
