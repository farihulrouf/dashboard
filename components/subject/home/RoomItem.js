import { Grid, Paper, Button     } from "@material-ui/core";
import {Videocam} from "@material-ui/icons";
import React from "react";

const RoomItem = (props) => {
  const { data } = props;

  function joinRoom(_id){
    window.open(
        `/api/room/${_id}`,
        '_blank' // <- This is what makes it open in a new window.
      );
  }

  return (
        <Paper style={{minWidth: 500, padding: 20}} elevation={4}>
            <Grid container>
                <Grid item xs={10}>
                    <h5>{data.name}</h5>
                    <span>Max participants: {data.maxParticipants}</span>
                </Grid> 
                <Grid item xs={2} style={{alignSelf: 'center'}}>
                    <Button onClick={() => joinRoom(data._id)} variant="contained" color="primary">
                        Join
                    </Button>
                </Grid>
            </Grid>
        </Paper>
  );
};

export default RoomItem;
