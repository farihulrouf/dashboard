import React from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';

import SearchIcon from '@material-ui/icons/Search';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputAdornment from "@material-ui/core/InputAdornment";
import FilterListIcon from '@material-ui/icons/FilterList';


import Icon from '@material-ui/core/Icon';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  TextField: {
    width: 230,
    backgroundColor: '#EAEAEA',
    marginTop: 5,
    borderRadius: 3,
  },

  input: {
    height: 30,
  },

  noBorder: {
    border: 'none',
  },
  
 
  dev_up: {
    height: 150,
    display: 'flex',
    margin: 5,
    flexDirection: 'column',
    alignItems: 'center'
    
  },

  

  userStatusText: {
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    color: '#38439F',
    fontSize: 14
  },
  clearFilter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    color: '#38439F'
  },
  textCheck: {
    width: 150,
    color: '#7E7E7E'
  },

  paper: {
    width: 250,
  },

  label: {
    width: 150,
  },

  Divider: {
    margin: 10
  },

  MenuItem: {
    height: 30,
  },

  Button: {
    width: 230,
    marginTop: 5,
    backgroundColor: '#EAEAEA',
    height: 30,
    display: 'flex',
    borderRadius: 3,
    justifyContent: 'space-between'
  },

  date: {
    marginTop: 5,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 230,
  },

  elementDate: {
    height: 110,
  },

  btnFilter: {
    color: '#38439F',
    '&:hover': {
      backgroundColor: '#fff',
      color: 'red',
    },
  },

  filter: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  }


}));




export default function Filter() {


  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const [value, setValue] = React.useState("");

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  
  //const [count, setCount] = useState(0);

 // const [show, setShow] = React.useState(true);



  const [state, setState] = React.useState({
    
      show: false
  })

  

  const openclose = () => {
    setState({
       show: !state.show
    })
  }

  const changeColor = () => {
    setState({
      black: !state.black
    })
  }
  
  



  return (

    <div className={classes.root}>
      
      <div>
        <Button classes={classes.filter}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <FilterListIcon />
          Filter
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={handleClose}>

                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <div className={classes.userStatusText}>
                      FILTER BY
                    </div>
                    <div className={classes.dev_up}>

                         <TextField className={classes.TextField}
                            variant="outlined"
                            placeholder="User name"
                            InputProps={{
                              className: classes.input,

                              classes:{notchedOutline:classes.noBorder}
                            }}
                            InputLabelProps={{
                              shrink: true
                            }}
          
                           />


                         <TextField className={classes.TextField}
                            variant="outlined"
                            placeholder="Email"
                            InputProps={{
                              className: classes.input,
                              classes:{notchedOutline:classes.noBorder}

                            }}
                            InputLabelProps={{
                              shrink: true
                            }}
          
                           />
                       




                       
                      <Button 
                          
                          className={classes.Button}
                          endIcon={<Icon><ExpandMoreIcon /></Icon>}
                       >
                        SIGN UP DATE
                          

                      </Button>



                      <Button 
                          
                          className={classes.Button}
                          endIcon={<Icon><ExpandMoreIcon /></Icon>}
                       >
                        LAST LOGIN DATE
                          

                      </Button>

                    
                          
                    
                  
                    </div>

                    <Divider className={classes.Divider} />
                      <div className={classes.userStatusText}>
                        USER STATUS
                      </div>
                      <MenuItem className={classes.MenuItem}>
                        <div className={classes.textCheck}>
                          Student
                        </div>
                           <FormControlLabel
                              value="student"
                              control={<Checkbox color="primary" />}
                              labelPlacement="start"
                            />
                     </MenuItem>


                      <MenuItem className={classes.MenuItem}>
                         <div className={classes.textCheck}>
                            Teacher
                         </div>
                          <FormControlLabel
                              value="student"
                              
                              control={<Checkbox color="primary" />}
                              labelPlacement="start"
                            />
                     </MenuItem>

                      <MenuItem className={classes.MenuItem}>
                        <div className={classes.textCheck}>
                          Organization
                        </div>
                          <FormControlLabel
                              value="student"
                           
                              control={<Checkbox color="primary" />}
                              labelPlacement="start"
                            />
                     </MenuItem>

                     <Divider  className={classes.Divider}/>

                     <div className={classes.clearFilter}>
                      <Button className={classes.btnFilter}>Clear Filter</Button>
                      <Button className={classes.btnFilter}>Apply Filter</Button>
                     </div>
                    
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}
