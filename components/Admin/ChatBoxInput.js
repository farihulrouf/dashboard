
import React from 'react';
import { makeStyles } from '@material-ui/core/styles'; 
 
import ArrowForward from "@material-ui/icons/ArrowForward";
 
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Button from '@material-ui/core/Button'
import ImageIcon from '@material-ui/icons/Image';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import GifIcon from '@material-ui/icons/Gif';
import AttachmentIcon from '@material-ui/icons/Attachment';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import FormLabel from '@material-ui/core/FormLabel';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 100,
    width: 350,
  },

  TextField: {
  	height: 80,
  	width: 300,
 
  },

  input : {
    height: 80,
    margin: 10,
 
  },

  footer_chat: {
  	height: 70,
  	backgroundColor: '#f9fafb',
  	display: 'flex',
  	justifyContent: 'space-around',
  	alignItems: 'center'
  },

  btn: { 
  	height: 30,
  	color: 'white',
  	backgroundColor: '#3f51b5',
  	fontSize: 12,
  	borderRadius: 10,
  },

  Grid_right: {
  	alignItems: 'center',
  	display: 'flex',
  	justifyContent: 'space-around',
  	width: 120,
  	 
  },

  iconImg: {
  	width: 20,
  	height: 20,
  	margin: 5,
  },

  Typography_text: {
    width: 300,
    height: 170,
  
  },

  Typography_text_desc: {
    marginLeft: 47,
    color: 'rgba(0,0,0,0.6)',
  },

  radioStyle: {
    marginLeft: 5,
    color: 'rgba(0,0,0,0.9)',
  }
  

 
  
}));
export default function ChatBoxInput() {

   const classes = useStyles();
   const [anchorEl, setAnchorEl] = React.useState(null);
   const [open, setOpen] = React.useState(false) 
   const [placement, setPlacement] = React.useState();
   const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

	return(
		<div className={classes.root}>
		  <TextField className={classes.root}
		  	multiline
            maxRows={3}
		   
   			 InputProps={
   			 	
   			 {	 
   			 className: classes.input, 	
    		 endAdornment: (
    		 <InputAdornment position="end">
     		 	<IconButton > 
      		 		<ExpandLessIcon />
      			</IconButton>
     		 </InputAdornment>
    		)
  		 }}


 		 />

 		 <div className={classes.footer_chat}>
 		 	   
 		 	  <Grid>
   		 		 <ImageIcon className={classes.iconImg} />
   		 		 <AttachmentIcon className={classes.iconImg}  />
   		 		 <GifIcon className={classes.iconImg} />
   		 		 <SentimentSatisfiedIcon className={classes.iconImg} />
   		 		 <VideoCallIcon className={classes.iconImg} />
 		 	  </Grid>			 
 		 	  <Grid className={classes.Grid_right}>
 		 	  	<Button  className={classes.btn}
 		 	  	variant="contained">kirim
 		 	  	</Button>
           <IconButton color="primary" 
           onClick={handleClick('top')}
           aria-label="upload picture" 
           component="span">
              <MoreHorizIcon />

              <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
               {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
              <Paper> 
                <Grid className={classes.Typography_text}>
                  <Grid>
                     <RadioGroup>
                      <FormControlLabel className={classes.radioStyle} value="enter" control={<Radio />} label="Tekan enter untuk mengirim" />
                      <div className={classes.Typography_text_desc}>
                        Menekan Enter untuk mengirim pesan
                      </div>
                      <FormControlLabel className={classes.radioStyle} value="send" control={<Radio />} label="Tekan kirim " />
                       <div className={classes.Typography_text_desc}>
                        Menekan kirim akan mengirim pesan
                       </div>
                     </RadioGroup>   
                  </Grid>
                </Grid>
            </Paper>
          </Fade>
        )}
      </Popper>
           </IconButton>
 		 	  </Grid>
 		 </div>
      </div>

	)

}
