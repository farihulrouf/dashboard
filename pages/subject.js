import React from "react";
import NavBar from '../components/NavBar';
import {makeStyles, ButtonBase, Grid, ButtonGroup, Button, Chip} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import PropTypes from "prop-types";
import SwipeableViews from 'react-swipeable-views';               
import { useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Discussion from './material/Discussion';
import Prerequisite from './material/Prerequisite';
import Exercise from './material/Exercise';
import ExerciseSetting from './material/ExerciseSetting';
import {HelpIcon} from '@material-ui/icons/Help';
import { authInitialProps } from "../lib/auth";

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

function FloatingActionButtonZoom() {
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
                <Tab label="Discussion" {...a11yProps(0)} />
                <Tab label="Prerequisite" {...a11yProps(1)} />
                <Tab label="Exercise" {...a11yProps(2)} />
            </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
          className={classes.swipeableViews}
        >
            <TabPanel value={value} index={0} dir={theme.direction}>
                <Discussion />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
                <span>Ini Prerequisite</span>{/* <Two/> */}
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
                <ExerciseSetting/>
            </TabPanel>
        </SwipeableViews>
      </Grid>
    );
}


class Subject extends React.Component {
    constructor(props){
        super(props)
        this.state={isOne: true, isTwo: false, isThree: false};
    }

    render(){
        const {classes} = this.props;
        return(
        <NavBar {...this.props}>
            <React.Fragment>
            <Grid className={classes.root} container>
                <Grid xs={12} sm={2} item style = {{textAlign: 'center'}}>
                    <img style={{width: '100%'}} src="https://cdn63.picsart.com/191275780000201.jpg" alt="complex" />
                </Grid>
                <Grid xs={12} sm={6} item style={{padding: 20, paddingTop: 0}}>
                    <h1>Kalkulus IA</h1>
                    <p style={{lineHeight: 2}} >
                    Silabus ringkas: Sistem Bilangan Real, Pertaksamaan, Fungsi dan Limit, 
                    Turunan dan Penggunaannya, Integral dan Penggunaannya,
                    Fungsi Transenden
                    </p>
                    <Grid container>
                        <img width="50"
                            style={{marginRight: 10}}
                            src="https://upload.wikimedia.org/wikipedia/en/thumb/8/85/Institut_Teknologi_Bandung_logo.svg/1200px-Institut_Teknologi_Bandung_logo.svg.png" />
                        <img width="50" 
                            style={{marginRight: 10, maxWidth: 50, maxHeight: 50, borderRadius: '50%'}}
                            src="https://www.professoren.tum.de/fileadmin/w00bgr/www/pics/RixenDaniel_01.jpg" />
                    </Grid>
                </Grid>
                <Grid xs={12} sm={4} item>
                    <Grid container style={{justifyContent: 'center',  alignItems: 'center', paddingTop: 20, paddingBottom: 20, height: '80%'}}>
                        <div>
                        <Chip label="Bilangan Real" variant="outlined" className={classes.chip} />
                        <Chip label="Pertaksamaan" variant="outlined" className={classes.chip}  />
                        <Chip label="Fungsi dan Limit" variant="outlined" className={classes.chip}  />
                        <Chip label="Turunan" variant="outlined" className={classes.chip}  />
                        <Chip label="Reimann" variant="outlined" className={classes.chip}  />
                        <Chip label="Deret" variant="outlined" className={classes.chip}  />
                        </div>
                    </Grid>
                    <Grid container justify="center" alignItems="flex-end">
                        <Button style={{width: '70%', height: 50}} variant="contained" color="primary">
                            JOIN COURSE
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container>
                <FloatingActionButtonZoom />
            </Grid>
            </React.Fragment>
        </NavBar>)
    }
}


Subject.getInitialProps = authInitialProps(true);

export default withStyles(styles)(Subject);