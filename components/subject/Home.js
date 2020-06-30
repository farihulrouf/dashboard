import NavBar from '../../components/NavBar.js';
import { makeStyles, withStyles } from '@material-ui/core/styles';;
import {Grid, List, ListItem, ListItemIcon, Checkbox, ListItemSecondaryAction, Avatar, ListItemText,
    Typography, Paper, Button, IconButton, InputBase, Divider, TextareaAutosize
} from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import SendIcon from '@material-ui/icons/Send';
import CommentIcon from '@material-ui/icons/Comment';
import AnnouncementIcon from '@material-ui/icons/AnnouncementOutlined';
import ExamIcon from '@material-ui/icons/AssessmentOutlined'
import ClassIcon from '@material-ui/icons/ClassOutlined'
import ShareIcon from '@material-ui/icons/Share';
import SearchIcon from '@material-ui/icons/Search';
import {getCoursePosts, likeAPost, postComment} from '../../lib/api';


const styles = (theme) => ({
    root: {
        width: '80%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    searchRoot: {
        marginTop: 10
    },
    input: {
        width: '80%'
    }
});
const useStyles = makeStyles(styles);

const CommentItem = (props) => {
    const classes = useStyles();
    const {data} = props;
    return(
        <Grid container style={{margin: 10}}>
            <Grid container spacing={2}>
                <Grid item>
                    <Avatar style={{width: 30, height: 30}} alt={data.commentator.name} src="/static/images/avatar/1.jpg" />
                </Grid>
                <Grid item>
                    <Grid container style={{fontSize: 12}}><b>{data.commentator.name}</b></Grid>
                    <Grid container>
                        <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                        >
                            {data.createdAt}
                        </Typography>
                        </React.Fragment>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 10}}>
                <span style={{fontSize: 12}}>{data.content}</span>
            </Grid>
        </Grid>
    )
}

const PostItem = (props) => {
    const classes = useStyles();
    const [showComment,setShowCommnet] = React.useState(false);
    const [data,setData] = React.useState(props.data);
    const [comment,setComment] = React.useState("");
    
    const showCommentBox = (event) => {
       setShowCommnet(!showComment);
    }

    const postCallback = (data) => {
        setComment("");
        setData(data);
    }

    return(
        <Paper elevation={3} style={{marginBottom: 30, padding: 20}}>
            <Grid container spacing={2}>
                <Grid item>
                    <Avatar alt={data.postedBy.name} src="/static/images/avatar/1.jpg" />
                </Grid>
                <Grid item>
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
            </Grid>
            <Grid container style={{marginTop: 10}}>
                <ListItemText primary={data.body} />
            </Grid>
            <Grid container style={{marginTop: 10}}>
                {/* <Button 
                    startIcon={<ThumbUpIcon style={{fontSize: 15}} />} color="primary" 
                    variant="contained"
                    style={{padding: 0, height: 20}}
                />  */}
                    <ThumbUpIcon style={{fontSize: 15, color:"#556cd6", marginRight: 10}} />
                    <span style={{fontSize: 12}}>{data.likes.total} Likes</span>
            </Grid>
            <Grid container spacing={3} style={{marginTop: 10}}>
                <Grid item>
                    <Button
                        variant={!!data.isLike?"contained" : "outlined"}
                        color="primary"
                        size="small"
                        className={classes.button}
                        startIcon={<ThumbUpIcon />}
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
                        startIcon={<CommentIcon />}
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
                        startIcon={<ShareIcon />}
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
                            <SendIcon style={{fontSize: 15}} />
                        </Button>
                    </Grid>
                </Grid>}
        </Paper>
    )
}

const SearchBar = () => {
    const classes = useStyles();
    return(
        <Paper elevation={3} component="form" className={classes.searchRoot}>
            <IconButton type="submit" className={classes.iconButton} aria-label="search">
                <SearchIcon />
            </IconButton>
            <InputBase
            className={classes.input}
            placeholder="Search....."
            inputProps={{ 'aria-label': 'search google maps' }}
            />
        </Paper>
    )
}

const TagFilter = () => {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
  
    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
  
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
  
      setChecked(newChecked);
    };

    const filters = [
        {id: 1, name: 'Berita',icon: <AnnouncementIcon />},
        {id: 2, name: 'Kelas', icon: <ClassIcon />},
        {id: 3, name: 'Ujian', icon: <ExamIcon />}
    ]
    return (
      <List>
        {filters.map((value) => {
          const labelId = `checkbox-list-label-${value.id}`;
  
          return (
            <ListItem key={value.id} role={undefined} dense button onClick={handleToggle(value.id)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.name} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="comments">
                  {value.icon}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    );
}

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {posts: []}
    }

    componentDidMount(){
        const {courseId} = this.props;
        getCoursePosts(courseId,1).then(posts => this.setState(posts))
    }

    render(){
        const {classes} = this.props
        const {posts} = this.state
        return(
            <React.Fragment>
                <Grid container>
                    <Grid item xs={12} sm={3}>
                        <SearchBar />
                        <TagFilter />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Grid container style={{justifyContent: 'center'}}>
                            <List className={classes.root}>
                                {posts.map((value) => <PostItem key={value._id} data={value} />)}
                            </List>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(Home);