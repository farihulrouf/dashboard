import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Close, PhotoCameraOutlined} from '@material-ui/icons';
import {Grid, TextField, IconButton, Typography, DialogActions, 
  DialogContent, DialogTitle, Dialog, Button} from '@material-ui/core';
import ChipInput from 'material-ui-chip-input';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import TeacherField from './TeacherField';


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const MyDialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
});

const MyDialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    width: 500,
    maxWidth: '100%'
  },
}))(DialogContent);

const MyDialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(DialogActions);

export default function CreateEditCourseDialog(props) {
  const [open, setOpen] = React.useState(true);
  const [prereqs, setPrereqs] = React.useState([]);
  const [materials, setMaterials] = React.useState([])
  const [price,setPrice] = React.useState("")
  const {title, onDialogClose} = props;
  const [instructors, setInstructors] = React.useState([])

  const handleClose = () => {
    setOpen(false);
    onDialogClose();
  };

  const handleAddPrereq = (prereq) => {
    setPrereqs(prereqs.concat(prereq))
  }

  const handleDeletePrereq = (prereq,index) => {
    let newPrereqs = [...prereqs];
    newPrereqs.splice(index,1)
    setPrereqs(newPrereqs)
  }

  const handleAddMaterial = (material) => {
    setMaterials(materials.concat(material))
  }

  const handleDeleteMaterial = (material,index) => {
    let newMaterials = [...materials];
    newMaterials.splice(index,1)
    setMaterials(newMaterials);
  }

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <MyDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {title}
        </MyDialogTitle>
        <MyDialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container justify="center">
              <label htmlFor='courseLogo'>
                  <input style={{display: 'none'}} id='courseLogo' type="file" name="files" onChange={()=>{}} />
                  <Button
                      color="primary"
                      size="small"
                      component="span"
                      aria-label="add"
                      variant="outlined"
                  >
                      <PhotoCameraOutlined />Add Course Logo
                  </Button>
              </label>
              </Grid>
            </Grid>
            <Grid item xs={12}>
                <TextField
                required
                id="courseName"
                name="courseName"
                label="Course Name"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
                <TextField
                required
                id="courseDescription"
                name="courseDescription"
                label="Course Description"
                fullWidth
                multiline
              />
            </Grid>
            <Grid item xs={12}>
              <ChipInput
                value={prereqs}
                onAdd={(prereq) => handleAddPrereq(prereq)}
                onDelete={(prereq, index) => handleDeletePrereq(prereq, index)}
                label="Course Prerequisites"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <ChipInput
                value={materials}
                onAdd={(material) => handleAddMaterial(material)}
                onDelete={(material, index) => handleDeleteMaterial(material, index)}
                label="Course Materials"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <CurrencyTextField
                  label="Course Price"
                  variant="standard"
                  value={price}
                  currencySymbol="Rp"
                  outputFormat="string"
                  onChange={(event, price)=> setPrice(price)}
              />
            </Grid>
            <Grid item xs={12}>
              <TeacherField setInstructors={setInstructors} />
            </Grid>
          </Grid>
        </MyDialogContent>
        <MyDialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Create
          </Button>
        </MyDialogActions>
      </Dialog>
    </div>
  );
}
