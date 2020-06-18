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
            {topics.map((value) => (<Chip key={value.id} label={value} color="primary"/>))}
            {/* <Chip label={topics} color="primary"/> */}
        </div>
    );
}

function CreatedCoursesCard(props) {
  const classes = useStyles();
  const {name, created_date, taken_by} = props.data

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title}>
          {name}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Created : {created_date}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Taken by : {taken_by} students
        </Typography>
        <Chips {...props}/>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export default function CreatedCourses(){
    const courses = [
        {id : "1", name : "Matematika Diskrit", created_date : "2 April 2020", taken_by : "35",topics : ["matriks", "hamilton circuit", "tree", "graph"]},
        {id : "2", name : "Kimia dasar", created_date : "11 maret 2020", taken_by : "2",topics : ["atom", "molekul", "reaksi kimia", "termokimia", "rantai karbon"]},
        {id : "3", name : "Strategi Algoritma", created_date : "10 juni 2020", taken_by : "78",topics : ["Dynamic Programming", "greedy", "bruteforce", "backtracking", "Divide n conquer"]},
        {id : "4", name : "Biologi", created_date : "30 januari 2020", taken_by : "41",topics : ["hewan", "tumbuhan", "pencernaan", "pernapasan"]},
        {id : "5", name : "Fisika", created_date : "1 Februari 2020", taken_by : "55",topics : ["kecepatan", "percepatan"]}
    ]

    return(
        <Grid container xs={12} sm={6} spacing={3}>
            {courses.map((value) => (<CreatedCoursesCard key={value.id} data={value} />))}
        </Grid>
    );
}