import {TextField, Grid, IconButton, Avatar, Button} from '@material-ui/core';
import {CameraAlt} from '@material-ui/icons'
import {getUser, updateUserProfile} from "../../lib/api"
import AvatarPicker from "../AvatarPicker";

class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            user: {email: "", name: "", linkedIn: "", about: "", avatar: ""},
            avatarChosen: undefined,
            showCropper: false
        })
        this.onButtonSubmit = this.onButtonSubmit.bind(this);
        this.onProfileImageClick = this.onProfileImageClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.avatarPickerCallback = this.avatarPickerCallback.bind(this);
    }

    componentDidMount(){
        getUser().then(data => this.setState({user: data}));
    }

    onButtonSubmit = () => {
        const {user} = this.state;
        updateUserProfile(user).then(result=>console.log(result));
    }

    onProfileImageClick = (event) => {
        this.setState({showCropper: true, avatarChosen: event.target.files[0]})
    }

    handleChange = (event) => {
        const user = {...this.state.user, [event.target.name]: event.target.value}
        this.setState({user})
    }

    avatarPickerCallback = (file) => {
        const avatar = `/files/${encodeURIComponent(file.key)}`;
        this.setState({showCropper: false, avatarChosen: undefined, user: {...this.state.user, avatar}})
    }

    render(){
        const {showCropper, user, avatarChosen} = this.state;
        return(
            <Grid alignItems="center" direction="column" container>
                <form noValidate autoComplete="off" style={{width: '80%'}}>
                    {!!showCropper && <AvatarPicker callback={this.avatarPickerCallback} image={avatarChosen || user.avatar} />}
                    {!showCropper && <Grid justify="center" container>`
                        <label htmlFor="file">
                            <input style={{display: 'none'}} value="" id="file" type="file" name="file" onChange={this.onProfileImageClick}  />
                            <Button
                                size="small"
                                component="span"
                                aria-label="add"
                            >
                                <Avatar 
                                src={user.avatar} 
                                style={{
                                    margin: "10px",
                                    width: "120px",
                                    height: "120px",
                                }} 
                                />
                                <CameraAlt style={{Index: 1, bottom: 20, right: 30, position: 'absolute'}} />
                            </Button>
                    </label>
                    </Grid>}
                    <TextField 
                        id="outlined" 
                        name="email" 
                        type="text" disabled 
                        label="Alamat Email" 
                        value={user.email} 
                        variant="outlined" style={{width: '100%', marginBottom: 20}}
                    />
                    <TextField 
                        id="outlined" 
                        name="name" 
                        label="Nama" 
                        value={user.name} 
                        variant="outlined" 
                        style={{width: '100%', marginBottom: 20}} 
                        onChange={this.handleChange}
                    />
                    <TextField 
                        id="outlined-basic" 
                        name="linkedIn" 
                        label="linkedIn"
                        value={user.linkedIn} 
                        variant="outlined" 
                        style={{width: '100%', marginBottom: 20}} 
                        onChange={this.handleChange}
                    />
                    <TextField 
                        id="outlined-basic" 
                        name="about" 
                        label="Tentang saya" 
                        value={user.about}
                        variant="outlined" 
                        style={{width: '100%', marginBottom: 20}} 
                        onChange={this.handleChange}
                    />
                    <Grid justify="flex-end" container>
                        <Button onClick={this.onButtonSubmit} variant="contained" color="primary"> Update </Button>
                    </Grid>
                </form>
            </Grid>
        )
    }
}

export default Profile;