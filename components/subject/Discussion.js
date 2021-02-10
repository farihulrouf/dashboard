import React from "react";
import DiscussionFilter from "./discussion/DiscussionFilter";
import DiscussionForm from "./discussion/DiscussionForm";

class Discussion extends React.Component{
    constructor(props){
        super(props);
        this.state = {open: false}
        this.openDiscussionForm = this.openDiscussionForm.bind(this);
        this.closeDiscussionForm = this.closeDiscussionForm.bind(this);
    }

    openDiscussionForm = () => {
        this.setState({open: true})
    }

    closeDiscussionForm = () => {
        this.setState({open: false})
    }

    render(){
        const {open} = this.state;
        return(
            <React.Fragment>
                <DiscussionFilter openDiscussionForm={this.openDiscussionForm} />
                <DiscussionForm auth={this.props.auth} closeDiscussionForm={this.closeDiscussionForm} open={open}/>
            </React.Fragment>
        )
    }
}

export default Discussion;