import PostItem from '../../components/subject/PostItem';
import NavBar from '../../components/NavBar';
import { authInitialProps } from "../../lib/auth";
import {getPostById} from "../../lib/api";
import {withRouter} from 'next/router'
import {Grid, Container, withStyles} from "@material-ui/core";

const styles = (theme) => ({
    container: {
        backgroundColor: 'white', 
        ['@media (min-width:800px)']: { 
            padding: '20px 48px'
        },
        ['@media (max-width:800px)']: { 
            padding: '20px 9px'
        }
    }
})

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
        const {classes} = this.props;
        return(
            <NavBar auth={this.props.auth}>
                <Container className={classes.container}>
                    <Grid container justify="center">
                        <Grid item>
                        {!!this.state.post && <PostItem data={this.state.post} openDeleteDialog={this.openDeleteDialog} />}
                        </Grid>
                    </Grid>
                </Container>
            </NavBar>
        )
    }
}
Post.getInitialProps = authInitialProps(true);

export default withStyles(styles)(withRouter(Post));