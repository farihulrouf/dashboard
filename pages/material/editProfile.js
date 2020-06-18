import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    large: {
      width: theme.spacing(15),
      height: theme.spacing(15),
    },
    paper_root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
        //   margin: theme.spacing(1),
          width: "100%",
          height: "100%",
        },
      },
    button_paper_root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
          margin: theme.spacing(1),
        //   width: theme.spacing(20),
        //   height: theme.spacing(20),
        },
    },
    field_root: {
    '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '100%',
    },
    },
}));


function UserPropsField() {
    const classes = useStyles();
  
    return (
      <form className={classes.field_root} noValidate autoComplete="off">
        <div>
          <TextField
            required
            id="Name"
            label="Name"
            defaultValue="Mojogoli Olio"
            variant="filled"
          />
          <TextField
            disabled
            id="Email"
            label="Email"
            defaultValue="mojogoli_olio@gmail.com"
            variant="filled"
          />
          <TextField
            id="filled-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="filled"
          />
          <TextField
            id="Occupation"
            label="Occupation"
            defaultValue="Student"
            variant="filled"
          />
          <TextField
            id="Age"
            label="Age"
            type="number"
            InputLabelProps={{
              shrink: true
            }}
            defaultValue="19"
            variant="filled"
          />
        </div>
      </form>
    );
  }

function OutlinedCard() {
    return (
      <Card width="30" variant="outlined">
        <CardContent>
          <AssignmentTurnedInIcon color="secondary" style={{ fontSize: 40 }}/>
          <Typography variant="body2" component="p">
            My Past Exercises
          </Typography>
        </CardContent>
      </Card>
    );
}
  

export default function EditProfile() {
    const classes = useStyles();

    return (
            <Grid container xs={12} className={classes.root}>
                <Grid container justify="center" >
                    {/* <Grid container xs={12} justify="flex-start" style = {{padding:10}}>
                        <Typography variant="h4">Your Profile</Typography>
                    </Grid> */}
                    <UserPropsField/>
                    <Grid container justify="center" style = {{padding:50}}>
                        <Button variant="contained" color="primary">
                            Save Changes
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
    );
}