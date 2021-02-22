import { Grid, Container, Button } from "@material-ui/core";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Feature from "./Feature";
import Testimoni from "./Testimoni";
import { features, testimonies } from "./HomeContent";
import { getCourses } from "../../lib/api";
import Carousel from "./Carousel";

const HomePage = () => {
  const [course, setCourse] = useState([]);

  useEffect(() => {
    getCourses({
      query: "",
      instructor: [],
      organization: [],
      price: [0, 500000],
      rating: 0,
      limit: 5,
    })
      .then((res) => {
        setCourse(res.courses);
        //console.log(res)
      })
      .catch((err) => {
        setCourse([]);
      });
  }, []);

  return (
    <React.Fragment>
      <img
        src="images/landing-home-bg.png"
        alt="landing-bg"
        className="home-landing-bg"
      />
      <div className="home-container">
        <Container maxWidth="lg">
          <section>
            <h2>
              A platform where you can study anything in
              <span>&#x20;Real Time</span>
              <br />
            </h2>
            <p>
              Edupedia will help you reach your learning goals and saving your
              precious time in learning
            </p>
            <Grid justify="center" container spacing={2}>
              <Grid item>
                <Link href="/signup">
                  <a>
                    <Button variant="contained" className="sign-btn mybtn">
                      Sign Up
                    </Button>
                  </a>
                </Link>
              </Grid>
              <Grid item>
                <Button className="learn-btn mybtn">Learn More</Button>
              </Grid>
            </Grid>
          </section>
        </Container>
      </div>
      <div className="features subtitle">
        <Container maxWidth="lg">
          <section>
            <h4>
              <span>
                Our global class is open
                <span className="for-all">&#x20; for All</span>
              </span>
              <br />
              <span className="best-way">
                The best way to do online learning is to be able to communicate
                two direction
              </span>
            </h4>
            <Grid container justify="space-evenly">
              {features.map((f, i) => (
                <Grid
                  className="feature-item"
                  key={i}
                  item
                  data-aos="flip-left"
                  data-aos-easing="ease-out-cubic"
                  data-aos-duration="1000"
                >
                  <Feature f={f} />
                </Grid>
              ))}
            </Grid>
          </section>
        </Container>
      </div>
      <div className="course subtitle">
        <Container maxWidth="lg">
          <section>
            <h4>
              <span>
                Browse our
                <span className="for-all">&#x20; popular courses</span>
              </span>
              <br />
              <span className="best-way">
                Here are our popular courses you might want to learn
              </span>
            </h4>
            <Carousel course={course} />
          </section>
        </Container>
      </div>
      <div className="testi subtitle">
        <Container maxWidth="lg">
          <section>
            <h4>
              <span className="for-all">Rated 5 out of 5 &#x20;</span>
              stars by our user
              <br />
              <span className="best-way">
                Educators and students have a great experiences using Edupedia,
                Here is what they have to say
              </span>
            </h4>
            <Grid container justify="space-evenly">
              {testimonies.map((t, i) => (
                <Grid
                  item
                  key={i}
                  data-aos="flip-left"
                  data-aos-easing="ease-out-cubic"
                  data-aos-duration="1000"
                >
                  <Testimoni testi={t} />
                </Grid>
              ))}
            </Grid>
          </section>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default HomePage;
