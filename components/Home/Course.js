import { Grid, Button } from "@material-ui/core";
import Avatar from "../Avatar";
import { Star, ArrowRightAlt, MoreVert } from "@material-ui/icons";
import Router from "next/router";
import React from "react";
import {
    PAYMENT_STATUS_EXPIRED,
    PAYMENT_STATUS_PAID,
    PAYMENT_STATUS_PENDING,
    PAYMENT_STATUS_UNREGISTERED
} from "../../constant";
import CourseMore from "../CourseMore";

const Course = ({ courseItem, onUpdate }) => {
    console.log(courseItem);
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

    const {
        canEdit,
        isInstructor,
        isOrganization,
        isParticipant,
        user_payment,
    } = courseItem;

    const lastPayment = user_payment[user_payment.length - 1];
    const status = lastPayment ? lastPayment.status : PAYMENT_STATUS_UNREGISTERED;

    return (
        <Grid className="course-container">
            {canEdit && <CourseMore course={courseItem} onUpdate={onUpdate} />}
            <Grid container className="course-content">
                <Grid item className="img-container">
                    <Avatar
                        name={courseItem.creator.name}
                        imgUrl={
                            courseItem.creator.isAnOrganization
                                ? courseItem.creator.avatar
                                : "images/personal-course.png"
                        }
                    />
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
                        {courseItem.instructors[0] ? (
                            <Avatar
                                name={courseItem.instructors[0].name}
                                imgUrl={
                                    courseItem.instructors[0]
                                        ? courseItem.instructors[0].avatar
                                        : null
                                }
                            >
                                {courseItem.instructors[0].name}
                            </Avatar>
                        ) : (
                            <Avatar alt="Unknown" />
                        )}
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
                {status === PAYMENT_STATUS_PAID && (
                    <Grid item className="price-tag-container enrolled-tag">
                        ENROLLED
                    </Grid>
                )}
                {status === PAYMENT_STATUS_PENDING && (
                    <Grid item className="price-tag-container pending-tag">
                        PENDING
                    </Grid>
                )}
                {(status === PAYMENT_STATUS_UNREGISTERED || status === PAYMENT_STATUS_EXPIRED) && (
                    <Grid item className="price-tag-container">
                        <Grid item className="price-tag">
                            {courseItem.price
                                ? valueLabelFormat(courseItem.price)
                                : "FREE"}
                        </Grid>{" "}
                    </Grid>
                )}
                <Grid item className="join-btn-container">
                    <Button
                        className="join-btn"
                        onClick={() => goToCourse(courseItem._id)}
                    >
                        {isOrganization || isInstructor || isParticipant
                            ? "OPEN"
                            : "JOIN"}{" "}
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
