import {
  Grid,
  IconButton,
  InputBase,
  Button,
  withStyles,
} from "@material-ui/core";
import {
  FilterList,
  FormatListBulleted,
  Search,
  Add,
} from "@material-ui/icons";
import FilterDialog from "./FilterDialog";
import PostFormDialog from "./PostFormDialog";
import LiveStreamingDialog from "./LiveStreamingDialog";
import React from "react";
import HomeMenu from "./HomeMenu"

const styles = (theme) => ({
  input: { flex: 1 },
});

class PostFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: this.props.query,
      showFilter: false,
      showPostForm: false,
      showLiveStream: false
    };
    this.onQueryChange = this.onQueryChange.bind(this);
    this.onCloseFilter = this.onCloseFilter.bind(this);
    this.onClearFilters = this.onClearFilters.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  onQueryChange = (e) => {
    let { query } = this.state;
    if (e) {
      if (e.target.name == "content") {
        query.content = e.target.value;
      }
      if (e.target.name == "category") {
        let categoryId = parseInt(e.target.value);
        let index = query.category.indexOf(categoryId);
        if (index == -1) {
          query.category.push(categoryId);
        } else query.category.splice(index, 1);
      }
      if (e.target.name == "creator") {
        let creatorId = e.target.value;
        let index = query.creator.indexOf(creatorId);
        if (index == -1) {
          query.creator.push(creatorId);
        } else query.creator.splice(index, 1);
      }
    }
    query.page = 1;
    this.props.onSearchQueryChange(query);
  };

  showFilter = () => {
    this.setState({ showFilter: true });
  };

  onCloseFilter = () => {
    this.setState({ showFilter: false });
  };

  onClearFilters = () => {
    const { query } = this.state;
    const newQuery = { content: query.content, category: [], page: 1 };
    this.props.onSearchQueryChange(newQuery);
  };

  showModal = (form_type) => {
    let obj = {}
    switch(form_type){
      case "showPostForm":
        obj = {showPostForm: true}
        break;
      case "showLiveStream":
        obj = {showLiveStream: true}
        break;
    }
    this.setState(obj)
  }

  closeModal = (form_type) => {
    let obj = {}
    switch(form_type){
      case "showPostForm":
        obj = {showPostForm: false}
        break;
      case "showLiveStream":
        obj = {showLiveStream: false}
        break;
    }
    this.setState(obj)
  };
  
  render() {
    const {
      classes,
      query,
      courseId,
      callback,
      auth,
      isInstructor,
      instructors,
      creator,
      createdAt,
    } = this.props;
    const { showFilter, showPostForm, showLiveStream} = this.state;
    return (
      <div>
        <Grid item className="post-filter">
          <Grid item className="syllabus">
            <HomeMenu showModal={this.showModal} isInstructor={isInstructor} />
            <PostFormDialog
                open={showPostForm}
                auth={auth}
                courseId={courseId}
                callback={callback}
                onClosePostForm={this.closeModal}
            />
            <LiveStreamingDialog
              open={showLiveStream}
              isInstructor={isInstructor}
              courseId={courseId}
              onCloseLiveStream={this.closeModal}
            />
          </Grid>
          <Grid item className="search-post">
            <Grid item className="input-container">
              <InputBase
                placeholder="Search for post?"
                name="content"
                onChange={this.onQueryChange}
              />
              <Search color="disabled" />
            </Grid>
          </Grid>
          <Grid item className="filter">
            <IconButton
              onClick={this.showFilter}
              size="small"
              aria-label="menu"
            >
              <FilterList />
            </IconButton>
            <FilterDialog
              open={showFilter}
              query={query}
              instructors={instructors}
              creator={creator}
              dateStart={createdAt}
              onClearFilters={this.onClearFilters}
              onFilterChange={this.onQueryChange}
              onCloseFilter={this.onCloseFilter}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(PostFilter);
