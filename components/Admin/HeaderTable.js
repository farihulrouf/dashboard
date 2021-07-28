

import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField"
import TablePagination from '@material-ui/core/TablePagination';
import SystemUpdateAltRoundedIcon from '@material-ui/icons/SystemUpdateAltRounded';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Filter from './Filter'

export default function HeaderTable(props) {
	const useStyles = makeStyles({
	  TableHead: {
	  	backgroundColor: '#38439f',
	  	display: 'flex',
	  	alignItems: 'center',
	  	height: 65

	  },

	 head_left: {
	 	width: '60%',
	 	height: '100%',
	 	display: 'flex',
	 	alignItems: 'center',
	 	justifyContent: 'space-around',
	 },

	 head_right: {
	 	width: '40%',
	 	height: '100%',
	 	display: 'flex',
	 	alignItems: 'center',
	 	justifyContent: 'space-around',
	 },

	 user_information: {
	 	
	 	color: 'white',
	 	display: 'flex',
	 	marginLeft: 10,
	 	flexDirection: 'column'
	 },

	 text_user: {
	 	fontSize: 13,
	 }, 

	 text_total: {
	 	fontSize: 13,
	 	 	
	 },

	 TextField: {
	 	width: 330,
	 	backgroundColor: 'white',
	 	borderRadius: 8,
	 },

	 Box: {
	  	width: 80,
	  	marginLeft: 10,
	  	height: 40,
	  	backgroundColor: 'white',
	  	display: 'flex',
	  	alignItems: 'center',
	  	justifyContent: 'space-around',
	  	borderRadius: 8
	  },

	  TablePagination: {
	  	width: 200,
	  },

	  menuItem: {
    	"&:hover": {
     	 backgroundColor: 'red'    	}
  	  },

  	  actions: {
  	  	'& .MuiButtonBase-root':{
      		color: 'white',
      		padding: '0',
    	}   
  	  },

  	  TablePagination: {
  	  	color: 'white',
  	  	padding: '0',
  	  },

  	  SystemUpdateAltRoundedIcon: {
  	  	fill: 'white',
  	  	width: 35,
  	  	height: 35,
  	 
  	  }



	});

    const classes = useStyles();

    const rows = [
	  createData('India', 'IN', 1324171354, 3287263),
	  createData('China', 'CN', 1403500365, 9596961),
	  createData('Italy', 'IT', 60483973, 301340),
	  createData('United States', 'US', 327167434, 9833520),
	  createData('Canada', 'CA', 37602103, 9984670),
	  createData('Australia', 'AU', 25475400, 7692024),
	  createData('Germany', 'DE', 83019200, 357578),
	  createData('Ireland', 'IE', 4857000, 70273),
	  createData('Mexico', 'MX', 126577691, 1972550),
	  createData('Japan', 'JP', 126317000, 377973),
	  createData('France', 'FR', 67022000, 640679),
	  createData('United Kingdom', 'GB', 67545757, 242495),
	  createData('Russia', 'RU', 146793744, 17098246),
	  createData('Nigeria', 'NG', 200962417, 923768),
	  createData('Brazil', 'BR', 210147125, 8515767),
  	];

  	function createData(name, code, population, size) {
	  const density = population / size;
	  return { name, code, population, size, density };
 	}

 	const [page, setPage] = React.useState(0);
  	const [rowsPerPage, setRowsPerPage] = React.useState(10);
  	const [value, setValue] = React.useState("");
  	const handleChangePage = (event, newPage) => {
    	setPage(newPage);
 	 };

 	 const handleChangeRowsPerPage = (event) => {
	    setRowsPerPage(+event.target.value);
	    setPage(0);
  	};


  	//

  	const [age, setAge] = React.useState('');
  	const [open, setOpen] = React.useState(false);

  	const handleChange = (event) => {
    	setAge(event.target.value);
    };

    const handleClose = () => {
       setOpen(false);
    };

   const handleOpen = () => {
     setOpen(true);
   };

	return(
		<TableHead className={classes.TableHead}>
			<div className={classes.head_left}>
				<div className={classes.user_information}>
					<div className="classes.text_user">
						User Information
					</div>
					<div className={classes.text_total}>
						Total users: 1000
					</div>
				</div>


				<TextField 
							  style={
							  	{
							  		width: 320,
							  		backgroundColor: 'white',
							  		borderRadius: 8
							  	}
							  }
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
						          ><CancelRoundedIcon/></IconButton>
						        )
						      }}
				/>
				<Box className={classes.Box}>
					<Filter />
				</Box>
			</div>
			<div className={classes.head_right}>
				<TablePagination className={classes.TablePagination}

							        rowsPerPageOptions={[10, 25, 100]}
							        component="div"
							        count={rows.length}
							        rowsPerPage={rowsPerPage}
							        page={page}
							        onPageChange={handleChangePage}
							        onRowsPerPageChange={handleChangeRowsPerPage}
							        classes={{ menuItem: classes.menuItem }}
							        classes ={{ actions: classes.actions }}
		      	/>


				<SystemUpdateAltRoundedIcon className={classes.SystemUpdateAltRoundedIcon} />
			</div>

		</TableHead>
	)

}