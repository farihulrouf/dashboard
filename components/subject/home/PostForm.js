import {
    FormControl,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
} from "@material-ui/core";
import {
    Attachment,
    Clear,
    Description,
    Add,
    Update,
} from "@material-ui/icons";
import { Editor } from "@tinymce/tinymce-react";
import {
    createCoursePost,
    generatePutUrl,
    uploadToS3,
    updatePost,
} from "../../../lib/api";
import Avatar from '../../Avatar'
import axios from "axios";
import React from "react";

class Attachments extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data, removeFile } = this.props;
        return (
            <List dense={true} className="uploaded-attachment">
                {data.map((e, idx) => (
                    <ListItem key={idx} className="uploaded-attachment-item">
                        <ListItemAvatar>
                            <Avatar>
                                <Description />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={e.name}
                            secondary={`${parseInt(
                                e.size / 1000
                            )} kb || upload progress: ${e.progress}%`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                onClick={() => removeFile(idx)}
                                edge="end"
                                aria-label="delete"
                            >
                                <Clear />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        );
    }
}

class PostForm extends React.Component {
    constructor(props) {
        super(props);

        const { _id, title, body, category, attachments } = props.post || {};
        this.state = {
            newPost: {
                _id: _id || null,
                title: title || "",
                body: body || "",
                category: category || "",
                attachments: (attachments || []).map((e) => {
                    e.progress = 100;
                    return e;
                }),
            },
            createStatus: true,
        };
        this.onTextChange = this.onTextChange.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.progressCallback = this.progressCallback.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    removeFile(e) {
        let { attachments } = this.state.newPost;
        if (!attachments[e]._id)
            attachments[e].source.cancel(`${attachments[e].name} is removed`);
        attachments.splice(e, 1);
        this.setState({ newPost: this.state.newPost });
    }

    progressCallback(file) {
        const _this = this;
        return function (completed) {
            let attachments = _this.state.newPost.attachments;
            let targetFile = attachments.find((e) => e.name == file.name);
            if (!!targetFile) {
                targetFile.progress = completed;
                let createStatus = attachments.reduce((acc, current) => {
                    return acc && current.progress == 100;
                }, true);
                _this.setState({
                    newPost: _this.state.newPost,
                    createStatus: createStatus,
                });
            }
        };
    }

    uploadImage = async (blobInfo, success, failure) => {
        try {
            let file = blobInfo.blob();
            let response = await generatePutUrl(file);
            if (response.status == "ok") {
                const { url, key } = response.file;
                file.url = url;
                file.key = key;
                file.source = axios.CancelToken.source();
                response = await uploadToS3(file, this.progressCallback(file));
                success(`/files/${encodeURIComponent(file.key)}`);
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert(error);
        }
    };

    onTextChange(e) {
        this.state.newPost[e.target.name] = e.target.value;
        this.setState({ newPost: this.state.newPost });
    }

    handleEditorChange(content, editor) {
        this.state.newPost.body = content;
        this.setState({ newPost: this.state.newPost });
    }

    onFileChange(e) {
        let newFiles = Array.from(e.target.files);
        let { newPost } = this.state;
        newPost.attachments = newPost.attachments.concat(newFiles);
        this.setState({ newPost: newPost });
        newFiles.forEach(async (file) => {
            let response = await generatePutUrl(file);
            if (response.status == "ok") {
                const { url, key } = response.file;
                file.url = url;
                file.key = key;
                file.source = axios.CancelToken.source();
                response = await uploadToS3(file, this.progressCallback(file));
            } else {
                alert(response.message);
            }
        });
    }

    onSubmit = (e, courseId) => {
        e.preventDefault();
        let { newPost } = this.state;
        let { callback, closeDialog } = this.props;

        if (newPost._id) {
            //Post have id must be updated
            updatePost(newPost).then((data) => {
                callback(data.post);
            });
        } else {
            //New post
            createCoursePost(courseId, newPost).then((result) => {
                this.setState({
                    newPost: {
                        title: "",
                        body: "",
                        category: "",
                        attachments: [],
                    },
                });
                //Reload post with current query
                callback(result.posts);
            });
        }

        closeDialog();
    };

    componentDidUpdate(prev) {
        if (this.props.wrsReady !== prev.wrsReady) {
            let wrs = document.querySelectorAll(".wrs_stack");

            if (wrs) {
                for (let item of wrs) {
                    item.parentNode.removeChild(item);
                }
            }
        }
    }

    render() {
        const { newPost } = this.state;
        const { auth } = this.props;

        return (
            <form onSubmit={(e) => this.onSubmit(e, this.props.courseId)}>
                <FormControl className="form-control">
                    <TextField
                        onChange={this.onTextChange}
                        name="title"
                        value={newPost.title}
                        id="outlined-basic"
                        variant="outlined"
                        label="Title"
                    />
                </FormControl>
                <FormControl variant="outlined" className="form-control">
                    <InputLabel id="demo-simple-select-outlined-label">
                        Category
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={newPost.category}
                        onChange={this.onTextChange}
                        label="Category"
                        name="category"
                    >
                        <MenuItem value={"Announcement"}>Berita</MenuItem>
                        <MenuItem value={"Materials"}>Materi</MenuItem>
                        <MenuItem value={"Exam"}>Ujian</MenuItem>
                    </Select>
                </FormControl>
                <Editor
                    className="editor"
                    initialValue=""
                    init={{
                        height: 225,
                        menubar: true,
                        file_picker_types: "file image media",
                        images_upload_handler: this.uploadImage,
                        external_plugins: {
                            tiny_mce_wiris: "/js/plugin.min.js",
                        },
                        plugins: [
                            "codesample",
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste table code help image wordcount",
                        ],
                        toolbar:
                            "codesample | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry| undo redo | formatselect | bold italic backcolor |  alignleft aligncenter alignright alignjustify |  bullist numlist outdent indent | removeformat | table | image | help",
                        toolbar_mode: "sliding",
                    }}
                    value={newPost.body}
                    onEditorChange={this.handleEditorChange}
                    apiKey={process.env.TINYMCE_APIKEY}
                />
                <Attachments
                    removeFile={this.removeFile.bind(this)}
                    data={newPost.attachments}
                />
                <label htmlFor={`files/${newPost._id ? newPost._id : ""}`}>
                    <input
                        style={{
                            display: "none",
                        }}
                        value=""
                        id={`files/${newPost._id ? newPost._id : ""}`}
                        type="file"
                        name="files"
                        onChange={this.onFileChange}
                        multiple
                    />
                </label>
                <Grid container className="form-foot">
                    <Grid container className="left-foot">
                        <Grid item className="creator-avatar">
                            <Avatar
                                name={auth.user.name}
                                imgUrl={auth.user.avatar}
                            />
                        </Grid>
                        <Grid item>
                            <Grid container>{auth.user.name}</Grid>
                        </Grid>
                    </Grid>
                    <Grid item className="right-foot">
                        <label
                            htmlFor={`files/${newPost._id ? newPost._id : ""}`}
                        >
                            <input
                                style={{ display: "none" }}
                                value=""
                                id={`files/${newPost._id ? newPost._id : ""}`}
                                type="file"
                                name="files"
                                onChange={this.onFileChange}
                                multiple
                            />
                            <Button
                                color="primary"
                                size="small"
                                component="span"
                                aria-label="add"
                                variant="outlined"
                                className="attachment-btn"
                            >
                                <Attachment />
                                Add Attachments
                            </Button>
                        </label>
                        {!!this.state.createStatus && (
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className="create-post-btn mybtn"
                            >
                                {this.props.post ? (
                                    <span>
                                        <Update />
                                        Update
                                    </span>
                                ) : (
                                    <span>
                                        <Add />
                                        Post
                                    </span>
                                )}
                            </Button>
                        )}
                        {!this.state.createStatus && (
                            <Button
                                disabled
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                {this.props.post ? (
                                    <span>
                                        <Update />
                                        Update
                                    </span>
                                ) : (
                                    <span>
                                        <Add />
                                        Post
                                    </span>
                                )}
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </form>
        );
    }
}

export default PostForm;
