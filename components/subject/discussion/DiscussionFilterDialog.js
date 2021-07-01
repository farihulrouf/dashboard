import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import TagsForm from "../../TagsForm";
import { getTags } from "../../../lib/api";

export default function DiscussionFilterDialog(props) {
  const { open, handleClose, params, setParams, handleFilter } = props;
  const { tags, status } = params;

  const setTags = (tags) => {
    setParams((prev) => ({
      ...prev,
      tags,
    }));
  };

  const setStatus = (e) => {
    setParams((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const resetFilter = () => {
    setParams((prev) => ({
      ...prev,
      tags: [],
      status: ''
    }))
  }

  const onClickFilter = () => {
    handleFilter();
    handleClose();
  }

  return (
    <Dialog
      className="discussion-filter-modal"
      open={open}
      onClose={handleClose}
      disableEnforceFocus
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Filter</DialogTitle>
      <DialogContent dividers>
        <InputLabel>Tags</InputLabel>
        <TagsForm
          tags={tags}
          setItems={setTags}
          getItems={getTags}
        />
        <FormControl
          variant="outlined"
          className="custom-select" 
          size="small"
        >
          <InputLabel>Answer Status</InputLabel>
          <Select
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={status}
            name="status"
            onChange={setStatus}
            label="Answer Status"
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="UNANSWERED">Unanswered</MenuItem>
            <MenuItem value="ANSWERED">Answered</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={resetFilter} className="reset-button">
          RESET
        </Button>
        <Button onClick={onClickFilter} color="primary" autoFocus>
          APPLY
        </Button>
      </DialogActions>
    </Dialog>
  );
}
