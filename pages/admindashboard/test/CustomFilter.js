import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Accordion from './Accordion';
import  {accordionData}  from './content';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },

  userStatus: {
    height: 250,
    width: '100%',
  },

  checked: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  textCheck: {
    marginLeft: 20,
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
    justifyContent: 'space-between',
    color: '#38439F'
  },

  Divider: {
    margin: 10
  },

  btnFilter: {
    color: '#38439F',
    width: '50%',
    '&:hover': {
      backgroundColor: '#fff',
      color: 'red',
    },
  },

   TextField: {
    width: '100%',
    backgroundColor: '#EAEAEA',
    marginTop: 5,
    borderRadius: 3,
  },

  udate: {
    width: '100%'
  },

  input: {
    height: 30,
  },

  noBorder: {
    border: 'none',
  },
  

  upDev: {
    width: '100%',
    height: 120,
    padding: 10,
  },

  AccordionDetails: {
    display: 'flex',
    flexDirection: 'column'
  },

  Accordion: {

    backgroundColor: '#EAEAEA',
  },

  accorDate: {
    marginLeft: 10,
    marginRight: 10,
  }

}));

export default function CustomFilter() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>

      <div className={classes.upDev}>
        <div className={classes.userStatusText}>
          FILTER BY
        </div>
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
      </div>

      <div className={classes.accorDate}>
            <div className={classes.accordion}>
            {accordionData.map(({ title, content }) => (
              <Accordion title={title} content={content} />
            ))}
          </div>
      </div>
      <div className={classes.userStatus}>
           <div className={classes.userStatusText}>
              USER STATUS 
            </div>           
            <div className={classes.checked}>
                <div className={classes.textCheck}>
                  Student
                </div>
              <Checkbox inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />
            </div>
             <div className={classes.checked}>
                <div className={classes.textCheck}>
                  Teacher
                </div>
              <Checkbox inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />
            </div>
             <div className={classes.checked}>
                <div className={classes.textCheck}>
                  Organization
                </div>
                <Checkbox inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />
            </div>
            <Divider  className={classes.Divider}/>


             <div className={classes.clearFilter}>
                      <Button className={classes.btnFilter}>Clear Filter</Button>
                      <Button className={classes.btnFilter}>Apply Filter</Button>
              </div>


        </div>
    </div>
  );
}
