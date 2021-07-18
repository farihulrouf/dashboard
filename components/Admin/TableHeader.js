
import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';


import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';

import { withStyles, makeStyles } from '@material-ui/core/styles';

import FilterListIcon from '@material-ui/icons/FilterList';
import Box from '@material-ui/core/Box';
import GetAppIcon from '@material-ui/icons/GetApp';

import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import TextField from "@material-ui/core/TextField"
import DirectionsIcon from '@material-ui/icons/Directions';
import InputAdornment from "@material-ui/core/InputAdornment";


export default function TableHeader(){
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

  	const useStyles = makeStyles({
	  TableHead: {
	  	backgroundColor: '#38439f',
	  	display: 'flex',
	  	alignItems: 'center',
	  	height: 65,

	  },

	  TablePagination: {
	  	color: 'white',
	  	
	  },

	  GetAppIcon: {
	  	fill: 'white'
	  },

	  Box: {
	  	width: 70,
	  	marginLeft: 10,
	  	height: 40,
	  	backgroundColor: 'white',
	  	display: 'flex',
	  	alignItems: 'center',
	  	justifyContent: 'space-around',
	  	borderRadius: 8
	  },

	  FilterList: {
	  	width: 40,
	  	height: 40
	  },

	  TextField: {
	  	width: 320,
	  	height: 40,
	  	backgroundColor: 'white',
	  	borderRadius: 8,
	  	marginLeft: 10,
	  	marginRight: 10

	  },

	  text_info: {
	  	color: 'white',
	  	fontSize: 12,
	  	marginLeft: 10,
	  }


	});

	const classes = useStyles();

	return(

					<TableHead className={classes.TableHead}>
							<div className={classes.text_info}>
								USER INFORMATION
								
							</div>

							<TextField className={classes.TextField}
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
  									<FilterListIcon />
  									 Filter
							 </Box>
							 <TablePagination className={classes.TablePagination}

							        rowsPerPageOptions={[10, 25, 100]}
							        component="div"
							        count={rows.length}
							        rowsPerPage={rowsPerPage}
							        page={page}
							        onPageChange={handleChangePage}
							        onRowsPerPageChange={handleChangeRowsPerPage}
		      				/>
		      				<GetAppIcon className={classes.GetAppIcon} />
      				</TableHead>
				
			
	)
    

}