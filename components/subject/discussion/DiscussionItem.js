import React from "react";
import { Grid, Divider, IconButton, Button } from "@material-ui/core";
import { ArrowDropUp, ArrowDropDown } from "@material-ui/icons";
import MathJax from "react-mathjax-preview";
import truncatise from "truncatise";
import CreateAnswer from "./CreateAnswer";
import DiscussionItemMore from "./DiscussionItemMore";
import DiscussionAnswer from "./DiscussionAnswer";
import { voteDiscussion } from "../../../lib/api";

class DiscussionItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreateAnAnswer: false,
            showBestAnswer: false,
            discussion: this.props.data,
        };
    }

    onClickShowCreateAnAnswer = () => {
        this.setState({
            showCreateAnAnswer: !this.state.showCreateAnAnswer,
            showBestAnswer: false,
        });
    };

    onClickShowBestAnswer = () => {
        this.setState({
            showCreateAnAnswer: false,
            showBestAnswer: !this.state.showBestAnswer,
        });
    };

    afterCreateAnswer = (newDiscussion) => {
        this.setState({ discussion: newDiscussion });
    };

    onVoteButtonClick = () => {
        const { discussion } = this.state;

        voteDiscussion(discussion)
            .then((res) => this.setState({ discussion: res.discussion }))
            .catch((err) => alert(err.message));
    };

    afterUpdateDiscussion = (discussion) => {
        this.setState({ discussion: discussion });
    };

    formatDate = (date) => {
        return date.slice(0, 19).replace("T", " at ");
    };

    componentDidUpdate(prev) {
        if (this.state.showCreateAnAnswer !== prev.showCreateAnAnswer) {
            let wrs = document.querySelectorAll(".wrs_stack");

            if (wrs) {
                for (let item of wrs) {
                    item.parentNode.removeChild(item);
                }
            }
        }
    }

    render() {
        const { discussion, showCreateAnAnswer, showBestAnswer } = this.state;
        const { canEdit, canDelete } = discussion;
        const { deleteDiscussion } = this.props;

        return (
            <div className="item-container">
                <Grid item className="edit-delete">
                    {(canEdit || canDelete) && (
                        <DiscussionItemMore
                            discussion={discussion}
                            afterUpdateDiscussion={this.afterUpdateDiscussion}
                            deleteDiscussion={deleteDiscussion}
                            canEdit={canEdit}
                            canDelete={canDelete}
                        />
                    )}
                </Grid>
                <Grid item className="discussion-item">
                    <Grid item className="left">
                        <Grid
                            className={
                                discussion.isVoted ? "is-voted top" : "top"
                            }
                        >
                            <IconButton
                                onClick={() => this.onVoteButtonClick()}
                            >
                                {discussion.isVoted ? (
                                    <ArrowDropDown />
                                ) : (
                                    <ArrowDropUp />
                                )}
                            </IconButton>
                            <Grid>
                                <Grid>
                                    <h3>{discussion.votes.total}</h3>
                                </Grid>
                                <span>Votes</span>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid
                            className={discussion.solved ? "solved top" : "top"}
                            item
                        >
                            <h3 className={discussion.solve ? "solved" : ""}>
                                {discussion.answers.total}
                            </h3>
                            <span>Answers</span>
                        </Grid>
                    </Grid>
                    <Grid item className="right">
                        <Grid item className="header">
                            <Grid
                                item
                                onClick={() =>
                                    this.props.handleOpen(discussion._id)
                                }
                            >
                                <h6>{discussion.title}</h6>
                            </Grid>
                            <Grid item className="created-at">
                                <span>
                                    {this.formatDate(discussion.createdAt)}
                                </span>
                            </Grid>
                        </Grid>
                        <Grid item className="body-discussion">
                            <MathJax
                                math={truncatise(discussion.body, {
                                    TruncateLength: 35,
                                })}
                            />
                        </Grid>
                        <Grid item className="tag-container">
                            {discussion.tag.map(
                                (item, index) => {
                                    return (
                                        <Grid key={index} className="tag" item>
                                            {item.name}
                                        </Grid>
                                    );
                                }
                            )}
                        </Grid>
                        <Grid item className="btn-container">
                            <Button
                                className="left-btn my-btn"
                                onClick={this.onClickShowBestAnswer}
                            >
                                MOST RELEVANT ANSWER
                            </Button>
                            <Button
                                className="right-btn my-btn"
                                onClick={this.onClickShowCreateAnAnswer}
                            >
                                GIVE ANSWER
                            </Button>
                        </Grid>
                        {showCreateAnAnswer && (
                            <CreateAnswer
                                createdAnswer={discussion.newAnswer}
                                afterCreateAnswer={this.afterCreateAnswer}
                                discussionId={discussion._id}
                            />
                        )}
                        {showBestAnswer && 
                            <DiscussionAnswer data={discussion.answers.topAnswers[0]} />
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default DiscussionItem;
