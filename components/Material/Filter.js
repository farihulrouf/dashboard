import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import {
  Button,
  Dialog,
  Grid,
  Typography,
  IconButton,
  FormControl,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";
import CustomizedHook from "./AutoComplete";
import HoverRating from "./Rating";
import { getAllInstructors, getAllOrganizations } from "../../lib/api";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const PrettoSlider = withStyles({
  root: {
    color: "#3F51B5",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid #3F51B5",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% - 10px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const Filter = ({
  open,
  setOpen,
  filter,
  setFilter,
  applyFilter,
  clearFilter,
}) => {
  const [insInput, setInsInput] = useState("");
  const [orgInput, setOrgInput] = useState("");
  const [insList, setInsList] = useState([]);
  const [orgList, setOrgList] = useState([]);

  useEffect(() => {
    getAllInstructors(insInput).then((res) => setInsList([...res.data]));
  }, [insInput]);

  useEffect(() => {
    getAllOrganizations(orgInput).then((res) => setOrgList([...res.data]));
  }, [orgInput]);

  const handleSlider = (e, newValue) => {
    setFilter((prev) => {
      return {
        ...prev,
        price: newValue,
      };
    });
  };

  const [low, high] = filter.price;

  const valueLabelFormat = (value) => {
    const array = String(value).split("");

    return `Rp${array
      .map((char, index) => {
        if (index > 2 && array.length - (index % 3) === 0) {
          return `.${char}`;
        } else {
          return char;
        }
      })
      .join("")}`;
  };

  return (
    <Dialog
      className="filter-modal"
      onClose={() => {
        setOpen(false);
      }}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={() => setOpen(false)}>
        Course Filter
      </DialogTitle>
      <DialogContent dividers className="filter-container">
        <Grid container>
          <Grid item xs={12}>
            <h6 className="apply-filter-title">Apply Filter</h6>
          </Grid>
          <Grid container>
            <FormControl>
              <CustomizedHook
                name="Instructor"
                filter={filter}
                setFilter={setFilter}
                opt={insList}
                input={insInput}
                setInput={setInsInput}
              />
              <br />
              <CustomizedHook
                name="Organization"
                filter={filter}
                setFilter={setFilter}
                opt={orgList}
                input={orgInput}
                setInput={setOrgInput}
              />
              <br />
              <Grid container>
                <label>Price Range</label>
                <span className="price-range-dom">{`(${valueLabelFormat(
                  low
                )} - ${valueLabelFormat(high)})`}</span>
                <PrettoSlider
                  onChange={(e, newValue) => handleSlider(e, newValue)}
                  valueLabelDisplay="auto"
                  aria-labelledby="Price Filter"
                  min={0}
                  max={500000}
                  step={1000}
                  value={filter.price}
                  valueLabelFormat={(x) => <div>{valueLabelFormat(x)}</div>}
                />
              </Grid>
              <br />
              <Grid item className="rating-filter-container">
                <label>Rating</label>
                <HoverRating rating={filter.rating} setRating={setFilter} />
              </Grid>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => clearFilter()}
          color="primary"
          className="clear-filter modal-btn"
        >
          Clear Filters
        </Button>
        <Button
          autoFocus
          onClick={applyFilter}
          color="primary"
          className="modal-btn"
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Filter;