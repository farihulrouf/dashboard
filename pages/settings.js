import {Grid,Avatar,Typography,AppBar,Tabs,Tab,Box,List,ListItem,
  ListItemText,ListItemIcon, TextField} from '@material-ui/core';
import {Inbox, Drafts, AccountCircle, Star, Book, Person, Business} from '@material-ui/icons';
import NavBar from '../components/NavBar';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CreatedCourses from '../components/settings/CreatedCourses'
import JoinedCourses from '../components/settings/JoinedCourses'
import { authInitialProps } from "../lib/auth"
import MyProfile from '../components/settings/MyProfile';
import MyCourses from '../components/settings/MyCourses';
import MyTeachers from '../components/settings/MyTeachers';
import MyOrganizations from '../components/settings/MyOrganizations';

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

const Content = (props) => {
  const {auth} = props;

  return(
    <React.Fragment>
      {props.settingOption === 1 && <MyProfile auth={props.auth} />}
      {props.settingOption === 2 && <MyCourses auth={props.auth} />}
      {props.settingOption === 3 && <MyTeachers auth={props.auth} />}
      {props.settingOption === 4 && <MyOrganizations auth={props.auth} />}
      {props.settingOption === 5 && <div>Stars</div>}
    </React.Fragment>
  )
}
export default function Settings(props) {
    const classes = useStyles();
    
    const filterOptions = (options) => {
      const {auth} = props;
      if(!auth.user.isAnOrganization) options.splice(2,1);
      if(auth.user.isAnOrganization) options.splice(3,1);
      return options;
    }

    const settingOptions = filterOptions([
      {id: 1, title: "Profile", icon: <AccountCircle />},
      {id: 2, title: "Courses", icon: <Book />},
      {id: 3, title: "Teachers", icon: <Person />},
      {id: 4, title: "Organizations", icon: <Business />},
      {id: 5, title: "Starred", icon: <Star />}
    ])
    
    const [selectedIndex,setSelectedIndex] = React.useState(1)

    const handleListItemClick = (event, index) => {
      setSelectedIndex(index);
    };

    return (
      <NavBar auth={props.auth}>
        <Grid container>
          <Grid item xs={12} sm={3} style={{paddingRight: 20}}>
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
              <Content auth={props.auth} settingOption={selectedIndex} />
          </Grid>
        </Grid>
      </NavBar>
    );
}

Settings.getInitialProps = authInitialProps(true);