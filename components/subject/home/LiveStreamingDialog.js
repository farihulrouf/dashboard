import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from "@material-ui/core/Grid";
import { DuoSharp } from '@material-ui/icons';
import {createRoom, getRooms} from "../../../lib/api"
import RoomItem from "./RoomItem"

export default function FormDialog({onCloseLiveStream, open, isInstructor, courseId}) {
  const [room, setRoom] = React.useState({})
  const [listRooms, setListRooms] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  
  function createClassRoom(){
    setLoading(true);
    const res = createRoom(room)
    setListRooms(res)
  }

  useEffect(() => {
    //Get list rooms
    setLoading(true);
    getRooms(courseId).then((res)=>{
      const {rooms} = res;
      setListRooms(rooms);
      setLoading(false)
    }).catch(err => {
      console.log(err);
      setLoading(false);
    })
  },[])

  return (
      <Dialog open={open} onClose={() => onCloseLiveStream("showLiveStream")} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
            <Grid container>
                <Grid item><DuoSharp style={{fontSize: 30, marginRight: 20}} /></Grid>
                <Grid item>Live Stream</Grid>
            </Grid>
        </DialogTitle>
        {loading && 
          <DialogContent>
            <Grid style={{minWidth: 550, display: 'flex', justifyContent: 'center'}}>
              <CircularProgress />
            </Grid>
          </DialogContent>
        }
        {!loading && !listRooms.length && isInstructor &&
        <React.Fragment>
          <DialogContent>
            <DialogContentText>
                You have no live stream class.
                In order to create one, please fill in the room name below.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Room Name"
              fullWidth
              onChange={(event)=>setRoom({...room, name: event.target.value})}
            />
            <TextField
              autoFocus
              margin="dense"
              id="welcome-message"
              label="Welcome Message"
              fullWidth
              onChange={(event)=>setRoom({...room, welcomeMessage: event.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary">
              Create Live Class
            </Button>
          </DialogActions>
        </React.Fragment>
        }
        {!loading && !listRooms.length && !isInstructor &&
          <DialogContent>
            <DialogContentText>
                This class has no live stream room by now.
                It is either that this class is designed to be passive only or your instructor hasn't create any room yet.
            </DialogContentText>
          </DialogContent>
        }
        {!loading && !!listRooms.length &&
          <DialogContent>
            <DialogContentText>Available rooms in this course</DialogContentText>
            {listRooms.map((e,idx)=> <RoomItem data={e} key={e._id}/>)}
          </DialogContent>
        }
      </Dialog>
  );
}