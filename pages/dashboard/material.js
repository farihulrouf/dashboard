import React from "react";
import {Container, Paper, Grid, Button,
    Avatar,
    IconButton, InputBase, withStyles} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {Star, ArrowRightAlt} from "@material-ui/icons";
import {getCourses} from '../../lib/api';
import Link from "next/link";

const styles = (theme) => ({
    iconButton: {
        padding: '0px 20px'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    }
})


const Course = (props) => {
    const {_id, name, about, creator, total_problems, logo, price, rating} = props.data;
    console.log(props);
    return(
        <Paper elevation={3} style={{borderRadius: 10}}>
            <div style={{padding: '32px 16px'}}>
                <Grid container>
                    <Grid item xs={12} sm={8}>
                        <Grid container>
                            <Grid xs={12} item style={{padding: 4}}><h6 style={{margin: 0, fontWeight: 700, color: '#121037', textAlign: 'left', fontSize: '1.25rem', lineHeight: 1.6}}>{name}</h6></Grid>
                            <Grid xs={12} item style={{padding: 4}}><p style={{color: '#546e7a', fontWeight: 400, fontSize: '1rem', lineHeight: 1.5, margin: 0}}>{`Oleh: ${creator.name}`}</p></Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <div style={{margin: 0, padding: 8, borderRadius: 8, backgroundColor: '#3f51b5'}}>
                            <p style={{ textAlign: 'center', margin: 0, fontWeight: 700, color: 'white', fontFamily: 'Lato', fontSize: '1rem', lineHeight: 1.5}}>{price === 0 ? `FREE` : `IDR ${price}`}</p>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <p>{about}</p>
                    </Grid>
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
                            <span style={{fontWeight: 700, fontSize: '1rem', fontColor: '#121037'}}>{rating}</span>
                            <span style={{marginLeft: 8, color: '#546e7a', fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.43}}>(28 reviews)</span>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" style={{paddingTop: 10}}>
                    <Button size="small" variant="outlined" color="primary" href={`/subjects/${_id}`} endIcon={<ArrowRightAlt />}>
                        GO TO COURSE
                    </Button>
                </Grid>
            </div>
        </Paper>
    )
}

class Material extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {modules: []}
    }

    componentDidMount(){
        const { auth } = this.props;
        getCourses(auth.user).then(courses => this.setState({modules: courses }));
    }

    render(){
        const {classes} = this.props;
        const {modules} = this.state;
        return(
            <Container style={{padding: '20px 48px'}}>
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
                    {modules.map((v,i)=> <Grid xs={12} sm={4} key={i} item><Course data={v} /></Grid>)}
                </Grid>
            </Container>
        )
    }
}
export default withStyles(styles)(Material);