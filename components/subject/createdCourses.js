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
import CreatedCoursesCard from "./createdCoursesCard"
import { render } from 'react-dom';

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