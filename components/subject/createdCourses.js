import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {getCourseByInstructor} from "../../lib/api"
import { render } from 'react-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "50%",
  },
  title: {
    fontSize: 20,
  },
  pos: {
    marginBottom: 12,
  },
  chip_root: {
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  list_root: {
    width: "100%",
    height : "90",
    backgroundColor: theme.palette.background.paper,
  },
}));

function Chips(props) {
    const classes = useStyles();
    const {prerequisites} = props.data

    return (
        <div className={classes.chip_root}>
            {prerequisites.map((value) => (<Chip key={value.id} label={value} color="primary"/>))}
        </div>
    );
}

function RequestList(props) {
  const classes = useStyles();
  const {requests} = props.data

  return (
    <List dense className={classes.list_root}>
      {requests.map((value) => (
        <ListItem key={value} button>
            <ListItemText key={value.id} primary={value} />
            <Button variant="contained" color="primary" className={classes.button} size="small">
              Accept
            </Button>
        </ListItem>
      ))}
    </List>
  );
}

function CreatedCoursesCard(props) {
  const classes = useStyles();
  const {name, createdAt} = props.data

  return (
    <Card className={classes.root} variant="outlined">
        <Grid container xs={12} justify="center">
          <CardContent>
            <Typography className={classes.title}>
              {name}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              Created : {createdAt}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              Taken by : 10 students
            </Typography>
            <Chips {...props}/>
          </CardContent>
        </Grid>
        <Grid container xs={12}>
          <CardContent>
            <Typography fontSize="15">
              Course Requests
            </Typography>
            {/* <RequestList {...props}/> */}
          </CardContent>
        </Grid>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

class CreatedCourses extends React.Component{
    constructor(props){
      super(props)
      this.state={courses: []}
    }

    componentDidMount(){
      getCourseByInstructor().then(courses => this.setState({courses: courses }));
    }

    render(){
      console.log(this.state.courses)
      return(
        <Grid container xs={12} spacing={3}>
          <Grid container justify="center">
            {this.state.courses.map((value) => (<CreatedCoursesCard key={value.id} data={value} />))}
          </Grid>
        </Grid>
      )
    }
}

export default CreatedCourses;