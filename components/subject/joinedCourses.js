import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

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
          {name}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Taken : {join_date}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Time : {time} minutes
        </Typography>
        <Chips {...props}/>
        {/* <Grid container spacing={3}>
            {topics.map((value) => (<Chips label={value.id} data={value} />))}
        </Grid> */}
      </CardContent>
      <CardActions>
        <Button size="small">Review</Button>
      </CardActions>
    </Card>
  );
}

export default function JoinedCourses(){
    const courses = [
        {id : "1", name : "Matematika Diskrit", join_date : "2 April 2020", time : "120",topics : ["matriks", "hamilton circuit", "tree", "graph"]},
        {id : "2", name : "Kimia dasar", join_date : "11 maret 2020", time : "90",topics : ["atom", "molekul", "reaksi kimia", "termokimia", "rantai karbon"]},
        {id : "3", name : "Strategi Algoritma", join_date : "10 juni 2020", time : "60",topics : ["Dynamic Programming", "greedy", "bruteforce", "backtracking", "Divide n conquer"]},
        {id : "4", name : "Biologi", join_date : "30 januari 2020", time : "60",topics : ["hewan", "tumbuhan", "pencernaan", "pernapasan"]},
        {id : "5", name : "Fisika", join_date : "1 Februari 2020", time : "120",topics : ["kecepatan", "percepatan"]}
    ]
    return(
        <Grid container xs={12} sm={6} spacing={3}>
            {courses.map((value) => (<JoinedCoursesCard key={value.id} data={value} />))}
        </Grid>
        // <JoinedCoursesCard />
    );
}