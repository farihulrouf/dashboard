import React from 'react';
import Grid from '@material-ui/core/Grid';
import {getMyCourses} from "../../lib/api"
import CreatedCoursesCard from "./CreatedCoursesCard"
import { render } from 'react-dom';

class CreatedCourses extends React.Component{
    constructor(props){
      super(props)
      this.state={courses: []}
    }

    componentDidMount(){
      getMyCourses().then(response => this.setState({courses: response.courses }));
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