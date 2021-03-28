import React from "react";
import { IconButton, Popper, Paper, Button } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import DiscussionForm from "./DiscussionForm";

class DiscussionItemMore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            discussion_id: this.props.discussion._id,
            openEditor: false,
        };
    }

    handleClick = (event) => {
        this.setState({
            anchorEl: this.state.anchorEl ? null : event.currentTarget,
        });
    };

    showEditMode = () => {
        this.setState({ openEditor: true });
    };

    closeDiscussionForm = () => {
        this.setState({ openEditor: false });
    };

    render() {
        const { anchorEl, openEditor, discussion_id } = this.state;
        const open = anchorEl;
        const id = open ? 'simple-popper' : undefined;
        const {canEdit, canDelete, deleteDiscussion} = this.props;

        return(
            <React.Fragment>
                <DiscussionForm
                    auth={this.props.auth}
                    closeDiscussionForm={this.closeDiscussionForm}
                    afterUpdateDiscussion={this.props.afterUpdateDiscussion}
                    open={openEditor}
                    discussion={this.props.discussion}
                />
                <IconButton
                    onClick={this.handleClick}
                    style={{ position: "absolute", right: 0 }}
                >
                    <MoreVert />
                    <Popper
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        placement="left-start"
                    >
                        <Paper className="edit-discussion">
                            {canEdit && (
                                <Button
                                    variant="outlined"
                                    style={{ background: "white" }}
                                    onClick={this.showEditMode}
                                >
                                    Edit
                                </Button>
                            )}
                            {canDelete && (
                                <Button
                                    variant="outlined"
                                    style={{ background: "white" }}
                                    value={-1}
                                    onClick={() => deleteDiscussion(discussion_id)}
                                >
                                    Delete
                                </Button>
                            )}
                        </Paper>
                    </Popper>
                </IconButton>
            </React.Fragment>
        );
    }
}

export default DiscussionItemMore;
