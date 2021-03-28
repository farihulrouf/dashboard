import React from 'react';
import {Container, Grid, Button, TextField, CircularProgress} from "@material-ui/core";
import {ArrowRightAlt} from "@material-ui/icons";
import NavBar from "../components/Navbar/NavBar";
import Link from "next/link";
import {signInUser, authInitialProps} from "../lib/auth"
import MuiAlert from '@material-ui/lab/Alert';
import Router from 'next/router'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            error: "",
            user: {}
        }
        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
    }

    handleSubmit = event => {
        event.preventDefault();
        const {user} = this.state;
        this.setState({isLoading: true})
        signInUser(user).then((response) => {
            window.location.href="/"
        }).catch((err) => {
            this.setState({isLoading: false, error: err.response.data})
        })
    };

    handleEnter = event => {
        if (event.key === 'Enter') {
            this.handleSubmit(event);
        }
    }

    closeAlert = event => {
        this.setState({error: null})
    }

    handleChange = (e, v) => {
        const {user} = this.state;
        const {name, value} = e.target;
        let newUser = {
            ...user
        };
        newUser[name] = value;
        this.setState({user: newUser});
    }

    render() {
        const {error, isLoading} = this.state;

        return (
            <NavBar onlyLogo={true}>
                <Container maxWidth="lg" className="sign-in-page">
                    {!!error && <Alert onClose={this.closeAlert} severity="error">{`${error}`}</Alert>}
                    <Grid className="container" container>
                        <Container maxWidth="sm">
                            <Grid container>
                                <Grid xs={12} item>
                                    <h1 >Sign in</h1>
                                </Grid>
                                <Grid xs={12} item className="field-container">
                                    <h4>
                                        <div className="desc">Don't have account ?</div>
                                        <div className="desc-link">
                                            <Link href="/signup">
                                                <a>
                                                    <div>
                                                        &nbsp; Sign up.

                                                        <ArrowRightAlt/>
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                    </h4>
                                </Grid>
                            </Grid>
                            <Grid justify="center" container spacing={2}>
                                {isLoading && <CircularProgress thickness={6} size="6rem" />}
                                {!isLoading && <React.Fragment>
                                    <Grid xs={12} item className="input-container">
                                        <TextField
                                            id="outlined-email-input"
                                            label="Email*"
                                            type="text"
                                            name="email"
                                            ref="email"
                                            onKeyDown={this.handleEnter}
                                            onChange={this.handleChange}
                                            autoComplete="current-email"
                                            variant="outlined"/>
                                    </Grid>
                                    <Grid xs={12} item className="input-container">
                                        <TextField
                                            id="outlined-password-input"
                                            label="Password*"
                                            type="password"
                                            name="password"
                                            ref="password"
                                            onKeyDown={this.handleEnter}
                                            onChange={this.handleChange}
                                            autoComplete="current-password"
                                            variant="outlined"/>
                                    </Grid>
                                    <Grid xs={12} item className="field-container">
                                        <h6>
                                            Fields that are marked with * signed is required
                                        </h6>
                                    </Grid>
                                </React.Fragment>}
                                <Grid xs={12} item>
                                    <Button
                                        onClick={this.handleSubmit}
                                        variant="contained"
                                        size="large"
                                        className="sign-btn">
                                        Sign in
                                    </Button>
                                </Grid>
                                <Grid xs={12} item className="field-container">
                                    <h6>
                                        <div className="desc">
                                            Forgot Your Password?</div>
                                        <div className="desc-link">
                                            <Link href="./forget">
                                                <a>
                                                    <div>
                                                        &nbsp; Reset Password.

                                                        <ArrowRightAlt/>
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                    </h6>
                                </Grid>
                            </Grid>
                        </Container>
                    </Grid>
                </Container>
            </NavBar>
        )
    }
}

SignIn.getInitialProps = authInitialProps();

export default SignIn;