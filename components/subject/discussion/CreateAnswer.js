import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button, IconButton } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { createDiscussionAnswer } from "../../../lib/api";
import MathJax from "react-mathjax-preview";
import DiscussionAnswer from "./DiscussionAnswer";

class CreateAnswer extends React.Component {
    constructor(props) {
        super(props);
        const initAnswer = { discussionId: props.discussionId };
        this.state = { loading: false, answer: initAnswer };
        this.createAnswer = this.createAnswer.bind(this);
    }

    handleEditorChange = (content, editor) => {
        const newAns = { ...this.state.answer, [editor.id]: content };
        console.log(newAns);
        this.setState({ answer: newAns });
    };

    createAnswer = () => {
        const { afterCreateAnswer } = this.props;
        const { answer } = this.state;
        console.log(answer);
        createDiscussionAnswer(answer)
            .then((res) => {
                console.log(res);
                afterCreateAnswer(res.discussion);
            })
            .catch((err) => console.log(err));
    };

    render() {
        const { createdAnswer } = this.props;
        return (
            <div>
                {!!createdAnswer && <DiscussionAnswer data={createdAnswer} />}
                {!createdAnswer && <div className="editor">
                    <Editor
                        onEditorChange={this.handleEditorChange}
                        initialValue=""
                        id="body"
                        init={{
                            height: 160,
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
                        value={this.state.answer.body}
                        apiKey={process.env.TINYMCE_APIKEY}
                    />
                    <Button
                        className="my-btn post-answer-btn"
                        onClick={this.createAnswer}
                        fullWidth
                        variant="outlined"
                        color="primary"
                    >
                        Post Answer
                    </Button>
                </div>}
            </div>
        );
    }
}

export default CreateAnswer;
