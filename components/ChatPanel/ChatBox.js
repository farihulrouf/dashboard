import React from 'react';
import { IconButton, Grid, Avatar, Paper } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import ChatHistoryList from "./ChatHistoryList";
export default class ChatBox extends React.Component{
    constructor(props){
        super(props);
         this.state={showChatUserList: false, openChats: []}
    }

    openChat(c){ 
     
        let openChats = this.state.openChats;
        let obj = openChats.find(e => e._id === c._id)
        if(!obj) openChats = [...openChats, {...c, windowOpen: true}]
        this.setState({openChats: openChats})   
    }

    render(){
        const {_id, name, message, profile} = this.props;
        const {showChatUserList, openChats} = this.state;

        return(

   <div style={{position: 'absolute', bottom: 0,  right: this.props.right}}>
                    <Paper variant="outlined">
                      

                        <IconButton style={{width: '100%', padding: 10, zIndex: 1}} onClick={()=> this.setState({showChatUserList: !showChatUserList})}>
                <Grid container>
                    <Grid item xs={2}><Avatar style={{width: 25, height: 25}} alt={name} src="/static/images/avatar/1.jpg" /></Grid>
                    <Grid item container xs={8} justify="flex-start">
                        {name}
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={()=> this.props.closeChat(_id)} style={{padding: 0}} ><CloseIcon/></IconButton>
                    </Grid>
                </Grid>
                </IconButton>
                        
                        {showChatUserList && <ChatHistoryList openChat={this.openChat.bind(this)} />}
                    </Paper>
                </div>
                

        )
    }
}