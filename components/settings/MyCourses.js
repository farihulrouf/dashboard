import { Grid, CircularProgress, Button, Tabs, Tab } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import Pagination from "@material-ui/lab/Pagination";
import Course from "./../Home/Course";
import { getMyCourses, getMyTeachers } from "../../lib/api";
import CreateEditCourseDialog from "./CreateEditCourseDialog";
import React from "react";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Grid item className="settings-course-container">
                    {children}
                </Grid>
            )}
        </div>
    );
}

export default class MyCourses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            courses: [],
            open: false,
            params: {
                query: "",
                limit: 4,
                page: 1,
            },
            total: 0,
            loading: false,
            dialogProps: {
                auth: props.auth,
                teachers: [],
                onCourseCreated: this.onCourseCreated.bind(this),
                onCourseUpdated: this.onCourseUpdated.bind(this),
            },
        };
        this.onCreateButtonClick = this.onCreateButtonClick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.changePage = this.changePage.bind(this);
    }

    componentDidMount() {
        this.getCourses();
    }

    componentDidUpdate(prevProps, prevState) {
        const { query, page } = this.state.params;
        if (prevState.params.query != query || prevState.params.page != page) {
            this.getCourses();
        }
    }

    getCourses = async () => {
        const { params } = this.state;

        this.setState({ loading: true, courses: [] });

        await getMyCourses(params).then((res) => {
            getMyTeachers().then((teacherRes) => {
                let { dialogProps } = this.state;
                dialogProps.teachers = teacherRes.teachers;
                this.setState({
                    dialogProps: dialogProps,
                });
            });

            this.setState({
                courses: res.data,
                loading: false,
                total: res.total,
            });
        }).catch(err => console.log(err));
    };

    onCreateButtonClick = () => {
        const dialogProps = {
            ...this.state.dialogProps,
            title: "Create New Course",
            course: {},
            action: "create",
            avatarChosen: undefined,
            showCropper: false,
        };
        this.setState({ open: true, dialogProps: dialogProps });
    };

    onCourseCreated = (res) => {
        const { params } = this.state;
        this.setState({ open: false, courses: res.data, params: { ...params, page: 1 } });
    };

    onCourseUpdated = (res) => {
        const { params } = this.state;
        this.setState({ open: false, courses: res.data, params: { ...params, page: 1 } });
    };


    onEditCourse = (course) => {
        const dialogProps = {
            ...this.state.dialogProps,
            title: "Edit Course",
            course: course,
            action: "update",
        };
        this.setState({ open: true, dialogProps: dialogProps });
    };

    handleSearch = async (e) => {
        this.setState((prev) => {
            return {
                params: {
                    ...prev.params,
                    page: 1,
                    query: e.target.value,
                },
            };
        });
    };

    changePage = (current) => {
        this.setState((prev) => {
            return {
                params: {
                    ...prev.params,
                    page: current,
                },
            };
        });
    };

    render() {
        const {
            courses,
            open,
            dialogProps,
            tabIndex,
            params,
            loading,
            total,
        } = this.state;
        const { query, page, limit } = params;
        const totalPage = Math.ceil(total / limit);

        return (
            <Grid item className="settings-course">
                {open && <CreateEditCourseDialog {...dialogProps} />}
                {!open && (
                    <Grid item>
                        <h4 className="settings-course-title">My Courses</h4>
                        <Tabs
                            value={tabIndex}
                            onChange={(e, value) => {
                                this.setState({ tabIndex: value });
                            }}
                            aria-label="simple tabs example"
                            indicatorColor="primary"
                            textColor="primary"
                            className="settings-course-tab"
                        >
                            <Tab label="ALL" {...a11yProps(0)} />
                            {/* <Tab label="UPDATED" {...a11yProps(1)} />
                    <Tab label="PENDING" {...a11yProps(2)} /> */}
                        </Tabs>
                        <Grid item className="settings-course-management">
                            <Button
                                variant="contained"
                                color="primary"
                                className="create-course-btn my-btn"
                                onClick={this.onCreateButtonClick}
                            >
                                CREATE COURSE <Add />
                            </Button>
                            <input
                                className="settings-course-search"
                                placeholder="Search My Course"
                                value={query}
                                onChange={this.handleSearch}
                            />
                        </Grid>
                        {loading && (
                            <CircularProgress
                                thickness={6}
                                size="6rem"
                                className="circular-progress-bar"
                            />
                        )}
                        {courses.length > 0 && (
                            <TabPanel
                                value={tabIndex}
                                index={0}
                                className="course settings-course-body"
                            >
                                {courses.map((course) => {
                                    return (
                                        <Course
                                            key={course._id}
                                            courseItem={course}
                                            onUpdate={this.onCourseUpdated}
                                        />
                                    );
                                })}
                            </TabPanel>
                        )}
                        {!loading && courses.length <= 0 && (
                            <h5 className="no-course">
                                You don't have any courses yet!
                            </h5>
                        )}
                        <Pagination
                            className="settings-course-pagination"
                            count={totalPage}
                            color="primary"
                            page={page}
                            onChange={(e, page) => this.changePage(page)}
                        />
                    </Grid>
                )}
            </Grid>
        );
    }
}
