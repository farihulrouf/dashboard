import {FormControl, TextField, InputLabel, Select, MenuItem, Button, Grid, List,ListItem,ListItemAvatar,Avatar,ListItemText,
    ListItemSecondaryAction,IconButton} from "@material-ui/core";
import {Attachment, Clear, Description} from "@material-ui/icons"
import { Editor } from '@tinymce/tinymce-react';
import { createCoursePost, generatePutUrl, uploadToS3, updatePost} from '../../lib/api';
import axios from "axios";
import React from 'react';


class Attachments extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const {data,removeFile} = this.props
        return(
            <List dense={true} >
                {data.map((e,idx)=> (
                    <ListItem key={idx}>
                        <ListItemAvatar>
                        <Avatar>
                            <Description />
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                        primary={e.name}
                        secondary={`${parseInt(e.size/1000)} kb || upload progress: ${e.progress}%`}
                        />
                        <ListItemSecondaryAction>
                        <IconButton onClick={()=>removeFile(idx)} edge="end" aria-label="delete">
                            <Clear />
                        </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        )
    }
}

class PostForm extends React.Component{
    constructor(props){
        super(props);
        console.log(props);
        const {_id, title, body, category, attachments} = props.post || {};
        this.state = {
            newPost: {_id: (_id || null), title: (title || ""), body: (body || ""), category: (category || ""), attachments: (attachments || []).map(e=>{e.progress=100; return e})},
            createStatus: true
        }
        this.onTextChange = this.onTextChange.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.progressCallback = this.progressCallback.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    removeFile(e){
        let {attachments} = this.state.newPost;
        if(!attachments[e]._id) attachments[e].source.cancel(`${attachments[e].name} is removed`);
        attachments.splice(e,1);
        this.setState({newPost: this.state.newPost})
    }

    progressCallback(file){
        const _this = this;
        return function(completed){
            let attachments = _this.state.newPost.attachments;
            let targetFile = attachments.find((e)=>e.name == file.name)
            if(!!targetFile){
                targetFile.progress = completed;
                let createStatus = attachments.reduce((acc,current)=> {
                    return acc && (current.progress == 100)
                }, true)
                _this.setState({newPost: _this.state.newPost, createStatus: createStatus});
            }
        }
    }

    uploadImage = async (blobInfo,success,failure) => {
        try {
            let file = blobInfo.blob();
            let response = await generatePutUrl(file);
            if(response.status == "ok"){
                const {url, key} = response.file;
                file.url = url;
                file.key = key;
                file.source = axios.CancelToken.source();
                response = await uploadToS3(file,this.progressCallback(file));
                success(`/files/${encodeURIComponent(file.key)}`);
            }else{
                alert(response.message);
            }
        } catch (error) {
            alert(error);
        }
    }

    onTextChange(e) {
        this.state.newPost[e.target.name] = e.target.value;
        this.setState({newPost: this.state.newPost});
    }

    handleEditorChange(content,editor){
        this.state.newPost.body = content;
        this.setState({newPost: this.state.newPost})
    }

    onFileChange(e) {
        let newFiles = Array.from(e.target.files);
        let {newPost} = this.state
        newPost.attachments = newPost.attachments.concat(newFiles);
        this.setState({ newPost: newPost})
        newFiles.forEach(async (file) => {
            let response = await generatePutUrl(file)
            if(response.status == "ok"){
                const {url, key} = response.file;
                file.url = url;
                file.key = key;
                file.source = axios.CancelToken.source();
                response = await uploadToS3(file,this.progressCallback(file));
            }else{
                alert(response.message);
            }
        })
    }

    onSubmit = (e,courseId) => {
        e.preventDefault()
        let {newPost} = this.state;
        let {callback} = this.props;
        if(newPost._id){
            //Post have id must be updated
            updatePost(newPost).then(data=>{
                callback(data.post)
            })
        }else{
            //New post
            createCoursePost(courseId, newPost).then(result=>{
                this.setState({newPost: {title: "",body: "",category: "",attachments: []}})
                //Reload post with current query
                callback(result.posts);
            })
        }
    }

    render(){
        const {newPost} = this.state;
        // console.log(this.props);
        // console.log(newPost.attachments)
        return(
            <form onSubmit={(e)=> this.onSubmit(e,this.props.courseId)}>
                <FormControl style={{width: '100%', marginBottom: 20}}>
                    <TextField onChange={this.onTextChange} name="title" value={newPost.title} id="outlined-basic" label="Title" />
                </FormControl>
                <FormControl style={{width: '100%', marginBottom: 20}}>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={newPost.category}
                    name="category"
                    onChange={this.onTextChange}
                    >
                        <MenuItem value={"Announcement"}>Berita</MenuItem>
                        <MenuItem value={"Materials"}>Materi</MenuItem>
                        <MenuItem value={"Exam"}>Ujian</MenuItem>
                    </Select>
                </FormControl>
                <Editor
                    initialValue=""
                    init={{
                    height: 200,
                    menubar: false,
                    file_picker_types: "file image media",
                    images_upload_handler: this.uploadImage,
                    external_plugins: {
                        'tiny_mce_wiris' : '/static/js/plugin.min.js'
                    },
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste table code help image wordcount'
                    ],
                    toolbar:
                        'tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry| undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | table | image | help'
                    }}
                    value = {newPost.body}
                    onEditorChange={this.handleEditorChange}
                    apiKey={process.env.TINYMCE_APIKEY}
                />
                <Attachments removeFile={this.removeFile.bind(this)} data={newPost.attachments}/>
                <label htmlFor={`files/${newPost._id ? newPost._id : ''}`}>
                    <input style={{display: 'none'}} value="" id={`files/${newPost._id ? newPost._id : ''}`} type="file" name="files" onChange={this.onFileChange} multiple />
                    <Button
                        color="primary"
                        size="small"
                        component="span"
                        aria-label="add"
                        variant="outlined"
                        style={{marginTop: 20}}
                    >
                        <Attachment />Add Attachments
                    </Button>
                </label>
                <Grid container style={{justifyContent: 'flex-end'}}>
                    {!!this.state.createStatus && <Button type="submit" variant="contained" color="primary">
                        {this.props.post ? "Update Post" : "Create Post"}
                    </Button>}
                    {!this.state.createStatus && <Button disabled type="submit" variant="contained" color="primary">
                        {this.props.post ? "Update Post" : "Create Post"}
                    </Button>}
                </Grid>
            </form>
        )
    }
}

export default PostForm;