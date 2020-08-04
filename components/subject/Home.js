import {Grid, List, Avatar, Paper, IconButton, withStyles, InputBase, Button} from '@material-ui/core';
import {FilterList} from "@material-ui/icons";
import {getCoursePosts, deletePost} from '../../lib/api';
import Pagination from '@material-ui/lab/Pagination';
import FormDialog from './FormDialog';
import PostForm from './PostForm';
import PostItem from './PostItem';
import PostFilter from './PostFilter';


const styles = (theme) => ({
    input: {
        flex: 1
    }
})

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            posts: {limit: 0, page: 1, pages: 1, total: 0, docs: []}, 
            query: {content: "", category: [], page: 1},
            deleteDialogOpen: false
        }
        this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this)
        this.deletePost = this.deletePost.bind(this);
        this.deleteDialogOnClose = this.deleteDialogOnClose.bind(this);
        this.openDeleteDialog = this.openDeleteDialog.bind(this);
        this.onNewPostCreated = this.onNewPostCreated.bind(this);
    }

    handlePaginationChange(event,page){
        getCoursePosts(this.props.courseId,{...this.state.query, page: page}).then(posts=>this.setState(posts));
    }

    componentDidMount(){
        const {courseId} = this.props;
        getCoursePosts(courseId,this.state.query).then(posts => this.setState(posts))
    }

    onSearchQueryChange(query){
        getCoursePosts(this.props.courseId,query)
            .then(result => this.setState({posts: result.posts, query: query}));
    }

    openDeleteDialog = (event)=>{
        this.setState({deleteDialogOpen: true, postToDelete: event.currentTarget.value});
    }

    deleteDialogOnClose = () => {
        this.setState({deleteDialogOpen: false});
    }

    deletePost = () => {
        const {postToDelete, query} = this.state;
        deletePost(postToDelete, query).then(result=> this.setState({posts: result.posts, deleteDialogOpen: false}))
    }

    onNewPostCreated = (posts) => {
        //Reload all posts with default query
        this.setState({posts: posts});
    }

    render(){
        const {isInstructor, auth, classes} = this.props
        const {posts, deleteDialogOpen} = this.state
        return(
            <React.Fragment>
                <FormDialog open={deleteDialogOpen} handleClose={this.deleteDialogOnClose} onDelete={this.deletePost} />
                <PostFilter query={this.state.query} onSearchQueryChange={this.onSearchQueryChange} />
                <Grid container style={{marginTop: 20}}>
                    <Grid item xs={12}>
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
                                        <PostForm courseId={this.props.courseId} callback={this.onNewPostCreated} />
                                </Paper>
                            </Grid>}
                            <Grid item sx={12} style={{marginBottom: 30}}>
                                <Pagination count={posts.pages} color="primary" onChange={this.handlePaginationChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <List>
                                    {posts.docs.map((value) => <PostItem key={value._id} data={value} openDeleteDialog={this.openDeleteDialog} />)}
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