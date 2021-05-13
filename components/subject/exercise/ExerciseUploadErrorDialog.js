import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ExerciseUploadErrorDialog({open, setOpen, errors}) {
  return (
      <Dialog
        open={open}
        onClose={(e) => setOpen(e, false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{color: 'red'}}>You have some errors in your uploaded files</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
                {Object.keys(errors).map((key,index)=>(<React.Fragment>
                    <h6>{key}</h6>
                    <ul>
                    {errors[key].map(e => (<li>Row number: {e.rowNumber}, {e.message}</li>))}
                    </ul>
                </React.Fragment>))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => setOpen(e, false)} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
  );
}