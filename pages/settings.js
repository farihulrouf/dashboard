import React from "react";
import {withStyles, Container, Grid, List, ListItem, ListItemText, createMuiTheme, Paper} from "@material-ui/core";
import { authInitialProps } from "../lib/auth"
import {AccountCircle, Book, Person, Business, Star} from "@material-ui/icons";
import NavBar from "../components/Navbar/NavBar";
import { ThemeProvider } from '@material-ui/core/styles';
import MyProfile from '../components/settings/MyProfile';
import MyCourses from '../components/settings/MyCourses';
import MyTeachers from '../components/settings/MyTeachers';
import MyOrganizations from '../components/settings/MyOrganizations';
import MyStarItems from '../components/settings/MyStarItems';

const styles = () => ({
})

const theme = createMuiTheme({
  overrides: {
    MuiListItem: {
      root: {
        color: '#546e7a',
        fontSize: '1rem',
        fontFamily: 'Lato',
        fontWeight: 400,
        lineHeight: 1.75,
        '&$selected': {borderLeft: '2px solid #303f9f', color: '#121037', pointerEvents: 'none'},
      }
    },
  },
});


const Content = (props) => {
  const {auth} = props;

  return(
    <React.Fragment>
      {props.settingOption === 1 && <MyProfile auth={props.auth} />}
      {props.settingOption === 2 && <MyCourses auth={props.auth} />}
      {props.settingOption === 3 && <MyTeachers auth={props.auth} />}
      {props.settingOption === 4 && <MyOrganizations auth={props.auth} />}
      {props.settingOption === 5 && <MyStarItems auth={props.auth} />}
    </React.Fragment>
  )
}

class Settings extends React.Component{
  constructor(props){
    super(props)
    this.state = {selectedIndex: 1}
    this.filterOptions = this.filterOptions.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }
  
  filterOptions = (options) => {
    const {auth} = this.props;
    if(!auth.user.isAnOrganization) options.splice(2,1);
    if(auth.user.isAnOrganization) options.splice(3,1);
    return options;
  }

  handleListItemClick = (event, index) => {
    this.setState({selectedIndex: index});
  };

  render(){
    const {auth, classes} = this.props;

    const settingOptions = this.filterOptions([
      {id: 1, title: "Profile", icon: <AccountCircle />},
      {id: 2, title: "Courses", icon: <Book />},
      {id: 3, title: "Teachers", icon: <Person />},
      {id: 4, title: "Organizations", icon: <Business />},
      {id: 5, title: "Starred", icon: <Star />}
    ])

    const {selectedIndex} = this.state;

    return(
      <NavBar auth={auth} mode={1}>
        <div style={{backgroundColor: 'rgb(247, 249, 250)'}}>
          <div style={{backgroundColor: '#3f51b5'}}>
                <Container maxWidth="lg" style={{padding: '96px 48px'}}>
                  <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <h3 style={{padding: 0, margin: 0, fontWeight: 'bold', color: 'white', fontSize: '3rem', lineHeight: 1.167, fontFamily: 'Lato'}}>Account Settings</h3>
                      </Grid>
                      <Grid item xs={12}>
                        <h6 style={{padding: 0, margin: 0, fontWeight: 500, color: 'white', fontSize: '1.25rem', lineHeight: 1.6, fontFamily: 'Lato'}}>
                          Change account information and settings
                        </h6>
                      </Grid>
                    </Grid>
                </Container>
          </div>
          <Container maxWidth="lg" style={{padding: '96px 48px', paddingTop: 0, marginTop: -40, zIndex: 1}}>
                <Grid spacing={4} style={{padding: '0px 16px'}} container>
                  <Grid item xs={12} md={3}>
                    <Paper elevation={3}>
                      <List component="nav">
                        <ThemeProvider theme={theme}>
                        {settingOptions.map((item,idx)=>
                          <ListItem
                            disableRipple
                            button
                            key={item.id}
                            selected={selectedIndex === item.id}
                            style={{backgroundColor: 'white'}}
                            onClick={(event) => this.handleListItemClick(event, item.id)}
                          >
                            <ListItemText primary={item.title} />
                          </ListItem>
                        )}
                        </ThemeProvider>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Paper style={{padding: 24, minHeight: 500}} elevation={3}>
                      <Content auth={auth} settingOption={selectedIndex} />
                    </Paper>  
                  </Grid>
                </Grid>
          </Container>
        </div>
      </NavBar>
    )
  }
}


Settings.getInitialProps = authInitialProps(true);

export default withStyles(styles)(Settings);