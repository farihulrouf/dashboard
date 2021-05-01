import React from "react";
import {
    Grid, Divider, Paper, 
    Button, IconButton, ButtonGroup
} from "@material-ui/core";
import {MoreVert, KeyboardArrowUp} from "@material-ui/icons";
import truncatise from "truncatise";
import MathJax from "react-mathjax-preview";

class DiscussionAnswer extends React.Component{
    render(){
        const {data} = this.props;
        
        return(
            <div style={{position: 'relative', backgroundColor: '#F6F8FB', marginTop: 10}}>
                <IconButton style={{position: 'absolute', right: 0}}>
                    <MoreVert />
                </IconButton>
                <Grid container style={{marginRight: 30}}>
                    <Grid xs={12} sm={2} item style={{padding: 20, textAlign: 'center'}}>
                        <IconButton style={{margin: 0, padding: 0}}>
                            <KeyboardArrowUp />
                        </IconButton>
                        <h3 style={{margin: 0, padding: 0}}>{data.votes.total}</h3>
                        <span>Votes</span>
                    </Grid>
                    <Grid xs={12} sm={10} item style={{flexGrow: 1,padding: '20px 0px'}}>
                        <MathJax math={truncatise(data.body, {TruncateLength: 35})} />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default DiscussionAnswer;