import {Grid,Avatar,Typography,AppBar,Tabs,Tab,Box,List,ListItem,
  ListItemText,ListItemIcon, TextField} from '@material-ui/core';
import {Inbox, Drafts, AccountCircle, Star, Book} from '@material-ui/icons';
import NavBar from '../components/NavBar';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import EditProfile from '../components/subject/editProfile'
import CreatedCourses from '../components/subject/createdCourses'
import JoinedCourses from '../components/subject/joinedCourses'
import { authInitialProps } from "../lib/auth"
import Profile from '../components/settings/profile';

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

const Content = (props) => {
  return(
    <React.Fragment>
      {props.settingOption === 1 && <Profile />}
      {props.settingOption === 2 && <div>Courses</div>}
      {props.settingOption === 3 && <div>Stars</div>}
    </React.Fragment>
  )
}
export default function Settings(props) {
    const classes = useStyles();
    const settingOptions = [
      {id: 1, title: "Profile", icon: <AccountCircle />},
      {id: 2, title: "Courses", icon: <Book />},
      {id: 3, title: "Starred", icon: <Star />}
    ]
    const [selectedIndex,setSelectedIndex] = React.useState(1)

    const handleListItemClick = (event, index) => {
      setSelectedIndex(index);
    };

    console.log(props.auth);
    
    return (
      <NavBar auth={props.auth}>
        <Grid container>
          <Grid item xs={12} sm={3}>
            <div>
              <List component="nav" aria-label="main mailbox folders">
                {settingOptions.map((item,idx)=>
                  <ListItem
                    button
                    key={item.id}
                    selected={selectedIndex === item.id}
                    onClick={(event) => handleListItemClick(event, item.id)}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItem>
                )}
              </List>
            </div>
          </Grid>
          <Grid item xs={12} sm={9}>
              <Content settingOption={selectedIndex} />
          </Grid>
        </Grid>
      </NavBar>
    );
}

Settings.getInitialProps = authInitialProps(true);