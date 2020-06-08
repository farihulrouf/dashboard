import NavBar from '../../components/NavBar.js';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import BookIcon from '@material-ui/icons/Book';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width : 250
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
    width : 250
  },
  title: {
    margin: theme.spacing(4, 0 ,2),
  },
}));

function InteractiveList(props) {
    const {name,prereq} = props.data;
    const classes = useStyles();

    return (
        <div className={classes.root}>
        <Grid container spacing={2} xs={12} md={3}>
            <Grid item >
                <Typography variant="h6" className={classes.title}>
                    {name}
                </Typography>
                <div className={classes.demo}>
                    {prereq.map((value) => (
                        <Grid key={value.id} item>
                            <ListItem>
                                <ListItemIcon>
                                    <BookIcon />
                                </ListItemIcon>
                                <ListItemText primary={value}/>
                            </ListItem>
                        </Grid>
                    ))}
                </div>
            </Grid>
        </Grid>
        </div>
    );
}

const two = () => {
    const sylabus = [
        {name : "OOP", prereq : ["PTI", "DASPRO", "ALSTRUKDAT"]},
        {name : "probstat", prereq : ["kalkulus 1", "kalkulus 2", "algeo"]},
        {name : "stima", prereq : ["alstrukdat", "PTI", "DASPRO", "matdis"]},
        {name : "MBA", prereq : ["bisnis", "manajemen", "finance", "ekonomi"]},
        {name : "Farmasi", prereq : ["IPA", "biologi", "kimia", "kimor"]},
        {name : "gatau", prereq : ["males mikir"]},
    ]
    return(
        <React.Fragment>
            <Grid item>
                <h1> PREREQUISITE</h1>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={3}>
                        {sylabus.map((value) => (
                            <Grid key={value.id} item>
                                <InteractiveList data={value} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
    
}

export default two;