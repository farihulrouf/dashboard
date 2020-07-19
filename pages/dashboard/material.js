import {Grid, makeStyles, withStyles, InputBase, Paper, ButtonBase, Typography,
        Button} from '@material-ui/core';
import {Search} from '@material-ui/icons';
import {getCourses} from '../../lib/api';
import StarRatings from 'react-star-ratings';

const styles = ((theme) => ({
    root: {
        flexGrow: 1,
    },
    search: {
        justifyContent: 'center',
        display: 'flex',
        marginBottom: 20,
    },
    searchIcon: {
        alignSelf: 'center',
        paddingLeft: 5,
        paddingRight: 5
    },
    paper: {
      padding: theme.spacing(2),
      margin: 'auto',
      width: 350,
      ['@media (max-width:400px)']: { 
        width: '90%'
      }
    },
    image: {
      width: 128,
      height: 128,
    },
    img: {
      margin: 'auto',
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
    },
}));
const useStyles = makeStyles(styles);

function Module(props){
    const {_id, name, about, total_problems, logo, price, rating} = props.data;
    const classes = useStyles();
    return(
        <Paper className={classes.paper}>
            <Grid container spacing={2}>
            <Grid item>
                <ButtonBase className={classes.image}>
                <img className={classes.img} src={logo} alt="complex" />
                </ButtonBase>
            </Grid>
            <Grid item>
                <b style={{fontSize: 20}}>{name}</b>
                <div>
                    <StarRatings
                    rating={rating}
                    starRatedColor="#F9A602"
                    starDimension="20px"
                    starSpacing="1px"
                    name='rating'
                    size={5}
                    />
                </div>
                <div>
                    {`${new Intl.NumberFormat('ind', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 2
                        }).format(price)}`
                    }
                </div>
                <div style={{marginTop: 10}}>
                    <Button size="small" variant="outlined" color="primary" href={`/subjects/${_id}`}>
                        GO TO COURSE
                    </Button>
                </div>
            </Grid>
            </Grid>
        </Paper>    
    )
}

class MaterialPage extends React.Component{
    constructor(props){
        super(props)
        this.state={modules: []}
    }

    componentDidMount(){
        const { auth } = this.props;

        getCourses(auth.user).then(courses => this.setState({modules: courses }));
    }

    render(){
        const {classes} = this.props;
        const {modules} = this.state;

        return(
            <React.Fragment>
            <div className={classes.search}>
                <div style={{display: 'flex', borderStyle: 'ridge', borderRadius: 50}}>
                    <div className={classes.searchIcon}>
                        <Search style={{fontSize: 20}} />
                    </div>
                    <InputBase
                        placeholder="Cari Materi……"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                        onInput={(text)=> console.log(text.target.value)}
                    />
                </div>
            </div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={3}>
                        {modules.map((value) => (
                            <Grid key={value._id} item>
                                <Module data={value} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
            </React.Fragment>    
        )
    }
}

export default withStyles(styles)(MaterialPage);
