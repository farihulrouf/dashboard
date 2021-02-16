import {
  Grid,
  Paper,
  IconButton,
  InputBase,
  Button,
  withStyles,
  Popper,
} from "@material-ui/core";
import {
  FilterList,
  FormatListBulleted,
  Search,
  Add,
} from "@material-ui/icons";
import FilterDialog from "./FilterDialog";
import PostFormDialog from "../PostFormDialog";
import React from "react";

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
    };
    this.onQueryChange = this.onQueryChange.bind(this);
    this.onCloseFilter = this.onCloseFilter.bind(this);
    this.onClearFilters = this.onClearFilters.bind(this);
    this.showPostForm = this.showPostForm.bind(this);
    this.onClosePostForm = this.onClosePostForm.bind(this);
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

  showPostForm = () => {
    this.setState({ showPostForm: true });
  };

  onClosePostForm = () => {
    this.setState({ showPostForm: false });
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
      createdAt,
    } = this.props;
    const { showFilter, showPostForm } = this.state;
    return (
      <div>
        <Grid item className="post-filter">
          {isInstructor && (
            <Grid item className="create-post-container">
              <Button onClick={this.showPostForm} className="create-post-btn">
                CREATE NEW POST <Add />
              </Button>
              <PostFormDialog
                open={showPostForm}
                auth={auth}
                courseId={courseId}
                callback={callback}
                onClosePostForm={this.onClosePostForm}
              />
            </Grid>
          )}
          <Grid item className="search-post">
            <Grid container className="input-container">
              <InputBase
                placeholder="Search for post?"
                name="content"
                onChange={this.onQueryChange}
              />
              <Search color="disabled" />
            </Grid>
          </Grid>
        </Grid>
        <Grid container className="second-row">
          <Grid item className="syllabus">
            <IconButton size="small">
              <FormatListBulleted />
            </IconButton>
            <p>
              Syllabus
            </p>
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
