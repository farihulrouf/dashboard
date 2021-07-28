import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
const useStyles = makeStyles((theme) => ({
  
 

  accordionTitle: {
    padding: 5,
    backgroundColor: '#EAEAEA',
    display: 'flex',
    height: 30,
    marginTop: 3,
    justifyContent: 'space-between',
    borderRadius: 5,
  },

  accordionContent: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
  }
 
}));

const Accordion = ({ title, content }) => {
  const [isActive, setIsActive] = useState(false);
  const classes = useStyles();

  return (
    <div className="accordion-item">
      <div className={classes.accordionTitle} onClick={() => setIsActive(!isActive)}>
        <div>{title}</div>
        <div>{isActive ? <KeyboardArrowDownIcon /> : <KeyboardArrowDownIcon />}</div>
      </div>
      {isActive && <div className={classes.accordionContent}>
            <TextField
            id="date"
            label="Start Date"
            type="date"
            defaultValue="2017-05-24"
            
            InputLabelProps={{
              shrink: true,
            }}
          />

           <TextField
            id="date"
            label="End Date"
            type="date"
            defaultValue="2017-05-24"
            
            InputLabelProps={{
              shrink: true,
            }}
          />
      </div>}
    </div>
  );
};

export default Accordion;