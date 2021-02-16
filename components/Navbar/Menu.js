import React, {useState, useRef} from 'react';
import {
    Button,
    Grow,
    Grid,
    Paper,
    ClickAwayListener,
    Popper,
    MenuItem,
    MenuList,
    Badge,
    withStyles
} from '@material-ui/core';
import {Settings, Lock, Notifications, AccountCircleSharp} from "@material-ui/icons";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Router from "next/router";
import {signoutUser} from "../../lib/auth";
import Notification from '../Notification'
import {fetchNotifications} from "../../redux/"
import {connect} from "react-redux";
import {readMyNotification} from "../../lib/api";

function Menu({name, avatar, notifications, fetchNotifications}) {

    const [open,
        setOpen] = useState(false);
    const anchorRef = useRef(null);

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

    const StyledBadge = withStyles((theme) => ({
        badge: {
            fontSize: 10,
            backgroundColor: 'crimson',
            color: 'white',
            fontWeight: 700
        }
    }))(Badge);

    const openNotificationItem = (e) => {
        const {notificationId, notificationUrl} = e.currentTarget.dataset;
        readMyNotification(notificationId).then((res) => {
            if (res.status === "ok") {
                Router.push(notificationUrl);
                fetchNotifications();
            }
        })
    }

    const accChild = [
        {
            id: 1,
            name: "Settings",
            icon: <Settings/>,
            action: () => Router.push("/settings")
        }, {
            id: 2,
            name: "Log Out",
            icon: <Lock/>,
            action: signoutUser
        }
    ]

    const pagesChild = [
        {
            id: 1,
            name: "Home",
            action: () => {}
        }, {
            id: 2,
            name: "Rapor",
            action: () => {}
        }
    ]

    const settingsChild = [
        {
            id: 1,
            name: "Profile",
            action: () => {}
        }, {
            id: 2,
            name: "Courses",
            action: () => {}
        }, {
            id: 3,
            name: "Organization",
            action: () => {}
        }, {
            id: 4,
            name: "Starred",
            action: () => {}
        }
    ]

    return (
        <div >
            <div>
                {name == "Notifications" && <Button
                    onClick={handleToggle}
                    ref={anchorRef}
                    aria-controls={open
                    ? 'menu-list-grow'
                    : undefined}>
                    <StyledBadge badgeContent={notifications.unread}>
                        <Notifications
                            style={{
                            fontSize: 20
                        }}/>
                    </StyledBadge>
                </Button>
}
                {name !== 'Notifications' && <Button
                    ref={anchorRef}
                    aria-controls={open
                    ? 'menu-list-grow'
                    : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    endIcon={(name !== 'Profile' && name !== 'Settings') && < KeyboardArrowDownIcon />}>
                    {name === 'Profile' && <div>{avatar
                            ? <img src={avatar} alt=""/>
                            : <AccountCircleSharp/>}</div>}
                    {name === 'Settings' && <Settings/>}
                    {(name !== 'Profile' && name !== 'Settings') && <span className="nav-item">{name}</span>}
                </Button>}
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    placement={name === 'Profile' || name === 'Notifications' || name === 'Settings'
                    ? 'bottom-end'
                    : 'bottom-start'}
                    transition
                    disablePortal>
                    {({TransitionProps, placement}) => (
                        <Grow {...TransitionProps}>
                            <Paper
                                className={name !== 'Notifications'
                                ? 'popout-menu'
                                : 'popout-menu notification-box'}>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <div className="notif-container">
                                        <Paper className="paper-container">
                                        <MenuList
                                            autoFocusItem={open}
                                            id="menu-list-grow"
                                            onKeyDown={handleListKeyDown}>
                                            {name === "Profile" && accChild.map(item => (
                                                <MenuItem onClick={item.action} key={item.id}>
                                                    {item.icon}
                                                    {item.name}
                                                </MenuItem>
                                            ))
}
                                            {name === "Pages" && pagesChild.map(item => (
                                                <MenuItem onClick={item.action} key={item.id}>{item.name}</MenuItem>
                                            ))
}

                                            {name === "Settings" && settingsChild.map(item => (
                                                <MenuItem onClick={item.action} key={item.id}>{item.name}</MenuItem>
                                            ))
}

                                            {name === "Notifications" && notifications.list.length !== 0 && notifications
                                                .list
                                                .slice(0, 10)
                                                .map(item => (
                                                    <MenuItem
                                                        className="notifications-item"
                                                        data-notification-id={item._id}
                                                        data-notification-url={item.bankNotification.url}
                                                        onClick={openNotificationItem}
                                                        key={item._id}>
                                                        <Notification data={item}/>
                                                    </MenuItem>
                                                ))
}

                                            {name === "Notifications" && notifications.list.length === 0 && <Grid item className="no-notif">
                                                <span onClick={handleClose}>You have no notifications!</span>
                                            </Grid>}
                                        </MenuList>
                                        </Paper>
                                        {name === "Notifications" && notifications.list.length > 0 && <Grid item className="see-all">
                                            <span onClick={() => {}}>Show all notifications</span>
                                        </Grid>}
                                    </div>
                                </ClickAwayListener>

                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        notifications: !!state
            ? state.notifications
            : []
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchNotifications: () => dispatch(fetchNotifications())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)