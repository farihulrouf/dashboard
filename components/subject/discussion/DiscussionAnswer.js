import React from "react";
import Avatar from "../../Avatar";
import { Grid, IconButton, Button, Paper, Popper } from "@material-ui/core";
import { MoreVert, ArrowDropUp } from "@material-ui/icons";
import truncatise from "truncatise";
import MathJax from "react-mathjax-preview";

class DiscussionAnswer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
    }

    openPopper = (e) => {
        this.setState({
            anchorEl: this.state.anchorEl ? null : e.currentTarget,
        });
    };

    render() {
        const { data } = this.props;
        console.log(data)
        const open = Boolean(this.state.anchorEl);
        const id = open ? "simple-popper" : undefined;
        const date = new Date(data.updatedAt);
        const name = data.creator.name  ? data.creator.name.split(" ")[0] : "Unknown";

        return (
            <Grid className="discussion-answer">
                <Grid item className="discussion-answer-left">
                    <IconButton>
                        <ArrowDropUp />
                    </IconButton>
                    <h3>{data.votes.total ? data.votes.total : "0"}</h3>
                    <span>Votes</span>
                </Grid>
                <Grid item className="discussion-answer-right">
                    <Grid className="three-dots">
                        <Button color="primary" onClick={this.openPopper}>
                            <MoreVert />
                        </Button>
                        <Popper
                            id={id}
                            open={open}
                            anchorEl={this.state.anchorEl}
                            placement="left-start"
                        >
                            <Paper className="popper-option">
                                <h6>Option</h6>
                                <Button className="edit" variant="contained">
                                    Edit
                                </Button>
                                <Button
                                    className="delete"
                                    variant="contained"
                                    value={data._id}
                                >
                                    Delete
                                </Button>
                            </Paper>
                        </Popper>
                    </Grid>
                    <MathJax
                        className="discussion-answer-body"
                        math={truncatise(data.body, { TruncateLength: 35 })}
                    />
                    <Grid item className="discussion-answer-creator">
                        <Grid item className="discussion-answer-creator-data">
                            <Grid
                                item
                                className="discussion-answer-creator-photo"
                            >
                                <Avatar
                                    name={data.creator.name}
                                    imgUrl={data.creator.avatar}
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
                                    {data.creator.isAnInstructor ? "Instructor" : "Member"}
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
