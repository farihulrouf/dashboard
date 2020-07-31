import React from 'react';
import {Container, Grid, IconButton, Button, TextField} from "@material-ui/core";
import {ArrowRightAlt} from "@material-ui/icons";
import NavBar from "../components/NavBar";
import Link from "next/link";

class SignIn extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <NavBar onlyLogo={true}>
                <Container maxWidth="lg" style={{height: '90vh'}}>
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
                            <Grid container spacing={2}>
                                <Grid xs={12} item>
                                    <TextField
                                    id="outlined-email-input"
                                    label="Email*"
                                    type="text"
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
                                <Grid xs={12} item>
                                    <Button variant="contained" size="large" style={{width: '100%', color: 'white', backgroundColor: '#3f51b5'}}>Send</Button>
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