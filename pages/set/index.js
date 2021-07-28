
import React from 'react';
import { IconButton, Grid, Avatar, Paper, Divider } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { withStyles } from '@material-ui/core/styles';  

const useStyles = theme => ({
    button :{
      width: 80,
      height: 40,
      margin: 15
    },
     blackButton: {
      backgroundColor: 'black',
      color: 'white',
    },

     whiteButton: {
      backgroundColor: 'white',
      color: 'black',
    }
      
 });

class Test extends React.Component {
  constructor(){
         super();

          
    }

    state = {
        left: 0,
        bottom: 100,
        backgroundColor: 'orange',
    }
   
    onChange = () => {
        this.setState(
            { 
                left: 400,
                 bottom: 200,
                 backgroundColor: 'teal',
             }
        );
    }



    render(){
        //let btn_class = this.state.black ? "blackButton" : "whiteButton";
        const { classes } = this.props;
        const data = [

            { id: 1, name: "John Doe" },
            { id: 2, name: "Victor Wayne" },
            { id: 3, name: "Jane Doe" },

        ];

        return (
              <div 
                style={{ 
                left: this.state.left,
                bottom: this.state.bottom,
                height: 400,
                width: 200,
                position: 'absolute',
                marginLeft: 30,
                backgroundColor: this.state.backgroundColor,
                 }} 
                onClick={this.onChange}
                >
                 <p>Some content goes here</p>
                <p>Some other content</p>

                 <div className="users">
                     {data.map((user, index) => (
                        <div className="user">{user.name},{index}</div>

                    ))}
                </div>
              </div>
        )
    }
}


export default withStyles(useStyles)(Test)