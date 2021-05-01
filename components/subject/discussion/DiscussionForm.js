import React from "react";
import {
    Button,
    Grid,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
} from "@material-ui/core";
import {
    Attachment,
    Clear,
    Description,
    Add,
    Update,
} from "@material-ui/icons";
import { Editor } from "@tinymce/tinymce-react";
import TagsForm from "./TagsForm";
import {
    createCourseDiscussion,
    updateCourseDiscussion,
} from "../../../lib/api";

export default function DiscussionForm(props) {
    const [open, setOpen] = React.useState(props.open);
    const [discussion, setDiscussion] = React.useState(
        !!props.courseId ? { postedOn: props.courseId } : props.discussion
    );
    const [errors, setErrors] = React.useState({});
    const [tags, setTags] = React.useState(props.discussion ? props.discussion.tag.map((val) => val.name) : []);
    // const {user} = props.auth;
    const {
        afterCreateDiscussion,
        afterUpdateDiscussion,
        closeDiscussionForm,
    } = props;

    React.useEffect(() => {
        setOpen(props.open);
        let wrs = document.querySelectorAll(".wrs_stack");

        if (wrs) {
            for (let item of wrs) {
                item.parentNode.removeChild(item);
            }
        }
    }, [props.open]);

    const onValueChange = (event) => {
        const { id, value } = event.currentTarget;
        const newDiscussion = { ...discussion, [id]: value };
        setDiscussion(newDiscussion);
    };

    const handleEditorChange = (content, editor) => {
        const newDiscussion = { ...discussion, [editor.id]: content };
        console.log(newDiscussion)
        setDiscussion(newDiscussion);
    };

    const onCreateClick = () => {
        const newDis = {...discussion, tag: tags}
        console.log(newDis);
        createCourseDiscussion(newDis)
            .then((res) => {
                afterCreateDiscussion(res.discussions);
            })
            .catch((err) => {
                const { data } = err.response;
                let errors = {};
                console.log(data)
                // data.message.forEach((e) => (errors[e.param] = e.msg));
                // setErrors(errors);
            });
    };

    const onUpdateClick = () => {
        const newDis = {...discussion, tag: tags}
        console.log(newDis);
        updateCourseDiscussion(newDis)
            .then((res) => {
                console.log(res)
                closeDiscussionForm();
                afterUpdateDiscussion(res.discussion);
            })
            .catch((err) => {
                const { data } = err.response;
                let errors = {};
                data.message.forEach((e) => (errors[e.param] = e.msg));
                setErrors(errors);
            });
    };

    const getAvailableTags = () => {
        return;
    };

    const uploadImage = async (blobInfo, success, failure) => {
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

    return (
        <div>
            <Dialog
                className="create-post discussion-post"
                open={open}
                aria-labelledby="form-dialog-title"
                onClose={closeDiscussionForm}
            >
                <DialogContent>
                    <div>
                        <FormControl className="form-control">
                            <TextField
                                onChange={onValueChange}
                                name="title"
                                value={discussion.title}
                                id="title"
                                variant="outlined"
                                label="Title"
                            />
                        </FormControl>
                        {errors.title && (
                            <span style={{ color: "red" }}>{errors.title}</span>
                        )}
                    </div>

                    <Editor
                        className="editor"
                        initialValue=""
                        id="body"
                        init={{
                            height: 225,
                            menubar: true,
                            file_picker_types: "file image media",
                            images_upload_handler: uploadImage,
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
                        value={discussion.body}
                        onEditorChange={handleEditorChange}
                        apiKey={process.env.TINYMCE_APIKEY}
                    />
                    {errors.body && (
                        <span style={{ color: "red" }}>{errors.body}</span>
                    )}

                    <div>
                        <TagsForm tags={tags} setTags={setTags} setErrors={setErrors}/>
                    </div>
                </DialogContent>
                <DialogActions className="form-foot">
                    <Grid item className="right-foot">
                        <Button
                            onClick={
                                !!discussion._id ? onUpdateClick : onCreateClick
                            }
                            className="create-post-btn mybtn"
                        >
                            {!!discussion._id ? (
                                <span>
                                    <Update /> Update
                                </span>
                            ) : (
                                <span>
                                    <Add /> Post
                                </span>
                            )}
                        </Button>
                    </Grid>
                </DialogActions>
            </Dialog>
        </div>
    );
}
