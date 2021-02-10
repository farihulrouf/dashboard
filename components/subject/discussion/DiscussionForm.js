import React from 'react';
import {
  Button, Avatar, TextField, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Input
} from '@material-ui/core';
import {Editor} from "@tinymce/tinymce-react";
import TagsForm from "./TagsForm";
import {createCourseDiscussion, updateCourseDiscussion} from "../../../lib/api";

export default function DiscussionForm(props) {
  const [open, setOpen] = React.useState(props.open);
  const [discussion, setDiscussion] = React.useState(!!props.courseId ? {postedOn: props.courseId} : props.discussion);
  const [errors, setErrors] = React.useState({})
  // const {user} = props.auth;
  const {afterCreateDiscussion, afterUpdateDiscussion, closeDiscussionForm} = props;

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

  const onCreateClick = () => {
    createCourseDiscussion(discussion)
      .then(res => {
        afterCreateDiscussion(res.discussions);
      })
      .catch(err => {
        const {data} = err.response;
        let errors = {}
        data.message.forEach((e) => errors[e.param] = e.msg)
        setErrors(errors);
      })
  }

  const onUpdateClick = () => {
    updateCourseDiscussion(discussion)
      .then(res => {
        closeDiscussionForm();
        afterUpdateDiscussion(res.discussion)
      })
      .catch(err => {
        const {data} = err.response;
        let errors = {}
        data.message.forEach((e) => errors[e.param] = e.msg)
        setErrors(errors);
      })
  }

  return (
    <div>
      <Dialog open={open} aria-labelledby="form-dialog-title">
        {/* <DialogTitle id="form-dialog-title">
          <div style={{display: 'flex'}}>
            <Avatar src={user.avatar} style={{marginRight: 20}}/><div styles={{display: 'flex', flexGrow: 1}}>{user.name}</div>
          </div>
        </DialogTitle> */}
        <DialogContent>
          <div style={{marginBottom: 10}}>
            <h3 style={{margin: 0}}>Title</h3>
            <p style={{margin: 0}}>Be specific and imagine you’re asking a question to another person</p>
            <TextField id="title" value={discussion.title} onChange={onValueChange} fullWidth size="small" placeholder="What's your question? Be specific..." variant="outlined" />
            {errors.title && <span style={{color: 'red'}}>{errors.title}</span>}
          </div>
          <div style={{marginBottom: 10}}>
            <h3 style={{margin: 0}}>Body</h3>
            <p style={{margin: 0}}>Include all the information someone would need to answer your question</p>
            <Editor
            id="body"
            onEditorChange={handleEditorChange}
            initialValue={discussion.body}
            init={{
              placeholder: "Write a discussion.....",
              menubar: false,
              external_plugins: { 'tiny_mce_wiris' : '/static/js/plugin.min.js'},
              toolbar:  'tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry| \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | table | image | help'
            }}
            />
            {errors.body && <span style={{color: 'red'}}>{errors.body}</span>}
          </div>
          <div>
            <h3 style={{margin: 0}}>Tags</h3>
            <p style={{margin: 0}}>Add up to 5 tags to describe what your question is about</p>
            <TagsForm />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDiscussionForm} color="primary">
            Cancel
          </Button>
          <Button onClick={!!discussion._id ? onUpdateClick : onCreateClick} color="primary">
            {!!discussion._id ? "Update Discussion" : "Create Discussion"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
