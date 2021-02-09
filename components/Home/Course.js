import { Grid, Button, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Star, ArrowRightAlt, FormatQuote } from "@material-ui/icons";
import Link from "next/link";
import React, { useEffect } from "react";

const Course = ({ courseItem }) => {

    const valueLabelFormat = (value) => {
        const array = String(value).split("");

        return `Rp${array.map((char, index) => {

            if (index > 2 && (array.length - index % 3) === 0) {
                return `.${char}`;
            } else {
                return char;
            }
        }).join("")}`;
    }

  return (
    <Grid className="course-container">
      <Grid container className="course-content">
        <Grid item className="img-container">
          <img src={courseItem.logo ? courseItem.logo : "images/dummy.png"} />
        </Grid>

        <Grid item className="review-container">
          <Star
            style={{
              color: "#f9a825",
            }}
            className="star"
          />
          <p>{`${courseItem.rating} (${courseItem.countReview ? courseItem.countReview : 0} reviews)`}</p>
        </Grid>
      </Grid>
      <Grid item className="course-name">
        <h5>{courseItem.name}</h5>
      </Grid>
      <Grid item className="course-desc">
        <p>{courseItem.about}</p>
      </Grid>
      <Grid item className="course-instructors">
        <h6>Instructor:</h6>
        <Grid container className="instructor-container">
          <Grid className="img-container">
            <img src="images/dummy.png" alt="instructor-photo" />
          </Grid>
          <Grid className="name-container">
            <h6>Instructor</h6>
            <p>
              {courseItem.instructors[0]
                ? courseItem.instructors[0].name
                : `No instructors yet`}
            </p>
          </Grid>
        </Grid>
        <span className="more-instructors">
          {courseItem.instructors.length > 1 &&
            `+${courseItem.instructors.length - 1} more instructors`}
        </span>
      </Grid>
      <Grid container className="btm-container">
        <Grid item className="price-tag-container">
          <div className="price-tag">
            {!courseItem.price
              ? `FREE`
              : `${valueLabelFormat(courseItem.price)}`
            }
          </div>
        </Grid>

        <Grid item className="join-btn-container">
          <Link href={`/subjects?id=${courseItem._id}`}>
            <a>
              <Button className="join-btn">
                <p>Join Course &nbsp;</p>
                <ArrowRightAlt
                  style={{
                    color: "white",
                  }}
                />
              </Button>
            </a>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Course;