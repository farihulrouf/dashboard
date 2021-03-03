import React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import PostForm from './home/PostForm';

class PostFormDialog extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      open: props.open
    }
  };

  render(){
    const {open, courseId, callback, auth, onClosePostForm} = this.props;
    return(
      <Dialog className="create-post" open={open} onClose={onClosePostForm} fullWidth={true} maxWidth='md' aria-labelledby="form-dialog-title" >
        <DialogContent>
          <PostForm courseId={courseId} callback={callback} auth={auth} open={open} closeDialog={onClosePostForm}/>
        </DialogContent>
      </Dialog>
    )
  }
}

export default PostFormDialog;