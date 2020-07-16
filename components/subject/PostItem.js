import {Grid, Typography, Paper, Button, Divider, TextareaAutosize, makeStyles, Popper, ButtonGroup} from '@material-ui/core';
import {ThumbUp, Send, Comment, Share, MoreVert, AssessmentOutlined, AnnouncementOutlined, ClassOutlined} from '@material-ui/icons';
import {likeAPost, postComment} from '../../lib/api';
import CommentItem from './CommentItem';
import PostForm from './PostForm';


const styles = (theme) => ({
    inline: {
        display: 'inline',
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
        <Paper elevation={3} style={{marginBottom: 30, padding: 20, paddingTop: 0}}>
            {!editMode && <React.Fragment>
                <Grid container spacing={2}>
                    <Grid item xs={2} sm={1} style={{alignSelf: 'center'}}>
                        {data.category == "Announcement" && <AnnouncementOutlined style={{width: '100%', height: 'auto'}} />}
                        {data.category == "Materials" && <ClassOutlined style={{width: '100%', height: 'auto'}} />}
                        {data.category == "Exam" && <AssessmentOutlined style={{width: '100%', height: 'auto'}} />}
                    </Grid>
                    <Grid item xs={8} sm={10}>
                        <Grid container><b>{data.title}</b></Grid>
                        <Grid container>
                            <React.Fragment>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.inline}
                                    color="textPrimary"
                                >
                                    {`${data.postedBy.name} - ${data.createdAt}`}
                                </Typography>
                            </React.Fragment>
                        </Grid>
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        {data.owned && 
                        <React.Fragment>
                        <Button color="primary" style={{right: 0, position: 'relative'}} onClick={handleClick}>
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
                    </Grid>
                </Grid>
                <Grid container style={{marginTop: 10}}>
                    <div  dangerouslySetInnerHTML={{__html: data.body}} />
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
            <Grid container spacing={3} style={{marginTop: 10}}>
                <Grid item>
                    <Button
                        variant={!!data.isLike?"contained" : "outlined"}
                        color="primary"
                        size="small"
                        className={classes.button}
                        startIcon={<ThumbUp />}
                        onClick={likeAPost(data._id, setData)}
                    >
                        Like
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.button}
                        startIcon={<Comment />}
                        onClick={showCommentBox}
                    >
                        Comment
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.button}
                        startIcon={<Share />}
                    >
                        Share
                    </Button>
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