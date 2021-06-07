import {
    Grid,
    Button,
    TextareaAutosize,
    Popper,
    Paper,
    IconButton,
    CircularProgress
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
    Lock,
} from "@material-ui/icons";
import { likeAPost, postComment, getMoreComments } from "../../../lib/api";
import CommentItem from "./CommentItem";
import PostForm from "./PostForm";
// import MathJax from "mathjax3-react";
import MathJax from "react-mathjax-preview";
import Router from "next/router";
import React, { useState, useEffect, useRef } from "react";
import Prism from "prismjs";
//List all highlightable languages
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";

const PostItem = (props) => {
    const [data, setData] = useState(props.data);
    const [comment, setComment] = useState("");
    const [myComment, setMyComment] = useState([]);
    const [queryParams, setQuery] = useState({
        limit: 5,
        createdAt: data.comments.total ? data.comments.listComments[0].createdAt : null
    });
    const [avail, setAvail] = useState(data.comments.total != data.comments.listComments.length);
    const [commentLoading, setCommentLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [readMore, setReadMore] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popper" : undefined;

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

    const showMoreComment = () => {
        const { _id, comments } = data;
        if (!commentLoading) {
            setCommentLoading(true);
            getMoreComments(_id, queryParams).then(res => {
                setData(prev => ({ 
                    ...prev, 
                    comments: {
                        ...prev.comments,
                        listComments: [ ...res.comments, ...comments.listComments]
                    }  
                }));
                setAvail(res.avail);
                setCommentLoading(false);
                setQuery(prev => ({ ...prev, createdAt: res.comments[0].createdAt }));
            });
        }
    }

    const createComment = () => {
        postComment(data._id, comment).then(res => {
            const { total } = res.post.comments;
            setComment('');
            setData(prev => ({ 
                ...prev, 
                comments: {
                    ...prev.comments,
                    total
                }  
            }));
            setMyComment(prev => [...prev, res.comment]);
        })
    }

    useEffect(() => {
        setData(props.data);
        //Prism.highlightAll();
    }, [props.data, readMore]);

    const { auth, blur } = props;

    const onDownloadAll = async (postId) => {
        window.open(`archive/${postId}.zip`);
    };

    const { listComments, total } = data.comments;
    console.log('avail', avail);
    console.log('query', queryParams);

    return (
        <Grid
            className={blur ? "post-box blurred" : "post-box"}
            id={props.data._id}
        >
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
                    <Grid
                        item
                        className={blur ? "post-body limited" : "post-body"}
                    >
                        {readMore ? (
                            <MathJax
                                math={data.body}
                                onDisplay={() => Prism.highlightAll()}
                                sanitizeOptions={{
                                    USE_PROFILES: { html: true, mathMl: true },
                                    ADD_TAGS: ["iframe"],
                                    ADD_ATTR: ["allowfullscreen"],
                                }}
                            />
                        ) : (
                            // <div dangerouslySetInnerHTML={{__html: data.body}}></div>
                            <MathJax
                                math={
                                    data.body.length > 1000
                                        ? `${data.body.slice(0, 1000)}`
                                        : data.body
                                }
                                onDisplay={() => Prism.highlightAll()}
                                sanitizeOptions={{
                                    USE_PROFILES: { html: true, mathMl: true },
                                    ADD_TAGS: ["iframe"],
                                    ADD_ATTR: ["allowfullscreen"],
                                }}
                            />
                            // <div dangerouslySetInnerHTML={{__html: data.body}}></div>
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
                                    <span
                                        onClick={() =>
                                            onDownloadAll(props.data._id)
                                        }
                                    >
                                        Download All Attachment
                                    </span>
                                </Grid>
                            )}
                        </Grid>
                        <Grid className="attached-files" item>
                            {data.attachments.map((e, idx) => (
                                <a
                                    key={e.key}
                                    href={`/files/${encodeURIComponent(e.key)}`}
                                    className="attached-file"
                                >
                                    {" "}
                                    <Description />
                                    <p>{e.name}</p>
                                </a>
                            ))}
                        </Grid>
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
                {avail && (
                    <Grid item className="show-more-comment-btn" onClick={showMoreComment}>
                        Show more comments
                        {commentLoading &&  (
                            <CircularProgress
                                thickness={3}
                                size="1rem"
                                className="circular-progress-bar"
                            />
                        )}
                    </Grid>
                )}
                <Grid item className="current-comment-list">
                    {listComments.map((value) => (
                        <CommentItem key={value._id} data={value} />
                    ))}
                    {myComment.length > 0 && myComment.map((commentItem) => {
                        const exist = listComments.find(item => item._id == commentItem._id);
                        if (!exist) {
                            return <CommentItem key={commentItem._id} data={commentItem} />
                        }
                    })}
                </Grid>
            </Grid>

            <Grid item className="comment-input-box">
                <TextareaAutosize
                    placeholder="Write your comments"
                    // multiline="true"
                    rowsMin={1}
                    rowsMax={10}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Grid
                    item
                    className="send-btn"
                    onClick={createComment}
                >
                    <Send />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default PostItem;
