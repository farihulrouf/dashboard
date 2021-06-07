import { Grid } from "@material-ui/core";
import Avatar from "../../Avatar";
import React from "react";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import id from 'javascript-time-ago/locale/id';

TimeAgo.addLocale(id);

const CommentItem = (props) => {
  const formatDate = (date) => {
    return date.slice(0, 19).replace("T", " at ");
  };


  const { data } = props;

  const timeAgo = new TimeAgo('id-ID')


  return (
    <Grid container className="comment-item">
      <Grid container>
        <Grid item className="commentator-ava">
          <Avatar  name={data.commentator.name} imgUrl={data.commentator.avatar} />
        </Grid>
        <Grid item className="commentator-detail">
          <Grid container className="commentator-name">
            <span className="commentator-name">{data.commentator.name}</span>
            <span className="comment-date">{timeAgo.format(new Date(data.createdAt))}</span>
          </Grid>
          <Grid container>
            <p className="comment">{data.content}</p>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CommentItem;
