import React from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Avatar} from '@material-ui/core';
import PostForm from './home/PostForm';

class PostFormDialog extends React.Component{
  constructor(props){
    super(props);
  };

  render(){
    const {open, courseId, callback, auth, onClosePostForm} = this.props;
    return(
      <Dialog open={open} onClose={onClosePostForm} fullWidth={true} maxWidth='md' aria-labelledby="form-dialog-title" >
        <DialogTitle id="form-dialog-title">
          <Grid container style={{marginBottom: 20}}>
              <Grid item style={{marginRight: 10}}>
                  <Avatar style={{width: 30, height: 30}} alt={auth.user.name} src={auth.user.avatar} />
              </Grid>
              <Grid item>
                  <Grid container style={{fontSize: 20}}><b>{auth.user.name}</b></Grid>
              </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <PostForm courseId={courseId} callback={callback} />
        </DialogContent>
      </Dialog>
    )
  }
}

export default PostFormDialog;