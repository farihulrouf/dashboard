import React from "react";
import { withRouter } from "next/router";
import {
  Container,
  Grid,
  Avatar,
  Tabs,
  Tab,
  Typography,
  Box,
  Button,
} from "@material-ui/core";
import { Star, ArrowRightAlt } from "@material-ui/icons";
import Breadcrumb from "../../components/subject/Breadcrumb";
import { authInitialProps } from "../../lib/auth";
import NavBar from "../../components/Navbar/NavBar";
import Home from "../../components/subject/Home";
import Discussion from "../../components/subject/Discussion";
import ExerciseSetting from "../../components/subject/ExerciseSetting";
import CreateExercise from "../../components/subject/exercise/CreateExercise";
import ExerciseList from "../../components/subject/exercise/ExerciseList";
import CreateExam from "../../components/subject/exam/CreateExam";
import ExamList from "../../components/subject/exam/ExamList";
import InstructorItem from "../../components/subject/InstructorItem";
import {
  getCourseById,
  getJoinedCourse,
  createInvoice,
  getMyInvoice,
} from "../../lib/api";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={1}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    "aria-controls": `action-tabpanel-${index}`,
  };
}

function CourseStatus(props) {
  const { status, price, handleEnroll } = props;
  if (status == 1) {
    return (
      <Grid container className="btn-container">
        <Grid item className="pending-tag-container">
          <div className="pending-tag mybtn">PENDING</div>
        </Grid>
        <Grid item className="join-btn-container">
          <Button className="join-btn mybtn" onClick={handleEnroll}>
            <p>Finish Payment</p>
            <ArrowRightAlt
              style={{
                color: "white",
              }}
            />
          </Button>
        </Grid>
      </Grid>
    );
  } else if (status == 2) {
    return (
      <Grid container className="btn-container">
        <Grid item className="enrolled-tag-container">
          <div className="enrolled-tag mybtn">ENROLLED</div>
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid container className="btn-container">
      <Grid item className="price-tag-container">
        <div className="price-tag mybtn">Rp. {price}</div>
      </Grid>
      <Grid item className="join-btn-container">
        <Button className="join-btn mybtn" onClick={handleEnroll}>
          <p>Join Course</p>
          <ArrowRightAlt
            style={{
              color: "white",
            }}
          />
        </Button>
      </Grid>
    </Grid>
  );
}

class Subject extends React.Component {

  constructor(props) {
    super(props);
    this.state = { tabIndex: 0, course: {}, joined: 0, exercise_page_active: 'ExerciseList', exam_page_active: 'ExamList' };
    this.handleEnroll = this.handleEnroll.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.router.query;
    getCourseById(id).then((course) => {
      this.setState(course, () => {
        getMyInvoice().then((res) => {
          if (
            res.status == "ok" &&
            res.payment.some(
              (p) =>
                this.state.course._id === p.course && p.status === "PENDING"
            )
          ) {
            this.setState({ joined: 1 });
          } else if (
            res.status == "ok" &&
            res.payment.some(
              (p) => this.state.course._id === p.course && p.status === "PAID"
            )
          ) {
            this.setState({ joined: 2 });
          } else {
            getJoinedCourse().then((courses) => {
              courses.forEach((course) => {
                if (this.state.course._id === course._id) {
                  this.setState({ joined: 2 });
                }
              });
            });
          }
        });
      });
    });
  }

  handleEnroll = () => {
    const { joined } = this.state;
    const { _id } = this.state.course;

    if (joined === 0) {
      const payload = {
        course: this.state.course,
      };

      createInvoice(payload).then((res) => {
        if (!res.data.error) {
          console.log(res.data);
          this.setState({ joined: 1 });
          window.open(res.data.invoice_url, "_blank");
        } else {
          console.log(res.data.error);
        }
      });
    } else if (joined === 1) {
      getMyInvoice().then((res) => {
        res.payment.forEach((p) => {
          if (p.course === _id) {
            window.open(p.invoice_url, "_blank");
          }
        });
      });
    }
  };

  changeTabPage = (tabIndex, pageName) => {
    if(tabIndex === 2){
      this.setState({exercise_page_active: pageName})
    }else if(tabIndex === 3){
      this.setState({exam_page_active: pageName})
    }else{
      this.setState({tabIndex: tabIndex})
    }
  }

  render() {
    const { auth, router } = this.props;
    const { tabIndex, course, joined } = this.state;
    const { creator, instructors, createdAt, name } = course;

    return (
      <NavBar auth={auth}>
        <Container className="subject-container">
          <Grid name="course-header" container className="subject-header">
            <Grid item className="breadcrumb">
              <Breadcrumb courseName={name} />
            </Grid>
            <Grid item className="subject">
              <Grid className="subject-header-desc">
                {creator ? (
                  <Grid item className="creator-container">
                    <Grid className="creator-logo" item container>
                      <a href={creator.linkedIn}>
                        <Avatar
                          alt={creator.name}
                          src={creator.avatar}
                          className="logo"
                        />
                      </a>
                    </Grid>
                    {creator.isAnOrganization ? (
                      <Grid className="org-desc" item>
                        {creator ? <h5>{creator.name}</h5> : ""}
                      </Grid>
                    ) : (
                      <Grid className="creator-desc" item xs={10}>
                        <h6>Personal Course</h6>
                        {creator ? (
                          <h6 className="creator-name">by: {creator.name}</h6>
                        ) : (
                          ""
                        )}
                      </Grid>
                    )}
                  </Grid>
                ) : (
                  ""
                )}
                <Grid className="subject-title" item>
                  <h2>{course.name}</h2>
                </Grid>
                <Grid className="subject-desc" item>
                  <h5>{course.about}</h5>
                </Grid>
                <Grid item>
                  <div>
                    <div className="subject-rating">
                      <Star style={{ color: "#f9a825" }} />
                      <span className="rating">
                        {`${course.rating} `}&nbsp;
                      </span>
                      <span className="review">{`(${
                        course.countReview ? course.countReview : 0
                      } reviews)`}</span>
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Grid className="subject-header-button" item>
                <CourseStatus
                  status={joined}
                  price={course.price}
                  handleEnroll={this.handleEnroll}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid className="subject-instructors" container>
            <Grid className="instructors-title" item>
              <p>Instructors:</p>
            </Grid>
            <Grid item container>
              {instructors &&
                instructors.map((instructor) => (
                  <InstructorItem id={instructor._id} data={instructor} />
                ))}
            </Grid>
          </Grid>
          <Tabs
            value={tabIndex}
            onChange={(e, value) => {
              this.setState({ tabIndex: value });
            }}
            aria-label="simple tabs example"
            indicatorColor="primary"
            textColor="primary"
            className="tab-container"
            centered
          >
            <Tab label="Home" {...a11yProps(0)} />
            <Tab label="Discussion" {...a11yProps(1)} />
            <Tab label="Exercise" {...a11yProps(2)} />
            <Tab label="Exam" {...a11yProps(3)} />
          </Tabs>
          {!course.isInstructor &&
          <React.Fragment>
            <TabPanel value={tabIndex} index={0}>
              <Home
                auth={auth}
                courseId={router.query.id}
                isInstructor={course.isInstructor}
                instructors={instructors}
                createdAt={createdAt}
                className="subject-home"
              />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <Discussion
                auth={auth}
                courseId={router.query.id}
                isInstructor={course.isInstructor}
                className="subject-discussion"
              />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              <ExerciseSetting
                tabIndex = {2}
                auth={auth}
                courseId={router.query.id}
                isInstructor={course.isInstructor}
                className="subject-exercise"
                />
            </TabPanel>
          </React.Fragment>
          }
          {course.isInstructor &&
          <React.Fragment>
            <TabPanel value={tabIndex} index={0}>
              <Home
                auth={auth}
                courseId={router.query.id}
                isInstructor={course.isInstructor}
                instructors={instructors}
                createdAt={createdAt}
                className="subject-home"
              />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <Discussion
                auth={auth}
                courseId={router.query.id}
                isInstructor={course.isInstructor}
                className="subject-discussion"
              />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              {this.state.exercise_page_active === 'ExerciseList'&&
                <ExerciseList
                  tabIndex = {2}
                  changeTabPage = {this.changeTabPage.bind(this)}
                  auth={auth}
                  courseId={router.query.id}
                  isInstructor={course.isInstructor}
                  className="subject-exercise-list"
                />
              }
              {this.state.exercise_page_active === 'CreateExercise'&&
                <CreateExercise
                  tabIndex = {2}
                  changeTabPage = {this.changeTabPage.bind(this)}
                  auth={auth}
                  courseId={router.query.id}
                  isInstructor={course.isInstructor}
                  className="subject-exercise-create"
                />
              }
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
              {this.state.exam_page_active === 'ExamList'&&
                <ExamList
                  tabIndex = {3}
                  changeTabPage = {this.changeTabPage.bind(this)}
                  auth={auth}
                  courseId={router.query.id}
                  isInstructor={course.isInstructor}
                  className="subject-exam-list"
                />
              }
              {this.state.exam_page_active === 'CreateExam'&&
                <CreateExam
                  tabIndex = {3}
                  changeTabPage = {this.changeTabPage.bind(this)}
                  auth={auth}
                  courseId={router.query.id}
                  isInstructor={course.isInstructor}
                  className="subject-exercise-create"
                />
              }
            </TabPanel>
          </React.Fragment>
          }
        </Container>
      </NavBar>
    );
  }
}

Subject.getInitialProps = authInitialProps(true);

export default withRouter(Subject);
