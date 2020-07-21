import {Paper, Grid, Button} from "@material-ui/core";
import StarRatings from 'react-star-ratings';

export default function CourseItem(props){
    const {logo,about,rating,name,price} = props

    return(
        <Paper elevation={3} style={{padding: 10, width: 300}}>
            <Grid container>
                <Grid item style={{width: '30%'}}>
                    <Grid container direction="column" alignItems="center" justify="center" style={{height: '100%'}}>
                        <img src={logo} style={{maxWidth: '100%', maxHeight: '100%'}} />
                    </Grid>
                </Grid>
                <Grid item style={{width: '70%', paddingLeft: 10}}>
                    <h3 style={{padding: 0, margin: 0}}>{name}</h3>
                    <p style={{padding: 0, margin: 0}}>{about}</p>
                    <p style={{padding: 0, margin: 0}}>{new Intl.NumberFormat('ind', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 2
                        }).format(price)}`
                    </p>
                    <StarRatings
                        rating={rating}
                        starRatedColor="#F9A602"
                        starDimension="20px"
                        starSpacing="1px"
                        name='rating'
                        size={5}
                    />
                    <Button variant="outlined" color="primary">Edit Course</Button>
                </Grid>
            </Grid>
        </Paper>
    )
}