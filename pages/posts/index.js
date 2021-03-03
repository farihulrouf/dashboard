import PostItem from '../../components/subject/home/PostItem';
import NavBar from '../../components/Navbar/NavBar';
import { authInitialProps } from "../../lib/auth";
import {getPostById} from "../../lib/api";
import {withRouter} from 'next/router'
import {Grid, Container, withStyles} from "@material-ui/core";
import DefaultErrorPage from 'next/error';
import React from 'react'

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
        this.fetchPost = this.fetchPost.bind(this);
    }

    openDeleteDialog = (event)=>{
        this.setState({deleteDialogOpen: true, postToDelete: event.currentTarget.value});
    }

    componentDidMount(){
        this.fetchPost();
    }
    
    componentDidUpdate(prevProps){
        if (prevProps.router.query.id !== this.props.router.query.id) {
            this.fetchPost();
        }
    }

    fetchPost = () => {
        const {id} = this.props.router.query;
        getPostById(id).then((data)=> {
            this.setState({status: data.status, post: data.post})
        }).catch(err=>{
           this.setState({status: err.response.data.status})
        })
    }

    render(){
        const {classes} = this.props;
        return(
            <NavBar auth={this.props.auth}>
                <Container className={classes.container}>
                    <Grid container justify="center">
                        <Grid item>
                        {this.state.status === "ok" && !!this.state.post && <PostItem data={this.state.post} openDeleteDialog={this.openDeleteDialog} />}
                        {this.state.status === "error" && <DefaultErrorPage statusCode={404} />}
                        </Grid>
                    </Grid>
                </Container>
            </NavBar>
        )
    }
}
Post.getInitialProps = authInitialProps(true);

export default withStyles(styles)(withRouter(Post));