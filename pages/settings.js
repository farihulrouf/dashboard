import React from "react";
import {withStyles, Container, Grid} from "@material-ui/core";
import { authInitialProps } from "../lib/auth"
import NavBar from "../components/NavBar";

const styles = () => ({
  container: {
    ['@media (min-width:800px)']: { 
        padding: '20px 48px'
    },
    ['@media (max-width:800px)']: { 
        padding: '20px 0px'
    },
  }
})
class Settings extends React.Component{
  constructor(props){
    super(props)
  }
  
  render(){
    const {auth, classes} = this.props;
    return(
      <NavBar auth={auth}>
        <React.Fragment>
          <div style={{backgroundColor: '#3f51b5'}}>
                <Container maxWidth="lg" style={{padding: '96px 16px'}}>
                  <Grid container spacing={2}>
                      <Grid item xs={12} style={{padding: 8, boxSizing: 'border-box'}}>
                        <h3 style={{padding: 0, margin: 0, fontWeight: 'bold', color: 'white', fontSize: '3rem', lineHeight: 1.167, fontFamily: 'Lato'}}>Account Settings</h3>
                      </Grid>
                      <Grid item xs={12} style={{padding: 8, boxSizing: 'border-box'}}>
                        <h6 style={{padding: 0, margin: 0, fontWeight: 500, color: 'white', fontSize: '1.25rem', lineHeight: 1.6, fontFamily: 'Lato'}}>
                          Change account information and settings
                        </h6>
                      </Grid>
                    </Grid>
                </Container>
            </div>
            <div style={{backgroundColor: 'rgb(247, 249, 250)', minHeight: 'calc(100vh - 64px - 320px - 296px)'}}>
              <Container maxWidth="lg" style={{padding: '96px 16px'}}>

              </Container>
            </div>
        </React.Fragment>
      </NavBar>
    )
  }
}


Settings.getInitialProps = authInitialProps(true);

export default withStyles(styles)(Settings);