import React from 'react';
import {Button, IconButton} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import {Settings, Lock} from "@material-ui/icons";
import { makeStyles } from '@material-ui/core/styles';
import { signoutUser } from "../lib/auth";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Router from "next/router";
import io from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  menuText: {
    textTransform: 'none'
  }
}));

export default function MenuListComposition(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const {name} = props;
  const anchorRef = React.useRef(null);
  const ENDPOINT = 'localhost:3000';
  let socket;

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  React.useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('join', {name: 'name', room: 'room'}, (error) => {
    });
  }, [ENDPOINT]);

  React.useEffect(()=> {
    socket.on('message', (message) => {
      console.log(message);
    })
  }, []);

  return (
    <div className={classes.root}>
      <div>
        <Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          endIcon={<KeyboardArrowDownIcon />}
        >
          <span className={classes.menuText}>{name}</span>
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    {name === "Account" &&
                      [{id: 1, name: "Settings", icon: <Settings />, action: () => Router.push("/settings")}, {id: 2, name: "Log Out", icon: <Lock />, action: signoutUser}].map(item=> (
                        <MenuItem onClick={item.action} key={item.id}>
                          <IconButton style={{padding: 0, marginRight: 10}} aria-label="settings">
                            {item.icon}
                          </IconButton>
                          {item.name}
                        </MenuItem>
                      ))
                    }
                    {name === "Pages" &&
                      [{id: 1, name: "Home", action: () => {}}, {id: 2, name: "Rapor", action: () => {}}].map(item=> (
                        <MenuItem onClick={item.action} key={item.id}>{item.name}</MenuItem>
                      ))
                    }
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}