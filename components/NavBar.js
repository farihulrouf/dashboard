import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button, AppBar, Toolbar, Typography, IconButton,
  Badge, Container, Grid, CssBaseline, Menu, MenuItem
} from '@material-ui/core';
import CONSTANTS from './constant';
import MenuIcon from '@material-ui/icons/Menu';
import ProfileIcon from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ListItemText from '@material-ui/core/ListItemText';

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
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Helvetica'
  },
  menuItem:{
    color: 'rgba(255,255,255,.5)'
  },
  toolbar: {
    paddingRight: '2%', // keep right padding when drawer closed
  },
  toolbarIcon: {
    ['@media (min-width:800px)']: { 
      display: 'none'
    }
  },
  navBar: {
    ['@media (max-width:800px)']: { 
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

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

class NavBar extends Component{
  constructor(props){
    super(props);
    this.state={active: 0, menuElement: null, accountElement: null}
    // this.onMenuClick = this.onMenuClick.bind(this);
  }

  onMenuClick = (idx) => {
    this.setState({active: idx, menuElement: null});
  }

  handleClick = (event) => {
    this.setState({[event.target.name]: event.currentTarget});
  }

  heading = (active) => {
    switch(active){
      case CONSTANTS.DASHBOARD.MATERIAL:
        return "Dashboard";
      case CONSTANTS.DASHBOARD.REPORT:
        return "Rapor";
      case CONSTANTS.DASHBOARD.TRYOUT:
        return "Try Out"
    }
  }

  handleClose = () => {
    this.setState({[event.target.name]: null})
  };

  render(){
    const {children, classes, auth} = this.props;
    const {active, menuElement, accountElement} = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Grid className={classes.navBar} container spacing={5}>
              <Grid item><Button onClick={() => this.onMenuClick(CONSTANTS.DASHBOARD.MATERIAL)} className={active === 0 ? classes.menuItemActive : classes.menuItem}>Materi</Button></Grid>
              <Grid item><Button onClick={() => this.onMenuClick(CONSTANTS.DASHBOARD.REPORT)} className={active === 1 ? classes.menuItemActive : classes.menuItem}>Rapor</Button></Grid>
              <Grid item><Button onClick={() => this.onMenuClick(CONSTANTS.DASHBOARD.TRYOUT)} className={active === 2 ? classes.menuItemActive : classes.menuItem}>Hasil TO</Button></Grid>
            </Grid>
            <Grid className={classes.toolbarIcon} container>
              <IconButton onClick={this.handleClick.bind(this)} style={{color: 'white'}} aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={menuElement}
                keepMounted
                open={Boolean(menuElement)}
                onClose={this.onMenuClick.bind(this)}
              >
                <MenuItem onClick={this.onMenuClick.bind(this,CONSTANTS.DASHBOARD.MATERIAL)}>Materi</MenuItem>
                <MenuItem onClick={this.onMenuClick.bind(this,CONSTANTS.DASHBOARD.REPORT)}>Rapor</MenuItem>
                <MenuItem onClick={this.onMenuClick.bind(this,CONSTANTS.DASHBOARD.TRYOUT)}>Hasil TO</MenuItem>
              </Menu>
              <h3>{this.heading(active)}</h3>
            </Grid>
            <Grid container style={{justifyContent: 'flex-end'}}>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton name="accountElement" color="inherit" onClick={this.handleClick.bind(this)}>
                <ProfileIcon style={{marginRight: 10}}/>
                <span style={{fontSize: 10}}>{auth.user.name}</span>
              </IconButton>
              <StyledMenu
                id="customized-menu"
                anchorEl={accountElement}
                keepMounted
                open={Boolean(accountElement)}
                onClose={this.handleClose}
              >
                <StyledMenuItem>
                  <ListItemText primary="Sign out" />
                </StyledMenuItem>
              </StyledMenu>
            </Grid>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            {React.cloneElement(children,{active: active})}
          </Container>
        </main>
      </div>
    );
  }
}

export default withStyles(useStyles)(NavBar);