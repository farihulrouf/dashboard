import {TextField, Grid, IconButton, Avatar, Button} from '@material-ui/core';
import {CameraAlt} from '@material-ui/icons'
import {getMyProfile, updateUserProfile} from "../../lib/api"
import AvatarPicker from "../AvatarPicker";

class MyProfile extends React.Component{
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
        getMyProfile().then(response => {
            this.setState({user: response.user})
        });
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
        const {showCropper, avatarChosen} = this.state;
        const {avatar, name, email, linkedIn, about} = this.state.user;
        return(
            <Grid alignItems="center" direction="column" container>
                <form noValidate autoComplete="off" style={{width: '80%'}}>
                    {!!showCropper && <AvatarPicker callback={this.avatarPickerCallback} image={avatarChosen || avatar} />}
                    {!showCropper && <Grid justify="center" container>`
                        <label htmlFor="file">
                            <input style={{display: 'none'}} value="" id="file" type="file" name="file" onChange={this.onProfileImageClick}  />
                            <Button
                                size="small"
                                component="span"
                                aria-label="add"
                            >
                                <Avatar 
                                src={avatar} 
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
                        id="email" 
                        name="email" 
                        type="text" disabled 
                        label="Alamat Email" 
                        value={email} 
                        variant="outlined" style={{width: '100%', marginBottom: 20}}
                    />
                    <TextField 
                        id="name" 
                        name="name" 
                        label="Nama" 
                        value={name} 
                        variant="outlined" 
                        style={{width: '100%', marginBottom: 20}} 
                        onChange={this.handleChange}
                    />
                    <TextField 
                        id="linkedIn" 
                        name="linkedIn" 
                        label="linkedIn"
                        value={linkedIn} 
                        variant="outlined" 
                        style={{width: '100%', marginBottom: 20}} 
                        onChange={this.handleChange}
                    />
                    <TextField 
                        id="outlined-basic" 
                        name="about" 
                        label="Tentang saya" 
                        value={about}
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

export default MyProfile;