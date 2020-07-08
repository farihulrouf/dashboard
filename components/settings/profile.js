import {TextField, Grid, IconButton, Avatar} from '@material-ui/core';
import {CameraAlt} from '@material-ui/icons'

class Profile extends React.Component{
    render(){
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
                            <CameraAlt style={{zIndex: 1, bottom: 20, right: 30, position: 'absolute'}} />
                        </IconButton>
                    </Grid>
                    <TextField id="outlined-basic" label="Nama" variant="outlined" style={{width: '100%', marginBottom: 20}} />
                    <TextField id="outlined-basic" label="Sekolah" variant="outlined" style={{width: '100%', marginBottom: 20}} />
                    <TextField id="outlined-basic" label="Alamat Email" variant="outlined" style={{width: '100%', marginBottom: 20}} />
                    <TextField id="outlined-basic" label="Tingkatan Kelas" variant="outlined" style={{width: '100%', marginBottom: 20}} />
                </form>
            </Grid>
        )
    }
}

export default Profile;