import React from 'react';
import {
  Button, Avatar, TextField, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Input
} from '@material-ui/core';
import {Editor} from "@tinymce/tinymce-react";
import TagsForm from "./TagsForm";
import {createCourseDiscussion} from "../../../lib/api";

export default function DiscussionForm(props) {
  const [open, setOpen] = React.useState(props.open);
  const [discussion, setDiscussion] = React.useState({postedOn: props.courseId});
  const {user} = props.auth;

  React.useEffect(()=>{
      setOpen(props.open);
  },[props.open])

  const onValueChange = (event) => {
    const {id, value} = event.currentTarget;
    const newDiscussion = {...discussion, [id]: value};
    setDiscussion(newDiscussion);
  }

  const handleEditorChange = (content,editor) => {
    const newDiscussion = {...discussion, [editor.id]: content}
    setDiscussion(newDiscussion);
  }

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
            <TextField id="title" onChange={onValueChange} fullWidth size="small" placeholder="What's your question? Be specific..." variant="outlined" />
          </div>
          <div style={{marginBottom: 10}}>
            <h3 style={{margin: 0}}>Body</h3>
            <p style={{margin: 0}}>Include all the information someone would need to answer your question</p>
            <Editor
            id="body"
            onEditorChange={handleEditorChange}
            init={{
              placeholder: "Write a discussion.....",
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
          <Button onClick={() => createCourseDiscussion(discussion)} color="primary">
            Create A Discussion
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
