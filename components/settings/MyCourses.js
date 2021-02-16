import {Grid, ButtonGroup, Button} from '@material-ui/core';
import {Add} from "@material-ui/icons";
import CourseItem from "./CourseItem";
import {getMyCourses, getMyTeachers} from "../../lib/api";
import CreateEditCourseDialog from "./CreateEditCourseDialog";
import React from 'react';
  
export default class MyCourses extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      courses: [], open: false, 
      dialogProps: {auth: props.auth, teachers: [], onDialogClose: this.onDialogClose.bind(this), onCourseCreated: this.onCourseCreated.bind(this), onCourseUpdated: this.onCourseUpdated.bind(this)},
    }
    this.onCreateButtonClick = this.onCreateButtonClick.bind(this);
  }

  componentDidMount(){
    getMyCourses().then(courseRes => {
      getMyTeachers().then((teacherRes)=> {
        let {dialogProps} = this.state;
        dialogProps.teachers = teacherRes.teachers;
        this.setState({courses: courseRes.courses, dialogProps: dialogProps});
      })
    });
  }

  onCreateButtonClick = () => {
    const dialogProps = {...this.state.dialogProps, title: "Create New Course", course:{}, action: "create", avatarChosen: undefined, showCropper: false}
    this.setState({open: true, dialogProps: dialogProps})
  }

  onDialogClose = () => {
    this.setState({open: false});
  }

  onCourseCreated = (data) => {
    this.setState({open: false, courses: data.courses})
  }

  onCourseUpdated = (data) => {
    this.setState({open: false, courses: data.courses})
  }

  onEditCourse = (course) =>{
    const dialogProps = {...this.state.dialogProps, title: "Edit Course", course: course, action: "update"}
    this.setState({open: true, dialogProps: dialogProps})
  }

  render(){
    const {courses, open, dialogProps} = this.state;

    return (
      <Grid container>
        {open && <CreateEditCourseDialog {...dialogProps} />}
        <Grid container>
          <h1>My Courses</h1>
        </Grid>
        <Grid container style={{marginBottom: 20}} spacing={2}>
          {!this.props.auth.isAnOrganization && <React.Fragment>
            <Grid item xs={12} sm={8}>
              <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button variant="contained">All</Button>
                <Button>Accepted</Button>
                <Button>Pending</Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Grid justify="flex-end" container>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={this.onCreateButtonClick}
                >
                  Course
                </Button>
              </Grid>
            </Grid>
          </React.Fragment>}
          {this.props.auth.isAnOrganization && <React.Fragment>
            <Grid item xs={12}>
              <Grid justify="flex-end" container>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={this.onCreateButtonClick}
                >
                  Course
                </Button>
              </Grid>
            </Grid>
          </React.Fragment>}
        </Grid>
        <Grid container justify="space-evenly" spacing={2}>
          {courses.map((course)=> <Grid key={course._id} item><CourseItem onEditCourse={this.onEditCourse.bind(this)}{...course} /></Grid>)}
        </Grid>
      </Grid>
    )
  }
}