import React from "react";
import {Grid, Avatar} from "@material-ui/core";
import {FiberManualRecord} from "@material-ui/icons";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import id from 'javascript-time-ago/locale/id';

TimeAgo.addLocale(id)


export default function Notification(props){
    const {data}  = props;
    const timeAgo = new TimeAgo('id-ID')
    return(
        <Grid container style={{width: 300}}>
            <Grid xs={2} item>
                <Grid alignItems="center" style={{height: '100%'}} container>
                    <Avatar src={data.bankNotification.photo} />
                </Grid>
            </Grid>
            <Grid xs={9} item>
                <p style={{padding: 0, margin: 0, whiteSpace: 'normal'}}>
                <span>{`${data.bankNotification.message}`}</span><br/>
                <span><b>{timeAgo.format(new Date(data.bankNotification.createdAt))}</b></span>
                </p>
            </Grid>
            <Grid xs={1} item>
                <Grid alignItems="center" justify="center" style={{height: '100%'}} container>
                    {!data.read && <FiberManualRecord color="primary" style={{fontSize: 10}} />}
                </Grid>
            </Grid>
        </Grid>
    )
}