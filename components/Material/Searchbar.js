import React, { Fragment } from "react";
import { Container, Grid, InputBase, Button } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { getCourses } from "../../lib/api";

const Searchbar = ({
  auth,
  setData,
  setIsLoading,
  filter,
  setFilter,
  setLoadMoreAvail,
}) => {
  const handleChange = (e) => {
    setFilter((prev) => {
      return {
        ...prev,
        query: e.target.value,
      };
    });
  };

  const clickSearch = () => {
    setIsLoading(true);
    getCourses(filter)
      .then((res) => {
        setIsLoading(false);
        setData(res.courses);
        setLoadMoreAvail(res.avail);
      })
      .catch((err) => {
        setIsLoading(true);
      });
  };

  return (
    <Fragment>
      <Container>
        <Grid className="search-box-container">
          <InputBase
            placeholder="Search Courses"
            className="search-bar"
            value={filter.query}
            onChange={(e) => handleChange(e)}
          />
          <Button>
            <Search className="search-btn" onClick={() => clickSearch()} />
          </Button>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default Searchbar;
