import NavBar from '../../components/NavBar.js';
import { makeStyles } from '@material-ui/core/styles';;
import {Grid, List, ListItem, ListItemAvatar, Avatar, ListItemText,
    Typography, Paper, Button, IconButton, InputBase, Divider
} from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Comment';
import ShareIcon from '@material-ui/icons/Share';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions'


const styles = (theme) => ({
    root: {
        width: '80%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    searchRoot: {
        marginTop: 10
    },
    input: {
        width: '80%'
    }
});
const useStyles = makeStyles(styles);

const Item = (props) => {
    const classes = useStyles();
    const {data} = props
    return(
    <Paper elevation={3} style={{marginBottom: 20}}>
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt={data.sender} src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
            primary={data.title}
            secondary={
                <React.Fragment>
                    <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                    >
                        {`${data.sender} | ${data.date}`}
                    </Typography>
                    <Grid container>
                        <p>{data.body}</p>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                className={classes.button}
                                startIcon={<ThumbUpIcon />}
                            >
                                Like
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                className={classes.button}
                                startIcon={<CommentIcon />}
                            >
                                Comment
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                className={classes.button}
                                startIcon={<ShareIcon />}
                            >
                                Share
                            </Button>
                        </Grid>
                    </Grid>
                </React.Fragment>
            }
        />
    </ListItem>
    </Paper>
    )
}

const SearchBar = () => {
    const classes = useStyles();
    return(
        <Paper elevation={3} component="form" className={classes.searchRoot}>
            <IconButton type="submit" className={classes.iconButton} aria-label="search">
                <SearchIcon />
            </IconButton>
            <InputBase
            className={classes.input}
            placeholder="Search....."
            inputProps={{ 'aria-label': 'search google maps' }}
            />
        </Paper>
    )
}

const AnnouncementBoard = () => {
    return(
        <Paper elevation={3} style={{paddingLeft: 20, marginTop: 10}}>
                <h3>Papan Pengumuman</h3>
        </Paper>
    )
}

const Home = () => {
    const classes = useStyles();
    const data = [
        {
            title: 'Ujian Kalkulus diundur',
            body: `Dikarenakan satu dan lain hal ujian kalkulus IA akan diundur 
            menjadi tanggal 20 Agustus 2020`,
            sender: 'Yudistira',
            date: new Date()
        },
        {
            title: 'Tugas Besar II',
            body: `Tugas besar dua dirilis perhari ini, silahkan cek dokumen terlampir
            untuk detail spesifikasi tugas besar II. Deadline tubes II ini 2 minggu dari
            hari ini`,
            sender: 'Agus Yodi',
            date: new Date()
        },
        {
            title: 'Ujian Kalkulus diundur',
            body: `Dikarenakan satu dan lain hal ujian kalkulus IA akan diundur 
            menjadi tanggal 20 Agustus 2020`,
            sender: 'Yudistira',
            date: new Date()
        },
        {
            title: 'Tugas Besar II',
            body: `Tugas besar dua dirilis perhari ini, silahkan cek dokumen terlampir
            untuk detail spesifikasi tugas besar II. Deadline tubes II ini 2 minggu dari
            hari ini`,
            sender: 'Agus Yodi',
            date: new Date
        },
        {
            title: 'Ujian Kalkulus diundur',
            body: `Dikarenakan satu dan lain hal ujian kalkulus IA akan diundur 
            menjadi tanggal 20 Agustus 2020`,
            sender: 'Yudistira',
            date: new Date()
        },
        {
            title: 'Tugas Besar II',
            body: `Tugas besar dua dirilis perhari ini, silahkan cek dokumen terlampir
            untuk detail spesifikasi tugas besar II. Deadline tubes II ini 2 minggu dari
            hari ini`,
            sender: 'Agus Yodi',
            date: new Date()
        }
    ]

    return(
        <React.Fragment>
            <Grid container>
                <Grid item xs={12} sm={3}>
                    <SearchBar />
                    <AnnouncementBoard />
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Grid container style={{justifyContent: 'center'}}>
                        <List className={classes.root}>
                            {data.map((value) => <Item data={value} />)}
                        </List>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
    
}

export default Home;