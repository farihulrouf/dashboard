import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button, IconButton } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { createDiscussionAnswer } from "../../../lib/api";
import MathJax from "react-mathjax-preview";

class CreateAnswer extends React.Component {
    constructor(props) {
        super(props);
        const initAnswer = { discussionId: props.discussionId };
        this.state = { loading: false, answer: initAnswer };
        this.createAnswer = this.createAnswer.bind(this);
    }

    handleEditorChange = (content, editor) => {
        this.setState({ answer: { ...this.state.answer, body: content } });
    };

    createAnswer = () => {
        const { afterCreateAnswer } = this.props;
        const { answer } = this.state;
        createDiscussionAnswer(answer)
            .then((res) => afterCreateAnswer(res.discussion))
            .catch((err) => console.log(err));
    };

    render() {
        const { createdAnswer } = this.props;
        return (
            <div>
                {!createdAnswer && (
                    <div className="editor">
                        <Editor
                            onChange={this.handleEditorChange}
                            initialValue=""
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
                        />
                        <Button
                            onClick={this.createAnswer}
                            style={{ marginTop: 10 }}
                            fullWidth
                            variant="outlined"
                            color="primary"
                        >
                            Post Answer
                        </Button>
                    </div>
                )}
                {!!createdAnswer && (
                    <React.Fragment>
                        <div
                            style={{
                                backgroundColor: "#F6F8FB",
                                position: "relative",
                            }}
                        >
                            <IconButton
                                style={{ position: "absolute", right: 0 }}
                            >
                                <MoreVert />
                            </IconButton>
                            <div style={{ padding: 20 }}>
                                <MathJax math={createdAnswer.body} />
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    }
}

export default CreateAnswer;
