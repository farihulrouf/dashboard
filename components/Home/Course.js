import { Grid, Button } from "@material-ui/core";
import Avatar from "../Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { Star, ArrowRightAlt, MoreVert } from "@material-ui/icons";
import Router from "next/router";
import React from "react";
import {
    PAYMENT_STATUS_EXPIRED,
    PAYMENT_STATUS_PAID,
    PAYMENT_STATUS_PENDING,
    PAYMENT_STATUS_UNREGISTERED,
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
        price,
        name,
        about,
        creator,
        rating,
        countReview,
        logo,
        instructors,
    } = courseItem;

    const lastPayment = user_payment[user_payment.length - 1];
    const status = lastPayment
        ? lastPayment.status
        : PAYMENT_STATUS_UNREGISTERED;

    const MAX_INSTRUCTORS_DISPLAYED = 3;
    console.log(courseItem);

    return (
        <Grid className="course-container">
            {canEdit && <CourseMore course={courseItem} onUpdate={onUpdate} />}
            <img
                className="course-logo-background"
                src={logo ? logo : "images/default-logo-course.jpg"}
            />
            <Grid container className="course-content">
                <Grid item className="img-container">
                    <Avatar
                        name={creator.name}
                        imgUrl={
                            creator.isAnOrganization
                                ? creator.avatar
                                : "images/personal-course.png"
                        }
                    />
                </Grid>

                <Grid item className="review-container">
                    <Star className="star" />
                    <p>{`${rating} (${
                        countReview ? countReview : 0
                    } reviews)`}</p>
                </Grid>
            </Grid>
            <Grid item className="course-name">
                <h5>{name}</h5>
            </Grid>
            <Grid item className="course-desc">
                <p>
                    {about.length > 100 ? `${about.substring(100)}...` : about}
                </p>
            </Grid>

            <h6 className="course-instructors-title">Instructors:</h6>

            {instructors.length > 0 ? (
                <Grid item className="course-instructors">
                    <AvatarGroup className="course-instructors-avatar" max={MAX_INSTRUCTORS_DISPLAYED}>
                        {instructors.map((instructor, index) => (
                            <Avatar
                                key={index}
                                name={instructor.name}
                                imgUrl={instructor.avatar}
                            />
                        ))}
                    </AvatarGroup>
                    <Grid item className="course-instructors-detail">
                        <h6>Instructors</h6>
                        {instructors.map((instructor, index) => {
                            if (index === 0)
                                return (
                                    <span key={index}>{instructor.name}</span>
                                );
                            else if (index < MAX_INSTRUCTORS_DISPLAYED - 1) {
                                return (
                                    <span
                                        key={index}
                                    >{`, ${instructor.name}`}</span>
                                );
                            }
                        })}
                        {(instructors.length > MAX_INSTRUCTORS_DISPLAYED - 1) && (
                            <span>{`+${
                                instructors.length - MAX_INSTRUCTORS_DISPLAYED
                            } more`}</span>
                        )}
                    </Grid>
                </Grid>
            ) : (
                <Grid item className="no-instructors-yet">
                    No instructors yet!
                </Grid>
            )}

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
                {(status === PAYMENT_STATUS_UNREGISTERED ||
                    status === PAYMENT_STATUS_EXPIRED) && (
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
