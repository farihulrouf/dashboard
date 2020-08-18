import {Grid, Typography, Paper, Button, Divider, TextareaAutosize, makeStyles, Popper, ButtonGroup, IconButton} from '@material-ui/core';
import {ThumbUp, ThumbUpOutlined, Send, Comment, Share, MoreVert, AssessmentOutlined, AnnouncementOutlined, ClassOutlined} from '@material-ui/icons';
import {likeAPost, postComment} from '../../lib/api';
import CommentItem from './CommentItem';
import PostForm from './PostForm';
import Link from 'next/link'
// import MathJax from "mathjax3-react";
import MathJax from 'react-mathjax-preview'
import Router from 'next/router';

const styles = (theme) => ({
    inline: {
        display: 'inline',
        fontSize: '0.875rem',
        fontFamily: 'Lato',
        fontWeight: 400,
        lineHeight: 1.43,
        color: '#121037',
        fontStyle: 'italic'
    },
    link: {
        backgroundColor: 'black'
    },
    body: {
        fontSize: '1rem',
        color: '#121037',
        fontFamily: 'Lato',
        fontWeight: 400,
        lineHeight: 1.5,
        width: '100%'
    },
    paper: {
        marginBottom: 30,
        ['@media (min-width:800px)']: { 
            padding: 50
        },
        ['@media (max-width:800px)']: { 
            padding: 10
        }
    }
});
const useStyles = makeStyles(styles);

const PostItem = (props) => {
    const classes = useStyles();
    const [showComment,setShowComment] = React.useState(false);
    const [data,setData] = React.useState(props.data);
    const [comment,setComment] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [editMode, setEditMode] = React.useState(false);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
      };
    
      const open = Boolean(anchorEl);
      const id = open ? 'simple-popper' : undefined;
    
    const showCommentBox = (event) => {
       setShowComment(!showComment);
    }

    const postCallback = (data) => {
        setComment("");
        setData(data);
    }

    const onEditClick = ()=>{
        setEditMode(true);
    }

    const onPostUpdated = (post) => {
        setData(post);
        setAnchorEl(null);
        setEditMode(false);
    }

    return(
        <Paper elevation={3} className={classes.paper}>
            {!editMode && <React.Fragment>
                {data.owned && 
                    <React.Fragment>
                        <Button color="primary" style={{right: 0, position: 'absolute'}} onClick={handleClick}>
                                <MoreVert />
                        </Button>
                        <Popper id={id} open={open} anchorEl={anchorEl}>
                            <ButtonGroup
                                orientation="vertical"
                                color="primary"
                                aria-label="vertical outlined primary button group"
                                style={{marginRight: 50}}
                            >
                                <Button variant="contained" onClick={onEditClick}>Edit</Button>
                                <Button variant="contained" value={data._id} onClick={props.openDeleteDialog}>Delete</Button>
                            </ButtonGroup>
                        </Popper>
                    </React.Fragment>
                }
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={1} style={{alignSelf: 'center'}}>
                        <Grid container justify="center">
                            {data.category == "Announcement" && <AnnouncementOutlined style={{maxWidth: '100%', width: 'auto', height: '50px'}} />}
                            {data.category == "Materials" && <ClassOutlined style={{maxWidth: '100%', width: 'auto', height: '50px'}} />}
                            {data.category == "Exam" && <AssessmentOutlined style={{maxWidth: '100%', width: 'auto', height: '50px'}} />}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={11}>
                        <Grid container><a onClick={()=>Router.push({pathname: 'posts', query: {id: data._id}})} style={{textDecoration: 'none'}}><h6 style={{margin: 0, fontFamily: 'Lato', lineHeight: 1.6, fontWeight: 700, color: '#121037', fontSize: '1.25rem'}}>{data.title}</h6></a></Grid>
                        <Grid container>
                            <React.Fragment>
                                <Typography
                                    component="p"
                                    className={classes.inline}
                                >
                                    {`${data.postedBy.name} - ${data.createdAt}`}
                                </Typography>
                            </React.Fragment>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container style={{margin: '1em 0px'}}>
                    <MathJax math={data.body} className={classes.body}  />
                </Grid>
                <Grid container spacing={2} style={{marginTop: 10}}>
                    {data.attachments.map((e,idx)=><Grid key={e._id} item><a href={`/files/${encodeURIComponent(e.key)}`} style={{fontSize: 12}}>{e.name}</a></Grid>)}
                </Grid>
            </React.Fragment>}
            {editMode && 
                <div style={{paddingTop: 20}}>
                    <PostForm post={data} callback={onPostUpdated} />
                </div>}
            <Grid container style={{marginTop: 10}}>
                <ThumbUp style={{fontSize: 15, color:"#556cd6", marginRight: 10}} />
                <span style={{fontSize: 12}}>{data.likes.total} Likes</span>
            </Grid>
            <Grid container style={{marginTop: 10}}>
                <Grid item>
                    <IconButton style={{paddingLeft: 0}} color="primary" onClick={likeAPost(data._id, setData)}>
                        {!!data.isLike? <ThumbUp style={{fontSize: 20}} /> : <ThumbUpOutlined style={{fontSize: 20}} />}
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton color="primary" onClick={showCommentBox}>
                        <Comment style={{fontSize: 20}} />
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton color="primary">
                        <Share style={{fontSize: 20}} />
                    </IconButton>
                </Grid>
            </Grid>
            <Divider style={{marginTop: 10}}/>
                <Grid container>
                    {data.comments.listComments.map((value) => <CommentItem key={value._id} data={value} />)}
                </Grid>
                {showComment && <Grid container style={{marginTop: 10}}>
                    <Grid xs={12} sm={11} item>
                        <TextareaAutosize
                            placeholder="Write your comments"
                            multiline="true"
                            rowsMin={2}
                            rowsMax={10}
                            style={{width: '100%', borderRadius: 10, resize: 'none'}}
                            value={comment}
                            onChange={(e)=>setComment(e.target.value)}
                        />
                    </Grid>
                    <Grid xs={12} sm={1} item>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={postComment({postId: data._id,comment: comment},postCallback)}
                        >
                            <Send style={{fontSize: 15}} />
                        </Button>
                    </Grid>
                </Grid>}
        </Paper>
    )
}

export default PostItem;