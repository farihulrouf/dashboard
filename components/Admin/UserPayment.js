import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Grid,
	IconButton,
	FormControl,
	Select,
	MenuItem,
	Modal,
	Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getPayments, updatePayment } from '../../redux/admin/actions';

const useStyles = makeStyles((theme) => ({
	tableContainer: {
		padding: 100,
	},
	tableHeaderCell: {
		fontWeight: 'bold',
		color: '#1C00BC',
		borderBottom: '#1C00BC solid 3px',
	},
	coursesBorder: {
		width: '100px',
		height: '30px',
		background: '#F9F9F9',
		border: '0.5px solid #38439F',
		borderRadius: '5px',
		margin: 'auto',
	},
	studentCourses: {
		background: '#FFEAEA',
		border: '0.5px solid #FF7D7D',
		bordeRadius: '50%',
		margin: 'auto',
		marginTop: '3px',
		width: '20px',
		lineHeight: '20px',
		borderRadius: '50%',
	},
	otherCourses: {
		background: '#EBF0FF',
		border: '0.5px solid #38439F',
		bordeRadius: '50%',
		margin: 'auto',
		marginTop: '3px',
		width: '20px',
		lineHeight: '20px',
		borderRadius: '50%',
	},
	userStatus: {
		position: 'relative',
		bottom: '4px',
	},
	headerText: {
		position: 'relative',
		top: '1.5px',
		// left: '10px'
	},
	sort: {
		padding: '2px',
	},
	statusOption: {
		fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
	},
	paper: {
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	applyQ: {
		width: '100%',
	},
	applyA: {
		width: '100%',
		'& > *': {
			margin: theme.spacing(1),
		},
	},
	applyText: {
		fontSize: '22px',
		fontFamily: 'Arial',
		fontWeight: '400',
	},
	cancelButton: {
		color: '#E50000',
		fontFamily: 'Arial'
	},
	applyButton: {
		color: '#38439F',
		fontFamily: 'Arial'
	}
}));

const modalStyle = {
	// width: '30%',
	// height: '10%',
	position: 'absolute',
  	top: '40%',
  	left: '40%',
};

const useSortableData = (items, config = null) => {
	const [sortConfig, setSortConfig] = React.useState(config);

	const sortedItems = React.useMemo(() => {
		let sortableItems = [...items];
		if (sortConfig !== null) {
			sortableItems.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === 'ascending' ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === 'ascending' ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableItems;
	}, [items, sortConfig]);

	const requestSort = (key) => {
		let direction = 'ascending';
		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === 'ascending'
		) {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	};

	return { items: sortedItems, requestSort, sortConfig };
};

const UserPayment = ({ getPayments, payments }) => {
	useEffect(() => {
		getPayments();
	}, [getPayments]);

	const classes = useStyles();

	const sort = (
		<svg
			width="6"
			height="9"
			viewBox="0 0 6 9"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M5.33619 2.89985C5.69228 3.21406 6.25609 2.71657 5.87032 2.40236L3.28865 0.0981891C3.14028 -0.0327299 2.87321 -0.0327299 2.72484 0.098189L0.113497 2.40236C-0.242596 2.71657 0.321217 3.21406 0.67731 2.89985L2.99191 0.857519L5.33619 2.89985Z"
				fill="#1C00BC"
			/>
			<path
				d="M5.33619 6.10015C5.69228 5.78594 6.25609 6.28343 5.87032 6.59764L3.28865 8.90181C3.14028 9.03273 2.87321 9.03273 2.72484 8.90181L0.113497 6.59764C-0.242596 6.28343 0.321217 5.78594 0.67731 6.10015L2.99191 8.14248L5.33619 6.10015Z"
				fill="#1C00BC"
			/>
		</svg>
	);
	
	const edit = (
		<svg
			width="19"
			height="19"
			viewBox="0 0 19 19"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4 15.013L8.413 14.998L18.045 5.45802C18.423 5.08003 18.631 4.57802 18.631 4.04402C18.631 3.51002 18.423 3.00802 18.045 2.63002L16.459 1.04402C15.703 0.288024 14.384 0.292024 13.634 1.04102L4 10.583V15.013ZM15.045 2.45802L16.634 4.04102L15.037 5.62302L13.451 4.03802L15.045 2.45802ZM6 11.417L12.03 5.44402L13.616 7.03002L7.587 13.001L6 13.006V11.417Z"
				fill="black"
			/>
			<path
				d="M2 19H16C17.103 19 18 18.103 18 17V8.332L16 10.332V17H5.158C5.132 17 5.105 17.01 5.079 17.01C5.046 17.01 5.013 17.001 4.979 17H2V3H8.847L10.847 1H2C0.897 1 0 1.897 0 3V17C0 18.103 0.897 19 2 19Z"
				fill="black"
			/>
		</svg>
	);

	// Toggle Edit
	const [displayEdit, toggleEdit] = useState({
		displayEditForm: false,
		displayEditUser: '',
	});

	const { displayEditForm, displayEditUser } = displayEdit;
	
	const { items, requestSort, sortConfig } = useSortableData(payments);
	const getClassNamesFor = (name) => {
	  if (!sortConfig) {
		return;
	  }
	  return sortConfig.key === name ? sortConfig.direction : undefined;
	};

	const userPayments = items.map((payment) => (
		<TableRow key={payment.payment_number}>
			<TableCell align="center">{payment.user.name}</TableCell>
			<TableCell align="center">{payment.user.email}</TableCell>
			<TableCell align="center"><Moment format="DD/MM/YYYY">{payment.user.signupdate}</Moment></TableCell>
			<TableCell align="center"><Moment format="DD/MM/YYYY">{payment.user.lastlogin}</Moment></TableCell>
			<TableCell align="center">
				<div>{payment.course.name}</div>
				<div>{payment.course.status} {payment.course.insTableRowuctors}</div>
			</TableCell>
			<TableCell align="center">
				{displayEditForm & (displayEditUser === payment.payment_number) ? (
					edit
				) : (
					<div>{payment.status}</div>
				)}
			</TableCell>
			<TableCell align="center">
			<IconButton
						onClick={() =>
							toggleEdit({
								displayEditForm: !displayEditForm,
								displayEditUser: payment.payment_number,
							})
						}
					>
						{edit}
					</IconButton>
			</TableCell>
		</TableRow>
	));

	return (
		<Fragment>
			<TableContainer component={Paper} className={classes.tableContainer}>
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell className={classes.tableHeaderCell} align="center">
						<span className={classes.headerText}>USER NAME </span>
						<IconButton
									onClick={() => requestSort('user')}
									// className={getClassNamesFor('username')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}
						</TableCell>
						<TableCell className={classes.tableHeaderCell} align="center">
							EMAIL {' '}
							<IconButton
									onClick={() => requestSort('username')}
									// className={getClassNamesFor('username')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '} </TableCell>
						<TableCell className={classes.tableHeaderCell} align="center">
							SIGNUP DATE{' '}
							<IconButton
									onClick={() => requestSort('username')}
									// className={getClassNamesFor('username')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}</TableCell>
						<TableCell className={classes.tableHeaderCell} align="center">
							LAST LOGIN{' '}
							<IconButton
									onClick={() => requestSort('username')}
									// className={getClassNamesFor('username')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '} </TableCell>
						<TableCell className={classes.tableHeaderCell} align="center">
							COURSES DETAIL{' '}
							<IconButton
									onClick={() => requestSort('username')}
									// className={getClassNamesFor('username')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}</TableCell>
						<TableCell className={classes.tableHeaderCell} align="center">
							PAYMENT STATUS{' '}
							<IconButton
									onClick={() => requestSort('status')}
									// className={getClassNamesFor('username')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}</TableCell>
						<TableCell className={classes.tableHeaderCell} align="center"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>{userPayments}</TableBody>
			</Table>
			</TableContainer>
		</Fragment>
	);
};

UserPayment.propTypes = {
	getPayments: PropTypes.func.isRequired,
	payments: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
	payments: state.reducer.payments,
});

export default connect(mapStateToProps, { getPayments })(UserPayment);
