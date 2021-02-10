import React from "react";
import DiscussionFilter from "./discussion/DiscussionFilter";
import DiscussionForm from "./discussion/DiscussionForm";
import DiscussionItem from "./discussion/DiscussionItem";
import {Grid, Divider} from "@material-ui/core";
import {getCourseDiscussions} from "../../lib/api";

class Discussion extends React.Component{
    constructor(props){
        super(props);
        this.state = {open: false, discussions: []}
        this.openDiscussionForm = this.openDiscussionForm.bind(this);
        this.closeDiscussionForm = this.closeDiscussionForm.bind(this);
    }

    componentDidMount(){
        getCourseDiscussions(this.props.courseId).then(res => {
            this.setState({discussions: res.discussions})
        })
    }

    openDiscussionForm = () => {
        this.setState({open: true})
    }

    closeDiscussionForm = () => {
        this.setState({open: false})
    }

    render(){
        const {open, discussions} = this.state;
        return(
            <React.Fragment>
                <DiscussionFilter openDiscussionForm={this.openDiscussionForm} />
                <DiscussionForm 
                    auth={this.props.auth} 
                    closeDiscussionForm={this.closeDiscussionForm} 
                    open={open}
                    courseId={this.props.courseId}
                />
                <Grid container style={{marginTop: 20}}>
                    {discussions.map((e) =>
                        <Grid key={e._id} item xs={12}>
                            <DiscussionItem data={e} />
                            <Divider />
                        </Grid>
                    )}
                </Grid>
            </React.Fragment>
        )
    }
}

export default Discussion;