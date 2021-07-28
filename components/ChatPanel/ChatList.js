import React from "react";
import ChatUserList from "./ChatUserList";
import ChatBox from "./ChatBox";
import {Paper, Grid, Avatar, IconButton, Divider} from "@material-ui/core";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

export default class ChatList extends React.Component{
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

    closeChat(id){
        let openChats = this.state.openChats;
        openChats = openChats.filter((e) => e._id !== id)
        this.setState({openChats: openChats})
    }

    checkStatus(){
        console.log("hello world")
    }

    render(){
        const {showChatUserList, openChats} = this.state;
        const {user} = this.props;
        return(
            <React.Fragment>
                <div style={{position: 'absolute', bottom: 0, right: 0}}>
                    <Paper variant="outlined">
                        <IconButton onClick={()=> this.setState({showChatUserList: !showChatUserList})}>
                            <Grid style={{height: 40, width: 300, padding: 0}} container xs={12}>
                                <Grid item xs={11}>
                                    <Grid container> 
                                        <b style={{margin: 10   }}>Messages (20 online)</b>
                                    </Grid>
                                </Grid>
                                <Grid item xs={1} style={{paddingTop: 10}}><KeyboardArrowUpIcon /></Grid>
                            </Grid>
                        </IconButton>
                        <Divider />
                        {showChatUserList && <ChatUserList openChat={this.openChat.bind(this)} />}
                    </Paper>
                </div>
                {openChats.map((e,index) => (
                    <ChatBox {...e} right={220*index+350}
                    checkStatus={this.checkStatus}
                    checkStatus={this.checkStatus.bind(this)} 
                    closeChat={this.closeChat} 
                    closeChat={this.closeChat.bind(this)}
                    />
                ))}
            </React.Fragment>
        )
    }
}