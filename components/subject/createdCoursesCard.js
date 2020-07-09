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
import {getCourseRequests} from "../../lib/api"
import { render } from 'react-dom';

const styles = (theme) => ({
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
  });
const useStyles = makeStyles(styles);  

function Chips(props) {
    const classes = useStyles();
    const {prerequisites} = props.data

    return (
        <div className={classes.chip_root}>
            {prerequisites.map((value) => (<Chip key={value.id} label={value} color="primary"/>))}
        </div>
    );
}

function RequestList(props) {
  const classes = useStyles();
  const [data,setData] = React.useState(props.requests);

  return (
    <List dense className={classes.list_root}>
      {props.requests.map((value) => (
        <ListItem key={value._id} button>
            <ListItemText primary={value.user} />
            <Button 
            variant="contained" 
            color="primary" 
            className={classes.button} 
            size="small">
              Accept
            </Button>
        </ListItem>
      ))}
    </List>
  );
}

class CreatedCoursesCard extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            requests: []
        }
    }
    componentDidMount(){
        getCourseRequests(this.props.data._id).then(requests => this.setState({requests: requests}));
    }
    render(){
        const {name, createdAt} = this.props.data
        // this.state.requests = getCourseRequests(this.props.data._id);
        console.log(this.state.requests);
        
        return(
            <Card variant="outlined">
                <Grid container xs={12} justify="center">
                    <CardContent>
                    <Typography>
                        {name}
                    </Typography>
                    <Typography color="textSecondary">
                        Created : {createdAt}
                    </Typography>
                    <Typography color="textSecondary">
                        Taken by : 10 students
                    </Typography>
                    <Chips {...this.props}/>
                    </CardContent>
                </Grid>
                <Grid container xs={12}>
                    <CardContent>
                    <Typography fontSize="15">
                        Course Requests
                    </Typography>
                    <RequestList requests = {this.state.requests}/>
                    </CardContent>
                </Grid>
                <CardActions>
                <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
        )
    }
}

export default CreatedCoursesCard;