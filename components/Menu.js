import React from 'react';
import {Button, IconButton, Badge, withStyles} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import {Settings, Lock, Notifications} from "@material-ui/icons";
import { makeStyles } from '@material-ui/core/styles';
import { signoutUser } from "../lib/auth";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Router from "next/router";
import Notification from "./Notification";
import {connect} from "react-redux";

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


const StyledBadge = withStyles((theme) => ({
  badge: {
      fontSize: 10,
      backgroundColor: 'red',
      color: 'white',
      fontWeight: 700
  },
}))(Badge);

function MenuListComposition(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const {name} = props;
  const anchorRef = React.useRef(null);

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

  return (
    <div className={classes.root}>
      <div>
        {name == "Notifications" &&
          <IconButton onClick={handleToggle} ref={anchorRef} aria-controls={open ? 'menu-list-grow' : undefined}>
              <StyledBadge badgeContent={props.notifications.unread}>
                  <Notifications style={{fontSize: 20}} />
              </StyledBadge>
          </IconButton>
        }
        {name !== "Notifications" && 
          <Button
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            endIcon={<KeyboardArrowDownIcon />}
          >
            <span className={classes.menuText}>{name}</span>
          </Button>
        }
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
                    {name === "Notifications" && !!props.notifications &&
                      props.notifications.list.map(item=> (
                        <MenuItem key={item._id}><Notification data={item} /></MenuItem>
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

const mapStateToProps = (state) => {
  return {
    notifications: !!state ? state.notifications : []
  }
}

export default connect(mapStateToProps,null)(MenuListComposition);