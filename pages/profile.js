import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import EditProfile from './material/editProfile'
import CreatedCourses from './material/createdCourses'
import JoinedCourses from './material/joinedCourses'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    large: {
      width: theme.spacing(15),
      height: theme.spacing(15),
    },
    slidetab_root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
}));
 
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.slidetab_root}>
      <AppBar position="relative">
        <Tabs value={value} onChange={handleChange} centered aria-label="profile tabs">
          <Tab label="Edit Profile" {...a11yProps(0)} />
          <Tab label="Created Courses" {...a11yProps(1)} />
          <Tab label="Joined Courses" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} >
        <EditProfile/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CreatedCourses/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <JoinedCourses/>
      </TabPanel>
    </div>
  );
}

export default function Profile() {
    const classes = useStyles();

    return (
            <Grid container className={classes.root} style={{backgroundColor:"#eeeeee"}}>
              {/* <Grid container xs={12} justify="center" >
              <Paper elevation={3}> */}
                <Grid container xs={12} justify="center" >
                        <Avatar 
                            alt="Mogli" 
                            img="https://www.google.com/url?sa=i&url=https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/102348974/original/039aee69bface75f7440dbcefd24fe3a606f9f7c/create-profile-avatar-of-your-image.png://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/102348974/original/039aee69bface75f7440dbcefd24fe3a606f9f7c/create-profile-avatar-of-your-image.png%3A%2F%2Fwww.freepik.com%2Fpremium-vector%2Fman-avatar-profile-round-icon_2652064.htm&psig=AOvVaw2626wFIEerSx9sWvPMaZoT&ust=1592291229170000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKiUsfWhg-oCFQAAAAAdAAAAABAD"
                            className={classes.large}
                        />
                </Grid>
                <Grid container justify="center" style = {{padding:15}}>
                    <Typography variant="h4">Mojogoli Olio</Typography>
                </Grid>
              {/* </Paper>
              </Grid> */}
                <Grid container xs={12} style = {{padding:15}}>
                  <SimpleTabs/>
                </Grid>
            </Grid>
    );
}