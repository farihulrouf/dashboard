import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Slider from "react-slick";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import Course from "./Course";

const Carousel = ({ course }) => {
    const [itemIndex, setItemIndex] = useState(0);

    const PrevArrow = ({ onClick }) => {
        return (
            <Grid item className="arrow" onClick={() => onClick()}>
                <ArrowBackIos />
            </Grid>
        );
    };

    const NextArrow = ({ onClick }) => {
        return (
            <Grid item className="arrow" onClick={() => onClick()}>
                <ArrowForwardIos />
            </Grid>
        );
    };

    const settings = {
        infinite: true,
        speed: 500,
        lazyLoad: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        autoplay: true,
        autoplaySpeed: 1500,
        pauseOnHover: true,
        swipeToSlide: true,
        beforeChange: (current, next) => setItemIndex(next),
        responsive: [
            {
                breakpoint: 1160,
                settings: {
                    slidesToShow: 2,
                    centerMode: false,
                },
            },
            {
                breakpoint: 866,
                settings: {
                    slidesToShow: 1,
                    centerMode: false,
                },
            },
        ],
    };
    return (
        <Grid className="carousel">
            <Slider {...settings}>
                {course.map((item, index) => {
                    return (
                        <Grid
                            key={index}
                            item
                            className={
                                index === itemIndex
                                    ? "slide activeSlide"
                                    : "slide"
                            }
                        >
                            <Course courseItem={item} />
                        </Grid>
                    );
                })}
            </Slider>
        </Grid>
    );
};

export default Carousel;
