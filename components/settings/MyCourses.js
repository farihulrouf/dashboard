import {Grid, ButtonGroup, Button} from '@material-ui/core';
import {Add} from "@material-ui/icons";
import CourseItem from "./CourseItem";
import {getCourseByInstructor} from "../../lib/api";
import CreateEditCourseDialog from "./CreateEditCourseDialog";
  
export default class MyCourses extends React.Component{
  constructor(props){
    super(props);
    this.state = {courses: [], open: false, onDialogClose: this.onDialogClose.bind(this)}
    this.onCreateButtonClick = this.onCreateButtonClick.bind(this);
  }

  componentDidMount(){
    getCourseByInstructor().then(courses => this.setState({courses: courses }));
  }

  onCreateButtonClick = () => {
    const dialogProps = {...this.state, title: "Create New Course"}
    this.setState({open: true, dialogProps: dialogProps})
  }

  onDialogClose = () => {
    this.setState({open: false});
  }

  render(){
    const {courses, open, dialogProps} = this.state;
    return (
      <Grid container>
        {open && <CreateEditCourseDialog {...dialogProps} />}
        <Grid container>
          <h1>List Courses</h1>
        </Grid>
        <Grid container style={{marginBottom: 20}} spacing={2}>
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
        </Grid>
        <Grid container justify="space-evenly" spacing={2}>
          {courses.map((course)=> <Grid key={course._id} item><CourseItem {...course} /></Grid>)}
        </Grid>
      </Grid>
    )
  }
}