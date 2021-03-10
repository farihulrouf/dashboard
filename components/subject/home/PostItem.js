import {
    Grid,
    Button,
    TextareaAutosize,
    Popper,
    Paper,
    IconButton,
} from "@material-ui/core";
import {
    ThumbUp,
    Send,
    Description,
    Comment,
    Share,
    MoreVert,
    AssessmentOutlined,
    AnnouncementOutlined,
    ClassOutlined,
    AttachFile,
    GetApp,
    Update,
} from "@material-ui/icons";
import { likeAPost, postComment } from "../../../lib/api";
import CommentItem from "./CommentItem";
import PostForm from "./PostForm";
// import MathJax from "mathjax3-react";
import MathJax from "react-mathjax-preview";
import Router from "next/router";
import React, { useState, useEffect, useRef } from "react";

const PostItem = (props) => {
    // const [showComment, setShowComment] = useState(false);
    const [data, setData] = useState(props.data);
    const [comment, setComment] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [readMore, setReadMore] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popper" : undefined;

    const showCommentBox = (event) => {
        setShowComment(!showComment);
    };

    const postCallback = (data) => {
        setComment("");
        setData(data);
    };

    const onEditClick = () => {
        setEditMode(true);
    };

    const closeEdit = () => {
        setEditMode(false);
        setAnchorEl(null);
    };

    const onPostUpdated = (post) => {
        setData(post);
        setAnchorEl(null);
        setEditMode(false);
    };

    const formatDate = (date) => {
        return date.slice(0, 19).replace("T", " at ");
    };

    useEffect(() => {
        setData(props.data);
    }, [props.data]);
    
    const { auth } = props;
    
    const onDownloadAll = async (postId) =>{
        window.open(`archive/${postId}.zip`)
    }

    return (
        <Grid className="post-box" id={props.data._id}>
            {!editMode && (
                <React.Fragment>
                    <Grid item className="post-header">
                        <Grid container className="title-container">
                            <Grid item>
                                {data.category == "Announcement" && (
                                    <AnnouncementOutlined />
                                )}
                                {data.category == "Materials" && (
                                    <ClassOutlined />
                                )}
                                {data.category == "Exam" && (
                                    <AssessmentOutlined />
                                )}
                            </Grid>
                            <Grid item className="title">
                                <h5>
                                    <a
                                        onClick={() =>
                                            Router.push({
                                                pathname: "posts",
                                                query: { id: data._id },
                                            })
                                        }
                                    >
                                        {data.title}
                                    </a>
                                </h5>
                                <p>{`${data.postedBy.name} - ${formatDate(
                                    data.createdAt
                                )}`}</p>
                            </Grid>
                        </Grid>
                        <Grid item>
                            {data.owned && (
                                <Grid item>
                                    <Button
                                        color="primary"
                                        onClick={handleClick}
                                    >
                                        <MoreVert />
                                    </Button>
                                    <Popper
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        placement="left-start"
                                    >
                                        <Paper className="edit-course">
                                            <Button
                                                variant="contained"
                                                onClick={onEditClick}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                value={data._id}
                                                onClick={props.openDeleteDialog}
                                            >
                                                Delete
                                            </Button>
                                        </Paper>
                                    </Popper>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    <hr />
                    <Grid item className="post-body">
                        {readMore ? (
                            <MathJax math={data.body} />
                        ) : (
                            <MathJax
                                math={
                                    data.body.length > 1000
                                        ? `${data.body.slice(0, 1000)}`
                                        : data.body
                                }
                            />
                        )}

                        {data.body.length > 1000 ? (
                            <a
                                href={`#${props.data._id}`}
                                className="read-less"
                                onClick={() => {
                                    setReadMore(!readMore);
                                }}
                            >
                                {readMore ? `...Read Less` : `...Read More`}
                            </a>
                        ) : null}
                    </Grid>
                    <hr />
                    <Grid item className="post-middle">
                        <Grid item className="attachment">
                            <Grid item className="attachment-number">
                                <AttachFile />
                                <span>
                                    {data.attachments.length
                                        ? `${
                                              data.attachments.length
                                          } attachment${
                                              data.attachments.length > 1
                                          }`
                                        : "No attachments available"}
                                </span>
                            </Grid>
                            {data.attachments.length > 0 && (
                                <Grid item className="download">
                                    <GetApp />
                                    <span onClick={() => onDownloadAll(props.data._id)}>Download All Attachment</span>
                                </Grid>
                            )}
                        </Grid>
                        {data.attachments.map((e, idx) => (
                            <Grid key={e._id} item>
                                <a
                                    href={`/files/${encodeURIComponent(e.key)}`}
                                    className="attached-file"
                                >
                                    {" "}
                                    <Description />
                                    <p>{e.name}</p>
                                </a>
                            </Grid>
                        ))}
                    </Grid>
                </React.Fragment>
            )}
            {editMode && (
                <div>
                    <PostForm
                        post={data}
                        auth={auth}
                        callback={onPostUpdated}
                        closeDialog={closeEdit}
                    />
                    <Grid item className="edit-btn-container">
                        <Grid
                            item
                            onClick={() => closeEdit()}
                            className="exit-edit"
                        >
                            Exit Edit Mode
                        </Grid>
                    </Grid>
                </div>
            )}
            <Grid container className="post-comment">
                <Grid item>
                    <IconButton
                        onClick={likeAPost(data._id, setData)}
                        className="icon"
                    >
                        {!data.isLike ? (
                            <ThumbUp />
                        ) : (
                            <ThumbUp className="purple" />
                        )}
                        <span
                            className={data.isLike === true ? "purple" : ""}
                        >{`${data.likes.total} like${
                            data.likes.total !== 1 ? "s" : ""
                        }`}</span>
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton
                        color="primary"
                        onClick={showCommentBox}
                        className="icon"
                    >
                        <Comment />
                        <span>{`${data.comments.total} comment${
                            data.comments.total !== 1 ? "s" : ""
                        }`}</span>
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton color="primary" className="icon">
                        <Share />
                        <span>share</span>
                    </IconButton>
                </Grid>
            </Grid>
            <Grid container className="comment-container">
                {data.comments.listComments.map((value) => (
                    <CommentItem key={value._id} data={value} />
                ))}
            </Grid>

            <Grid item className="comment-input-box">
                <TextareaAutosize
                    placeholder="Write your comments"
                    // multiline="true"
                    rowsMin={2}
                    rowsMax={10}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Grid
                    item
                    className="send-btn"
                    onClick={postComment(
                        { postId: data._id, comment: comment },
                        postCallback
                    )}
                >
                    <Send />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default PostItem;
