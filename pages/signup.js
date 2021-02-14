import React from 'react';
import {
    Container,
    Grid,
    IconButton,
    Button,
    TextField,
    CircularProgress
} from "@material-ui/core";
import {ArrowRightAlt} from "@material-ui/icons";
import NavBar from "../components/Navbar/NavBar";
import Link from "next/link";
import MuiAlert from '@material-ui/lab/Alert';
import {signupUser, authInitialProps} from '../lib/auth';
import Router from "next/router"

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} className="alert" />;
}

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        let user = {
            name: "",
            email: "",
            occupation: "",
            password: "",
            confPass: ""
        }
        this.state = {
            user: user,
            error: {},
            isLoading: false
        }
        this.handleChange = this
            .handleChange
            .bind(this);
        this.closeAlert = this
            .closeAlert
            .bind(this);
    }

    handleChange = (event) => {
        const {name, value} = event.target;
        let newUser = {
            ...this.state.user
        };
        newUser[name] = value;
        let newError = this.errorCheck(newUser, this.state.error);
        this.setState({user: newUser, error: newError})
    }

    errorCheck = (user, error) => {
        const required = ["name", "email", "password"]
        let newError = {
            ...error
        }
        required.forEach((field) => {
            if (user[field] === "") 
                newError[field] = "This field should not be empty"
            else 
                newError[field] = ""
        })
        if (user.password !== user.confPass) 
            newError["confPass"] = "Should matched password"
        else 
            newError["confPass"] = ""
        return newError;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const {user, error} = this.state;
        let newError = this.errorCheck(user, error);
        this.setState({error: newError});
        console.log(newError)
        if (Object.values(newError).reduce((c, n) => {
            return (c && (n === ""))
        }, true)) {
            this.setState({isLoading: true})
            return signupUser(user).then(response => {
                Router.push("/signin");
                // this.setState({isLoading: false})
            }).catch(err => {
                let newError = {
                    ...error
                };
                newError["server"] = err.response.data
                this.setState({error: newError, isLoading: false})
            })
        }
    }

    closeAlert = (event) => {
        let newError = {
            ...this.state.error
        }
        newError["server"] = "";
        this.setState({error: newError})
    }

    render() {
        const {error, user, isLoading} = this.state;
        console.log(error.server);

        return (
            <NavBar onlyLogo={true}>
                <Container maxWidth="lg" className="sign-up-page">
                    {!!error.server && <Alert onClose={this.closeAlert} severity="error">{`${error.server}`}</Alert>}
                    <Grid className="container" container>
                        <Container maxWidth="sm">
                            <Grid container>
                                <Grid xs={12} item>
                                    <h1>Sign Up</h1>
                                </Grid>
                                <Grid xs={12} item className="field-container">
                                    <h5 className="sign-up-sub">
                                        Create an account to start teaching and learning in our platform
                                    </h5>
                                </Grid>
                            </Grid>
                            <Grid justify="center" container spacing={2}>
                                {isLoading && <CircularProgress thickness={6} size="6rem" />}
                                {!isLoading && <React.Fragment>
                                    <Grid xs={12} item className="input-container">
                                        <TextField
                                            id="outlined-name-input"
                                            label="Name*"
                                            name="name"
                                            value={user.name}
                                            type="text"
                                            variant="outlined"
                                            onChange={this.handleChange}/>
                                        <span style={{color: 'red'}} >{error.name}</span>
                                    </Grid>
                                    <Grid xs={12} sm={6} item className="input-container">
                                        <TextField
                                            id="outlined-email-input"
                                            label="Email*"
                                            name="email"
                                            value={user.email}
                                            type="email"
                                            variant="outlined"
                                            onChange={this.handleChange}/>
                                        <span style={{color: 'red'}} >{error.email}</span>
                                    </Grid>
                                    <Grid xs={12} sm={6} item className="input-container">
                                        <TextField
                                            id="occupation-input"
                                            label="Occupation"
                                            name="occupation"
                                            value={user.occupation}
                                            type="text"
                                            variant="outlined"
                                            onChange={this.handleChange}/>
                                        <span style={{color: 'red'}} >{error.occupation}</span>
                                    </Grid>
                                    <Grid xs={12} item className="input-container">
                                        <TextField
                                            id="outlined-password-input"
                                            label="Password*"
                                            name="password"
                                            value={user.password}
                                            type="password"
                                            autoComplete="new-password"
                                            variant="outlined"
                                            onChange={this.handleChange}/>
                                        <span style={{color: 'red'}} >{error.password}</span>
                                    </Grid>
                                    <Grid xs={12} item className="input-container">
                                        <TextField
                                            id="outlined-confirmation-password-input"
                                            label="Retype Password*"
                                            name="confPass"
                                            value={user.confPass}
                                            type="password"
                                            variant="outlined"
                                            onChange={this.handleChange}/>
                                        <span style={{color: 'red'}} >{error.confPass}</span>
                                    </Grid>
                                    <Grid xs={12} item className="field-container">
                                        <h6>
                                            Fields that are marked with * signed is required
                                        </h6>
                                    </Grid>
                                </React.Fragment>}
                                <Grid xs={12} item>
                                    <Button onClick={this.handleSubmit} variant="contained" size="large" className="sign-btn">
                                        Create An Account
                                    </Button>
                                </Grid>
                                <Grid xs={12} item className="field-container">
                                    <h6>
                                        <div className="desc">Already have an account ?</div>
                                        <div className="desc-link">
                                            <Link href="./signin">
                                                <a>
                                                    <div>
                                                        &nbsp; Sign in.

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

SignUp.getInitialProps = authInitialProps();

export default SignUp;