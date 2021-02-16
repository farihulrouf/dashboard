import React from 'react'
import { Paper } from "@material-ui/core";

const Feature = (props) => {
    const {f} = props;
    return (
        <Paper className="feature-container">
            <div className="feature-icon">

                {f.icon({color: f.iconColor, fontSize: 50, fontWeight: 900})}

            </div>
            <h5 className="feature-number">{f.number}</h5>
            <h5 className="feature-title">{f.title}</h5>
            <p>{f.body}</p>
        </Paper>
    )
}

export default Feature