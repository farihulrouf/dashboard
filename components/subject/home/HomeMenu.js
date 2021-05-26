import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
    MoreVert,
    NoteAdd,
    DuoSharp,
    FormatListBulleted,
} from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

const StyledMenu = withStyles({
    paper: {
        border: "1px solid #d3d4d5",
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        "&:focus": {
            backgroundColor: theme.palette.primary.main,
            "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

const CustomizedMenus = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const {
        showModal,
        canCreatePost,
        canJoinRoom,
        canShowSyllabus,
    } = props;

    return (
        <div>
            <IconButton onClick={handleClick}>
                <MoreVert />
            </IconButton>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className="course-popper-menu"
            >
                {canCreatePost && (
                    <StyledMenuItem
                        onClick={() => {
                            setAnchorEl(null);
                            showModal("showPostForm");
                        }}
                    >
                        <ListItemIcon>
                            <NoteAdd fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Create A New Post" />
                    </StyledMenuItem>
                )}
                <StyledMenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        showModal("showLiveStream");
                    }}
                    disabled={!canJoinRoom}
                    aria-labelledby={
                        canJoinRoom
                            ? "Live Streaming"
                            : "You don't have access for this feature"
                    }
                >
                    <ListItemIcon>
                        <DuoSharp fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Live Streaming" />
                </StyledMenuItem>
                <StyledMenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        showModal("showSyllabus");
                    }}
                    disabled={!canShowSyllabus}
                    aria-labelledby={
                        canShowSyllabus
                            ? "Syllabus"
                            : "You don't have access for this feature"
                    }
                >
                    <ListItemIcon>
                        <FormatListBulleted fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Syllabus" />
                </StyledMenuItem>
            </StyledMenu>
        </div>
    );
};

export default CustomizedMenus;
