import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import Image from 'next/image'
import Link from 'next/link'
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    marginTop:10,
  },
  
  Toolbar: {
    height: 71,
    display: 'flex',
    justifyContent: 'space-between',

  },

  m_left: {
    width: 250,
    display: 'flex',
    alignItems: 'center'
  },

  m_right: {
    width: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

  },

  ExitToAppOutlinedIcon: {
    height: 40,
    width: 40,
    fill: '#AFAFAF'
  },

  textMyaccount: {
    fontSize: 15,
    marginLeft: 5,
  }
}));

export default function Navbar() {
  const classes = useStyles();

  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
 

  return (
    <div className={classes.root}>
      
      <AppBar position="fixed"
        style={{
          height: 71,
          color: 'black',
          backgroundColor: 'white',
          position: 'fixed'
          }}
      >
        <Toolbar className={classes.Toolbar}>
         <div className={classes.m_left}> 
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Link href='/admin-dashboard'>
              <img
                      alt="klassiq-logo"
                      src="/images/klassiq-logo.svg"
                      style={
                        {
                          height: 59,
                          width: 157
                      }}
              />
              </Link>
          </div>

          <div className={classes.m_right}> 
             
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >

            <AccountCircle style={{fill:'#AFAFAF'}} /> 
            <div className={classes.textMyaccount}>
              My account
            </div>
            </IconButton>
            
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
              

              <ExitToAppOutlinedIcon className={classes.ExitToAppOutlinedIcon}>
              </ExitToAppOutlinedIcon>

         
          </div> 
               
        </Toolbar>
      </AppBar>
    </div>
  );
}
