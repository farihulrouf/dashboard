import React from 'react';
import {Container, Grid, IconButton, Button, TextField, CircularProgress} from "@material-ui/core";
import {ArrowRightAlt} from "@material-ui/icons";
import NavBar from "../components/NavBar";
import Link from "next/link";
import Router from "next/router";
import {signInUser} from "../lib/auth"
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class SignIn extends React.Component{
    constructor(props){
        super(props);
        this.state = {isLoading: false, error: "", user: {}}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = event => {
        event.preventDefault();
        const {user} = this.state;
        this.setState({isLoading: true})
        signInUser(user).then((response) => {
            Router.push("/"); 
        }).catch((err) => {
            this.setState({isLoading: false, error: err.response.data})
        })
    };

    closeAlert = event => {
        this.setState({error: ""})
    }

    handleChange = (e,v) => {
        const {user} = this.state;
        const {name, value} = e.target;
        let newUser = {...user};
        newUser[name] = value;
        this.setState({user: newUser});
    }

    render(){
        const {error, isLoading} = this.state;
        return(
            <NavBar onlyLogo={true}>
                <Container maxWidth="lg" style={{height: '90vh'}}>
                    {!!error && <Alert onClose={this.closeAlert} severity="error">{`${error}`}</Alert>}
                    <Grid justify="center" alignItems="center" container style={{height: '100%'}}>
                        <Container maxWidth="sm">
                            <Grid container style={{marginBottom: 30}}>
                                <Grid xs={12} style={{padding: 5}} item>
                                    <h3 style={{margin: 0, padding: 0, textAlign: 'center', fontWeight: 'bold', color: '#121037', fontSize: '3rem', lineHeight: 1}}>Sign in</h3>
                                </Grid>
                                <Grid xs={12} style={{padding: 5}} item>
                                    <h6 style={{margin: 0, padding: 0, textAlign: 'center', fontWeight: 500, color: '#546e7a', fontSize: '1.5rem', lineHeight: 1.6}}>
                                        Don't have account ? <Link href="./signup"><a style={{textDecoration: 'none', color: '#3f51b5'}}>
                                        Sign up.
                                        <IconButton style={{color: '#3f51b5', height: 20, width: 20}}>
                                            <ArrowRightAlt />
                                        </IconButton>
                                        </a></Link>
                                    </h6>
                                </Grid>
                            </Grid>
                            <Grid justify="center" container spacing={2}>
                                {isLoading && <CircularProgress />}
                                {!isLoading && <React.Fragment>
                                    <Grid xs={12} item>
                                        <TextField
                                        id="outlined-email-input"
                                        label="Email*"
                                        type="text"
                                        name="email"
                                        ref="email"
                                        onChange={this.handleChange}
                                        autoComplete="current-email"
                                        variant="outlined"
                                        style={{width: '100%'}}
                                        />
                                    </Grid>
                                    <Grid xs={12} item>
                                        <TextField
                                        id="outlined-password-input"
                                        label="Password*"
                                        type="password"
                                        name="password"
                                        ref="password"
                                        onChange={this.handleChange}
                                        autoComplete="current-password"
                                        variant="outlined"
                                        style={{width: '100%'}}
                                        />
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
                                    style={{width: '100%', 
                                    color: 'white', 
                                    backgroundColor: '#3f51b5'}}>
                                        Sign in
                                    </Button>
                                </Grid>
                                <Grid xs={12} item>
                                    <h6 style={{textAlign: 'center', color: '#546e7a', margin: 0, padding: 0, fontSize: '1rem', fontWeight: 400, lineHeight: 1.75}}>
                                        Forgot Your Password? <Link href="./forget">
                                        <a style={{color: '#3f51b5', fontWeight: 'bold', textDecoration: 'none'}}>
                                            Reset Password
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

export default SignIn;