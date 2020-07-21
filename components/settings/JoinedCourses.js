import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import {getJoinedCourse} from "../../lib/api"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  title: {
    fontSize: 20,
  },
  pos: {
    marginBottom: 12,
  },
  chip_root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

function Chips(props) {
    const classes = useStyles();
    const {topics} = props.data

    return (
        <div className={classes.chip_root}>
            {topics.map((value) => (<Chip label={value.id} label={value} color="primary"/>))}
            {/* <Chip label={topics} color="primary"/> */}
        </div>
    );
}

function JoinedCoursesCard(props) {
  const classes = useStyles();
  const {name, join_date, time} = props.data
  
  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title}>
          Matematika Diskrit
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Taken : 20 januari 2020
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Time : 30 minutes
        </Typography>
        <Chips {...props}/>
      </CardContent>
      <CardActions>
        <Button size="small">Review</Button>
      </CardActions>
    </Card>
  );
}

class JoinedCourses extends React.Component{
  constructor(props){
    super(props)
    this.state={courses: []}
  }

  componentDidMount(){
    getJoinedCourse().then(data => this.setState({courses: data}));
  }
    
  render(){
    console.log(this.state.courses)
    return(
      <Grid item xs={12} sm={6}>
          {this.state.courses.map((value) => (<JoinedCoursesCard key={value._id} data={value} />))}
      </Grid>
    );
  }
}

export default JoinedCourses;