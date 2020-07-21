import React from 'react';
import Grid from '@material-ui/core/Grid';
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
      // console.log(this.state.courses)
      return(
        <Grid item xs={12}>
          <Grid container justify="center">
            {this.state.courses.map((value) => (<CreatedCoursesCard key={value._id} data={value} />))}
          </Grid>
        </Grid>
      )
    }
}

export default CreatedCourses;