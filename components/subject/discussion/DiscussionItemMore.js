import React from "react";
import {IconButton, Popper, ButtonGroup, Button} from "@material-ui/core";
import {MoreVert} from "@material-ui/icons";
import DiscussionForm from "./DiscussionForm";

class DiscussionItemMore extends React.Component{
    constructor(props){
        super(props)
        this.state={
            anchorEl: null, 
            id: undefined, 
            openEditor: false
        }
    }

    handleClick = (event) => {
        this.setState({anchorEl: this.state.anchorEl ? null : event.currentTarget})
    }

    showEditMode = () => {
        this.setState({openEditor: true})
    }

    closeDiscussionForm = () => {
        this.setState({openEditor: false})
    }

    render(){
        const {anchorEl, openEditor, discussion} = this.state;
        const open = anchorEl;
        const id = open ? 'simple-popper' : undefined;
        const {canEdit, canDelete} = this.props;
        return(
            <React.Fragment>
                <DiscussionForm
                    auth={this.props.auth} 
                    closeDiscussionForm={this.closeDiscussionForm} 
                    afterUpdateDiscussion={this.props.afterUpdateDiscussion}
                    open={openEditor}
                    discussion={this.props.discussion}
                />
                <IconButton onClick={this.handleClick} style={{position: 'absolute', right: 0}}>
                    <MoreVert />
                    <Popper id={this.id} open={open} anchorEl={anchorEl}>
                        <ButtonGroup
                            orientation="vertical"
                            color="primary"
                            aria-label="vertical outlined primary button group"
                            style={{marginRight: 50}}
                        >
                            {canEdit && <Button variant="outlined" style={{background: 'white'}} onClick={this.showEditMode}>Edit</Button>}
                            {canDelete && <Button variant="outlined" style={{background: 'white'}} value={-1} onClick={() => alert("open delete dialog")}>Delete</Button>}
                        </ButtonGroup>
                    </Popper>
                </IconButton>
            </React.Fragment>
        )
    }
}

export default DiscussionItemMore;