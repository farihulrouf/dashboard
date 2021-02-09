import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {Card, CardHeader, CardMedia, CardContent,MenuItem,
    CardActions, Select } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        marginTop: 30
    },
    formControl: {
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
      backgroundColor: blue[900],
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
        <Button variant="contained" color="primary">
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
            <CardContent style = {{width : '100%'}}>
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

const Discussion = () => {
    const classes = useStyles();
    const [orderByValue, setOrderByValue] = React.useState("newest");

    const handleChange = (event) => {
        setOrderByValue(event.target.value);
    };

    const questions = [
        {id : "1", name : "c", kodesoal : "alj-SMA-2", nomor : "10",question : "no 3 bagian c kenapa caranya gapake taorema blablabla"},
        {id : "2", name : "r", kodesoal : "geo-SMP-4", nomor : "98",question : "saya ngitung pake a kok hasilnya b"},
        {id : "3", name : "a", kodesoal : "bhs-SD-10", nomor : "3",question : "gatau bingung mau nanya apa menuh2in aja hehehe"},
        {id : "4", name : "m", kodesoal : "bio-SMA-1", nomor : "61",question : "kak untuk no 10 itu pake cara apa ya?"},
        {id : "5", name : "d", kodesoal : "kim-SMA-5", nomor : "24",question : "yu mari ditanya ditanya"}
    ]
    return(
        <React.Fragment>
            <Grid container spacing={3} style={{alignItems: 'center', justifyContent: 'space-between'}}>
                <Grid xs={12} sm={10} item>
                    <Grid container style={{alignItems: 'center'}}>
                        <h3 style={{marginRight: 20}}>Diskusi</h3>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Oder By</InputLabel>
                            <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={orderByValue}
                            label="OrderBy"
                            style={{height: 35}}
                            onChange={handleChange}
                            >
                            <MenuItem value={"newest"}>Newest</MenuItem>
                            <MenuItem value={"oldest"}>Oldest</MenuItem>
                            <MenuItem value={"toppost"}>Top Post</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid xs={12} sm={2} item>
                    <Button style={{width: '100%'}} variant="contained" color="secondary">
                        New Post
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {questions.map((value) => (<QuestionCard key={value.id} data={value} />))}
            </Grid>
        </React.Fragment>
    )
}

export default Discussion;