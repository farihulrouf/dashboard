import React, { useState, useEffect } from "react";
import { Container, Grid, Button, CircularProgress } from "@material-ui/core";
import { getCourses } from "../../lib/api";
import Course from "../../components/Home/Course";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Searchbar from "../../components/Material/Searchbar";
import Filter from "../../components/Material/Filter";
import NoCourse from "../../components/Material/NoCourse";
import { set } from "js-cookie";

const Material = ({ auth }) => {
  const [data, setData] = useState([]);
  const [loadMoreAvail, setLoadMoreAvail] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [filter, setFilter] = useState({
    query: "",
    instructor: [],
    organization: [],
    price: [0, 500000],
    rating: 0,
    page: 1,
    limit: 3,
  });

  const loadMore = () => {
    if (loadMoreAvail) {
      setFilter((prev) => {
        return {
          ...prev,
          page: prev.page + 1,
        };
      });

      setIsLoading(true);
    }
  };

  useEffect(() => {
    getCourses(filter).then((res) => {
      setIsLoading(false);
      setData((prev) => [...prev, ...res.courses]);
      setLoadMoreAvail(res.avail);
    });
  }, [filter.page]);

  useEffect(() => {
    setFilter((prev) => {
      return {
        ...prev,
        page: 1,
      };
    });
  }, [data.length === 0]);

  const { query, instructor, organization, price, rating } = filter;

  const applyFilter = () => {
    setIsLoading(true);
    getCourses(filter)
      .then((res) => {
        setIsLoading(false);
        setData(res.courses);
        setLoadMoreAvail(res.avail);
      })
      .catch((err) => setData([]));
    setOpen(false);
  };

  const clearFilter = () => {
    let emptyFilter = {
      query: "",
      instructor: [],
      organization: [],
      price: [0, 500000],
      rating: 0,
      page: 1,
      limit: 3,
    };

    setFilter(emptyFilter);
    setIsLoading(true);

    getCourses(emptyFilter)
      .then((res) => {
        setIsLoading(false);
        setData(res.courses);
        setLoadMoreAvail(res.avail);
      })
      .catch((err) => {
        setIsLoading(true);
      });

    setOpen(false);
  };

  useEffect(() => {
    setData([]);
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
  }, [query]);

  return (
    <Container className="material">
      <Searchbar
        auth={auth}
        setData={setData}
        setIsLoading={setIsLoading}
        filter={filter}
        setFilter={setFilter}
        setLoadMoreAvail={setLoadMoreAvail}
      />
      <Container className="course-number">
        <Grid className="course-number-content">
          {`${data.length} result${data.length !== 1 ? "" : "s"} found`}
        </Grid>
        <Grid>
          <Button>
            <FontAwesomeIcon
              icon={faFilter}
              className="filter"
              onClick={() => setOpen(true)}
            />
          </Button>
        </Grid>
      </Container>

      <div className="course">
        <Grid container justify="center">
          <Grid container justify="center">
            {data.map((val, index) => (
              <Grid
                key={index}
                item
                data-aos="flip-left"
                data-aos-easing="ease-out-cubic"
                data-aos-duration="1000"
              >
                <Course courseItem={val} />
              </Grid>
            ))}
          </Grid>
          {isLoading && (
            <Grid container justify="center">
              <CircularProgress thickness={6} size="6rem" />
            </Grid>
          )}

          {data.length === 0 && !isLoading && <NoCourse />}
          {!isLoading && loadMoreAvail && (
            <Grid
              className="load-more"
              onClick={() => {
                loadMore();
              }}
            >
              <h4>
                Load More Courses<span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </h4>
            </Grid>
          )}
        </Grid>
      </div>

      <Filter
        open={open}
        setOpen={setOpen}
        filter={filter}
        setFilter={setFilter}
        applyFilter={applyFilter}
        clearFilter={clearFilter}
      />
    </Container>
  );
};

export default Material;
