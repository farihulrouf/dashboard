import React from "react";
import DiscussionFilter from "./discussion/DiscussionFilter";
import DiscussionForm from "./discussion/DiscussionForm";
import DiscussionItem from "./discussion/DiscussionItem";
import {Grid, Divider} from "@material-ui/core";
import {getCourseDiscussions, deleteCourseDiscussion} from "../../lib/api";

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

    deleteDiscussion = async (discussionId) => {
      const data = await deleteCourseDiscussion(discussionId);
      this.setState({discussions : data.discussions});
    }

    afterCreateDiscussion = (discussions) => {
        this.setState({open: false, discussions: discussions})
    }

    render(){
        const {open, discussions} = this.state;
        console.log(discussions);
        return(
            <React.Fragment>
                <DiscussionFilter openDiscussionForm={this.openDiscussionForm} />
                <DiscussionForm 
                    auth={this.props.auth} 
                    closeDiscussionForm={this.closeDiscussionForm} 
                    afterCreateDiscussion={this.afterCreateDiscussion}
                    open={open}
                    courseId={this.props.courseId}
                />
                <Grid container style={{marginTop: 20}}>
                    {discussions.map((e) =>
                        <Grid key={e._id} item xs={12}>
                            <DiscussionItem data={e} deleteDiscussion={this.deleteDiscussion}/>
                            <Divider />
                        </Grid>
                    )}
                </Grid>
            </React.Fragment>
        )
    }
}

export default Discussion;