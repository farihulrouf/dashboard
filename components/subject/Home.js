import NavBar from '../../components/NavBar.js';
import { makeStyles, withStyles } from '@material-ui/core/styles';;
import {Grid, List, ListItem, ListItemIcon, Checkbox, ListItemSecondaryAction, Avatar, ListItemText,
    Typography, Paper, Button, IconButton, InputBase, Divider, TextField, ListItemAvatar, InputLabel, Select, TextareaAutosize,
    MenuItem, Popper, ButtonGroup,
    FormControl
} from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import SendIcon from '@material-ui/icons/Send';
import CommentIcon from '@material-ui/icons/Comment';
import AnnouncementIcon from '@material-ui/icons/AnnouncementOutlined';
import ExamIcon from '@material-ui/icons/AssessmentOutlined'
import ClassIcon from '@material-ui/icons/ClassOutlined'
import ShareIcon from '@material-ui/icons/Share';
import SearchIcon from '@material-ui/icons/Search';
import AttachmentIcon from '@material-ui/icons/Attachment';
import DocumentIcon from '@material-ui/icons/Description';
import DeleteIcon from '@material-ui/icons/Clear'
import AddIcon from '@material-ui/icons/AddCircleRounded'
import {createCoursePost, getCoursePosts, likeAPost, 
    postComment, generatePutUrl, uploadToS3, deletePost} from '../../lib/api';
import { Editor } from '@tinymce/tinymce-react';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import MoreVertIcon from '@material-ui/icons/MoreVert';


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
    },
    paper: {
        border: '1px solid',
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
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
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    
    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
      };
    
      const open = Boolean(anchorEl);
      const id = open ? 'simple-popper' : undefined;
    
    const showCommentBox = (event) => {
       setShowCommnet(!showComment);
    }

    const postCallback = (data) => {
        setComment("");
        setData(data);
    }

    return(
        <Paper elevation={3} style={{marginBottom: 30, padding: 20, paddingTop: 0}}>
            <Grid container spacing={2}>
                <Grid item xs={2} sm={1} style={{alignSelf: 'center'}}>
                    {data.category == "Announcement" && <AnnouncementIcon style={{width: '100%', height: 'auto'}} />}
                    {data.category == "Materials" && <ClassIcon style={{width: '100%', height: 'auto'}} />}
                    {data.category == "Exam" && <ExamIcon style={{width: '100%', height: 'auto'}} />}
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
                            <MoreVertIcon />
                    </Button>
                    <Popper id={id} open={open} anchorEl={anchorEl}>
                        <ButtonGroup
                            orientation="vertical"
                            color="primary"
                            aria-label="vertical outlined primary button group"
                            style={{marginRight: 50}}
                        >
                            <Button variant="contained">Edit</Button>
                            <Button variant="contained" value={data._id} onClick={props.deletePost}>Delete</Button>
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
            <Grid container style={{marginTop: 10}}>
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

const PostFilter = (props) => {
    const [query, setQuery] = React.useState({content: "",category: [],page: 1})

    const onQueryChange = (e) => {
        if(e.target.name == "content"){
            query.content=e.target.value;
        }
        if(e.target.name == "category"){
            let categoryId = parseInt(e.target.value);
            let index = query.category.indexOf(categoryId)
            if(index == -1){
                query.category.push(categoryId)
            }else query.category.splice(index,1)
        }
        setQuery({...query})
        props.onSearchQueryChange(query)
    }

    const filters = [
        {id: 1, name: 'Berita',icon: <AnnouncementIcon />},
        {id: 2, name: 'Materi', icon: <ClassIcon />},
        {id: 3, name: 'Ujian', icon: <ExamIcon />}
    ]
    return(
        <div>
            <Paper elevation={3} component="form">
                <IconButton type="submit" aria-label="search">
                    <SearchIcon />
                </IconButton>
                <InputBase
                    placeholder="Search....."
                    inputProps={{ 'aria-label': 'search google maps' }}
                    onChange={onQueryChange}
                    name="content"
                />
            </Paper>
            <List>
                {filters.map((value) => {
                const labelId = `checkbox-list-label-${value.id}`;
        
                return (
                    <ListItem key={value.id} role={undefined} dense>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={query.category.indexOf(value.id) !== -1}
                                tabIndex={-1}
                                disableRipple
                                value={value.id}
                                name="category"
                                onClick={onQueryChange}
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
        </div>
    )
}

const Attachments = (props) => {
    const {data} = props
    return(
        <List dense={true} >
            {data.map((e,idx)=> (
                <ListItem key={idx}>
                    <ListItemAvatar>
                    <Avatar>
                        <DocumentIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                    primary={e.name}
                    secondary={`${parseInt(e.size/1000)} kb || upload progress: ${e.progress||0}%`}
                    />
                    <ListItemSecondaryAction>
                    <IconButton onClick={()=>props.removeFile(idx)} edge="end" aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    )
}
class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            posts: {limit: 0, page: 1, pages: 1, total: 0, docs: []}, 
            newPost: {title: "", body: "", category: "", files: []},
            query: {page: 1},
            createStatus: true
        }
        this.onFileChange = this.onFileChange.bind(this)
        this.onTextChange = this.onTextChange.bind(this)
        this.handleEditorChange = this.handleEditorChange.bind(this)
        this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
        this.progressCallback = this.progressCallback.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this)
        this.deletePost = this.deletePost.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    handlePaginationChange(event,page){
        getCoursePosts(this.props.courseId,{...this.state.query, page: page}).then(posts=>this.setState(posts));
    }

    componentDidMount(){
        const {courseId} = this.props;
        getCoursePosts(courseId,this.state.query).then(posts => this.setState(posts))
    }

    progressCallback(file){
        const _this = this;
        return function(completed){
            let files = _this.state.newPost.files;
            let targetFile = files.find((e)=>e.name == file.name)
            if(!!targetFile){
                targetFile.progress = completed;
                let createStatus = files.reduce((acc,current)=> {
                    return acc && (current.progress == 100)
                }, true)
                _this.setState({newPost: _this.state.newPost, createStatus: createStatus});
            }
        }
    }

    onFileChange(e) {
        let newFiles = Array.from(e.target.files);
        let {newPost} = this.state
        this.state.newPost.files = newPost.files.concat(newFiles);
        this.setState({ newPost: this.state.newPost })
        newFiles.forEach(async (file) => {
            let response = await generatePutUrl(file)
            if(response.status == "ok"){
                const {url, key} = response.file;
                file.url = url;
                file.key = key;
                file.source = axios.CancelToken.source();
                response = await uploadToS3(file,this.progressCallback(file));
            }else{
                alert(response.message);
            }
        })
    }

    onTextChange(e) {
        this.state.newPost[e.target.name] = e.target.value;
        this.setState({newPost: this.state.newPost});
    }

    onSearchQueryChange(query){
        getCoursePosts(this.props.courseId,query)
            .then(result => this.setState({posts: result.posts, query: query}));
    }

    handleEditorChange(content,editor){
        this.state.newPost.body = content;
        this.setState({newPost: this.state.newPost})
    }

    removeFile(e){
        let {files} = this.state.newPost;
        files[e].source.cancel(`${files[e].name} is removed`);
        files.splice(e,1);
        this.setState({newPost: this.state.newPost})
    }

    onSubmit = (e,courseId) => {
        e.preventDefault()
        let {newPost} = this.state;
        createCoursePost(courseId, newPost).then(result=>{
            this.setState({posts: result.posts, newPost: {title: "",body: "",category: "",files: []}})
        })
    }

    deletePost = (event)=>{
        const {value} = event.currentTarget;
        const {query} = this.state;
        deletePost(value, query).then(result=> this.setState({posts: result.posts}))
    }

    uploadImage = async (blobInfo,success,failure) => {
        try {
            let file = blobInfo.blob();
            let response = await generatePutUrl(file);
            if(response.status == "ok"){
                const {url, key} = response.file;
                file.url = url;
                file.key = key;
                file.source = axios.CancelToken.source();
                response = await uploadToS3(file,this.progressCallback(file));
                success(`/files/${encodeURIComponent(file.key)}`);
            }else{
                alert(response.message);
            }
        } catch (error) {
            alert(error);
        }
    }

    render(){
        const {classes, isInstructor, auth} = this.props
        const {posts, newPost} = this.state
        return(
            <React.Fragment>
                <Grid container>
                    <Grid item xs={12} sm={4} style={{paddingRight: '5%'}}>
                        <PostFilter onSearchQueryChange={this.onSearchQueryChange} />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Grid container style={{justifyContent: 'center'}}>
                            {isInstructor && <Grid item xs={12} style={{marginBottom: 50}}>
                                <Paper elevation={5} style={{padding: 20}}>
                                        <Grid container style={{marginBottom: 20}}>
                                            <Grid item style={{marginRight: 10}}>
                                                <Avatar style={{width: 30, height: 30}} alt={auth.user.name} src={auth.user.avatar} />
                                            </Grid>
                                            <Grid item>
                                                <Grid container style={{fontSize: 20}}><b>{auth.user.name}</b></Grid>
                                            </Grid>
                                        </Grid>
                                        <form onSubmit={(e)=> this.onSubmit(e,this.props.courseId)}>
                                            <FormControl style={{width: '100%', marginBottom: 20}}>
                                                <TextField onChange={this.onTextChange} name="title" value={newPost.title} id="outlined-basic" label="Title" />
                                            </FormControl>
                                            <FormControl style={{width: '100%', marginBottom: 20}}>
                                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                                <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={newPost.category}
                                                name="category"
                                                onChange={this.onTextChange}
                                                >
                                                    <MenuItem value={"Announcement"}>Berita</MenuItem>
                                                    <MenuItem value={"Materials"}>Materi</MenuItem>
                                                    <MenuItem value={"Exam"}>Ujian</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Editor
                                                initialValue=""
                                                init={{
                                                height: 200,
                                                menubar: false,
                                                file_picker_types: "file image media",
                                                images_upload_handler: this.uploadImage,
                                                plugins: [
                                                    'advlist autolink lists link image charmap print preview anchor',
                                                    'searchreplace visualblocks code fullscreen',
                                                    'insertdatetime media table paste table code help image wordcount'
                                                ],
                                                toolbar:
                                                    'undo redo | formatselect | bold italic backcolor | \
                                                    alignleft aligncenter alignright alignjustify | \
                                                    bullist numlist outdent indent | removeformat | table | image | help'
                                                }}
                                                value = {newPost.body}
                                                onEditorChange={this.handleEditorChange}
                                                apiKey={process.env.TINYMCE_APIKEY}
                                            />
                                            <Attachments removeFile={this.removeFile.bind(this)} data={newPost.files}/>
                                            <label htmlFor="files">
                                                <input style={{display: 'none'}} value="" id="files" type="file" name="files" onChange={this.onFileChange} multiple />
                                                <Button
                                                    color="primary"
                                                    size="small"
                                                    component="span"
                                                    aria-label="add"
                                                    variant="outlined"
                                                    style={{marginTop: 20}}
                                                >
                                                    <AttachmentIcon />Add Attachments
                                                </Button>
                                            </label>
                                            <Grid container style={{justifyContent: 'flex-end'}}>
                                                {!!this.state.createStatus && <Button type="submit" variant="contained" color="primary">
                                                    Create Post
                                                </Button>}
                                                {!this.state.createStatus && <Button disabled type="submit" variant="contained" color="primary">
                                                    Create Post
                                                </Button>}
                                            </Grid>
                                        </form>
                                </Paper>
                            </Grid>}
                            <Grid item sx={12} style={{marginBottom: 30}}>
                                <Pagination count={posts.pages} color="primary" onChange={this.handlePaginationChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <List>
                                    {posts.docs.map((value) => <PostItem key={value._id} data={value} deletePost={this.deletePost} />)}
                                </List>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(Home);