import {TextField, Grid, IconButton, Avatar, Button} from '@material-ui/core';
import {CameraAlt} from '@material-ui/icons'
import {getCourse, editCourse} from "../../lib/api"
import AvatarPicker from "../AvatarPicker";

class editCourse extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            course: {name: "", description: "", prerequisites: [], materials: [], price: 0 , instructors: ""},
            // avatarChosen: undefined,
            // showCropper: false
        })
        this.onButtonSubmit = this.onButtonSubmit.bind(this);
        // this.onProfileImageClick = this.onProfileImageClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.avatarPickerCallback = this.avatarPickerCallback.bind(this);
    }

    componentDidMount(){
        getCourse().then(response => {
            this.setState({course: response.course})
        });
    }

    onButtonSubmit = () => {
        const {course} = this.state;
        editCourse(course).then(result=>console.log(result));
    }

    // onProfileImageClick = (event) => {
    //     this.setState({showCropper: true, avatarChosen: event.target.files[0]})
    // }

    handleChange = (event) => {
        const course = {...this.state.course, [event.target.name]: event.target.value}
        this.setState({course})
    }

    // avatarPickerCallback = (file) => {
    //     const avatar = `/files/${encodeURIComponent(file.key)}`;
    //     this.setState({showCropper: false, avatarChosen: undefined, user: {...this.state.user, avatar}})
    // }

    render(){
        // const {showCropper, avatarChosen} = this.state;
        const {name, description, prerequisites, materials, price, instructors} = this.state.course;
        return(
            <Grid alignItems="center" direction="column" container>
                <form noValidate autoComplete="off" style={{width: '80%'}}>
                    {/* {!!showCropper && <AvatarPicker callback={this.avatarPickerCallback} image={avatarChosen || avatar} />} */}
                    {/* {!showCropper && <Grid justify="center" container>`
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
                    </Grid>} */}
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
                        id="description" 
                        name="description" 
                        type="text" disabled 
                        label="Course description" 
                        value={description} 
                        variant="outlined" style={{width: '100%', marginBottom: 20}}
                    />
                    <TextField 
                        id="prerequisites" 
                        name="prerequisites" 
                        label="course prerequisites"
                        value={prerequisites} 
                        variant="outlined" 
                        style={{width: '100%', marginBottom: 20}} 
                        onChange={this.handleChange}
                    />
                    <TextField 
                        id="materials" 
                        name="materials" 
                        label="course materials" 
                        value={materials}
                        variant="outlined" 
                        style={{width: '100%', marginBottom: 20}} 
                        onChange={this.handleChange}
                    />
                    <TextField 
                        id="price" 
                        name="price" 
                        label="course price" 
                        value={price}
                        variant="outlined" 
                        style={{width: '100%', marginBottom: 20}} 
                        onChange={this.handleChange}
                    />
                    <TextField 
                        id="instructors" 
                        name="instructors" 
                        label="course instructors" 
                        value={instructors}
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

export default editCourse;