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
import {getCourseRequests, acceptCourseRequest} from "../../lib/api"
import { withStyles } from '@material-ui/styles';
import { render } from 'react-dom';
import PropTypes from 'prop-types';

const useStyles = (theme) => ({
    root: {
      width: "50%",
    },
    title: {
      fontSize: 20,
    },
    pos: {
      marginBottom: 12,
    },
    // chip_root: {
    //   '& > *': {
    //     margin: theme.spacing(0.5),
    //   },
    // },
    // list_root: {
    //   width: "100%",
    //   height : "90",
    //   backgroundColor: theme.palette.background.paper,
    // },
  });

function Chips(props) {
    const classes = useStyles();
    const {prerequisites} = props.data

    return (
        <div className={classes.chip_root}>
            {prerequisites.map((value, index) => (<Chip key={index} label={value} color="primary"/>))}
        </div>
    );
}

function RequestList(props) {
  const classes = useStyles();

  return (
    <List dense className={classes.list_root}>
      {props.requests.map((value) => (
        <ListItem key={value._id} button>
            <ListItemText primary={value.user} />
            {value.status == 'pending' && 
              <Button value={value._id} onClick={acceptCourseRequest.bind(this)} className={classes.button} size="small" variant="contained" color="primary">
                  ACCEPT
              </Button>
            }
            {value.status == 'joined' && 
            <Button className={classes.button} size="small" variant="contained">
                HAS JOINED
            </Button>
            }
            {/* <Button 
            variant="contained" 
            color="primary" 
            className={classes.button} 
            size="small">
              Accept
            </Button> */}
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
        getCourseRequests(this.props.data._id, 1).then(data => this.setState({requests: data.requests}));
    }

    render(){
        const {name, createdAt} = this.props.data
        const { classes } = this.props;

        return(
            <Card variant="outlined"className={classes.root} >
                <Grid item xs={12}>
                    <CardContent>
                    <Typography className={classes.title}>
                        {name}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        Created : {createdAt}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        Taken by : 10 students
                    </Typography>
                    <Chips {...this.props}/>
                    </CardContent>
                </Grid>
                <Grid item xs={12}>
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

CreatedCoursesCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(CreatedCoursesCard);