import { Grid } from "@material-ui/core";
import Avatar from "../../Avatar";
import React from "react";

const CommentItem = (props) => {
  const formatDate = (date) => {
    return date.slice(0, 19).replace("T", " at ");
  };

  const { data } = props;
  return (
    <Grid container className="comment-item">
      <Grid container>
        <Grid item className="commentator-ava">
          <Avatar  name={data.commentator.name} imgUrl={data.commentator.avatar} />
        </Grid>
        <Grid item>
          <Grid container className="commentator-name">
            <span className="commentator-name">{data.commentator.name}</span>
            <span className="comment-date">{formatDate(data.createdAt)}</span>
          </Grid>
          <Grid container>
            <span className="comment">{data.content}</span>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CommentItem;
