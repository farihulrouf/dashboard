

import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextSearch from './TextSearch'
import Filter from './Filter'
import Box from '@material-ui/core/Box';
import TablePagination from '@material-ui/core/TablePagination';

export default function TableHeader() {

	const useStyles = makeStyles({
	  TableHead: {
	  	backgroundColor: '#38439f',
	  	display: 'flex',
	  	alignItems: 'center',
	  	height: 65,
	  	width: '100%'

	  },

	  userInformation: {
	  	color: 'white',
	 	display: 'flex',
	 	marginLeft: 10,
	 	flexDirection: 'column'
	  },
	  text_user: {
	  	fontSize: 13,
	  },

	  text_total_user: {
	  	fontSize: 12,

	  },

	  searchText: {
	  	width: 320, 
	  	alignItems: 'center',
	  	height: '100%',
	  	display: 'flex'
	  },


	 Box: {
	  	width: 80,
	  	marginLeft: 10,
	  	height: 40,
	  	backgroundColor: 'white',
	  	display: 'flex',
	  	alignItems: 'center',
	  	justifyContent: 'space-around',
	  	borderRadius: 8,
	  	zIndex: 3,
	  },


  	  TablePagination: {
  	  	color: 'white',
  	  	padding: '0',
  	  },




	});

	const classes = useStyles();

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

  	const rows = 100



	return(
		<TableHead className={classes.TableHead}>
			<div className={classes.userInformation}>
				<div className={classes.text_user}>
					USER INFORMATION
				</div>
				<div className={classes.text_total_user}>
					Total Users : 1000
				</div>

			</div>

			<div className={classes.searchText}>
				<TextSearch />
			</div>
			<Box className={classes.Box}>
				<Filter />
			</Box>

	
			<TablePagination className={classes.TablePagination}

					rowsPerPageOptions={[10, 25, 100]}
					component="div"
					count={rows}
					rowsPerPage={rowsPerPage}
				    page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					classes={{ menuItem: classes.menuItem }}
					classes ={{ actions: classes.actions }}
		      />


		</TableHead>
	)
	
}