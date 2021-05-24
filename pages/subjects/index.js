import React from "react";
import Router, {withRouter} from "next/router";
import {
    Container,
    Grid,
    Tabs,
    Tab,
    Typography,
    Box,
    Button
} from "@material-ui/core";
import Avatar from "../../components/Avatar";
import {Star, ArrowRightAlt} from "@material-ui/icons";
import Breadcrumb from "../../components/subject/Breadcrumb";
import {authInitialProps} from "../../lib/auth";
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
import StudentExerciseList from "../../components/subject/exercise/StudentExerciseList";
import StudentCreateExercise from "../../components/subject/exercise/StudentCreateExercise";
import CONSTANT from "../../constant";
import StudentExerciseReview from "../../components/subject/exercise/StudentExerciseReview";

function TabPanel(props) {
    const {
        children,
        value,
        index,
        ...other
    } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`action-tabpanel-${index}`}
            aria-labelledby={`action-tab-${index}`}
            {...other}>
            {value === index && <Box p={1}>{children}</Box>}
        </Typography>
    );
}

function a11yProps(index) {
    return {id: `action-tab-${index}`, "aria-controls": `action-tabpanel-${index}`};
}

const valueLabelFormat = (value) => {
    const array = String(value).split("");

    return `Rp. ${array
        .map((char, index) => {
            if (index > 0 && index % 3 === array.length % 3) {
                return `.${char}`;
            } else {
                return char;
            }
        })
        .join("")},00`;
};

function CourseStatus(props) {
    const { status, price, handleEnroll, isInstructor } = props;
    if (isInstructor) return "";
    if (status === CONSTANT.PAYMENT_STATUS_PENDING) {
        return (
            <Grid container className="btn-container">
                <Grid item>
                    <div className="pending-tag mybtn">
                        <span>PENDING</span>
                    </div>
                </Grid>
                <Grid item className="join-btn-container">
                    <Button className="join-btn mybtn" onClick={handleEnroll}>
                        <p>Finish Payment</p>
                        <ArrowRightAlt
                            style={{
                            color: "white"
                        }}/>
                    </Button>
                </Grid>
            </Grid>
        );
    } else if (status === CONSTANT.PAYMENT_STATUS_PAID) {
        return (
            <Grid container className="btn-container">
                <Grid item>
                    <div className="enrolled-tag mybtn">
                        <span>ENROLLED</span>
                    </div>
                </Grid>
            </Grid>
        );
    }
    return (
        <Grid container className="btn-container">
            <Grid item>
                <div className="price-tag mybtn">
                    <span>{valueLabelFormat(price)}</span>
                </div>
            </Grid>
            <Grid item className="join-btn-container">
                <Button className="join-btn mybtn" onClick={handleEnroll}>
                    <p>Join Course</p>
                    <ArrowRightAlt
                        style={{
                        color: "white"
                    }}/>
                </Button>
            </Grid>
        </Grid>
    );
}


class Subject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            course: {},
            joined: CONSTANT.PAYMENT_STATUS_UNREGISTERED,
            exercise_page_active: 'ExerciseList', 
            exam_page_active: 'ExamList' 
        };
        this.handleEnroll = this
            .handleEnroll
            .bind(this);
    }

    componentDidMount() {
        const {id} = this.props.router.query;

        getCourseById(id).then((data) => {
            this.setState({course: data.course, joined: data.course.enrollStatus});
        });
    }

    handleEnroll = () => {
        const {joined} = this.state;
        const {_id} = this.state.course;

        if (joined === CONSTANT.PAYMENT_STATUS_UNREGISTERED) {
            const payload = {
                course: this.state.course
            };

            createInvoice(payload).then((res) => {
                if (!res.data.error) {
                    this.setState({ joined: CONSTANT.PAYMENT_STATUS_PENDING });
                    window.open(res.data.invoice_url, "_blank");
                } else {
                    console.log(res.data.error);
                }
            });
        } else if (joined === CONSTANT.PAYMENT_STATUS_PENDING) {
            getMyInvoice().then((res) => {
                res
                    .payment
                    .forEach((p) => {
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
        const { creator, instructors, createdAt, name, isInstructor } = course;

        console.log(course);

        let lengthInstructors = 0;

        if (instructors) {
            lengthInstructors = instructors.length;
        }

        if (!auth) {
            window.location.href = "/signin";
        }

        return (
            <NavBar auth={auth}>
                <Container className="subject-container">
                    <Container className="subject-header-container">
                        <Grid name="course-header" container className="subject-header">
                            <Grid item className="breadcrumb">
                                <Breadcrumb courseName={name}/>
                            </Grid>
                            <Grid item className="subject">
                                <Grid item className="subject-header-desc">
                                    {creator
                                        ? (
                                            <Grid item className="creator-container">
                                                <Grid className="creator-logo" item container>
                                                    <a href={creator.linkedIn}>
                                                        <Avatar
                                                            name={course.creator.name}
                                                            imgUrl={course.creator.isAnOrganization
                                                            ? course.creator.avatar
                                                            : "images/personal-course.png"} 
                                                        />   
                                                    </a>
                                                </Grid>
                                                {creator.isAnOrganization
                                                    ? (
                                                        <Grid className="org-desc" item>
                                                            {creator
                                                                ? (
                                                                    <h5>{creator.name}</h5>
                                                                )
                                                                : ("")}
                                                        </Grid>
                                                    )
                                                    : (
                                                        <Grid className="creator-desc" item xs={10}>
                                                            <h6>Personal Course</h6>
                                                            {creator
                                                                ? (
                                                                    <h6 className="creator-name">
                                                                        by: {creator.name}
                                                                    </h6>
                                                                )
                                                                : ("")}
                                                        </Grid>
                                                    )}
                                            </Grid>
                                        )
                                        : ("")}
                                    <Grid className="subject-title" item>
                                        <h2>{course.name}</h2>
                                    </Grid>
                                    <Grid className="subject-desc" item>
                                        <h5>{course.about}</h5>
                                    </Grid>
                                    <Grid item>
                                        <div>
                                            <div className="subject-rating">
                                                <Star
                                                    style={{
                                                    color: "#f9a825"
                                                }}/>
                                                <span className="rating">
                                                    {`${course.rating} `}&nbsp;
                                                </span>
                                                <span className="review">{`(${
                                                    course.countReview
                                                        ? course.countReview
                                                        : 0} reviews)`}</span>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid className="subject-header-button" item>
                                    <CourseStatus
                                        status={joined}
                                        price={course.price}
                                        handleEnroll={this.handleEnroll}
                                        isInstructor={course.isInstructor}/>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid className="subject-instructors" container>
                            <Grid className="instructors-title" item>
                                <p>Instructors:</p>
                            </Grid>
                            <Grid item container>
                                {lengthInstructors ? (
                                    instructors.map((instructor, index) => (
                                        <InstructorItem
                                            key={index}
                                            id={instructor._id}
                                            data={instructor}
                                        />
                                    ))
                                ) : (
                                    <span>No available instructors</span>
                                )}
                            </Grid>
                        </Grid>
                    </Container>
                    <Tabs
                        value={tabIndex}
                        onChange={(e, value) => {
                        this.setState({tabIndex: value});
                    }}
                        aria-label="simple tabs example"
                        indicatorColor="primary"
                        textColor="primary"
                        className="tab-container"
                        centered>
                        <Tab label="Home" {...a11yProps(0)}/>
                        <Tab label="Discussion" {...a11yProps(1)}/>
                        <Tab label="Exercise" {...a11yProps(2)} />
                        <Tab label="Exam" {...a11yProps(3)} />
                    </Tabs>
                    {!course.isInstructor && <React.Fragment>
                        <TabPanel value={tabIndex} index={0}>
                            <Home
                                auth={auth}
                                courseId={router.query.id}
                                isInstructor={isInstructor}
                                instructors={instructors}
                                creator={creator}
                                price={course.price}
                                createdAt={createdAt}
                                isEnrolled={joined}
                                enroll={this.handleEnroll}
                                className="subject-home"/>
                        </TabPanel>
                        <TabPanel value={tabIndex} index={1}>
                            <Discussion
                                auth={auth}
                                courseId={router.query.id}
                                isInstructor={course.isInstructor}
                                className="subject-discussion"/>
                        </TabPanel>
                        <TabPanel value={tabIndex} index={2}>
                        {this.state.exercise_page_active === 'ExerciseList'&&
                            <StudentExerciseList
                            tabIndex = {2}
                            changeTabPage = {this.changeTabPage.bind(this)}
                            auth={auth}
                            courseId={router.query.id}
                            isInstructor={course.isInstructor}
                            className="subject-exercise-list"
                            />
                        }
                        {this.state.exercise_page_active === 'CreateExercise'&&
                            <StudentCreateExercise
                            tabIndex = {2}
                            changeTabPage = {this.changeTabPage.bind(this)}
                            auth={auth}
                            courseId={router.query.id}
                            isInstructor={course.isInstructor}
                            className="subject-exercise-student-create"
                            />
                        }
                        {this.state.exercise_page_active === 'ExerciseReview'&&
                            <StudentExerciseReview
                            tabIndex = {2}
                            changeTabPage = {this.changeTabPage.bind(this)}
                            auth={auth}
                            courseId={router.query.id}
                            isInstructor={course.isInstructor}
                            className="subject-exercise-student-review"
                            />
                        }
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
                                creator={creator}
                                price={course.price}
                                createdAt={createdAt}
                                isEnrolled={joined}
                                enroll={this.handleEnroll}
                                className="subject-home"/>
                        </TabPanel>
                        <TabPanel value={tabIndex} index={1}>
                            <Discussion
                                auth={auth}
                                courseId={router.query.id}
                                isInstructor={course.isInstructor}
                                className="subject-discussion"/>
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
                    </React.Fragment>}
                </Container>
            </NavBar>
        );
    }
}

Subject.getInitialProps = authInitialProps(true);

export default withRouter(Subject);
