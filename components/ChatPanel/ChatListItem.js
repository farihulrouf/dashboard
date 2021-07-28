import React from "react";
import {Avatar, Grid, IconButton} from '@material-ui/core';
import TimeAgo from 'javascript-time-ago';


export default class ChatListItem extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        const {name, message, date} = this.props;
        //const timeAgo = new TimeAgo('id-ID')

        return(
            <IconButton style={{width: '100%', textAlign: 'left', padding: 0}}>
                <Grid container xs={12} style={{padding: 10}}>
                    <Grid item xs={2}><Avatar alt={name} src="/static/images/avatar/1.jpg" /></Grid>
                    <Grid item xs={10} justify="flex-start">
                        <Grid container>
                            <Grid item xs={10}>{name}</Grid>
                            <Grid item xs={2}><span style={{fontSize: 10}}>5 June</span></Grid>
                        </Grid>
                        <span style={{fontSize: 12}}>{message}</span>
                    </Grid>
                </Grid>
            </IconButton>
        )
    }
}