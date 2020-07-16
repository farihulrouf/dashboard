import {Grid, Avatar, Typography, makeStyles} from '@material-ui/core';

const styles = (theme) => ({
    inline: {
        display: 'inline',
    }
});
const useStyles = makeStyles(styles);

const CommentItem = (props) => {
    const classes = useStyles();
    const {data} = props;
    return(
        <Grid container style={{margin: 10}}>
            <Grid container spacing={2}>
                <Grid item>
                    <Avatar style={{width: 30, height: 30}} alt={data.commentator.name} src="/static/images/avatar/1.jpg" />
                </Grid>
                <Grid item>
                    <Grid container style={{fontSize: 12}}><b>{data.commentator.name}</b></Grid>
                    <Grid container>
                        <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                        >
                            {data.createdAt}
                        </Typography>
                        </React.Fragment>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 10}}>
                <span style={{fontSize: 12}}>{data.content}</span>
            </Grid>
        </Grid>
    )
}

export default CommentItem;