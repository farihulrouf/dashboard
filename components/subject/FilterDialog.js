import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Button, Dialog, Grid, FormControl, FormControlLabel, Checkbox, Typography} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
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

class FilterDialog extends React.Component{
    constructor(props){
        super(props);
        const filters = [
          {id: 1, name: 'Berita'},
          {id: 2, name: 'Materi'},
          {id: 3, name: 'Ujian'}
        ]
        this.filters = filters;
    }

    render(){
        const {open, onClearFilters, onCloseFilter, onFilterChange, query} = this.props;
        return(
            <Dialog onClose={onCloseFilter} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={onCloseFilter}>
                    Post Filter
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container>
                        <Grid item xs={12}>
                            Category
                        </Grid>
                        <Grid item xs={12}>
                            {this.filters.map((f) => (
                              <FormControlLabel
                                  key={f.id}
                                  control={
                                  <Checkbox
                                      checked={query.category.indexOf(f.id)>=0}
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
        )
    }
}

export default FilterDialog;