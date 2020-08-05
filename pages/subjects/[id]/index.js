import React from "react";
import {withRouter} from 'next/router'
import {withStyles, Container, Grid, Avatar, Tabs, Tab, Paper, IconButton, Typography, Box, InputBase, Button} from "@material-ui/core";
import {Star} from "@material-ui/icons";
import { authInitialProps } from "../../../lib/auth"
import NavBar from "../../../components/NavBar";
import Home from "../../../components/subject/Home";
import Discussion from "../../../components/subject/Discussion";
import ExerciseSetting from "../../../components/subject/ExerciseSetting";
import { getCourseById } from "../../../lib/api";

const styles = (theme) => ({
    indicator: {
        backgroundColor: "rgb(27, 22, 66)"
    },
    container: {
        backgroundColor: 'white', 
        ['@media (min-width:800px)']: { 
            padding: '20px 48px'
        },
        ['@media (max-width:800px)']: { 
            padding: '20px 9px'
        }
    }
})


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
        "aria-controls": `action-tabpanel-${index}`
    };
}

class Subject extends React.Component{
    constructor(props){
        super(props);
        this.state={tabIndex: 0, course: {}}
    }

    componentDidMount(){
        const {id} = this.props.router.query;
        getCourseById(id).then(course=>this.setState(course));
    }

    render(){
        const {auth, classes, router} = this.props;
        const {tabIndex, course} = this.state;

        return(
            <NavBar auth={auth}>
                <Container className={classes.container}>
                    <Grid name="course-header" container>
                        <Grid xs={12} sm={8} item style={{padding: 16}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <h3 style={{margin: 0, fontWeight: 'bold', color: '#121037', textAlign: 'left', fontSize: '3rem', fontFamily: 'Lato', lineHeight: 1.2}}>{course.name}</h3>
                                </Grid>
                                <Grid item xs={12}>
                                    <h6 style={{margin: 0, color: '#546e7a', textAlign: 'left', fontWeight: 500, fontSize: '1.25rem', lineHeight: 1.6, fontFamily: 'Lato'}}>{course.about}</h6>
                                </Grid>
                                <Grid item xs={12}>
                                    <div style={{display: "flex", backgroundColor: 'white'}}>
                                        <div style={{display: "block"}}><Avatar src="https://thefront.maccarianagency.com/images/photos/people/veronica-adams.jpg" width="40" height="40" style={{border: '3px solid white'}} /></div>
                                        <div style={{display: "block"}}><Avatar src="https://thefront.maccarianagency.com/images/photos/people/akachi-luccini.jpg" width="40" height="40" style={{border: '3px solid white'}} /></div>
                                        <div style={{display: "flex", justifyContent: "flex-end", alignSelf: "center", backgroundColor: "white", flexGrow: 1}}>
                                            <Star style={{color: '#f9a825'}} />
                                            <span style={{fontWeight: 700, fontSize: '1rem', fontColor: '#121037'}}>{course.rating}</span>
                                            <span style={{marginLeft: 8, color: '#546e7a', fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.43}}>(28 reviews)</span>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid xs={12} sm={4} item>
                            <span height="auto" width="auto">
                                <img src="https://thefront.maccarianagency.com/images/illustrations/mobiles.svg" height="100%" width="100%" />
                            </span>
                        </Grid>
                    </Grid>
                    <Tabs classes={{indicator: classes.indicator}} value={tabIndex} onChange={(e,value)=>{this.setState({tabIndex: value})}} aria-label="simple tabs example">
                        <Tab label="Home" {...a11yProps(0)}  />
                        <Tab label="Discussion" {...a11yProps(1)}  />
                        <Tab label="Exercise" {...a11yProps(2)}/>
                    </Tabs>
                    <React.Fragment>
                        <TabPanel value={tabIndex} index={0} className={classes.tabPanel}>
                            <Home
                                auth = {auth} 
                                courseId={router.query.id} 
                                isInstructor = {course.isInstructor} 
                            />
                        </TabPanel>
                        <TabPanel value={tabIndex} index={1} className={classes.tabPanel}>
                            <Discussion
                                auth = {auth}
                                courseId={router.query.id} 
                                isInstructor = {course.isInstructor} 
                            />
                        </TabPanel>
                        <TabPanel value={tabIndex} index={2}>
                            <ExerciseSetting
                                auth = {auth}
                                courseId={router.query.id} 
                                isInstructor = {course.isInstructor} 
                            />
                        </TabPanel>
                    </React.Fragment>
                </Container>
            </NavBar>
        )
    }
}

Subject.getInitialProps = authInitialProps(true);

export default withRouter(withStyles(styles)(Subject));
