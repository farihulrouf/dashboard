import PostItem from '../../../components/subject/PostItem';
import NavBar from '../../../components/NavBar';
import { authInitialProps } from "../../../lib/auth";
import {getPostById} from "../../../lib/api";
import {withRouter} from 'next/router'
import {Grid} from "@material-ui/core";

class Post extends React.Component{
    constructor(props){
        super(props)
        this.state = {post: undefined}
    }

    openDeleteDialog = (event)=>{
        this.setState({deleteDialogOpen: true, postToDelete: event.currentTarget.value});
    }

    componentDidMount(){
        const {id} = this.props.router.query;
        getPostById(id).then((data)=> {
            this.setState({post: data.post})
        })
    }

    render(){
        return(
            <NavBar auth={this.props.auth}>
                <Grid container justify="center">
                    <Grid item>
                    {!!this.state.post && <PostItem data={this.state.post} openDeleteDialog={this.openDeleteDialog} />}
                    </Grid>
                </Grid>
            </NavBar>
        )
    }
}
Post.getInitialProps = authInitialProps(true);

export default withRouter(Post);