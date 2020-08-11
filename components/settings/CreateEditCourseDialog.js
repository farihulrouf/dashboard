import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Close, PhotoCameraOutlined} from '@material-ui/icons';
import {Grid, TextField, IconButton, Typography, DialogActions, 
  DialogContent, DialogTitle, Dialog, Button} from '@material-ui/core';
import ChipInput from 'material-ui-chip-input';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import TeacherField from './TeacherField';
import {createCourse, updateCourse} from '../../lib/api';
import AvatarPicker from "../AvatarPicker";


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
  const [state, setState] = React.useState({
    showCropper: false,
    avatarChosen: undefined,
    course: {name: "", about:"", logo:"", prerequisites: [], materials: [], instructors: [], ...props.course} 
  })
  const {title, onDialogClose, action, avatarChosen, showCropper} = props;

  const handleClose = () => {
    setOpen(false);
    onDialogClose();
  };

  const handleAddPrereq = (prereq) => {
    let updatedCourse = {...state.course};
    updatedCourse.prerequisites = state.course.prerequisites.concat(prereq);
    setState({...state, course: updatedCourse})
  }

  const handleDeletePrereq = (prereq,index) => {
    let prerequisites = [...state.course.prerequisites];
    prerequisites.splice(index,1)
    setState({...state, course: {...state.course,prerequisites}})
  }

  const handleAddMaterial = (material) => {
    let updatedCourse = {...state.course};
    updatedCourse.materials = state.course.materials.concat(material)
    setState({...state, course: updatedCourse})
  }

  const handleDeleteMaterial = (material,index) => {
    let materials = [...state.course.materials];
    materials.splice(index,1);
    setState({...state, course: {...state.course, materials}})
  }

  const onButtonClick = ()=> {
    if(state.course._id){
      updateCourse(state.course).then((response)=>{
        props.onCourseUpdated(response);
      })
    }else{
      createCourse(state.course).then((response)=>{
        props.onCourseCreated(response);
      })
    }
  }

  const onLogoClick = (event) => {
    let newState = {...state, showCropper: true, avatarChosen: event.target.files[0]}
    setState(newState)
  }

  const logoPickerCallback = (file) => {
    const logo = `/files/${encodeURIComponent(file.key)}`;
    setState({...state, showCropper: false, avatarChosen: undefined, course: {...state.course, logo}})
  }

  const setCourse = (newCourse) => {
    setState({...state, course: newCourse})
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
            {!!state.showCropper && <AvatarPicker width={400} height={200} borderRadius={1} callback={logoPickerCallback} image={state.avatarChosen || state.course.logo} />}
            {!state.showCropper &&  
              <Grid container>
              <Grid item xs={12}>
                <Grid container justify="center"><img src={state.course.logo} alt="Course Logo" width="100%" height="auto" /></Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container justify="center">
                  <label htmlFor='courseLogo'>
                      <input style={{display: 'none'}} id='courseLogo' type="file" name="files" onChange={onLogoClick} />
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
              </Grid>}
            </Grid>
            <Grid item xs={12}>
                <TextField
                required
                value={state.course.name}
                id="courseName"
                name="courseName"
                label="Course Name"
                onChange={(event)=>setState({...state, course: {...state.course, name: event.target.value}})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
                <TextField
                required
                value={state.course.about}
                id="courseDescription"
                name="courseDescription"
                label="Course Description"
                onChange={(event)=>setState({...state, course: {...state.course, about: event.target.value}})}
                fullWidth
                multiline
              />
            </Grid>
            <Grid item xs={12}>
              <ChipInput
                value={state.course.prerequisites}
                onAdd={(prereq) => handleAddPrereq(prereq)}
                onDelete={(prereq, index) => handleDeletePrereq(prereq, index)}
                label="Course Prerequisites"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <ChipInput
                value={state.course.materials}
                onAdd={(material) => handleAddMaterial(material)}
                onDelete={(material, index) => handleDeleteMaterial(material, index)}
                label="Course Materials"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <CurrencyTextField
                  required
                  label="Course Price"
                  variant="standard"
                  value={state.course.price}
                  currencySymbol="Rp"
                  outputFormat="string"
                  onChange={(event, price)=> setState({...state, course: {...state.course,price}})}
              />
            </Grid>
            <Grid item xs={12}>
              <TeacherField course={state.course} teachers={props.teachers} setCourse={setCourse} />
            </Grid>
          </Grid>
        </MyDialogContent>
        <MyDialogActions>
          <Button onClick={onButtonClick} autoFocus color="primary">
            {action}
          </Button>
        </MyDialogActions>
      </Dialog>
    </div>
  );
}
