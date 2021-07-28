import React from "react";
import ChatList from "./ChatList";
import Chat from "./ChatBox";

export default class ChatPanel extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <React.Fragment>
                <ChatList {...this.props} />
            </React.Fragment>
        )
    }
}