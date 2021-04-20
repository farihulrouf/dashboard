import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { MoreVert, NoteAdd, DuoSharp, FormatListBulleted } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const CustomizedMenus = ({showModal, isInstructor}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {isInstructor && <StyledMenuItem onClick={() => {setAnchorEl(null); showModal("showPostForm")}} >
          <ListItemIcon>
            <NoteAdd fontSize="small"/>
          </ListItemIcon>
          <ListItemText primary="Create A New Post" />
        </StyledMenuItem>}
        <StyledMenuItem onClick={() => {setAnchorEl(null); showModal("showLiveStream")}}>
          <ListItemIcon>
            <DuoSharp fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Live Streaming" />
        </StyledMenuItem>
        <StyledMenuItem>
          <ListItemIcon>
            <FormatListBulleted fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Syllabus" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}

export default CustomizedMenus;