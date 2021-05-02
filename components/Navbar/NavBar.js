import React, { useState } from "react";
import Router from "next/router";
import {
    AppBar,
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
    Search,
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
                                            : "images/white-logo.png"
                                    }
                                    style={{maxHeight: 50, width: 'auto'}}
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
                    </Grid>
                    <Grid item>
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
                                            username={auth.user.name}
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
                    <Grid item className="footer-content">
                        <Grid item className="identity">
                            <img
                                alt="klassiq-logo"
                                src="images/full-white-logo.png"
                            />
                            <p className="address">
                                Jl. Tebet Timur Dalam Raya No.133, RT.4/RW.9
                                <br /> Tebet Timur, Kec. Tebet
                                <br /> Kota Jakarta Selatan <br />
                                DKI Jakarta, 12820
                            </p>
                        </Grid>

                        {footerMenu.map((item, index) => {
                            return (
                                <Grid item key={index}>
                                    <h5>{item.heading}</h5>
                                    <List>
                                        {item.items.map((item, index) => {
                                            return (
                                                <ListItem key={index}>
                                                    {item.name}
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Grid>
                            );
                        })}

                        <Grid item className="social-media-container">
                            <h6>Follow Us</h6>
                            <Grid item className="social-media">
                                <Link href="/">
                                    <a>
                                        <Facebook />
                                    </a>
                                </Link>
                                <Link href="/">
                                    <a>
                                        <Twitter />
                                    </a>
                                </Link>
                                <Link href="/">
                                    <a>
                                        <Instagram />
                                    </a>
                                </Link>
                                <Link href="/">
                                    <a>
                                        <Pinterest />
                                    </a>
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Container>
        </React.Fragment>
    );
}

export default NavBar;
