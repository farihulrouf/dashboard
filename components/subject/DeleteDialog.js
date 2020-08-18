import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class DeleteDialog extends React.Component{
    
    constructor(props){
        super(props);
        this.checkDelete = this.checkDelete.bind(this);
        this.state = {type: ""};
    }

    componentWillReceiveProps(){
        const toType = Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 4);
        this.setState({toType: toType})
    }

    checkDelete(){
        const {toType, type} = this.state;
        if(toType == type){
            this.props.onDelete()
        }else{
            alert("You type wrong string")
        }
    }

    render(){
        const {open, handleClose, onDelete} = this.props;
        return (
            <div>
              <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Delete Post</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please type <b><i>{this.state.toType}</i></b> to delete Post
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Keyword"
                    type="password"
                    fullWidth
                    onChange={(event)=>this.setState({type: event.target.value})}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.checkDelete} color="primary">
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          );
    }
}