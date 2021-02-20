import React from "react";
import "date-fns";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  Grid,
  FormControl,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

class FilterDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateStart: this.props.dateStart,
      dateEnd: Date.now(),
    };
    this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
  }

  handleChangeStartDate = (date) => {
    this.setState({ dateStart: date });
    this.props.query.dateStart = date.toString();
    this.props.onFilterChange();
  };

  handleChangeEndDate = (date) => {
    this.setState({ dateEnd: date });
    this.props.query.dateEnd = date.toString();
    this.props.onFilterChange();
  };

  render() {
    const {
      open,
      query,
      onClearFilters,
      onCloseFilter,
      onFilterChange,
      instructors,
      creator
    } = this.props;
    const categories = [
      { id: 1, name: "Berita" },
      { id: 2, name: "Materi" },
      { id: 3, name: "Ujian" },
    ];
    const { dateStart, dateEnd } = this.state;
    // const dateStart = query.dateStart || Date.now();
    // const dateEnd = query.dateEnd || Date.now();
    const postCreator = Array.isArray(instructors) && instructors.concat(creator);
    const creators = postCreator
      ? postCreator.map((value, index) => ({ id: index + 1, creator: value }))
      : [];
    // const creators = [];

    return (
      <Dialog
        onClose={onCloseFilter}
        aria-labelledby="customized-dialog-title"
        open={open}
        className="filter-post"
      >
        <DialogTitle id="customized-dialog-title" onClose={onCloseFilter}>
          Post Filter
        </DialogTitle>
        <DialogContent dividers className="filter-body">
          <Grid container>
            <Grid item className="creator-filter-title">
              <h6>Creator</h6>
            </Grid>
            <Grid item>
              {creators &&
                creators.map((f) => (
                  <FormControlLabel
                    className="checkbox"
                    key={f.id}
                    control={
                      <Checkbox
                        checked={query.creator.indexOf(f.creator._id) >= 0}
                        onChange={onFilterChange}
                        name="creator"
                        value={f.creator._id}
                        color="primary"
                      />
                    }
                    label={f.creator.name}
                  />
                ))}
            </Grid>
            <Grid item className="creator-filter-title">
              <h6>Date Created</h6>
            </Grid>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around" className="date-filter">
                  <KeyboardDatePicker
                    className="date-picker"
                    name="date-start"
                    format="MM/dd/yyyy"
                    id="date-picker-inline-start"
                    label="Start Date"
                    maxDate={dateEnd}
                    value={dateStart}
                    onChange={this.handleChangeStartDate}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                  <KeyboardDatePicker
                    className="date-picker"
                    name="date-end"
                    format="MM/dd/yyyy"
                    id="date-picker-inline-end"
                    label="End Date"
                    minDate={dateStart}
                    value={dateEnd}
                    onChange={this.handleChangeEndDate}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item className="creator-filter-title">
              <h6>Category</h6>
            </Grid>
            <Grid item xs={12}>
              {categories.map((f) => (
                <FormControlLabel
                  className="checkbox"
                  key={f.id}
                  control={
                    <Checkbox
                      checked={query.category.indexOf(f.id) >= 0}
                      onChange={onFilterChange}
                      name={"category"}
                      value={f.id}
                      color="primary"
                    />
                  }
                  label={f.name}
                />
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onClearFilters} color="primary">
            Clear Filters
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default FilterDialog;
