import NavBar from '../src/NavBar';
import {makeStyles, ButtonBase, Grid, ButtonGroup, Button} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import One from '../src/One';
import Two from '../src/Two';
import Three from '../src/Three';

const classes = (theme) => ({
    image: {
        width: 250,
        height: 250
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
});

class Subject extends React.Component {
    constructor(props){
        super(props)
        this.state={isOne: true, isTwo: false, isThree: false};
    }

    render(){
        const {isOne,isTwo,isThree} = this.state;
        return(<NavBar>
            <Grid container direction="row" alignItems="center" wrap = "nowrap">
                <Grid item style = {{marginRight : 30}}>
                    <ButtonBase className={classes.image}>
                        <img className={classes.img} src={"https://www.udemy.com/staticx/udemy/images/v6/logo-coral.svg"} alt="complex" />
                    </ButtonBase>
                </Grid>
                <Grid item>
                    Avengers: Endgame is a 2019 American superhero film based on the Marvel Comics superhero team the Avengers, produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures. It is the direct sequel to Avengers: Infinity War (2018) and the 22nd film in the Marvel Cinematic Universe (MCU). It was directed by Anthony and Joe Russo and written by Christopher Markus and Stephen McFeely, and features an ensemble cast including Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson, Jeremy Renner, Don Cheadle, Paul Rudd, Brie Larson, Karen Gillan, Danai Gurira, Benedict Wong, Jon Favreau, Bradley Cooper, Gwyneth Paltrow, and Josh Brolin. In the film, the surviving members of the Avengers and their allies attempt to reverse the damage caused by Thanos in Infinity War.
                </Grid>
            </Grid>
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group" style={{width: "100%", justifyContent : 'center', marginTop : 50}}>
                <Button onClick={()=>this.setState({isOne: true, isTwo: false, isThree: false})}  style={{width: 200, backgroundColor : isOne ? 'pink' : 'white'}}>One</Button>
                <Button onClick={()=>this.setState({isOne: false, isTwo: true, isThree: false})} style={{width: 200, backgroundColor : isTwo ? 'pink' : 'white'}}>Two</Button>
                <Button onClick={()=>this.setState({isOne: false, isTwo: false, isThree: true})} style={{width: 200, backgroundColor : isThree ? 'pink' : 'white'}}>Three</Button>
            </ButtonGroup>
            <Grid container>
                {this.state.isOne && <One />}
                {this.state.isTwo && <Two />}
                {this.state.isThree && <Three />}
            </Grid>
            
        </NavBar>)
    }
}
export default withStyles(classes)(Subject);