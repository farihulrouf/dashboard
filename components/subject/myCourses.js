import Grid from '@material-ui/core/Grid';
import CreatedCourses from './createdCourses';
import JoinedCourses from './joinedCourses';
  
export default function MyCourses(){
    return (
      <Grid container style={{backgroundColor:"blue"}}>
        <Grid item xs={12} sm={6} style={{backgroundColor:"yellow"}}>
            <CreatedCourses/>
        </Grid>
        <Grid item xs={12} sm={6} style={{backgroundColor:"red"}}>
          <JoinedCourses/>
        </Grid>
      </Grid>
    );
}