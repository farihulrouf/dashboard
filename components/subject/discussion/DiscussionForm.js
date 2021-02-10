import React from 'react';
import {
  Button, Avatar, TextField, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Input
} from '@material-ui/core';
import {Editor} from "@tinymce/tinymce-react";
import TagsForm from "./TagsForm";

export default function DiscussionForm(props) {
  const [open, setOpen] = React.useState(props.open);
  const {user} = props.auth;

  React.useEffect(()=>{
      setOpen(props.open);
  },[props.open])

  return (
    <div>
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <div style={{display: 'flex'}}>
            <Avatar src={user.avatar} style={{marginRight: 20}}/><div styles={{display: 'flex', flexGrow: 1}}>{user.name}</div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div style={{marginBottom: 10}}>
            <h3 style={{margin: 0}}>Title</h3>
            <p style={{margin: 0}}>Be specific and imagine you’re asking a question to another person</p>
            <TextField fullWidth size="small" placeholder="What's your question? Be specific..." variant="outlined" />
          </div>
          <div style={{marginBottom: 10}}>
            <h3 style={{margin: 0}}>Body</h3>
            <p style={{margin: 0}}>Include all the information someone would need to answer your question</p>
            <Editor
            initialValue="<span style='color: #C5CCD0'>Write a discussion...</span>" 
            init={{
              menubar: false,
              external_plugins: { 'tiny_mce_wiris' : '/static/js/plugin.min.js'},
              toolbar:  'tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry| \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | table | image | help'
            }}
            />
          </div>
          <div>
            <h3 style={{margin: 0}}>Tags</h3>
            <p style={{margin: 0}}>Add up to 5 tags to describe what your question is about</p>
            <TagsForm />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeDiscussionForm} color="primary">
            Cancel
          </Button>
          <Button onClick={props.closeDiscussionForm} color="primary">
            Create A Discussion
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
