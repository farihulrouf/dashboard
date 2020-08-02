import React from "react";
import {Container, Paper, Grid, Button,
    Avatar,
    IconButton, InputBase, withStyles} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {Star, ArrowRightAlt} from "@material-ui/icons";

const styles = (theme) => ({
    iconButton: {
        padding: '0px 20px'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    }
})


const Course = () => {
    return(
        <Paper elevation={3} style={{borderRadius: 10}}>
            <div style={{padding: '32px 16px'}}>
                <Grid container>
                    <Grid xs={12} item style={{padding: 4}}><h6 style={{margin: 0, fontWeight: 700, color: '#121037', textAlign: 'left', fontSize: '1.25rem', lineHeight: 1.6}}>Data Science</h6></Grid>
                    <Grid xs={12} item style={{padding: 4}}><p style={{color: '#546e7a', fontWeight: 400, fontSize: '1rem', lineHeight: 1.5, margin: 0}}>Oleh: Delta Wira</p></Grid>
                    <div>
                        <p>A statement is a basic fact or opinion</p>
                    </div>
                </Grid>
                <Grid alignItems="center" container>
                    <Grid xs={6} item>
                        <Grid container>
                            <Avatar src="https://thefront.maccarianagency.com/images/photos/people/veronica-adams.jpg" width="40" height="40" style={{border: '3px solid white'}} />
                            <Avatar src="https://thefront.maccarianagency.com/images/photos/people/akachi-luccini.jpg" width="40" height="40" style={{marginLeft: -16, border: '3px solid white'}} />
                            <Avatar width="40" height="40" style={{marginLeft: -16, border: '3px solid white'}} />
                        </Grid>
                        <span style={{paddingTop: 10}}>120 students enroll</span>
                    </Grid>
                    <Grid xs={6} item>
                        <Grid container justify="flex-end"><Star style={{color: '#f9a825'}} />
                            <span style={{fontWeight: 700, fontSize: '1rem', fontColor: '#121037'}}>5.0</span>
                            <span style={{marginLeft: 8, color: '#546e7a', fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.43}}>(28 reviews)</span>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container alignItems="center">
                        <p style={{color: '#3f51b5', fontSize: '1rem', fontWeight: 'bold', lineHeight: 1.5}}>Join Course </p><ArrowRightAlt style={{color: '#3f51b5'}}/>
                </Grid>
            </div>
        </Paper>
    )
}

class Material extends React.Component{
    
    constructor(props){
        super(props)
    }

    render(){
        const {classes} = this.props;
        return(
            <Container maxWidth="lg" style={{padding: '20px 48px'}}>
                <Paper elevation={3} style={{height: '5em', display: 'flex', alignItems: 'center'}}>
                    <IconButton className={classes.iconButton} aria-label="menu">
                        <Menu />
                    </IconButton>
                    <InputBase
                        className={classes.input}
                        placeholder="Search Courses"
                    />
                    <Button size="large" variant="contained" color="primary" style={{margin: '0px 20px'}}>
                        Search
                    </Button>
                </Paper>
                <Grid justify="flex-start" container style={{paddingTop: 30}}>
                    <Button disabled variant="contained" color="primary" style={{backgroundColor: 'rgb(250, 199, 92)', color: 'white'}}>
                        105 results found
                    </Button>
                </Grid>
                <Grid container justify="center" spacing={5} style={{padding: 0, marginTop: 5}}>
                    {[1,2,3,4,5].map((v,i)=> <Grid xs={12} sm={6} key={i} item><Course /></Grid>)}
                </Grid>
            </Container>
        )
    }
}
export default withStyles(styles)(Material);