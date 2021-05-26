import { Grid, Button } from "@material-ui/core";
import { Update } from "@material-ui/icons";
import { getMyProfile, updateUserProfile } from "../../lib/api";
import Avatar from "../Avatar";
import AvatarPicker from "../AvatarPicker";
import React from "react";

class MyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: { email: "", name: "", linkedIn: "", about: "", avatar: "" },
            avatarChosen: undefined,
            showCropper: false,
        };
        this.onButtonSubmit = this.onButtonSubmit.bind(this);
        this.onProfileImageClick = this.onProfileImageClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.avatarPickerCallback = this.avatarPickerCallback.bind(this);
        this.deleteAvatar = this.deleteAvatar.bind(this);
    }

    componentDidMount() {
        getMyProfile().then((response) => {
            this.setState({ user: response.user });
        });
    }

    onButtonSubmit = () => {
        const { user } = this.state;
        updateUserProfile(user).then((result) => console.log(result));
    };

    onProfileImageClick = (event) => {
        this.setState({
            showCropper: true,
            avatarChosen: event.target.files[0],
        });
    };

    handleChange = (event) => {
        const user = {
            ...this.state.user,
            [event.target.name]: event.target.value,
        };
        this.setState({ user });
    };

    avatarPickerCallback = (file) => {
        const avatar = `/files/${encodeURIComponent(file.key)}`;
        this.setState({
            showCropper: false,
            avatarChosen: undefined,
            user: { ...this.state.user, avatar },
        });
    };

    deleteAvatar = () => {
        this.setState({
            avatarChosen: null,
            user: { ...this.state.user, avatar: null },
        });
    };

    render() {
        const { showCropper, avatarChosen } = this.state;
        const { avatar, name, email, linkedIn, about } = this.state.user;

        return (
            <form noValidate autoComplete="off" className="settings-profile">
                {!!showCropper && (
                    <AvatarPicker
                        callback={this.avatarPickerCallback}
                        image={avatarChosen || avatar}
                    />
                )}
                {!showCropper && (
                    <Grid className="settings-profile-photo">
                        <Avatar name={name} imgUrl={avatar} />
                        <Button className="upload-avatar mybtn">
                            UPLOAD NEW PICTURE
                            <input
                                value=""
                                id="file"
                                type="file"
                                name="file"
                                onChange={this.onProfileImageClick}
                            />
                        </Button>
                        <Button
                            className="delete-avatar mybtn"
                            onClick={this.deleteAvatar}
                        >
                            DELETE
                        </Button>
                    </Grid>
                )}
                <Grid item className="settings-profile-data-input disabled">
                    <label>Email</label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        value={email}
                        disabled
                    />
                </Grid>
                <Grid item className="settings-profile-data-input">
                    <label>Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={this.handleChange}
                    />
                </Grid>
                <Grid item className="settings-profile-data-input">
                    <label>LinkedIn</label>
                    <input
                        id="linkedin"
                        name="linkedIn"
                        type="text"
                        value={linkedIn}
                        onChange={this.handleChange}
                    />
                </Grid>
                <Grid item className="settings-profile-data-input">
                    <label>About</label>
                    <input
                        id="about"
                        name="about"
                        type="about"
                        value={about}
                        onChange={this.handleChange}
                    />
                </Grid>
                <Grid justify="flex-end" container>
                    <Button
                        onClick={this.onButtonSubmit}
                        variant="contained"
                        color="primary"
                        className="update-profile-btn my-btn"
                    >
                        Update <Update />
                    </Button>
                </Grid>
            </form>
        );
    }
}

export default MyProfile;
