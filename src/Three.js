import NavBar from '../src/NavBar.js';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import {Card,CardActions,CardContent} from '@material-ui/core';
import {Select,FormControl,FormHelperText,InputLabel,MenuItem} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
      width:400
    },
    rootButton: {
        '& > *': {
          margin: theme.spacing(1),
        },
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
  }));

function ContainedButtons() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
        <Button variant="contained" color="secondary">
            Start
        </Button>
        </div>
    );
}

function SimpleSelect() {
    const classes = useStyles();
    const [time, setTime] = React.useState('');

    const handleChange = (event) => {
        setTime(event.target.value);
    };

    return (
        <div>
        <FormControl className={classes.formControl}>
            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
            Time
            </InputLabel>
            <Select
            labelId="demo-simple-select-placeholder-label-label"
            id="demo-simple-select-placeholder-label"
            value={time}
            onChange={handleChange}
            displayEmpty
            className={classes.selectEmpty}
            >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={60}>60</MenuItem>
            <MenuItem value={90}>90</MenuItem>
            <MenuItem value={120}>120</MenuItem>
            </Select>
            <FormHelperText>waktu dalam menit</FormHelperText>
        </FormControl>
        </div>
    );
}


function CheckboxLabels(props) {
    
    const [state, setState] = React.useState({
      checkedB: false
    });
  
    const handleChange = (event) => {
      setState({ ...state, [event.target.name]: event.target.checked });
    };
  
    console.log("CheckBoxLabels");

    return (
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.checkedB}
              onChange={handleChange}
              name="checkedB"
              color="primary"
            />
          }
        label= {<CardFormat {...props} />}
        />
      </FormGroup>
    );
}

function CardFormat(props){
    const classes = useStyles();
    const {name, description, suitable} = props.data;
    // const bull = <span className={classes.bullet}>•</span>;
    return(
        // <span>{name}</span>
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography variant="h5" component="h2">
                    {name}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {description}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    {suitable}
                </Typography>
            </CardContent>
        </Card>
    );
}

const three = () => {
    const modules = [
        {id: 1, name:"aljabar", description: "aljabar linier dan geometri", suitable: "SMA"},
        {id: 2, name:"geometri", description: "bangun ruang, luas, volume", suitable: "SMP"},
        {id: 3, name:"probabilitas", description: "menghitung peluang suatu kejadian", suitable: "SMA"},
        {id: 4, name:"statistika", description: "menampilkan dalam bentuk diagram", suitable: "SMA"},
        {id: 5, name:"tambah kurang", description: "buar nak sd", suitable: "SD"},
        {id: 6, name:"kali bagi", description: "buat nak sd juga", suitable: "SD"}
    ]
    return(
        <NavBar>
            <Grid container justify="space-around" spacing={2}>
                <Grid item>
                    <SimpleSelect />
                </Grid>
                <Grid item>
                    <ContainedButtons />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={3}>
                        {modules.map((value) => (
                            <Grid key={value.id} item>
                                <CheckboxLabels data={value} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </NavBar>
    )
}

export default three;