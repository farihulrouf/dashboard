import React from 'react';
import {AppBar, Toolbar, Grid, Button, Container, withStyles} from "@material-ui/core";
import Link from "next/link";
import MenuItem from "./Menu";

const useStyles = (theme) => ({
    appBar: {
        backgroundColor: '#ffffffff', 
        boxShadow: 'none',
        borderBottom: '1px solid #eeeeee'
    },
    logo: {
        width: 120,
        height: 32
    },
    container: {
        padding: 0
    }
})

class NavBar extends React.Component{
    constructor(props){
        super(props);
        this.state={active: ""}
    }
    render(){
        const {classes, children, onlyLogo, auth} = this.props;
        const {active} = this.state;
        return(
        <React.Fragment>
            <AppBar position="static" className={classes.appBar}>
                <Container maxWidth="lg">
                    <Toolbar className={classes.toolbar}>
                        <Grid container justify="space-between" alignItems="center">
                            <Grid item className={classes.logo}>
                                <Link href="/"><a style={{textDecoration: 'none'}}><img width="100%" height="100%" src="https://thefront.maccarianagency.com/images/logos/logo.svg" /></a></Link>
                            </Grid>
                            <Grid item>
                                {!onlyLogo && <Grid container spacing={2}>
                                    {!auth && <React.Fragment>
                                    <Grid item>
                                        <MenuItem name="Landings" />
                                    </Grid>
                                    <Grid item>
                                        <MenuItem name="Pages" />
                                    </Grid>
                                    <Grid item>
                                        <Link href="/signin"><a style={{textDecoration: 'none'}}><Button variant="outlined" color="primary">Sign in</Button></a></Link>
                                    </Grid>
                                    </React.Fragment>}
                                    {!!auth && <React.Fragment>
                                        <Grid item>
                                            <MenuItem name="Landings" />
                                        </Grid>
                                        <Grid item>
                                            <MenuItem name="Pages" />
                                        </Grid>
                                        <Grid item>
                                            <MenuItem name="Account" />
                                        </Grid>
                                    </React.Fragment>}
                                </Grid>}
                            </Grid>
                        </Grid>
                    </Toolbar>
                </Container>
            </AppBar>
            <main className={classes.content}>
                <Container maxWidth={false} className={classes.container}>
                    {React.cloneElement(children,{active: active})}
                </Container>
            </main>
        </React.Fragment>
        )
    }
}

export default withStyles(useStyles)(NavBar);