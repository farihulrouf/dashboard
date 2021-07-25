import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField"
import IconButton from '@material-ui/core/IconButton';

import { withStyles, makeStyles } from '@material-ui/core/styles';

import React from 'react';
export default function TextSearch() {

	const useStyles = makeStyles({
	 
	 TextField: {
	 	maxWidth: '100%',
	 	backgroundColor: 'white',
	 	borderRadius: 8,
	 	marginLeft: 10,
	 }




	});

	const [value, setValue] = React.useState("");

	const classes = useStyles();

	return(

		<TextField 	className={classes.TextField}

			placeholder="Search User by Name, Email, Date"
			type="text"
			variant="outlined"			      
			size="small"
			onChange={(e) => setValue(e.target.value)}
			value={value}
			InputProps={{
			startAdornment: (
				<InputAdornment position="start">
				<SearchIcon />
				</InputAdornment>
				),

		        endAdornment: value && (
				 	<IconButton
				    aria-label="toggle password visibility"
				    onClick={() => setValue("")}
					>
					</IconButton>
				)
			  }}
			/>
		
	)

}