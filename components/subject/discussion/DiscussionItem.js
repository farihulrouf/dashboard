import React from "react";
import {Grid, Divider, IconButton} from "@material-ui/core";
import Chip from '@material-ui/core/Chip';
import {KeyboardArrowUp, Create, QuestionAnswer} from "@material-ui/icons";
import MathJax from "react-mathjax-preview";
import truncatise from "truncatise";
import CreateAnswer from "./CreateAnswer";
import DiscussionItemMore from "./DiscussionItemMore";
import DiscussionAnswer from "./DiscussionAnswer";
import {voteDiscussion}from "../../../lib/api";

class DiscussionItem extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showCreateAnAnswer: false, 
            showBestAnswer: false,
            discussion: this.props.data
        }
    }

    onClickShowCreateAnAnswer = () => {
        this.setState({showCreateAnAnswer: !this.state.showCreateAnAnswer, showBestAnswer: false})
    }

    onClickShowBestAnswer = () => {
        this.setState({showCreateAnAnswer: false, showBestAnswer: !this.state.showBestAnswer})
    }

    afterCreateAnswer = (newDiscussion) => {
        this.setState({discussion: newDiscussion})
    }

    onVoteButtonClick = () => {
        const {discussion} = this.state;
        voteDiscussion(discussion)
            .then((res)=> this.setState({discussion: res.discussion}))
            .catch((err) => alert(err.message))
    }

    afterUpdateDiscussion = (discussion) => {
        this.setState({discussion: discussion});
    }

    render(){
        const {discussion} = this.state;
        const {canEdit, canDelete} = discussion;
        const {showCreateAnAnswer, showBestAnswer} = this.state;
        return(
        <div style={{position: 'relative'}}>
            {(canEdit || canDelete ) && 
                <DiscussionItemMore 
                    discussion={discussion} 
                    afterUpdateDiscussion={this.afterUpdateDiscussion}
                    canEdit={canEdit}
                    canDelete={canDelete}
                />
            }
            <Grid container style={{marginRight: 30}}>
                <Grid xs={12} sm={2} item style={{padding: 20, textAlign: 'center'}}>
                    <IconButton onClick={this.onVoteButtonClick} style={{margin: 0, padding: 0}}>
                        <KeyboardArrowUp style={discussion.isVoted ? {color: 'blue', fontSize: 50} : {}}/>
                    </IconButton>
                    <h3 style={{margin: 0, padding: 0}}>{discussion.votes.total}</h3>
                    <span>Votes</span>
                    <Divider style={{margin: '5px 0px'}} />
                    <h3 style={{margin: 0, padding: 0, color: !!discussion.solve ? 'green' : 'black'}}>{discussion.answers.total}</h3>
                    <span>Answers</span>
                </Grid>
                <Grid xs={12} sm={10} item style={{flexGrow: 1, padding: 20}}>
                    <div style={{display: 'flex'}}>
                        <div style={{display: 'block', flexGrow: 1}}>
                            <div>
                                <span style={{fontFamily: 'Lato', fontWeight: 'bold', fontSize: 16, color: '#3F51B5', lineHeight: '19px'}}>
                                    {discussion.title}
                                </span>
                            </div>
                            <div>
                                <span style={{color: '#1B1642', fontFamily: 'Lato', fontStyle: 'italic', fontWeight: 300, fontSize: 12, lineHeight: '14px'}}>
                                    {discussion.createdAt}
                                </span>
                            </div>
                        </div>
                    </div>
                    <MathJax math={truncatise(discussion.body, {TruncateLength: 35})} />
                    {["aljabar","geometri","trigonometri"].map((e,index) => 
                        <Chip size="small" key={index} label={e} style={{margin: '10px 10px 0px 0px'}} />
                    )}
                    <div>
                        <IconButton color={showCreateAnAnswer ? "primary" : "default"} onClick={this.onClickShowCreateAnAnswer}>
                            <Create />
                        </IconButton>
                        <IconButton color={showBestAnswer ? "primary" : "default"} onClick={this.onClickShowBestAnswer}>
                            <QuestionAnswer />
                        </IconButton>
                    </div>
                    {showCreateAnAnswer && <CreateAnswer createdAnswer={discussion.newAnswer} afterCreateAnswer={this.afterCreateAnswer} discussionId={discussion._id} />}
                    {showBestAnswer && <DiscussionAnswer data={discussion.answers.topAnswers[0]} />}
                </Grid>
            </Grid>
        </div>
        )
    }
}

export default DiscussionItem;