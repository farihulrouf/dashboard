import React, { forwardRef } from "react";
import truncatise from "truncatise";
import { Grid, Button, IconButton, Divider } from "@material-ui/core";
import { voteDiscussion } from "../../../lib/api";
import { ArrowDropUp, ArrowDropDown } from "@material-ui/icons";
import MathJax from "react-mathjax-preview";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import CreateAnswer from "./CreateAnswer";
import DiscussionAnswer from "./DiscussionAnswer";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ModalDiscussion = (props) => {
    const { open, handleClose, selected, setSelected } = props;

    const formatDate = (date) => {
        return date.slice(0, 19).replace("T", " at ");
    };

    const onVoteButtonClick = () => {
        voteDiscussion(selected)
            .then((res) => setSelected(res.discussion))
            .catch((err) => alert(err.message));
    };

    const afterCreateAnswer = (newDiscussion) => {
        console.log("running from modal", newDiscussion)
        setSelected(newDiscussion);
    };

    return (
        <div>
            <Dialog
                className="discussion-modal"
                disableEnforceFocus={true}
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <Grid item className="discussion-item-con">
                    <Grid item className="discussion-item">
                        <Grid item className="left">
                            <Grid
                                className={
                                    selected.isVoted ? "is-voted top" : "top"
                                }
                            >
                                <IconButton onClick={onVoteButtonClick}>
                                    {selected.isVoted ? (
                                        <ArrowDropDown />
                                    ) : (
                                        <ArrowDropUp />
                                    )}
                                </IconButton>
                                <Grid>
                                    <Grid>
                                        <h3>{selected.votes.total}</h3>
                                    </Grid>
                                    <span>Votes</span>
                                </Grid>
                            </Grid>
                            <Divider />
                            <Grid
                                className={
                                    selected.solved ? "solved top" : "top"
                                }
                                item
                            >
                                <h3 className={selected.solve ? "solved" : ""}>
                                    {selected.answers.total}
                                </h3>
                                <span>Answers</span>
                            </Grid>
                        </Grid>
                        <Grid item className="right">
                            <Grid item className="header">
                                <Grid item className="header-modal">
                                    <h6>{selected.title}</h6>
                                    <Button className="left-btn my-btn">
                                        SHOW RELEVANT COURSES
                                    </Button>
                                </Grid>
                                <Grid item className="created-at">
                                    <span>
                                        {formatDate(selected.createdAt)}
                                    </span>
                                </Grid>
                            </Grid>
                            <Grid item className="body-discussion">
                                <MathJax
                                    math={truncatise(selected.body, {
                                        TruncateLength: 35,
                                    })}
                                />
                            </Grid>
                            <Grid item className="tag-container">
                                {selected.tags.map(
                                    (item, index) => {
                                        return (
                                            <Grid
                                                key={index}
                                                className="tag"
                                                item
                                            >
                                                {item.name}
                                            </Grid>
                                        );
                                    }
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid className="comment-section">
                        {selected.answers.topAnswers.length ? (
                            selected.answers.topAnswers.map((item, index) => {
                                return <DiscussionAnswer key={index} data={item} />;
                            })
                        ) : (
                            <div className="no-answer">No answer yet!</div>
                        )}
                        <CreateAnswer
                            createdAnswer={selected.newAnswer}
                            afterCreateAnswer={afterCreateAnswer}
                            discussionId={selected._id}
                        />
                    </Grid>
                </Grid>
            </Dialog>
        </div>
    );
};

export default ModalDiscussion;
