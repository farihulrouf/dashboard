import React, { forwardRef, useState } from "react";
import truncatise from "truncatise";
import { Grid, Button, IconButton, Divider, CircularProgress } from "@material-ui/core";
import { voteDiscussion, getMoreAnswers } from "../../../lib/api";
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
    const { open, handleClose, selected, setSelected, canVoteAnswer } = props;
    const [query, setQuery] = useState({
        page: 2,
        limit: 3
    });
    const [discussion, setDiscussion] = useState(props.selected);
    const [answerLoading, setAnswerLoading] = useState(false);
    const [total, setTotal] = useState(discussion.answers.total);

    const showMoreAnswers = () => {
        if (!answerLoading) {
            setAnswerLoading(true);
            getMoreAnswers(discussion._id, query).then(res => {
                console.log(res)
                if (query.page <= res.pages) {
                    setDiscussion(prev => ({
                        ...prev,
                        answers: {
                            ...prev.answers,
                            total: res.total,
                            topAnswers: [...prev.answers.topAnswers, ...res.answers]
                        }
                    }));
                        setQuery(prev => ({
                            ...prev,
                            page: res.page + 1
                        }));
                    
                    setTotal(res.total)
                    setAnswerLoading(false);
                }
            });

        }
    }

    const onVoteButtonClick = () => {
        voteDiscussion(discussion)
            .then((res) => setSelected(res.discussion))
            .catch((err) => alert(err.message));
    };

    const afterCreateAnswer = (newDiscussion) => {
        setSelected(newDiscussion);
        setTotal(prev => prev + 1);
    };

    const { topAnswers } = discussion.answers; 
    const dateCreated = new Date(discussion.createdAt);

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
                                    discussion.isVoted ? "is-voted top" : "top"
                                }
                            >
                                <IconButton onClick={onVoteButtonClick}>
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
                                className={
                                    discussion.solved ? "solved top" : "top"
                                }
                                item
                            >
                                <h3 className={discussion.solve ? "solved" : ""}>
                                    {total}
                                </h3>
                                <span>Answers</span>
                            </Grid>
                        </Grid>
                        <Grid item className="right">
                            <Grid item className="header">
                                <Grid item className="header-modal">
                                    <h6>{discussion.title}</h6>
                                    <Button className="left-btn my-btn">
                                        SHOW RELEVANT COURSES
                                    </Button>
                                </Grid>
                                <Grid item className="created-at">
                                    <span>
                                        {dateCreated.toUTCString()}
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
                                {discussion.tags.map(
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
                        {discussion.answers.topAnswers.length ? (
                            discussion.answers.topAnswers.map((item, index) => {
                                if (item._id != selected.newAnswer?._id) {
                                    return <DiscussionAnswer key={index} data={item} discussionId={discussion._id} canVoteAnswer={canVoteAnswer} />;
                                }
                            })
                        ) : (
                            <div className="no-answer">No answer yet!</div>
                        )}
                        {query.page <= Math.ceil(total/query.limit) && (
                            <Grid item className="get-more-answers-btn" onClick={showMoreAnswers}>
                                Show more answers 
                                {answerLoading && (
                                    <CircularProgress
                                        thickness={3}
                                        size="1rem"
                                        className="circular-progress-bar"
                                    />
                                )}
                            </Grid>
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
