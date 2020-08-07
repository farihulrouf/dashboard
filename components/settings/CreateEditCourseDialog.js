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
  const [course,setCourse] = React.useState({name: "", about:"", logo:"", prerequisites: [], materials: [], instructors: [], ...props.course})
  const [open, setOpen] = React.useState(true);
  const [state, setState] = React.useState({showCropper: false})
  const {title, onDialogClose, action, avatarChosen, showCropper} = props;

  const handleClose = () => {
    setOpen(false);
    onDialogClose();
  };

  const handleAddPrereq = (prereq) => {
    let updatedCourse = {...course};
    updatedCourse.prerequisites = course.prerequisites.concat(prereq);
    setCourse(updatedCourse)
  }

  const handleDeletePrereq = (prereq,index) => {
    let prerequisites = [...course.prerequisites];
    prerequisites.splice(index,1)
    setCourse({...course,prerequisites})
  }

  const handleAddMaterial = (material) => {
    let updatedCourse = {...course};
    updatedCourse.materials = course.materials.concat(material)
    setCourse(updatedCourse)
  }

  const handleDeleteMaterial = (material,index) => {
    let materials = [...course.materials];
    materials.splice(index,1);
    setCourse({...course, materials})
  }

  const onButtonClick = ()=> {
    if(course._id){
      updateCourse(course).then((response)=>{
        // console.log(response)
        props.onCourseUpdated(response);
      })
    }else{
      createCourse(course).then((response)=>{
        props.onCourseCreated(response);
      })
    }
  }

  const onLogoClick = (event) => {
    let newState = {...state, showCropper: true, avatarChosen: event.target.files[0]}
    setState(newState)
  }

  const logoPickerCallback = (file) => {
    // console.log(file)
    const logo = `/files/${encodeURIComponent(file.key)}`;
    setState({showCropper: false, avatarChosen: undefined, course: {...course, logo}})
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
            {!!state.showCropper && <AvatarPicker callback={logoPickerCallback} image={state.avatarChosen || course.logo} />}
            {!state.showCropper &&  
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
              </Grid>}
            </Grid>
            <Grid item xs={12}>
                <TextField
                required
                value={course.name}
                id="courseName"
                name="courseName"
                label="Course Name"
                onChange={(event)=>setCourse({...course,name: event.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
                <TextField
                required
                value={course.about}
                id="courseDescription"
                name="courseDescription"
                label="Course Description"
                onChange={(event)=>setCourse({...course,about: event.target.value})}
                fullWidth
                multiline
              />
            </Grid>
            <Grid item xs={12}>
              <ChipInput
                value={course.prerequisites}
                onAdd={(prereq) => handleAddPrereq(prereq)}
                onDelete={(prereq, index) => handleDeletePrereq(prereq, index)}
                label="Course Prerequisites"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <ChipInput
                value={course.materials}
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
                  value={course.price}
                  currencySymbol="Rp"
                  outputFormat="string"
                  onChange={(event, price)=> setCourse({...course,price})}
              />
            </Grid>
            <Grid item xs={12}>
              <TeacherField course={course} setCourse={setCourse} />
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
