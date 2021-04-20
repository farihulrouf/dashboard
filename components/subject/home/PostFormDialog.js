import React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import PostForm from './PostForm';

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
      <Dialog disableEnforceFocus={true} className="create-post" open={open} onClose={() => onClosePostForm("showPostForm")} fullWidth={true} maxWidth='md' aria-labelledby="form-dialog-title" >
        <DialogContent>
          <PostForm courseId={courseId} callback={callback} auth={auth} open={open} closeDialog={() => onClosePostForm("showPostForm")} wrsReady={open} />
        </DialogContent>
      </Dialog>
    )
  }
}

export default PostFormDialog;