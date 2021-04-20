import { Grid, Button, Avatar } from "@material-ui/core";
import { Star, ArrowRightAlt, FormatQuote } from "@material-ui/icons";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect } from "react";
import {
    PAYMENT_STATUS_EXPIRED,
    PAYMENT_STATUS_PAID,
    PAYMENT_STATUS_PENDING,
    PAYMENT_STATUS_UNREGISTERED,
} from "../../constant";

function getRandomColor(name) {
    // get first alphabet in upper case
    const firstAlphabet = name.charAt(0).toLowerCase();
   
    // get the ASCII code of the character
    const asciiCode = firstAlphabet.charCodeAt(0);
   
    // number that contains 3 times ASCII value of character -- unique for every alphabet
    const colorNum = asciiCode.toString() + asciiCode.toString() + asciiCode.toString();
   
    var num = Math.round(0xffffff * parseInt(colorNum));
    var r = num >> 16 & 255;
    var g = num >> 8 & 255;
    var b = num & 255;
   
    return 'rgb(' + r + ', ' + g + ', ' + b + ', 1)';
  }

const Course = ({ courseItem }) => {

    const valueLabelFormat = (value) => {
        const array = String(value).split("");
        const length = array.length;

        return `Rp. ${array
            .map((char, index) => {
                if (index > 0 && index % 3 === length % 3) {
                    return `.${char}`;
                } else {
                    return char;
                }
            })
            .join("")},00`;
    };

    const goToCourse = (id) => {
        Router.push(`/subjects?id=${id}`);
    };

    const getStatusCourse = () => {
        const { user_payment } = courseItem;
        let payment_status = (user_payment[0] || {}).status ;
        if(payment_status === PAYMENT_STATUS_EXPIRED) payment_status = PAYMENT_STATUS_UNREGISTERED;
        return ( payment_status || PAYMENT_STATUS_UNREGISTERED);
    };

    let courseStatus = getStatusCourse();
    
    return (
        <Grid className="course-container">
            <Grid container className="course-content">
                <Grid item className="img-container">
                    <Avatar
                        style={{backgroundColor: getRandomColor(courseItem.creator.name)}}
                        alt={courseItem.creator.name}
                        src={
                            courseItem.creator.isAnOrganization
                                ? courseItem.creator.avatar
                                : "images/personal-course.png"
                        }
                    >{courseItem.creator.name}</Avatar>
                </Grid>

                <Grid item className="review-container">
                    <Star
                        style={{
                            color: "#f9a825",
                        }}
                        className="star"
                    />
                    <p>{`${courseItem.rating} (${
                        courseItem.countReview ? courseItem.countReview : 0
                    } reviews)`}</p>
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
                        {courseItem.instructors[0] ? 
                            <Avatar alt={courseItem.instructors[0].name} src={courseItem.instructors[0] ? courseItem.instructors[0].avatar : null}>
                                {courseItem.instructors[0].name}
                            </Avatar> :  <Avatar alt="Unknown" />
                        }
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
                        `+${
                            courseItem.instructors.length - 1
                        } more instructors`}
                </span>
            </Grid>
            <Grid item className="btm-container">
                {courseStatus === PAYMENT_STATUS_PAID && (
                    <Grid item className="price-tag-container enrolled-tag">
                        <div>ENROLLED</div>
                    </Grid>
                )}
                {courseStatus === PAYMENT_STATUS_PENDING && (
                    <Grid item className="price-tag-container pending-tag">
                        <div>PENDING</div>
                    </Grid>
                )}
                {courseStatus === PAYMENT_STATUS_UNREGISTERED && (
                    <Grid item className="price-tag-container">
                        <div className="price-tag">
                            {courseItem.price
                                ? valueLabelFormat(courseItem.price)
                                : "FREE"}
                        </div>{" "}
                    </Grid>
                )}
                <Grid item className="join-btn-container">
                    <Button
                        className="join-btn"
                        onClick={() => goToCourse(courseItem._id)}
                    >
                        <p>
                            {courseStatus === PAYMENT_STATUS_PAID ||
                            courseItem.isInstructor
                                ? "OPEN COURSE"
                                : "JOIN COURSE"}{" "}
                            &nbsp;
                        </p>
                        <ArrowRightAlt
                            style={{
                                color: "white",
                            }}
                        />
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Course;
