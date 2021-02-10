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

  console.log(data);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  useEffect(() => {
    let readMoreText = document.getElementById("readMore");

    if (readMoreText) {
      readMoreText.addEventListener("click", function () {
        setReadMore(true);
      });
    }
  });

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

  return (
    <Grid className="post-box" id={props.data._id}>
      {!editMode && (
        <React.Fragment>
          <Grid item className="post-header">
            <Grid container className="title-container">
              <Grid item>
                {data.category == "Announcement" && <AnnouncementOutlined />}
                {data.category == "Materials" && <ClassOutlined />}
                {data.category == "Exam" && <AssessmentOutlined />}
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
                <p>{`${data.postedBy.name} - ${formatDate(data.createdAt)}`}</p>
              </Grid>
            </Grid>
            <Grid item>
              {data.owned && (
                <Grid item>
                  <Button color="primary" onClick={handleClick}>
                    <MoreVert />
                  </Button>
                  <Popper
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    placement="left-start"
                  >
                    <Paper item className="edit-course">
                      <Button variant="contained" onClick={onEditClick}>
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
                math={`${data.body.substring(0, 800)}${
                  readMore
                    ? ""
                    : '<span class="read-more" id="readMore">&nbsp;...Read More</span>'
                }`}
              />
            )}
            {readMore && (
              <a
                href={`#${props.data._id}`}
                class="read-less"
                onClick={() => {
                  setReadMore(false);
                }}
              >
                ...Read Less
              </a>
            )}
          </Grid>
          <hr />
          <Grid item className="post-middle">
            <Grid item className="attachment">
              <Grid item className="attachment-number">
                <AttachFile />
                <span>
                  {data.attachments.length
                    ? `${data.attachments.length} attachment${
                        data.attachments.length > 1
                      }`
                    : "No attachments available"}
                </span>
              </Grid>
              {data.attachments.length > 0 && (
                <Grid item className="download">
                  <GetApp />
                  <span>Download All Attachment</span>
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
          <PostForm post={data} callback={onPostUpdated} />
        </div>
      )}
      <Grid container className="post-comment">
        <Grid item>
          <IconButton onClick={likeAPost(data._id, setData)} className="icon">
            {!data.isLike ? <ThumbUp /> : <ThumbUp className="purple" />}
            <span className={data.isLike && "purple"}>{`${
              data.likes.total
            } like${data.likes.total !== 1 ? "s" : ""}`}</span>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton color="primary" onClick={showCommentBox} className="icon">
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
