import React from "react";
import {Grid} from "@material-ui/core";
import Avatar from "./Avatar";
import {FiberManualRecord} from "@material-ui/icons";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import id from 'javascript-time-ago/locale/id';

TimeAgo.addLocale(id)

export default function Notification(props) {
    const {data} = props;
    const timeAgo = new TimeAgo('id-ID')
    console.log(data)
    return (
        <Grid container className="notification-item">
            <Grid item className="avatar-container">
                <Avatar imgUrl={data.bankNotification.photo} />
            </Grid>
            <Grid item>
                <p>
                    {data.bankNotification.message}
                </p>
                <span>
                    {timeAgo.format(new Date(data.bankNotification.createdAt))}
                </span>
            </Grid>
            <Grid item  className="unread-container">
                {data.status === "unread" && <FiberManualRecord className="unread" />}
            </Grid>
        </Grid>
    )
}