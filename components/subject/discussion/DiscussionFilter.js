import React from "react";
import {Paper, IconButton, withStyles, InputBase, Button} from "@material-ui/core";
import {FilterList, AddComment} from "@material-ui/icons";

const styles = (theme) => ({
    input: {flex: 1}
})

class DiscussionFilter extends React.Component{
    render(){
        const {classes} = this.props;
        return(
            <Paper elevation={3} style={{height: '5em', display: 'flex', alignItems: 'center', marginTop: 20}}>
                <IconButton className={classes.iconButton} aria-label="show-filter">
                    <FilterList />
                </IconButton>
                <InputBase
                    className={classes.input}
                    placeholder="Cari diskusi...."
                    name="content"
                    onChange={this.onQueryChange}
                />
                <IconButton onClick={this.props.openDiscussionForm} style={{backgroundColor: '#556cd6', marginRight: 20}} aria-label="add-new-discussion">
                    <AddComment style={{color: 'white'}} />
                </IconButton>
            </Paper>
        )
    }
}


export default withStyles(styles)(DiscussionFilter);