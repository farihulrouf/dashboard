import React, { Component } from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Drawer, Box, Button} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {Menu, MenuItem, useMediaQuery} from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = (theme) => ({
  root: {
    display: 'flex',
  },
  menuItemActive: {
    color: '#fff'
  },
  menuItem:{
    color: 'rgba(255,255,255,.5)'
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    ['@media (min-width:500px)']: { 
      display: 'none'
    }
  },
  navBar: {
    ['@media (max-width:500px)']: { 
      display: 'none'
    }
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
});

class Dashboard extends Component{
  constructor(props){
    super(props);
    this.state={active: 0, anchorEl: null}
    // this.onMenuClick = this.onMenuClick.bind(this);
  }

  onMenuClick = (idx) => {
    this.setState({active: idx});
  }

  handleClick = (event) => {
    this.setState({anchorEl: event.currentTarget});
  }

  handleClose = () => {
    this.setState({anchorEl: null})
  }

  render(){
    const {children, classes} = this.props;
    const {active, anchorEl} = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Grid className={classes.navBar} container spacing={5}>
              <Grid item><Button onClick={() => this.onMenuClick(0)} className={active === 0 ? classes.menuItemActive : classes.menuItem}>Materi</Button></Grid>
              <Grid item><Button onClick={() => this.onMenuClick(1)} className={active === 1 ? classes.menuItemActive : classes.menuItem}>Rapor</Button></Grid>
              <Grid item><Button onClick={() => this.onMenuClick(2)} className={active === 2 ? classes.menuItemActive : classes.menuItem}>Hasil TO</Button></Grid>
            </Grid>
            <Grid className={classes.toolbarIcon} container>
              <IconButton onClick={this.handleClick.bind(this)} style={{color: 'white'}} aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={this.handleClose.bind(this)}
              >
                <MenuItem onClick={this.handleClose.bind(this)}>Materi</MenuItem>
                <MenuItem onClick={this.handleClose.bind(this)}>Rapor</MenuItem>
                <MenuItem onClick={this.handleClose.bind(this)}>Hasil TO</MenuItem>
              </Menu>
            </Grid>
            <Grid>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Grid>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            {children}
          </Container>
        </main>
      </div>
    );
  }
}

export default withStyles(useStyles)(Dashboard);