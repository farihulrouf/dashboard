import React from 'react';
import DiscussionFilter from "./discussion/DiscussionFilter"

class Discussion extends React.Component{
    render(){
        return(
            <React.Fragment>
                <DiscussionFilter />
            </React.Fragment>
        )
    }
}

export default Discussion;