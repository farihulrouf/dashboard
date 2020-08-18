import React from 'react';
import {AppBar, Toolbar, List, ListItem, ListItemIcon, ListItemText, IconButton,
     Grid, Button, Container, withStyles} from "@material-ui/core";
import {Facebook, Pinterest, Twitter, Instagram, Menu} from "@material-ui/icons";
import Link from "next/link";
import MenuItem from "./Menu";

const useStyles = (theme) => ({
    appBar: {
        backgroundColor: '#ffffffff', 
        boxShadow: 'none',
        borderBottom: '1px solid #eeeeee'
    },
    logo: {
        width: 120,
        height: 32
    },
    container: {
        padding: 0
    },
    content: {
        minHeight: 'calc(100vh - 64px - 320px)'
    },
    toolbarIcon: {
      ['@media (min-width:800px)']: { 
        display: 'none'
      },
      flexGrow: 1
    },
    navBar: {
      ['@media (max-width:800px)']: { 
        display: 'none'
      },
      zIndex: 1,
      flexGrow: 1
    }
})

class NavBar extends React.Component{
    constructor(props){
        super(props);
        this.state={active: ""}
    }
    render(){
        const {classes, children, onlyLogo, auth} = this.props;
        const {active} = this.state;
        return(
        <React.Fragment>
            <AppBar position="static" className={classes.appBar}>
                <Container maxWidth="lg">
                    <Toolbar className={classes.toolbar}>
                        <Grid container alignItems="center">
                            <Grid item className={classes.logo}>
                                <Link href="/"><a style={{textDecoration: 'none'}}><img width="100%" height="100%" src="https://thefront.maccarianagency.com/images/logos/logo.svg" /></a></Link>
                            </Grid>
                            <Grid item className={classes.navBar}>
                                {!onlyLogo && <Grid container justify="flex-end" spacing={2}>
                                    {!auth && <React.Fragment>
                                    <Grid item>
                                        <MenuItem name="Landings" />
                                    </Grid>
                                    <Grid item>
                                        <MenuItem name="Pages" />
                                    </Grid>
                                    <Grid item>
                                        <Link href="/signin"><a style={{textDecoration: 'none'}}><Button variant="outlined" color="primary">Sign in</Button></a></Link>
                                    </Grid>
                                    </React.Fragment>}
                                    {!!auth && <React.Fragment>
                                        <Grid item>
                                            <MenuItem name="Landings" />
                                        </Grid>
                                        <Grid item>
                                            <MenuItem name="Pages" />
                                        </Grid>
                                        <Grid item>
                                            <MenuItem name="Notifications" />
                                        </Grid>
                                        <Grid item>
                                            <MenuItem name="Account" />
                                        </Grid>
                                    </React.Fragment>}
                                </Grid>}
                            </Grid>
                            <Grid item className={classes.toolbarIcon}>
                              <Grid container justify="flex-end">
                                <Grid item>
                                  <IconButton style={{padding: 0}} aria-label="menu">
                                    <Menu />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </Container>
            </AppBar>
            <main className={classes.content}>
                <Container maxWidth={false} className={classes.container}>
                    {React.cloneElement(children,{active: active})}
                </Container>
            </main>
            <Container maxWidth={false} name="footer" style={{color: 'white', backgroundColor: '#1b1642', padding: '48px 0px'}}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={2} style={{padding: 16}}>
                            <List style={{padding: 0}}>
                                <ListItem style={{padding: 0, paddingBottom: 8}}>
                                    <div style={{width: 120, height: 32}}>
                                    <a href="/"><img width="100%" height="100%" src="https://thefront.maccarianagency.com/images/logos/logo-negative.svg" /></a>
                                    </div>
                                </ListItem>
                                <ListItem style={{padding: '8px 0px'}}>
                                    <IconButton style={{padding: 0}}>
                                        <Facebook style={{marginRight: 8, color: "rgba(255,255,255,.6)"}} />
                                    </IconButton>
                                    <IconButton style={{padding: 0}}>
                                        <Instagram style={{marginRight: 8, color: "rgba(255,255,255,.6)"}} />
                                    </IconButton>
                                    <IconButton style={{padding: 0}}>
                                        <Twitter style={{marginRight: 8, color: "rgba(255,255,255,.6)"}} />
                                    </IconButton>
                                    <IconButton style={{padding: 0}}>
                                        <Pinterest style={{marginRight: 8, color: "rgba(255,255,255,.6)"}} />
                                    </IconButton>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12} md={10} style={{padding: 0}}>
                            <Grid container>
                                <Grid item>
                                    <div style={{display: "flex"}}>
                                        <div style={{display: "block"}}>
                                            <List style={{padding: 0, margin: 16}}>
                                                <ListItem style={{margin: 0, padding: 0, paddingBottom: 4, textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Layanan</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bimbel Online</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bank Soal</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Materi Pelajaran</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bimbingan Konseling</p></ListItem>
                                            </List>
                                            <List style={{padding: 0, margin: 16}}>
                                                <ListItem style={{margin: 0, padding: 0, paddingBottom: 4, textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Lesgo</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Tentang Kami</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Karir</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Kontak Kami</p></ListItem>
                                            </List>
                                        </div>
                                        <div style={{display: "block"}}>
                                            <List style={{padding: 0, margin: 16}}>
                                                <ListItem style={{margin: 0, padding: 0, paddingBottom: 4, textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Layanan</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bimbel Online</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bank Soal</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Materi Pelajaran</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bimbingan Konseling</p></ListItem>
                                            </List>
                                            <List style={{padding: 0, margin: 16}}>
                                                <ListItem style={{margin: 0, padding: 0, paddingBottom: 4, textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Lesgo</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Tentang Kami</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Karir</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Kontak Kami</p></ListItem>
                                            </List>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item>
                                    <div style={{display: "flex"}}>
                                        <div style={{display: "block"}}>
                                            <List style={{padding: 0, margin: 16}}>
                                                <ListItem style={{margin: 0, padding: 0, paddingBottom: 4, textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Layanan</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bimbel Online</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bank Soal</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Materi Pelajaran</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bimbingan Konseling</p></ListItem>
                                            </List>
                                            <List style={{padding: 0, margin: 16}}>
                                                <ListItem style={{margin: 0, padding: 0, paddingBottom: 4, textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Lesgo</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Tentang Kami</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Karir</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Kontak Kami</p></ListItem>
                                            </List>
                                        </div>
                                        <div style={{display: "block"}}>
                                            <List style={{padding: 0, margin: 16}}>
                                                <ListItem style={{margin: 0, padding: 0, paddingBottom: 4, textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Layanan</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bimbel Online</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bank Soal</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Materi Pelajaran</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bimbingan Konseling</p></ListItem>
                                            </List>
                                            <List style={{padding: 0, margin: 16}}>
                                                <ListItem style={{margin: 0, padding: 0, paddingBottom: 4, textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Lesgo</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Tentang Kami</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Karir</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Kontak Kami</p></ListItem>
                                            </List>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item>
                                    <div style={{display: "flex"}}>
                                        <div style={{display: "block"}}>
                                            <List style={{padding: 0, margin: 16}}>
                                                <ListItem style={{margin: 0, padding: 0, paddingBottom: 4, textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Layanan</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bimbel Online</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bank Soal</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Materi Pelajaran</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bimbingan Konseling</p></ListItem>
                                            </List>
                                            <List style={{padding: 0, margin: 16}}>
                                                <ListItem style={{margin: 0, padding: 0, paddingBottom: 4, textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Lesgo</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Tentang Kami</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Karir</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Kontak Kami</p></ListItem>
                                            </List>
                                        </div>
                                        <div style={{display: "block"}}>
                                            <List style={{padding: 0, margin: 16}}>
                                                <ListItem style={{margin: 0, padding: 0, paddingBottom: 4, textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Layanan</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bimbel Online</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bank Soal</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Materi Pelajaran</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Bimbingan Konseling</p></ListItem>
                                            </List>
                                            <List style={{padding: 0, margin: 16}}>
                                                <ListItem style={{margin: 0, padding: 0, paddingBottom: 4, textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Lesgo</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Tentang Kami</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Karir</p></ListItem>
                                                <ListItem style={{color: 'rgba(255,255,255,.6)', padding: 0, paddingBottom: 4, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4}}><p style={{margin: 0, padding: 0}}>Kontak Kami</p></ListItem>
                                            </List>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Container>
        </React.Fragment>
        )
    }
}

export default withStyles(useStyles)(NavBar);