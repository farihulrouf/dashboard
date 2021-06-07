import React from "react";
import Avatar from "../../Avatar";
import {
    Grid,
    IconButton,
    Button,
    Paper,
    Popover,
    Tooltip,
} from "@material-ui/core";
import { voteAnswer } from "../../../lib/api";
import { MoreVert, ArrowDropUp, ArrowDropDown } from "@material-ui/icons";
import truncatise from "truncatise";
import MathJax from "react-mathjax-preview";

class DiscussionAnswer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            answer: this.props.data
        };
    }

    openPopper = (e) => {
        this.setState({
            anchorEl: this.state.anchorEl ? null : e.currentTarget,
        });
    };

    handleVoteAnswer = () => {
        const { discussionId, data } = this.props;
        const answerId = data._id;

        voteAnswer(discussionId, answerId).then(res => {
            this.setState({ answer: res.answer })
        })
    }

    render() {
        const { canVoteAnswer } = this.props;
        const { answer } = this.state;
        const open = Boolean(this.state.anchorEl);
        const id = open ? "simple-popper" : undefined;
        const date = new Date(answer.updatedAt);
        const name = answer.creator.name
            ? answer.creator.name.split(" ")[0]
            : "Unknown";

        const { isVoted } = answer;
        return (
            <Grid className="discussion-answer">
                <Grid item className="discussion-answer-left">
                    <Tooltip title={!canVoteAnswer ? "Unable to vote answer" : ""}>
                        <IconButton disabled={!canVoteAnswer} onClick={this.handleVoteAnswer}>
                            {!isVoted ? <ArrowDropUp /> : <ArrowDropDown className="is-voted"/>}
                        </IconButton>
                    </Tooltip>
                    <h3 className={isVoted && 'is-voted'}>{answer.votes.total ? answer.votes.total : "0"}</h3>
                    <span className={isVoted && 'is-voted'}>Votes</span>
                </Grid>
                <Grid item className="discussion-answer-right">
                    <Grid className="three-dots">
                        <Button color="primary" onClick={this.openPopper}>
                            <MoreVert />
                        </Button>
                        <Popover
                            id={id}
                            open={open}
                            className="discussion-answer-more-popover"
                            anchorEl={this.state.anchorEl}
                            onClose={this.openPopper}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <Paper className="popper-option">
                                <h6>Option</h6>
                                <Button className="edit" variant="contained">
                                    Edit
                                </Button>
                                <Button
                                    className="delete"
                                    variant="contained"
                                    value={answer._id}
                                >
                                    Delete
                                </Button>
                            </Paper>
                        </Popover>
                    </Grid>
                    <MathJax
                        className="discussion-answer-body"
                        math={truncatise(answer.body, { TruncateLength: 35 })}
                    />
                    <Grid item className="discussion-answer-creator">
                        <Grid item className="discussion-answer-creator-data">
                            <Grid
                                item
                                className="discussion-answer-creator-photo"
                            >
                                <Avatar
                                    name={answer.creator.name}
                                    imgUrl={answer.creator.avatar}
                                />
                            </Grid>
                            <Grid
                                item
                                className="discussion-answer-creator-profile"
                            >
                                <Grid
                                    item
                                    className="discussion-answer-creator-name"
                                >
                                    <h6>{name}</h6>
                                </Grid>
                                <Grid
                                    item
                                    className="discussion-answer-creator-role"
                                >
                                    {answer.creator.isAnInstructor
                                        ? "Instructor"
                                        : "Member"}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item className="discussion-answer-creator-date">
                            {date.toUTCString()}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default DiscussionAnswer;
