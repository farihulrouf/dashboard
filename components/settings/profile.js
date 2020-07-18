import {TextField, Grid, IconButton, Avatar, Button} from '@material-ui/core';
import {CameraAlt} from '@material-ui/icons'
import {getUser, updateUserProfile} from "../../lib/api"

class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            email: "",
            name: "",
            linkedIn:"",
            about: ""
        })
        this.onButtonSubmit = this.onButtonSubmit.bind(this);
    }

    componentDidMount(){
        getUser().then(data => this.setState({email: data.email, name: data.name, linkedIn: data.linkedIn, about: data.about}));
    }

    onButtonSubmit = () => {
        const user = this.state;
        updateUserProfile(user).then(result=>console.log(result));
    }

    render(){
        const handleChange = (event) => {
            let newState = {...this.state,[event.target.name]: event.target.value}
            this.setState(newState)
        }

        return(
            <Grid alignItems="center" direction="column" container>
                <form noValidate autoComplete="off" style={{width: '80%'}}>
                    <Grid justify="center" container>
                        <IconButton>
                            <Avatar 
                            src="/profile/profile.jpg" 
                            style={{
                                margin: "10px",
                                width: "120px",
                                height: "120px",
                            }} 
                            />
                            <CameraAlt style={{Index: 1, bottom: 20, right: 30, position: 'absolute'}} />
                        </IconButton>
                    </Grid>
                    <TextField 
                        id="outlined" 
                        name="email" 
                        type="text" disabled 
                        label="Alamat Email" 
                        value={this.state.email} 
                        variant="outlined" style={{width: '100%', marginBottom: 20}}
                    />
                    <TextField 
                        id="outlined" 
                        name="name" 
                        label="Nama" 
                        value={this.state.name} 
                        variant="outlined" 
                        style={{width: '100%', marginBottom: 20}} 
                        onChange={handleChange}
                    />
                    <TextField 
                        id="outlined-basic" 
                        name="linkedIn" 
                        label="linkedIn"
                        value={this.state.linkedIn} 
                        variant="outlined" 
                        style={{width: '100%', marginBottom: 20}} 
                        onChange={handleChange}
                        />
                    <TextField 
                        id="outlined-basic" 
                        name="about" 
                        label="Tentang saya" 
                        value={this.state.about}
                        variant="outlined" 
                        style={{width: '100%', marginBottom: 20}} 
                        onChange={handleChange}
                    />
                    <Grid justify="flex-end" container>
                        <Button value = {this.state} onClick={this.onButtonSubmit} variant="contained" color="primary"> Update </Button>
                    </Grid>
                </form>
            </Grid>
        )
    }
}

export default Profile;