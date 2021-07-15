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
import { getUsers, updateUserInfo } from '../../redux/admin/actions';

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

const UserInfo = ({ getUsers, users, updateUserInfo }) => {
	useEffect(() => {
		getUsers();
	}, [getUsers]);

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

	const teacher = (
		<svg
			width="30"
			height="22"
			viewBox="0 0 30 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M25.75 2.5V2H25.25H1V0.875H27V19.5V20H27.5H29.25V21.125H10V20H25.25H25.75V19.5V2.5ZM16.0825 14.9144L13.303 16.3028V16.3006L12.5795 16.6621C12.0629 16.9203 11.4377 16.9209 10.9208 16.6622L10.9205 16.6621L8.59849 15.5019L7.875 15.1403V15.9491V21.125H6.625V15.25V14.75H6.125H2.75H2.25V15.25V21.125H1V13.625H6.69173C7.16507 13.6253 7.63003 13.7346 8.04602 13.9422L8.0462 13.9422L11.5292 15.6784L11.7525 15.7896L11.9756 15.6782L15.5208 13.9079L16.0825 14.9144ZM2.16728 5.17509C2.91523 4.46904 3.93407 4.06621 5.00309 4.0625C7.22382 4.06293 8.99952 5.78043 9 7.81168C8.99609 8.7955 8.58092 9.74418 7.83479 10.4492C7.08769 11.1552 6.06972 11.5582 5.00138 11.5625C2.77783 11.5621 1.00061 9.84619 1 7.81355C1.00444 6.82918 1.42035 5.88016 2.16728 5.17509ZM16.875 6.25H12.25V5.125H16.875V6.25ZM22.5 6.25H20.125V5.125H22.5V6.25ZM7.75 7.8125C7.75 6.32316 6.5045 5.1875 5.00225 5.1875C3.49488 5.1875 2.25 6.32269 2.25 7.8125C2.25 9.30582 3.49409 10.4375 5.00225 10.4375C6.50529 10.4375 7.75 9.30534 7.75 7.8125ZM22.5 10.5H12.25V9.375H22.5V10.5Z"
				fill="black"
			/>
			<path
				d="M25.75 2.5V2H25.25H1V0.875H27V19.5V20H27.5H29.25V21.125H10V20H25.25H25.75V19.5V2.5ZM16.0825 14.9144L13.303 16.3028V16.3006L12.5795 16.6621C12.0629 16.9203 11.4377 16.9209 10.9208 16.6622L10.9205 16.6621L8.59849 15.5019L7.875 15.1403V15.9491V21.125H6.625V15.25V14.75H6.125H2.75H2.25V15.25V21.125H1V13.625H6.69173C7.16507 13.6253 7.63003 13.7346 8.04602 13.9422L8.0462 13.9422L11.5292 15.6784L11.7525 15.7896L11.9756 15.6782L15.5208 13.9079L16.0825 14.9144ZM2.16728 5.17509C2.91523 4.46904 3.93407 4.06621 5.00309 4.0625C7.22382 4.06293 8.99952 5.78043 9 7.81168C8.99609 8.7955 8.58092 9.74418 7.83479 10.4492C7.08769 11.1552 6.06972 11.5582 5.00138 11.5625C2.77783 11.5621 1.00061 9.84619 1 7.81355C1.00444 6.82918 1.42035 5.88016 2.16728 5.17509ZM16.875 6.25H12.25V5.125H16.875V6.25ZM22.5 6.25H20.125V5.125H22.5V6.25ZM7.75 7.8125C7.75 6.32316 6.5045 5.1875 5.00225 5.1875C3.49488 5.1875 2.25 6.32269 2.25 7.8125C2.25 9.30582 3.49409 10.4375 5.00225 10.4375C6.50529 10.4375 7.75 9.30534 7.75 7.8125ZM22.5 10.5H12.25V9.375H22.5V10.5Z"
				stroke="black"
			/>
			<path
				d="M25.75 2.5V2H25.25H1V0.875H27V19.5V20H27.5H29.25V21.125H10V20H25.25H25.75V19.5V2.5ZM16.0825 14.9144L13.303 16.3028V16.3006L12.5795 16.6621C12.0629 16.9203 11.4377 16.9209 10.9208 16.6622L10.9205 16.6621L8.59849 15.5019L7.875 15.1403V15.9491V21.125H6.625V15.25V14.75H6.125H2.75H2.25V15.25V21.125H1V13.625H6.69173C7.16507 13.6253 7.63003 13.7346 8.04602 13.9422L8.0462 13.9422L11.5292 15.6784L11.7525 15.7896L11.9756 15.6782L15.5208 13.9079L16.0825 14.9144ZM2.16728 5.17509C2.91523 4.46904 3.93407 4.06621 5.00309 4.0625C7.22382 4.06293 8.99952 5.78043 9 7.81168C8.99609 8.7955 8.58092 9.74418 7.83479 10.4492C7.08769 11.1552 6.06972 11.5582 5.00138 11.5625C2.77783 11.5621 1.00061 9.84619 1 7.81355C1.00444 6.82918 1.42035 5.88016 2.16728 5.17509ZM16.875 6.25H12.25V5.125H16.875V6.25ZM22.5 6.25H20.125V5.125H22.5V6.25ZM7.75 7.8125C7.75 6.32316 6.5045 5.1875 5.00225 5.1875C3.49488 5.1875 2.25 6.32269 2.25 7.8125C2.25 9.30582 3.49409 10.4375 5.00225 10.4375C6.50529 10.4375 7.75 9.30534 7.75 7.8125ZM22.5 10.5H12.25V9.375H22.5V10.5Z"
				stroke="black"
				strokeOpacity="0.2"
			/>
		</svg>
	);

	const student = (
		<svg
			width="32"
			height="19"
			viewBox="0 0 32 19"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M16 0.780029L15.687 0.875029L3.18697 5.06303L0.344971 6.00003L1.99997 6.53003V15.28C1.40297 15.627 0.999971 16.26 0.999971 17C0.999971 17.5305 1.21068 18.0392 1.58576 18.4142C1.96083 18.7893 2.46954 19 2.99997 19C3.5304 19 4.03911 18.7893 4.41418 18.4142C4.78926 18.0392 4.99997 17.5305 4.99997 17C4.99997 16.26 4.59697 15.627 3.99997 15.28V7.22003L5.99997 7.87503V13C5.99997 13.82 6.49997 14.5 7.09397 14.97C7.68797 15.437 8.42597 15.767 9.31197 16.063C11.086 16.653 13.424 17 16 17C18.576 17 20.914 16.654 22.688 16.062C23.574 15.767 24.312 15.437 24.906 14.969C25.5 14.5 26 13.82 26 13V7.87503L28.813 6.93703L31.655 6.00003L28.812 5.06203L16.312 0.875029L16 0.780029ZM16 2.87503L25.375 6.00003L16 9.12503L6.62497 6.00003L16 2.87503ZM7.99997 8.56303L15.688 11.125L16 11.219L16.313 11.124L24 8.56203V13C24 13.01 24.004 13.126 23.687 13.375C23.371 13.625 22.804 13.94 22.062 14.188C20.58 14.681 18.395 15 16 15C13.605 15 11.42 14.682 9.93697 14.187C9.19697 13.94 8.62897 13.624 8.31297 13.375C7.99497 13.125 7.99997 13.01 7.99997 13V8.56203V8.56303Z"
				fill="black"
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

	const org = (
		<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M13 13.8667C12.7701 13.8667 12.5497 13.958 12.3871 14.1205C12.2246 14.2831 12.1333 14.5035 12.1333 14.7334C12.1333 14.9632 12.2246 15.1837 12.3871 15.3462C12.5497 15.5087 12.7701 15.6 13 15.6C13.2298 15.6 13.4503 15.5087 13.6128 15.3462C13.7753 15.1837 13.8666 14.9632 13.8666 14.7334C13.8666 14.5035 13.7753 14.2831 13.6128 14.1205C13.4503 13.958 13.2298 13.8667 13 13.8667Z" fill="black"/>
		<path fill-rule="evenodd" clip-rule="evenodd" d="M20.8 10.7311L13.8667 7.2644V5.2H19.0667V0H12.1333V7.2644L5.2 10.7311V13.8667H1.73333V24.2667H0V26H10.4V19.0667H15.6V26H26V24.2667H24.2667V13.8667H20.8V10.7311ZM22.5333 24.2667V15.6H20.8V24.2667H22.5333ZM5.2 24.2667H3.46667V15.6H5.2V24.2667ZM10.4 14.7333C10.4 14.0438 10.6739 13.3825 11.1615 12.8949C11.6491 12.4073 12.3104 12.1333 13 12.1333C13.6896 12.1333 14.3509 12.4073 14.8385 12.8949C15.3261 13.3825 15.6 14.0438 15.6 14.7333C15.6 15.4229 15.3261 16.0842 14.8385 16.5718C14.3509 17.0594 13.6896 17.3333 13 17.3333C12.3104 17.3333 11.6491 17.0594 11.1615 16.5718C10.6739 16.0842 10.4 15.4229 10.4 14.7333Z" fill="black"/>
		<path d="M13.8666 26V20.8H12.1333V26H13.8666Z" fill="black"/>
		</svg>
	)

	// Toggle Edit
	const [displayEdit, toggleEdit] = useState({
		displayEditForm: false,
		displayEditUser: null,
	});

	const { displayEditForm, displayEditUser } = displayEdit;

	// Sort Table
	const { items, requestSort, sortConfig } = useSortableData(users);
	const getClassNamesFor = (name) => {
		if (!sortConfig) {
			return;
		}
		return sortConfig.key === name ? sortConfig.direction : undefined;
	};

	

	// User Rows
	const userRows = items.map((user) => {
		// Save Modal
		const [open, setOpen] = useState(false);
		const handleClose = () => {
			setOpen(false);
			toggleEdit({
				displayEditForm: !displayEditForm,
				displayEditUser: user.username,
			})
		}

		const [formData, setFormData] = useState({
			_id: user._id,
			username: user.username,
			email: user.email,
			signupdate: user.signupdate,
			lastlogin: user.lastlogin,
			courses: user.courses,
			userstatus: user.userstatus,
		});

		// useEffect(() => {
		// 	setFormData({
				
		// 		username: user.username,
		// 		email: user.email,
		// 		signupdate: user.signupdate,
		// 		lastlogin: user.lastlogin,
		// 		courses: user.courses,
		// 		userstatus: user.userstatus,
		// 	});
		// 	// eslint-disable-next-line
		// }, []);


		const { userstatus } = formData;

		const onChange = (e) => {
			setFormData({ ...formData, [e.target.name]: e.target.value });
			setOpen(true);
		};

		const applyChange = (e) => {
			e.preventDefault();
			updateUserInfo(formData);
			setOpen(false);
			toggleEdit({
				displayEditForm: !displayEditForm,
				displayEditUser: user.username,
			})
		};

		return (
			<Fragment>
			<TableRow key={user._id}>
				<TableCell align="center">{user.username}</TableCell>
				<TableCell align="center">{user.email}</TableCell>
				<TableCell align="center">
					<Moment format="DD/MM/YYYY">{user.signupdate}</Moment>
				</TableCell>
				<TableCell align="center">
					<Moment format="DD/MM/YYYY">{user.lastlogin}</Moment>
				</TableCell>
				<TableCell align="center">
					{user.courses.length == 0 ? (
						'-'
					) : user.userstatus === 'Student' ? (
						<Grid container className={classes.coursesBorder}>
							<Grid item className={classes.studentCourses}>
								{user.courses.length}
							</Grid>
						</Grid>
					) : (
						<Grid container className={classes.coursesBorder}>
							<Grid item className={classes.otherCourses}>
								{user.courses.length}
							</Grid>
						</Grid>
					)}
				</TableCell>
				<TableCell align="center">
					{displayEditForm & (displayEditUser === user.username) ? (
						user.userstatus === 'Student' ? (
							<FormControl>
								<Select
									name="userstatus"
									value={userstatus}
									onChange={(e) => onChange(e)}
								>
									<MenuItem value="Student" className="classes.statusOption">
										{student} Student
									</MenuItem>
									<MenuItem value="Teacher">{teacher} Teacher</MenuItem>
									<MenuItem value="Organization">{org}Organization</MenuItem>
								</Select>
							</FormControl>
						) : user.userstatus === 'Teacher' ? (
							<FormControl>
								<Select
									name="userstatus"
									value={userstatus}
									onChange={(e) => onChange(e)}
								>
									<MenuItem value="Teacher">{teacher} Teacher</MenuItem>
									<MenuItem value="Student">{student} Student</MenuItem>
									<MenuItem value="Organization">{org} Organization</MenuItem>
								</Select>
							</FormControl>
						) : (
							<select name="user-status" id="user-status">
								<option value="organization">Teacher</option>
								<option value="student">Student</option>
								<option value="teacher">Organization</option>
							</select>
						)
					) : user.userstatus === 'Teacher' ? (
						<Grid>
							{teacher}{' '}
							<span className={classes.userStatus}>{user.userstatus}</span>
						</Grid>
					) : (
						<Grid>
							{student}{' '}
							<span className={classes.userStatus}>{user.userstatus}</span>
						</Grid>
					)}
				</TableCell>
				<TableCell align="center">
					<IconButton
						onClick={() =>
							toggleEdit({
								displayEditForm: !displayEditForm,
								displayEditUser: user.username,
							})
						}
					>
						{edit}
					</IconButton>
				</TableCell>
			</TableRow>
			<Modal
				open={open}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				<div style={modalStyle} className={classes.paper}>
						<div className={classes.applyQ}><p className={classes.applyText} align="center" fontFamily>Apply The Change?</p></div>
						<div className={classes.applyA} align="center">
							<Button onClick={handleClose}><div className={classes.cancelButton}>Cancel</div> </Button>
							<Button className={classes.applyButton} onClick={(e) => applyChange(e)}>Apply</Button>
						</div>
				</div>
			</Modal>
			</Fragment>
		);
	});

	return (
		<Fragment>
			<TableContainer component={Paper} className={classes.tableContainer}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<TableCell className={classes.tableHeaderCell} align="center">
								<span className={classes.headerText}>USER NAME </span>
								<IconButton
									onClick={() => requestSort('username')}
									// className={getClassNamesFor('username')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}
							</TableCell>
							<TableCell className={classes.tableHeaderCell} align="center">
								<span className={classes.headerText}>EMAIL </span>
								<IconButton
									onClick={() => requestSort('email')}
									// className={getClassNamesFor('email')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}
							</TableCell>
							<TableCell className={classes.tableHeaderCell} align="center">
								<span className={classes.headerText}>SIGNUP DATE </span>
								<IconButton
									onClick={() => requestSort('signupdate')}
									// className={getClassNamesFor('signupdate')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}
							</TableCell>
							<TableCell className={classes.tableHeaderCell} align="center">
								<span className={classes.headerText}>LAST LOGIN </span>
								<IconButton
									onClick={() => requestSort('lastlogin')}
									// className={getClassNamesFor('lastlogin')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}
							</TableCell>
							<TableCell className={classes.tableHeaderCell} align="center">
								<span className={classes.headerText}>COURSES </span>
								<IconButton
									onClick={() => requestSort('courses')}
									// className={getClassNamesFor('courses')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}
							</TableCell>
							<TableCell className={classes.tableHeaderCell} align="center">
								<span className={classes.headerText}>USER STATUS </span>
								<IconButton
									onClick={() => requestSort('userstatus')}
									// className={getClassNamesFor('userstatus')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}
							</TableCell>
							<TableCell
								className={classes.tableHeaderCell}
								align="center"
							></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>{userRows}</TableBody>
				</Table>
			</TableContainer>
		</Fragment>
	);
};

UserInfo.propTypes = {
	getUsers: PropTypes.func.isRequired,
	users: PropTypes.array.isRequired,
	updateUserInfo: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	users: state.reducer.users,
});

export default connect(mapStateToProps, { getUsers, updateUserInfo })(UserInfo);
