import NavBar from '../src/NavBar.js';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {Card, CardHeader, CardMedia, CardContent,CardActions } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        Width: 200
    },
    rootButton: {
        '& > *': {
          margin: theme.spacing(1)
        },
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
    root2: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    margin: {
        margin: theme.spacing(1)
      },
    withoutLabel: {
        marginTop: theme.spacing(3),
      },
    textField: {
        width: '20ch',
      },
  }));

function ContainedButtons() {
    const classes = useStyles();

    return (
        <div className={classes.rootButton}>
        <Button variant="contained" color="secondary">
            Tanyakan
        </Button>
        </div>
    );
}

function InputAdornments() {
    const classes = useStyles();

    return (
        <Grid container className={classes.root2}>
            <TextField
            label="Kode soal"
            id="outlined-start-adornment"
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
            />
            <TextField
            label="Nomor"
            id="outlined-start-adornment"
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
            />
            <ContainedButtons />
            <FormControl fullWidth className={classes.margin} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-amount">Pertanyaan</InputLabel>
                <OutlinedInput labelWidth={85}/>
            </FormControl>
        </Grid>
    );
}

function QuestionCard(props) {
    const {name, kodesoal, nomor, question} = props.data
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card className={classes.root}>
        <CardHeader
            avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
                {name}
            </Avatar>
            }
            action={
            <IconButton aria-label="settings">
                <MoreVertIcon />
            </IconButton>
            }
            title = {
            <Typography variant="body2" color="textSecondary" component="p">
                {kodesoal} / {nomor}
            </Typography>
            }
            subheader= "19 mei 2020"
        />
        {/* <CardMedia
            className={classes.media}
            image="data:image/jpeg;base64,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"
            title="Paella dish"
        /> */}
        <CardContent style = {{width : 1000}}>
            <Typography variant="body2" color="textSecondary" component="p">
                {question}
            </Typography>
        </CardContent>
        <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
                <FavoriteIcon />
            </IconButton>
            <IconButton
                className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                >
            <ExpandMoreIcon />
            </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
            <Typography paragraph>Jawaban Guru:</Typography>
            <Typography paragraph>
                hitung yg bener dong bro !!
            </Typography>
            </CardContent>
        </Collapse>
        </Card>
    );
}

const one = () => {
    const questions = [
        {id : "1", name : "c", kodesoal : "alj-SMA-2", nomor : "10",question : "no 3 bagian c kenapa caranya gapake taorema blablabla"},
        {id : "2", name : "r", kodesoal : "geo-SMP-4", nomor : "98",question : "saya ngitung pake a kok hasilnya b"},
        {id : "3", name : "a", kodesoal : "bhs-SD-10", nomor : "3",question : "gatau bingung mau nanya apa menuh2in aja hehehe"},
        {id : "4", name : "m", kodesoal : "bio-SMA-1", nomor : "61",question : "kak untuk no 10 itu pake cara apa ya?"},
        {id : "5", name : "d", kodesoal : "kim-SMA-5", nomor : "24",question : "yu mari ditanya ditanya"}
    ]
    return(
        <NavBar>
            <Grid item justify="left">
                <h1> ask your question here! </h1>
            </Grid>
            <Grid item justify="left">
                <InputAdornments/>
            </Grid>
            <Grid container justify="center">
                <h1> Subject Discussion </h1>
            </Grid>
            <Grid container justify="center" spacing={3}>
                {questions.map((value) => (
                        <Grid key={value.id} item>
                            <QuestionCard data={value} />
                        </Grid>
                    ))}
            </Grid>
        </NavBar>
    )
}

export default one;