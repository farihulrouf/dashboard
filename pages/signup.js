import React from "react";
import {
    Container,
    Grid,
    IconButton,
    Button,
    TextField,
    CircularProgress,
} from "@material-ui/core";
import { ArrowRightAlt } from "@material-ui/icons";
import NavBar from "../components/Navbar/NavBar";
import Link from "next/link";
import MuiAlert from '@material-ui/lab/Alert';
import {signupUser, authInitialProps, requestOTP, validateEmail} from '../lib/auth';
import Router from "next/router"
import OtpInput from 'react-otp-input';
import Countdown from 'react-countdown';
import ReCAPTCHA from "react-google-recaptcha";
import { color } from 'jimp';

function Alert(props) {
    return (
        <MuiAlert elevation={6} variant="filled" {...props} className="alert" />
    );
}

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        let user = {
            name: "",
            email: "",
            occupation: "",
            password: "",
            confPass: "",
            recaptcha: undefined,
            recaptchaKey: Date.now()
        };
        this.state = {
            user: user,
            error: {},
            fill_otp: false,
            otp: '',
            isLoading: false,
        }
        this.handleChange = this
            .handleChange
            .bind(this);
        this.closeAlert = this
            .closeAlert
            .bind(this);
        this.requestAnotherOTP = this.requestAnotherOTP.bind(this);
        this.otpHandleChange = this.otpHandleChange.bind(this);
        this.onRecaptchaChange = this.onRecaptchaChange.bind(this);
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        let newUser = {
            ...this.state.user,
        };
        newUser[name] = value;
        let newError = this.errorCheck(newUser, this.state.error);
        this.setState({ user: newUser, error: newError });
    };

    errorCheck = (user, error) => {
        console.log(user);
        const required = ["name", "email", "password"];
        let newError = {
            ...error,
        };
        required.forEach((field) => {
            if (user[field] === "")
                newError[field] = "This field should not be empty";
            else newError[field] = "";
        });
        if (user.password !== user.confPass)
            newError["confPass"] = "Should matched password";
        else newError["confPass"] = "";
        if(!user.recaptcha)
            newError["recaptcha"] = "Please complete the captcha"
        else newError["recaptcha"] = ""
        return newError;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { user, error } = this.state;
        let newError = this.errorCheck(user, error);
        this.setState({error: newError});
        if (Object.values(newError).reduce((c, n) => {
            return (c && (n === ""))
        }, true)) {
            this.setState({isLoading: true})
            return signupUser(user).then(response => {
                const {countdown_time, email, name, otp_length} = response;
                this.setState({
                    isLoading: false, 
                    fill_otp: true, 
                    countdown_time: countdown_time, 
                    email: email, 
                    name: name, 
                    otp_length: otp_length
                })
            }).catch(err => {
                let newError = {
                    ...error,
                };
                newError["server"] = err.response.data;
                user["recaptcha"] = undefined;
                this.setState({ error: newError, isLoading: false, recaptchaKey: Date.now(), user });
            });
        };
    }

    closeAlert = (event) => {
        let newError = {
            ...this.state.error,
        };
        newError["server"] = "";
        this.setState({ error: newError });
    };

    otpHandleChange = (updatedOtp) => {
        this.setState({otp: updatedOtp})
        const {email, otp_length} = this.state;
        if(updatedOtp.length === otp_length){
            validateEmail({email, otp: updatedOtp}).then(data => {
                const {message, redirect_at} = data;
                this.setState({otp_success: true, otp_success_message: message, redirect_at: redirect_at})
            }).catch(err => {
                let newError = {server: err.response.data};
                this.setState({error: newError})
            })
        }
    }

    requestAnotherOTP = (e) => {
        e.preventDefault();
        requestOTP(this.state.email).then((response)=>{
            const {countdown_time, otp_length} = response;
            this.setState({
                countdown_time: countdown_time, 
                otp_length: otp_length
            })
        }).catch(err => {
            let newError = {server: err.response.data}
            this.setState({error: newError})
        })
    }

    renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
          // Render a completed state
          return <span>Token expired. Click <a href="#" style={{display: 'inline'}} onClick={this.requestAnotherOTP}>here</a> to request another token</span>;
        } else {
          // Render a countdown
          return <span>It is valid for {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} minutes</span>;
        }
    };

    onOTPSuccess = ({hours, minutes, seconds, completed}) => {
        if(completed){
            //redirect to signin page
            Router.push("/signin");
            return (null)
        }else{
            return (<span>
                {this.state.otp_success_message}. 
                You will be redirected to sign in page in {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} seconds
                </span>)
        }
    }
    
    onRecaptchaChange = (value) => {
        let {user, error} = this.state;
        let newUser =  {
            ...user
        }
        newUser["recaptcha"] = value
        let newError =  this.errorCheck(newUser, error);
        this.setState({ user: newUser, error: newError })
    }

    render() {
        const {
            error, 
            user, 
            isLoading, 
            fill_otp, 
            countdown_time, 
            otp_length,
            otp_success,
            redirect_at,
            recaptchaKey
        } = this.state;

        return (
            <NavBar onlyLogo={true}>
                <Container maxWidth="lg" className="sign-up-page">
                    {!!error.server && (
                        <Alert
                            onClose={this.closeAlert}
                            severity="error"
                        >{`${error.server}`}</Alert>
                    )}
                    <Grid className="container" container>
                        <Container maxWidth="sm">
                            <Grid container>
                                <Grid xs={12} item>
                                    <h1>Sign Up</h1>
                                </Grid>
                                <Grid xs={12} item className="field-container">
                                    <p className="sign-up-sub">
                                        Create an account to start teaching and
                                        learning in our platform
                                    </p>
                                </Grid>
                            </Grid>
                            {!fill_otp && <Grid justify="center" container spacing={2}>
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
                                <ReCAPTCHA
                                    key={recaptchaKey}
                                    sitekey={process.env.RECAPTCHA_SITE_KEY}
                                    onChange={this.onRecaptchaChange}
                                />
                                <h5 style={{color: 'red'}} >{error.recaptcha}</h5>
                                <Grid xs={12} item>
                                    <Button
                                        onClick={this.handleSubmit}
                                        variant="contained"
                                        size="large"
                                        className="sign-btn"
                                    >
                                        Create An Account
                                    </Button>
                                </Grid>
                                <Grid xs={12} item className="field-container">
                                    <h6>
                                        <div className="desc">
                                            Already have an account ?
                                        </div>
                                        <div className="desc-link">
                                            <Link href="/signin">
                                                <a>
                                                    <div>
                                                        &nbsp; Sign in.
                                                        <ArrowRightAlt />
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                    </h6>
                                </Grid>
                            </Grid>}
                            {fill_otp && <Grid justify="center" container spacing={2}>
                                {!isLoading && fill_otp && !otp_success && <React.Fragment>
                                    <div style={{fontSize: 20, margin: 20, textAlign: 'center'}}>
                                    We sent an OTP to your email.<br/>
                                    <Countdown key={countdown_time} renderer={this.renderer} date={countdown_time} />
                                    </div>
                                    <OtpInput
                                        value={this.state.otp}
                                        onChange={this.otpHandleChange}
                                        numInputs={otp_length}
                                        containerStyle={{margin: 40}}
                                        separator={<span>-</span>}
                                        inputStyle={{fontSize: 50}}
                                    />
                                </React.Fragment>}
                                {otp_success && <React.Fragment>
                                    <Countdown date={redirect_at} renderer={this.onOTPSuccess} key={"otp_success"} />
                                </React.Fragment>}
                            </Grid>}
                        </Container>
                    </Grid>
                </Container>
            </NavBar>
        );
    }
}

SignUp.getInitialProps = authInitialProps();

export default SignUp;
