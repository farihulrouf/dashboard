import { Grid, List, useRadioGroup } from "@material-ui/core";
import { getCoursePosts, deletePost } from "../../lib/api";
import Router from "next/router";
import Pagination from "@material-ui/lab/Pagination";
import DeleteDialog from "./DeleteDialog";
import PostItem from "./home/PostItem";
import PostFilter from "./home/PostFilter";
import React from "react";
import NotEnrolled from "./home/NotEnrolled";
import { Lock } from "@material-ui/icons";
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: { limit: 0, page: 1, pages: 1, total: 0, docs: [] },
            query: {
                content: "",
                dateStart: "",
                dateEnd: "",
                creator: [],
                category: [],
                page: 1,
            },
            deleteDialogOpen: false,
        };
        this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.deleteDialogOnClose = this.deleteDialogOnClose.bind(this);
        this.openDeleteDialog = this.openDeleteDialog.bind(this);
        this.onNewPostCreated = this.onNewPostCreated.bind(this);
    }

    handlePaginationChange(event, page) {
        getCoursePosts(this.props.courseId, {
            ...this.state.query,
            page: page,
        }).then((posts) => this.setState(posts));
    }

    componentDidMount() {
        const { courseId, createdAt } = this.props;
        // console.log(createdAt);
        // this.setState(prev => ({
        //   query: {
        //     ...prev.query,
        //     dateStart: createdAt
        //   }
        // }), () => {
        //   getCoursePosts(courseId,this.state.query).then(posts => this.setState(posts))
        // })

        getCoursePosts(courseId, this.state.query)
            .then((posts) => {
                this.setState(posts);
            })
            .catch((err) => Router.push("/signin"));
    }

    onSearchQueryChange(query) {
        getCoursePosts(this.props.courseId, query).then((result) =>
            this.setState({ posts: result.posts, query: query })
        );
    }

    openDeleteDialog = (event) => {
        this.setState({
            deleteDialogOpen: true,
            postToDelete: event.currentTarget.value,
        });
    };

    deleteDialogOnClose = () => {
        this.setState({ deleteDialogOpen: false });
    };

    deletePost = () => {
        const { postToDelete, query } = this.state;
        deletePost(postToDelete, query).then((result) =>
            this.setState({ posts: result.posts, deleteDialogOpen: false })
        );
    };

    onNewPostCreated = (posts) => {
        //Reload all posts with default query
        this.setState({ posts: posts });
    };

    render() {
        const {
            isInstructor,
            auth,
            instructors,
            createdAt,
            creator,
            isEnrolled,
        } = this.props;
        const { posts, deleteDialogOpen } = this.state;

        const currentPost =
            isEnrolled === 2 ? posts.docs : posts.docs.slice(0, 4);

        const length = currentPost.length;
        console.log(length)

        return (
            <div className="subject-home">
                <DeleteDialog
                    open={deleteDialogOpen}
                    handleClose={this.deleteDialogOnClose}
                    onDelete={this.deletePost}
                />
                <PostFilter
                    query={this.state.query}
                    onSearchQueryChange={this.onSearchQueryChange}
                    courseId={this.props.courseId}
                    callback={this.onNewPostCreated}
                    auth={auth}
                    isInstructor={isInstructor}
                    instructors={instructors}
                    creator={creator}
                    createdAt={createdAt}
                />

                <Grid container>
                    {/* <Grid item>
            <Pagination
              count={posts.pages}
              color="primary"
              onChange={this.handlePaginationChange}
            />
          </Grid> */}
                    <Grid item xs={12}>
                        <List>
                            {currentPost.map((value, index) => {
                                if (index === 3 && isEnrolled !== 2 && !isInstructor) {
                                    return (
                                        <Grid item key={value._id} className="post-item-container">
                                            <PostItem
                                                blur={true}
                                                auth={auth}
                                                data={value}
                                                openDeleteDialog={
                                                    this.openDeleteDialog
                                                }
                                            />
                                            <Lock className="locked-post" />
                                        </Grid>
                                    );
                                }
                                return (
                                    <PostItem
                                        blur={false}
                                        key={value._id}
                                        auth={auth}
                                        data={value}
                                        openDeleteDialog={this.openDeleteDialog}
                                    />
                                );
                            })}
                        </List>

                        {length >= 4 && isEnrolled !== 2 && !isInstructor && (
                            <NotEnrolled
                                price={this.props.price}
                                enroll={this.props.enroll}
                            />
                        )}
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default Home;
