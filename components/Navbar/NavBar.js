import React, { useState } from "react";
import Router from 'next/router';
import {
    AppBar,
    Toolbar,
    List,
    ListItem,
    IconButton,
    Grid,
    Button,
    Container,
    Hidden,
} from "@material-ui/core";
import {
    Facebook,
    Pinterest,
    Twitter,
    Instagram,
    Menu,
    Search
} from "@material-ui/icons";
import Link from "next/link";
import MyMenu from "./Menu";
import footerMenu from "./FooterMenu";

function NavBar(props) {
    const { children, onlyLogo, auth } = props;
    const [active, setActive] = useState("");

    let user = null;

    if (auth) {
        if (auth.user) {
            user = auth.user;
        }
    }

    return (
        <React.Fragment>
            <AppBar
                position="static"
                className={props.mode ? "navbar" : "navbar-1"}
            >
                <Container className="container">
                    <Grid item className="brands">
                        <Link href="/">
                            <a>
                                <img
                                    src={
                                        props.mode
                                            ? "images/white-logo.png"
                                            : "images/purple-logo.png"
                                    }
                                />
                            </a>
                        </Link>
                    </Grid>
                    <Grid item className="nav-menu">
                        {!onlyLogo && (
                            <Grid container justify="flex-start" spacing={2}>
                                <React.Fragment>
                                    <Grid item>
                                        <MyMenu name="Landings" />
                                    </Grid>
                                    <Grid item>
                                        <MyMenu name="Pages" />
                                    </Grid>
                                    <Grid item>
                                        <MyMenu name="Account" />
                                    </Grid>
                                </React.Fragment>
                            </Grid>
                        )}

                        <Hidden xsDown>
                            {!user && !onlyLogo && (
                                <Grid item className="navbar-end">
                                    <Link href="/signin">
                                        <a>
                                            <Button className="sign-btn mybtn">
                                                Sign in
                                            </Button>
                                        </a>
                                    </Link>
                                </Grid>
                            )}

                            {user && !onlyLogo ? (
                                <Grid item className="right-nav">
                                    <Grid item>
                                        <IconButton>
                                            <Search />
                                        </IconButton>
                                    </Grid>
                                    <Grid item>
                                        <MyMenu name="Notifications" />
                                    </Grid>
                                    <Grid item>
                                        <MyMenu name="Settings" />
                                    </Grid>
                                    <Grid item className="profile-picture">
                                        <MyMenu
                                            name="Profile"
                                            avatar={auth.user.avatar}
                                        />
                                    </Grid>
                                </Grid>
                            ) : null}
                        </Hidden>
                    </Grid>

                    <Hidden smUp>
                        <Grid container justify="flex-end">
                            <IconButton aria-label="menu">
                                <Menu />
                            </IconButton>
                        </Grid>
                    </Hidden>
                </Container>
            </AppBar>
            <main>
                <Container maxWidth={false} className="main-content">
                    {React.cloneElement(children, { active: active })}
                </Container>
            </main>
            <Container maxWidth={false} className="footer">
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item className="left-footer">
                            <List>
                                <ListItem className="footer-logo">
                                    <div>
                                        <a href="/">
                                            <img
                                                width="100%"
                                                src="images/white-logo.png"
                                            />
                                        </a>
                                    </div>
                                </ListItem>
                                <ListItem className="social">
                                    <IconButton>
                                        <Facebook />
                                    </IconButton>
                                    <IconButton>
                                        <Instagram />
                                    </IconButton>
                                    <IconButton>
                                        <Twitter />
                                    </IconButton>
                                    <IconButton>
                                        <Pinterest />
                                    </IconButton>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item className="right-footer">
                            <Grid container>
                                {footerMenu.map((MyMenu, index) => {
                                    return (
                                        <Grid
                                            key={index}
                                            item
                                            className="footer-item"
                                        >
                                            <Link href={MyMenu.url}>
                                                <a className="heading">
                                                    {MyMenu.heading}
                                                </a>
                                            </Link>
                                            <List>
                                                {MyMenu.items.map(
                                                    (item, index) => {
                                                        return (
                                                            <ListItem
                                                                key={index}
                                                            >
                                                                <Link
                                                                    href={
                                                                        item.url
                                                                    }
                                                                >
                                                                    <a>
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </a>
                                                                </Link>
                                                            </ListItem>
                                                        );
                                                    }
                                                )}
                                            </List>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Container>
        </React.Fragment>
    );
}

export default NavBar;
