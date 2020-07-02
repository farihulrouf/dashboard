import React from "react";
import NavBar from '../../../components/NavBar';
import {makeStyles, Grid, Avatar, Button, Chip} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import PropTypes from "prop-types";
import SwipeableViews from 'react-swipeable-views';               
import { useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Discussion from '../../../components/subject/Discussion'
import Home from '../../../components/subject/Home';
import ExerciseSetting from '../../../components/subject/ExerciseSetting';
import {HelpIcon} from '@material-ui/icons/Help';
import { authInitialProps } from "../../../lib/auth"
import {withRouter} from 'next/router'
import {getCourseById} from '../../../lib/api';

const styles = (theme => ({
    root: {
        backgroundColor: '#ffffff',
        padding: 20,
        paddingTop: '100vh',
        marginTop: '-100vh',
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)"
    },
    swipeableViews: {
        flexGrow: 1,
        borderRadius: 10,
        minHeight: 200
    },
    chip: {
        margin: '5px',
        marginLeft: 0
    },
    tabPanel: {
    }
}));

const useStyles = makeStyles(styles);

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
        {value === index && <Box p={3}>{children}</Box>}
        </Typography>
        // <span>TabPanel yo</span>
    );
  }
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};
  
function a11yProps(index) {
    return {
        id: `action-tab-${index}`,
        "aria-controls": `action-tabpanel-${index}`
    };
}

function FloatingActionButtonZoom(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    const handleChangeIndex = index => {
      setValue(index);
    };
  
    return (
      <Grid container>
        <AppBar elevation={0} position="static" style={{ boxShadow: "0 6px 8px 0 rgba(0, 0, 0, 0.2)"}}>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                aria-label="action tabs example"
                style = {{backgroundColor : "#fff"}}
            >
                <Tab label="Home" {...a11yProps(0)} />
                <Tab label="Discussion" {...a11yProps(1)} />
                <Tab label="Exercise" {...a11yProps(2)} />
            </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
          className={classes.swipeableViews}
        >
            <TabPanel value={value} index={0} className={classes.tabPanel} dir={theme.direction}>
                <Home
                    auth = {props.auth} 
                    courseId={props.router.query.id} 
                    isInstructor = {props.isInstructor} 
                />
            </TabPanel>
            <TabPanel value={value} index={1} className={classes.tabPanel} dir={theme.direction}>
                <Discussion
                    auth = {props.auth}
                    courseId={props.router.query.id} 
                    isInstructor = {props.isInstructor} 
                />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
                <ExerciseSetting
                    auth = {props.auth}
                    courseId={props.router.query.id} 
                    isInstructor = {props.isInstructor} 
                />
            </TabPanel>
        </SwipeableViews>
      </Grid>
    );
}


class Subject extends React.Component {
    constructor(props){
        super(props)
        this.state={isOne: true, isTwo: false, isThree: false, course: {}};
    }

    componentDidMount(){
        const {id} = this.props.router.query;
        getCourseById(id).then(course => this.setState(course))
    }

    render(){
        const {classes} = this.props;
        const {course, joinStatus} = this.state;
        return(
        <NavBar auth={this.props.auth}>
            <React.Fragment>
            <Grid className={classes.root} container>
                <Grid xs={12} sm={2} item style = {{textAlign: 'center'}}>
                    <img style={{width: '100%'}} src={course.logo} alt="complex" />
                </Grid>
                <Grid xs={12} sm={6} item style={{padding: 20, paddingTop: 0}}>
                    <h1>{course.name}</h1>
                    <p style={{lineHeight: 2}} >{course.about}</p>
                    <Grid container spacing={2}>
                        {course.instructors && course.instructors.map((ins,idx)=>
                            <Grid key={idx} item>
                                <Avatar alt={ins.name} src={ins.avatar} />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid xs={12} sm={4} item>
                    <Grid container style={{justifyContent: 'center',  alignItems: 'center', paddingTop: 20, paddingBottom: 20, height: '80%'}}>
                        <div>
                            {course.prerequisites && course.prerequisites.map((prereq,idx) => (
                                <Chip key={idx} label={prereq} variant="outlined" className={classes.chip} />
                            ))}
                        </div>
                    </Grid>
                    <Grid container justify="center" alignItems="flex-end">
                        {!joinStatus && <Button style={{width: '70%', height: 50}} variant="contained" color="primary">
                            JOIN COURSE
                        </Button>}
                        {joinStatus == 'pending' && <Button style={{width: '70%', height: 50}} variant="contained" color="primary">
                            JOIN REQUEST SENT
                        </Button>}
                        {joinStatus == 'joined' && <Button style={{width: '70%', height: 50}} variant="contained" color="primary">
                            EXIT COURSE
                        </Button>}
                    </Grid>
                </Grid>
            </Grid>
            <Grid container>
                <FloatingActionButtonZoom isInstructor={course.isInstructor} {...this.props} />
            </Grid>
            </React.Fragment>
        </NavBar>)
    }
}


Subject.getInitialProps = authInitialProps(true);

export default withStyles(styles)(withRouter(Subject));