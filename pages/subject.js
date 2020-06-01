import React from "react";
import NavBar from '../src/NavBar';
import {makeStyles, ButtonBase, Grid, ButtonGroup, Button} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import One from '../src/One';
import Two from '../src/Two';
import Three from '../src/Three';
import {HelpIcon} from '@material-ui/icons/Help';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        minHeight: 200,
        flexGrow: 1,
    }
}));

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
      <div className={classes.root}>
        <AppBar position="static" color="default">
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                aria-label="action tabs example"
                style = {{backgroundColor : "white"}}
            >
            {/* <HelpIcon /> */}
            <Tab label="Discussion" {...a11yProps(0)} />
            <Tab label="Prerequisite" {...a11yProps(1)} />
            <Tab label="Exercise" {...a11yProps(2)} />
            </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
          style={{backgroundColor: '#f5f5f5'}}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <One />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Two/>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Three/>
          </TabPanel>
        </SwipeableViews>
      </div>
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
        <NavBar>
            <Grid container direction="row" style={{justifyContent: 'center'}} wrap = "nowrap">
                <Grid item style = {{marginRight : 30}}>
                    <img width="250" src="https://cdn63.picsart.com/191275780000201.jpg" alt="complex" />
                </Grid>
                <Grid item justify="right">
                    <h1>Matematika</h1>
                    <p style={{lineHeight: 2, width: "370px"}} >
                        Avengers: Endgame is a 2019 American superhero film based on the Marvel Comics superhero team the Avengers, 
                        produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures. 
                        It is the direct sequel to Avengers: Infinity War (2018) and the 22nd film in the Marvel Cinematic Universe (MCU). 
                    </p>
                </Grid>
            </Grid>
            <Grid container>
                <FloatingActionButtonZoom/>
            </Grid>
            {/* <ButtonGroup variant="text" color="primary" aria-label="text primary button group" style={{width: "100%", justifyContent : 'center', marginTop : 50}}>
                <Button onClick={()=>this.setState({isOne: true, isTwo: false, isThree: false})}  style={{width: 200, backgroundColor : isOne ? 'pink' : 'white'}}>One</Button>
                <Button onClick={()=>this.setState({isOne: false, isTwo: true, isThree: false})} style={{width: 200, backgroundColor : isTwo ? 'pink' : 'white'}}>Two</Button>
                <Button onClick={()=>this.setState({isOne: false, isTwo: false, isThree: true})} style={{width: 200, backgroundColor : isThree ? 'pink' : 'white'}}>Three</Button>
            </ButtonGroup>
            <Grid container>
                {this.state.isOne && <One />}
                {this.state.isTwo && <Two />}
                {this.state.isThree && <Three />}
            </Grid> */}
            
        </NavBar>)
    }
}
export default withStyles(useStyles)(Subject);