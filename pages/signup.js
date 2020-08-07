import React from 'react';
import {Container, Grid, IconButton, Button, TextField, CircularProgress} from "@material-ui/core";
import {ArrowRightAlt} from "@material-ui/icons";
import NavBar from "../components/NavBar";
import Link from "next/link";
import MuiAlert from '@material-ui/lab/Alert';
import {signupUser} from '../lib/auth';
import Router from "next/router"

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class SignUp extends React.Component{
    constructor(props){
        super(props);
        let user = {name: "", email: "", occupation: "", password: "", confPass: ""}
        this.state={user: user, error: {}, isLoading: false}
        this.handleChange = this.handleChange.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
    }

    handleChange = (event) => {
        const {name, value} = event.target;
        let newUser = {...this.state.user};
        newUser[name] = value;
        let newError = this.errorCheck(newUser, this.state.error);
        this.setState({user: newUser, error: newError})
    }

    errorCheck = (user, error) => {
        const required = ["name","email","password"]
        let newError = {...error}
        required.forEach((field)=>{
            if(user[field] === "") newError[field] = "This field should not be empty"
            else newError[field] = ""
        })
        if(user.password !== user.confPass) newError["confPass"] = "Should matched password"
        else newError["confPass"] = ""
        return newError;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const {user,error} = this.state;
        let newError = this.errorCheck(user,error);
        this.setState({error: newError, isLoading: true});
        if(Object.values(newError).reduce((c,n) => {
            return (c && (n === ""))
        },true)){
            return signupUser(user)
            .then(response=>{
                Router.push("/signin");
                // this.setState({isLoading: false})
            }).catch(err=>{
                let newError = {...error};
                newError["server"] = err.response.data
                this.setState({error: newError, isLoading: false})
            })
        }
    }

    closeAlert = (event) =>{
        let newError = {...this.state.error}
        newError["server"] = "";
        this.setState({error: newError})
    }

    render(){
        const {error, user, isLoading} = this.state;

        return(
            <NavBar onlyLogo={true}>
                <Container maxWidth="lg" style={{height: '90vh'}}>
                    {!!error.server && <Alert style={{width: '50%', margin: '0px 25%'}} onClose={this.closeAlert} severity="error">{`${error.server}`}</Alert>}
                    <Grid justify="center" alignItems="center" container style={{height: '100%'}}>
                        <Container maxWidth="sm">
                            <Grid container style={{marginBottom: 30}}>
                                <Grid xs={12} style={{padding: 5}} item>
                                    <h3 style={{margin: 0, padding: 0, textAlign: 'center', fontWeight: 'bold', color: '#121037', fontSize: '3rem', lineHeight: 1}}>Sign up</h3>
                                </Grid>
                                <Grid xs={12} style={{padding: 5}} item>
                                    <h6 style={{fontFamily: 'Lato', fontWeight: 500, lineHeight: 1.6, margin: 0, padding: '0px 50px', textAlign: 'center', fontSize: '1.25rem', color: '#546e7a'}}>
                                        Create an account to start teaching and learning in our platform
                                    </h6>
                                </Grid>
                            </Grid>
                            <Grid justify="center" container spacing={2}>
                                {isLoading && <div style={{padding: '50px 0px'}}><CircularProgress /></div>}
                                {!isLoading && <React.Fragment>
                                    <Grid xs={12} item>
                                        <TextField
                                        id="outlined-name-input"
                                        label="Name*"
                                        name="name"
                                        value={user.name}
                                        type="text"
                                        variant="outlined"
                                        style={{width: '100%'}}
                                        onChange={this.handleChange}
                                        />
                                        <span style={{color: 'red', fontStyle: 'italic'}}>{error.name}</span>
                                    </Grid>
                                    <Grid xs={12} sm={6} item>
                                        <TextField
                                        id="outlined-email-input"
                                        label="Email*"
                                        name="email"
                                        value={user.email}
                                        type="email"
                                        variant="outlined"
                                        style={{width: '100%'}}
                                        onChange={this.handleChange}
                                        />
                                        <span style={{color: 'red', fontStyle: 'italic'}}>{error.email}</span>
                                    </Grid>
                                    <Grid xs={12} sm={6} item>
                                        <TextField
                                        id="occupation-input"
                                        label="Occupation"
                                        name="occupation"
                                        value={user.occupation}
                                        type="text"
                                        variant="outlined"
                                        style={{width: '100%'}}
                                        onChange={this.handleChange}
                                        />
                                        <span style={{color: 'red', fontStyle: 'italic'}}>{error.occupation}</span>
                                    </Grid>
                                    <Grid xs={12} item>
                                        <TextField
                                        id="outlined-password-input"
                                        label="Password*"
                                        name="password"
                                        value={user.password}
                                        type="password"
                                        autoComplete="new-password"
                                        variant="outlined"
                                        style={{width: '100%'}}
                                        onChange={this.handleChange}
                                        />
                                        <span style={{color: 'red', fontStyle: 'italic'}}>{error.password}</span>
                                    </Grid>
                                    <Grid xs={12} item>
                                        <TextField
                                        id="outlined-confirmation-password-input"
                                        label="Retype Password*"
                                        name="confPass"
                                        value={user.confPass}
                                        type="password"
                                        variant="outlined"
                                        style={{width: '100%'}}
                                        onChange={this.handleChange}
                                        />
                                        <span style={{color: 'red', fontStyle: 'italic'}}>{error.confPass}</span>
                                    </Grid>
                                    <Grid xs={12} item>
                                        <h6 style={{margin: 0, padding: 0, fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5}}>
                                            Fields that are marked with * signed is required
                                        </h6>
                                    </Grid>
                                </React.Fragment>}
                                <Grid xs={12} item>
                                    <Button
                                        onClick={this.handleSubmit} 
                                        variant="contained" 
                                        size="large" 
                                        style={{width: '100%', color: 'white', backgroundColor: '#3f51b5'}}
                                    >
                                        Create An Account
                                    </Button>
                                </Grid>
                                <Grid xs={12} item>
                                    <h6 style={{textAlign: 'center', color: '#546e7a', margin: 0, padding: 0, fontSize: '1rem', fontWeight: 400, lineHeight: 1.75}}>
                                        Already have an account? <Link href="./signin">
                                        <a style={{color: '#3f51b5', fontWeight: 'bold', textDecoration: 'none'}}>
                                            Sign in
                                            <IconButton style={{color: '#3f51b5', height: 20, width: 20}}>
                                                <ArrowRightAlt />
                                            </IconButton>
                                        </a>
                                        </Link>
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

export default SignUp;