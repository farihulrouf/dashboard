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
    const {topics} = props.data

    return (
        <div className={classes.chip_root}>
            {topics.map((value) => (<Chip key={value.id} label={value} color="primary"/>))}
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
  const {name, created_date, taken_by} = props.data

  return (
    <Card className={classes.root} variant="outlined">
        <Grid container xs={12} justify="center">
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
        </Grid>
        <Grid container xs={12}>
          <CardContent>
            <Typography fontSize="15">
              Course Requests
            </Typography>
            <RequestList {...props}/>
          </CardContent>
        </Grid>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export default function CreatedCourses(){
    const courses = [
        {id : "1", name : "Matematika Diskrit", created_date : "2 April 2020", taken_by : "35",topics : ["matriks", "hamilton circuit", "tree", "graph"], requests: ["Kaos kaki", "emak item", "bujel", "belti", "mulan"]},
        {id : "2", name : "Kimia dasar", created_date : "11 maret 2020", taken_by : "2",topics : ["atom", "molekul", "reaksi kimia", "termokimia", "rantai karbon"],  requests: ["Kaos kaki", "emak item", "emak bujel", "bleki", , "mulan"]},
        {id : "3", name : "Strategi Algoritma", created_date : "10 juni 2020", taken_by : "78",topics : ["Dynamic Programming", "greedy", "bruteforce", "backtracking", "Divide n conquer"],  requests: ["Kaos kaki", "emak item", "emak bujel", "bleki", "bujel", "belti"]},
        {id : "4", name : "Biologi", created_date : "30 januari 2020", taken_by : "41",topics : ["hewan", "tumbuhan", "pencernaan", "pernapasan"],  requests: ["Kaos kaki", "emak item", "emak bujel", "bleki", "bujel", "belti", "mulan"]},
        {id : "5", name : "Fisika", created_date : "1 Februari 2020", taken_by : "55",topics : ["kecepatan", "percepatan"],  requests: ["emak item", "emak bujel", "bleki", "bujel", "belti", "mulan"]}
    ]

    return(
        <Grid container xs={12} spacing={3}>
          <Grid container justify="center">
            {courses.map((value) => (<CreatedCoursesCard key={value.id} data={value} />))}
          </Grid>
        </Grid>
    );
}