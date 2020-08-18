import {Grid, Container, Button, Paper, withStyles, Avatar} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {Assignment, SupervisorAccount, PeopleAlt, Business, Star, ArrowRightAlt, FormatQuote} from "@material-ui/icons";
import Link from "next/link";


const useStyles = (theme) => ({
    toolbar: {
        margin: '0 auto',
        padding: '0 16',
        maxWidth: 1100,
        width: '100%'
    },
    divider: {
        borderBottom: '1px solid #eeeeee',
        width: '100%'
    },
    container: {
        margin: '0px auto',
        padding: '0 16px',
        width: '100%'
    },
    paper: {
        padding: '48px 24px',
        minHeight: 350,
        maxHeight: 350
    }
})


const Feature = (props) => {
    const classes= makeStyles(useStyles)();
    const {f} = props;

    return(
        <Paper className={classes.paper} elevation={3}>
            <div style={{width: 200}}>
                <div style={{marginBottom: 10}}>
                    <div style={{backgroundColor: f.iconBackgroundColor, padding: 10, borderRadius: 10, display: 'inline-block'}}>
                        {f.icon({color: f.iconColor, fontSize: 50, fontWeight: 900})}
                    </div>
                </div>
                <h4 style={{margin: '0 auto', color: '#3f51b5', fontWeight: 700, textAlign: 'left', fontSize: '2rem'}}>{f.number}</h4>
                <h4 style={{margin: '0 auto', fontWeight: 700, fontSize: '1.25rem'}}>{f.title}</h4>
                <p>{f.body}</p>
            </div>
        </Paper>
    )
}
const Course = () => {
    return(
        <Paper style={{borderRadius: 20, overflow: 'hidden'}}>
            <div style={{height: 300, width: 350, position: 'relative'}}>
                <span>
                    <img width="100%" height="100%" src="https://thefront.maccarianagency.com/images/photos/coworking/place2.jpg" />
                </span>
                <div style={{margin: 0, padding: 8, borderRadius: 8, position: 'absolute', right: 16, bottom: 16, backgroundColor: 'white'}}>
                    <p style={{margin: 0, fontWeight: 700, color: '#3f51b5', fontFamily: 'Lato', fontSize: '1rem', lineHeight: 1.5}}>$59 / month</p>
                </div>
            </div>
            <div style={{padding: '32px 16px'}}>
                <Grid container>
                    <Grid xs={12} item style={{padding: 4}}><h6 style={{margin: 0, fontWeight: 700, color: '#121037', textAlign: 'left', fontSize: '1.25rem', lineHeight: 1.6}}>Data Science</h6></Grid>
                    <Grid xs={12} item style={{padding: 4}}><p style={{color: '#546e7a', fontWeight: 400, fontSize: '1rem', lineHeight: 1.5, margin: 0}}>Ramandika Pranamulia</p></Grid>
                </Grid>
                <Grid alignItems="center" container>
                    <Grid xs={6} item>
                        <Grid container><Avatar
                             src="https://thefront.maccarianagency.com/images/photos/people/veronica-adams.jpg" width="40" height="40" style={{border: '3px solid white'}} />
                            <Avatar src="https://thefront.maccarianagency.com/images/photos/people/akachi-luccini.jpg" width="40" height="40" style={{marginLeft: -16, border: '3px solid white'}} />
                            <Avatar width="40" height="40" style={{marginLeft: -16, border: '3px solid white'}} />
                            <Avatar width="40" height="40" style={{marginLeft: -16, border: '3px solid white'}} />
                            <Avatar width="40" height="40" style={{marginLeft: -16, border: '3px solid white'}} />
                        </Grid>
                    </Grid>
                    <Grid xs={6} item>
                        <Grid container justify="flex-end"><Star style={{color: '#f9a825'}} />
                            <span style={{fontWeight: 700, fontSize: '1rem', fontColor: '#121037'}}>5.0</span>
                            <span style={{marginLeft: 8, color: '#546e7a', fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.43}}>(28 reviews)</span>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container alignItems="center">
                        <p style={{color: '#3f51b5', fontSize: '1rem', fontWeight: 'bold', lineHeight: 1.5}}>Join Course </p><ArrowRightAlt style={{color: '#3f51b5'}}/>
                </Grid>
            </div>
        </Paper>
    )
}

const Testimoni = (props) => {
    const classes = makeStyles(useStyles)();
    return(
        <Paper style={{padding: '48px 24px',}} elevation={3}>
            <Grid container style={{width: 250}}>
                <Grid xs={12} item>
                    <Grid container justify="center" style={{padding: 8}} >
                        <div style={{backgroundColor: '#e3f2fd', padding: 10, borderRadius: 10, display: 'inline-block'}}>
                            <FormatQuote style={{color: 'rgb(33, 150, 243)', fontSize: 50, fontWeight: 900}}/>
                        </div>
                    </Grid>
                </Grid>
                <Grid xs={12} item>
                    <div style={{height: 120}}>
                    <p style={{textAlign: 'center', fontSize: '1.25rem'}}>{props.comment}</p>
                    </div>
                </Grid>
                <Grid xs={12} item>
                    <Grid container alignItems="center" style={{padding: 10, height: 100}}>
                        <Grid item xs={3}>
                            <Avatar src="https://thefront.maccarianagency.com/images/photos/people/veronica-adams.jpg" width="40" height="40" style={{border: '3px solid white'}} />
                        </Grid>
                        <Grid item xs={9}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <span style={{fontSize: '1rem', fontWeight: 700, lineHeight: 1.5}}>{props.name}</span>
                                </Grid>
                                <Grid item xs={12}>
                                    <span style={{fontSize: '0.875rem', color: '#546e7a', fontWeight: 400, lineHeight: 1.4}}>{props.title}</span>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}
class HomePage extends React.Component{
    constructor(props){
        super(props)
        const features = [
            {icon: (styles)=> <Assignment style={styles}/>,iconColor: 'rgb(33, 150, 243)', iconBackgroundColor: '#e3f2fd', number: '1000+', title: 'Online Courses', body: 'Choose from over 1000+ online courses and join the community'},
            {icon: (styles) => <SupervisorAccount style={styles}/>,iconColor: 'rgb(156, 39, 176)', iconBackgroundColor: '#f3e5f5', number: '200+', title: 'Expert Tutors', body: 'More than two hundred expert tutors are ready to take you into the next level'},
            {icon: (styles) => <PeopleAlt style={styles}/>,iconColor: 'rgb(233, 30, 99)', iconBackgroundColor: '#fce4ec', number: '1M+', title: 'Active Students', body: 'We have more than 1 Million students actively learning in our platform'},
            {icon: (styles) => <Business style={styles}/>,iconColor: 'rgb(63, 81, 181)', iconBackgroundColor: '#e8eaf6', number: '10+', title: 'Company Partners', body: 'Get hired by our company partners'}
        ]
        const testimonies = [
            {comment: "Berbagi ilmu di platform ini menjadi lebih mudah karena bisa interaksi dua arah", name: "Ramandika", title: "Senior Software Engineer @Qontak.com"},
            {comment: "Belajar materi IF di sini banyak yang share dan bisa tanya2", name: "Ramandika", title: "Mahasiswa IF ITB"},
            {comment: "Cari engineer di sini sangat mudah dan berkualiatas", name: "Ramandika", title: "Lead Software Engineer @Pinhome"},
        ]
        this.features = features;
        this.testimonies = testimonies;
    }

    render(){
        const {classes} = this.props;
        return(
        <React.Fragment>
                <div className={classes.divider}>
                    <Container maxWidth="lg" className={classes.body}>
                        <section style={{padding: '96px 16px'}}>
                            <h2 style={{padding: 30, paddingBottom: 0, margin: 0, fontWeight: 'bold', color: '#121037', fontSize: '3.75rem', textAlign: 'center', fontFamily: 'Lato', lineHeight: 1.2}}>
                                A platform where you can study anything <br />
                                <span style={{fontSize: '4rem', color: '#F9B934'}}>in Real Time</span><br/>
                                <p style={{fontSize: '1.5rem', color: '#121037', fontWeight: 400, fontFamily: 'Lato'}}>Edupedia will help you reach your learning goals and saving your precious time in learning</p>
                            </h2>
                            <Grid justify="center" container spacing={2}>
                                <Grid item>
                                    <Link href="./signup"><a style={{textDecoration: 'none'}}><Button style={{fontSize: 18}} variant="contained" color="primary">SignUp</Button></a></Link>
                                </Grid>
                                <Grid item>
                                    <Button style={{fontSize: 18}} variant="outlined" color="primary">Learn More</Button>
                                </Grid>
                            </Grid>
                        </section>
                    </Container>
                </div>
                <div style={{width: '100%', backgroundColor: 'rgb(247, 249, 250)'}}>
                    <Container maxWidth="lg" className={classes.body}>
                        <section style={{padding: '96px 16px'}}>
                            <h4 style={{fontWeight: 'bold', color: '#121037', textAlign: 'center', fontSize: '2rem', fontFamily: 'Lato', lineHeight: 1.2}}>
                                <span>Our global class is open <span style={{color: "#3f51b5"}}>for All</span></span><br/>
                                <span style={{color: "#546e7a", fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.6}}>The best way to do online learning is to be able to communicate two direction</span>
                            </h4>
                            <Grid container justify="space-evenly" spacing={3}>
                                {this.features.map((f,i) => (
                                    <Grid key={i} item><Feature f={f} /></Grid>)
                                )}
                            </Grid>
                        </section>
                    </Container>
                </div>
                <div style={{width: '100%'}}>
                    <Container maxWidth="lg" className={classes.body}>
                        <section style={{padding: '96px 16px'}}>
                            <h4 style={{fontWeight: 'bold', color: '#121037', textAlign: 'center', fontSize: '2rem', fontFamily: 'Lato', lineHeight: 1.2}}>
                                <span>Browse our <span style={{color: "#f9b934"}}>popular courses</span></span><br/>
                                <span style={{color: "#546e7a", fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.6}}>Here are our popular courses you might want to learn</span>
                            </h4>
                            <Grid container justify="center" spacing={5}>
                                {[1,2,3,4,5].map((val) => <Grid key={val} item><Course /></Grid>)}
                            </Grid>
                        </section>
                    </Container>
                </div>
                <div style={{width: '100%', backgroundColor: 'rgb(247, 249, 250)'}}>
                    <Container maxWidth="lg" className={classes.body}>
                        <section style={{padding: '96px 16px'}}>
                            <div style={{textAlign: 'center'}}>
                                <img width="100" src="https://thefront.maccarianagency.com/images/illustrations/rated-by-our-customer.png" />
                            </div>
                            <h4 style={{marginTop: 0, fontWeight: 'bold', color: '#121037', textAlign: 'center', fontSize: '2rem', fontFamily: 'Lato', lineHeight: 1.2}}>
                                <span style={{fontWeight: 'bold', color: '#121037', fontSize: '2rem'}}><span style={{color: '#3f51b5'}}>Rated 5 out of 5</span> stars by our users</span><br/>
                                <span style={{color: "#546e7a", fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.6}}>Educators and students have a great experiences using Edupedia, Here is what they have to say</span>
                            </h4>
                            <Grid container justify="space-evenly">
                                {this.testimonies.map((t,i)=> (
                                    <Grid item key={i}><Testimoni {...t} /></Grid>
                                ))}
                            </Grid>
                        </section>
                    </Container>
                </div>
        </React.Fragment>
        )
    }
}

export default withStyles(useStyles)(HomePage);