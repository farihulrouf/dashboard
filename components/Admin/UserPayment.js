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
	Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getPayments, updatePayment } from '../../redux/admin/actions';

const useStyles = makeStyles((theme) => ({
	tableContainer: {
		maxHeight: '84vh',
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
		// width: 400,
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
		fontFamily: 'Arial',
	},
	applyButton: {
		color: '#38439F',
		fontFamily: 'Arial',
	},
	courseActive: {
		color: '#001AFF',
	},
	courseInactive: {
		color: '#FF0000',
	},
	courseName: {
		fontWeight: 'bold',
	},
	courseInstructors: {
		color: '#5E6366',
	},
	dot: {
		position: 'relative',
		bottom: '4px',
	},
	paymentSuccess: {
		position: 'relative',
		bottom: '5.5px',
	},
	paymentProcess: {
		position: 'relative',
		bottom: '7.5px',
	},
	paymentExpired: {
		position: 'relative',
		bottom: '4.5px',
	},
}));

const modalStyle = {
	position: 'absolute',
	padding: '0',
	top: '40%',
	left: '40%',
	border: 'none',
	borderRadius: '5px',
	width: '400px',
	height: '127px',
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

const UserPayment = ({ getPayments, payments, updatePayment }) => {
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

	const success = (
		<svg
			width="22"
			height="22"
			viewBox="0 0 22 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M11 1.22217C9.06615 1.22217 7.17572 1.79562 5.56777 2.87002C3.95982 3.94442 2.70658 5.4715 1.96652 7.25815C1.22647 9.04481 1.03283 11.0108 1.41011 12.9075C1.78739 14.8042 2.71863 16.5464 4.08608 17.9139C5.45353 19.2813 7.19576 20.2126 9.09246 20.5898C10.9892 20.9671 12.9551 20.7735 14.7418 20.0334C16.5285 19.2934 18.0555 18.0401 19.1299 16.4322C20.2043 14.8242 20.7778 12.9338 20.7778 10.9999C20.7778 8.40672 19.7476 5.9197 17.9139 4.08601C16.0803 2.25232 13.5932 1.22217 11 1.22217ZM17.3861 7.71828L9.35612 15.7422L4.6139 10.9999C4.45182 10.8379 4.36077 10.618 4.36077 10.3888C4.36077 10.1596 4.45182 9.9398 4.6139 9.77772C4.77598 9.61565 4.9958 9.52459 5.22501 9.52459C5.45422 9.52459 5.67405 9.61565 5.83612 9.77772L9.36834 13.3099L16.1761 6.50828C16.2564 6.42803 16.3516 6.36437 16.4565 6.32094C16.5614 6.2775 16.6737 6.25515 16.7872 6.25515C16.9007 6.25515 17.0131 6.2775 17.118 6.32094C17.2228 6.36437 17.3181 6.42803 17.3983 6.50828C17.4786 6.58853 17.5423 6.6838 17.5857 6.78866C17.6291 6.89351 17.6515 7.0059 17.6515 7.11939C17.6515 7.23288 17.6291 7.34527 17.5857 7.45012C17.5423 7.55498 17.4786 7.65025 17.3983 7.7305L17.3861 7.71828Z"
				fill="#10C900"
			/>
		</svg>
	);

	const process = (
		<svg
			width="26"
			height="26"
			viewBox="0 0 26 26"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M23.9942 10.4609H17.4942C17.3824 10.4609 17.291 10.5523 17.291 10.6641V11.8828C17.291 11.9945 17.3824 12.0859 17.4942 12.0859H23.9942C24.1059 12.0859 24.1973 11.9945 24.1973 11.8828V10.6641C24.1973 10.5523 24.1059 10.4609 23.9942 10.4609ZM20.5918 13.9141H17.4942C17.3824 13.9141 17.291 14.0055 17.291 14.1172V15.3359C17.291 15.4477 17.3824 15.5391 17.4942 15.5391H20.5918C20.7035 15.5391 20.7949 15.4477 20.7949 15.3359V14.1172C20.7949 14.0055 20.7035 13.9141 20.5918 13.9141ZM12.119 8.18848H11.0195C10.8621 8.18848 10.7352 8.31543 10.7352 8.47285V14.7697C10.7352 14.8611 10.7783 14.9449 10.852 14.9982L14.6326 17.7557C14.7596 17.8471 14.9373 17.8217 15.0287 17.6947L15.6813 16.8035V16.801C15.7727 16.674 15.7447 16.4963 15.6178 16.4049L12.4008 14.0791V8.47285C12.4033 8.31543 12.2738 8.18848 12.119 8.18848Z"
				fill="black"
			/>
			<path
				d="M20.4344 17.1107H18.9668C18.8246 17.1107 18.6901 17.1843 18.6139 17.3062C18.2914 17.8165 17.9156 18.2888 17.484 18.7205C16.7401 19.4644 15.8742 20.0484 14.9119 20.4546C13.9141 20.8761 12.8553 21.0894 11.7635 21.0894C10.6692 21.0894 9.61037 20.8761 8.61505 20.4546C7.65275 20.0484 6.78693 19.4644 6.04298 18.7205C5.29904 17.9765 4.71506 17.1107 4.30881 16.1484C3.88732 15.1531 3.67404 14.0943 3.67404 12.9999C3.67404 11.9056 3.88732 10.8494 4.30881 9.85151C4.71506 8.8892 5.29904 8.02338 6.04298 7.27944C6.78693 6.53549 7.65275 5.95151 8.61505 5.54526C9.61037 5.12377 10.6717 4.91049 11.7635 4.91049C12.8578 4.91049 13.9166 5.12377 14.9119 5.54526C15.8742 5.95151 16.7401 6.53549 17.484 7.27944C17.9156 7.71108 18.2914 8.18334 18.6139 8.6937C18.6901 8.81557 18.8246 8.8892 18.9668 8.8892H20.4344C20.6096 8.8892 20.7213 8.70639 20.6426 8.55151C18.9871 5.25834 15.6305 3.11791 11.8828 3.07475C6.39591 3.00619 1.8383 7.4978 1.82814 12.9796C1.81799 18.4716 6.26896 22.9277 11.761 22.9277C15.5568 22.9277 18.9693 20.7796 20.6426 17.4484C20.7213 17.2935 20.607 17.1107 20.4344 17.1107Z"
				fill="black"
			/>
		</svg>
	);

	const expired = (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect width="20" height="20" fill="white" />
			<path
				d="M10 0C7.23958 0 4.88281 0.976562 2.92969 2.92969C0.976562 4.88281 0 7.23958 0 10C0 12.7604 0.976562 15.1172 2.92969 17.0703C4.88281 19.0234 7.23958 20 10 20C12.7604 20 15.1172 19.0234 17.0703 17.0703C19.0234 15.1172 20 12.7604 20 10C20 7.23958 19.0234 4.88281 17.0703 2.92969C15.1172 0.976562 12.7604 0 10 0ZM1.67969 10C1.67969 7.70833 2.49349 5.7487 4.12109 4.12109C5.7487 2.49349 7.70833 1.67969 10 1.67969C12.0573 1.67969 13.8021 2.31771 15.2344 3.59375L3.59375 15.2344C2.31771 13.8021 1.67969 12.0573 1.67969 10ZM10 18.3203C7.94271 18.3203 6.19792 17.6823 4.76562 16.4062L16.4062 4.76562C17.6823 6.19792 18.3203 7.94271 18.3203 10C18.3203 12.2917 17.5065 14.2513 15.8789 15.8789C14.2513 17.5065 12.2917 18.3203 10 18.3203Z"
				fill="#C50000"
			/>
		</svg>
	);

	const unpaid = (
		<svg
			width="21"
			height="21"
			viewBox="0 0 21 21"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="10.5" cy="10.5" r="10.5" fill="#C4C4C4" />
			<circle cx="10.5" cy="10.5001" r="8.4" fill="white" />
			<line
				x1="4.19995"
				y1="10.55"
				x2="16.8"
				y2="10.55"
				stroke="#C4C4C4"
				stroke-width="2"
			/>
		</svg>
	);

	const download = (
		<svg
			width="31"
			height="31"
			viewBox="0 0 31 31"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M15.3093 20.0107C15.3319 20.0397 15.3609 20.0631 15.3939 20.0792C15.427 20.0953 15.4632 20.1037 15.5 20.1037C15.5368 20.1037 15.573 20.0953 15.6061 20.0792C15.6391 20.0631 15.6681 20.0397 15.6907 20.0107L19.0813 15.721C19.2055 15.5636 19.0935 15.3305 18.8906 15.3305H16.6474V5.08594C16.6474 4.95273 16.5384 4.84375 16.4052 4.84375H14.5888C14.4556 4.84375 14.3466 4.95273 14.3466 5.08594V15.3274H12.1094C11.9065 15.3274 11.7945 15.5605 11.9187 15.718L15.3093 20.0107ZM26.5801 18.9512H24.7637C24.6305 18.9512 24.5215 19.0602 24.5215 19.1934V23.8555H6.47852V19.1934C6.47852 19.0602 6.36953 18.9512 6.23633 18.9512H4.41992C4.28672 18.9512 4.17773 19.0602 4.17773 19.1934V25.1875C4.17773 25.7233 4.61064 26.1562 5.14648 26.1562H25.8535C26.3894 26.1562 26.8223 25.7233 26.8223 25.1875V19.1934C26.8223 19.0602 26.7133 18.9512 26.5801 18.9512Z"
				fill="black"
			/>
		</svg>
	);

	// Toggle Edit
	const [displayEdit, toggleEdit] = useState({
		displayEditForm: false,
		displayEditPayment: '',
	});

	const { displayEditForm, displayEditPayment } = displayEdit;

	const { items, requestSort, sortConfig } = useSortableData(payments);
	const getClassNamesFor = (name) => {
		if (!sortConfig) {
			return;
		}
		return sortConfig.key === name ? sortConfig.direction : undefined;
	};

	const userPayments = items.map((payment) => {
		// Save Modal
		const [open, setOpen] = useState(false);
		const handleClose = () => {
			setOpen(false);
		};

		const [formData, setFormData] = useState({
			payment_number: payment.payment_number,
			user: payment.user,
			course: payment.course,
			status: payment.status,
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

		const { status } = formData;

		const genNew = (e) => {
			setFormData({ ...formData, status: 'Unpaid' });
			setOpen(true);
		};

		const applyChange = (e) => {
			e.preventDefault();
			updatePayment(formData);
			setOpen(false);
		};
		return (
			<Fragment key={payment.payment_number}>
				<TableRow>
					<TableCell align="center">{payment.user.name}</TableCell>
					<TableCell align="center">{payment.user.email}</TableCell>
					<TableCell align="center">
						<Moment format="DD/MM/YYYY">{payment.user.signupdate}</Moment>
					</TableCell>
					<TableCell align="center">
						<Moment format="DD/MM/YYYY">{payment.user.lastlogin}</Moment>
					</TableCell>
					<TableCell align="center">
						{payment.status === 'Success' && (
							<IconButton
							// onClick={() =>
							// 	toggleEdit({
							// 		displayEditForm: !displayEditForm,
							// 		displayEditUser: user.username,
							// 	})
							// }
							>
								{download}
							</IconButton>
						)}
					</TableCell>
					<TableCell>
						<div className={classes.courseName}>{payment.course.name}</div>
						<div>
							{payment.course.status === 'Active' ? (
								<span className={classes.courseActive}>
									{payment.course.status}
								</span>
							) : (
								<span className={classes.courseInactive}>
									{payment.course.status}
								</span>
							)}{' '}
							<span className={classes.dot}> . </span>{' '}
							<span className={classes.courseInstructors}>
								{payment.course.instructors}
							</span>
						</div>
					</TableCell>
					<TableCell align="center">
						{displayEditForm &
						(displayEditPayment == payment.payment_number) ? (
							payment.status === 'Success' ? (
								<FormControl>
									<Select
										name="status"
										value={status}
										onChange={(e) => onChange(e)}
									>
										<MenuItem value="Success" className="classes.statusOption">
											{success} Success
										</MenuItem>
										<MenuItem value="Process">{process} Process</MenuItem>
										<MenuItem value="Expired">{expired} Expired</MenuItem>
									</Select>
								</FormControl>
							) : payment.status === 'Process' ? (
								<FormControl>
									<Select
										name="status"
										value={status}
										onChange={(e) => onChange(e)}
									>
										<MenuItem value="Process" className="classes.statusOption">
											{process} Process
										</MenuItem>
										<MenuItem value="Success">{success} Success</MenuItem>
										<MenuItem value="Expired">{expired} Expired</MenuItem>
									</Select>
								</FormControl>
							) : (
								<FormControl>
									<Select
										name="status"
										value={status}
										onChange={(e) => onChange(e)}
									>
										<MenuItem value="Expired" className="classes.statusOption">
											{expired} Expired
										</MenuItem>
										<MenuItem value="Success">{success} Success</MenuItem>
										<MenuItem value="Process">{process} Process</MenuItem>
									</Select>
								</FormControl>
							)
						) : payment.status === 'Success' ? (
							<div>
								{success}{' '}
								<span className={classes.paymentSuccess}>{payment.status}</span>
							</div>
						) : payment.status === 'Process' ? (
							<div>
								{process}{' '}
								<span className={classes.paymentProcess}>{payment.status}</span>
							</div>
						) : payment.status === 'Expired' ? (
							<div>
								{expired}{' '}
								<span className={classes.paymentExpired}>{payment.status}</span>
							</div>
						) : (
							<div>
								{unpaid}{' '}
								<span className={classes.paymentExpired}>{payment.status}</span>
							</div>
						)}
					</TableCell>

					<TableCell align="center">
						{payment.status === 'Expired' && (
							<Button
								variant="contained"
								size="small"
								className="gen-new-button"
								onClick={(e) => genNew(e)}
							>
								<div className="gen-new-text">Generate New Invoice</div>
							</Button>
						)}
					</TableCell>
				</TableRow>
				<Modal open={open}>
					<div style={modalStyle} className={classes.paper}>
						<div className="modal-header">
							<p className="modal-header-text" align="center">
								Apply The Change?
							</p>
						</div>
						<div>
							<hr className="line-break-apply" />
						</div>
						<div className="apply-answer" align="center">
							<Button onClick={handleClose} className="cancel-button">
								<div className="cancel-button-text">Cancel</div>{' '}
							</Button>
							<Button onClick={(e) => applyChange(e)} className="apply-button">
								<div className="apply-button-text">Apply</div>
							</Button>
						</div>
					</div>
				</Modal>
			</Fragment>
		);
	});

	return (
		<Fragment>
			<TableContainer component={Paper} className={classes.tableContainer}>
				<Table stickyHeader className={classes.table}>
					<TableHead>
						<TableRow>
							<TableCell className={classes.tableHeaderCell} align="center">
								<span className={classes.headerText}>USER NAME </span>
								<IconButton
									onClick={() => requestSort('payment_number')}
									// className={getClassNamesFor('username')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}
							</TableCell>
							<TableCell className={classes.tableHeaderCell} align="center">
								<span className={classes.headerText}>EMAIL </span>
								<IconButton
									onClick={() => requestSort('payment_number')}
									// className={getClassNamesFor('username')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}
							</TableCell>
							<TableCell className={classes.tableHeaderCell} align="center">
								<span className={classes.headerText}>SIGNUP DATE </span>
								<IconButton
									onClick={() => requestSort('payment_number')}
									// className={getClassNamesFor('username')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}
							</TableCell>
							<TableCell className={classes.tableHeaderCell} align="center">
								<span className={classes.headerText}>LAST LOGIN </span>
								<IconButton
									onClick={() => requestSort('payment_number')}
									// className={getClassNamesFor('username')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}
							</TableCell>
							<TableCell className={classes.tableHeaderCell} align="center">
								<span className={classes.headerText}>INVOICE </span>
								<IconButton
									onClick={() => requestSort('status')}
									// className={getClassNamesFor('username')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}
							</TableCell>
							<TableCell className={classes.tableHeaderCell} align="center">
								<span className={classes.headerText}>COURSES DETAIL </span>
								<IconButton
									onClick={() => requestSort('payment_number')}
									// className={getClassNamesFor('username')}
									className={classes.sort}
								>
									{sort}
								</IconButton>{' '}
							</TableCell>
							<TableCell className={classes.tableHeaderCell} align="center">
								<span className={classes.headerText}>PAYMENT STATUS </span>
								<IconButton
									onClick={() => requestSort('status')}
									// className={getClassNamesFor('username')}
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
					<TableBody>{userPayments}</TableBody>
				</Table>
			</TableContainer>
		</Fragment>
	);
};

UserPayment.propTypes = {
	getPayments: PropTypes.func.isRequired,
	payments: PropTypes.array.isRequired,
	updatePayment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	payments: state.reducer.payments,
});

export default connect(mapStateToProps, { getPayments, updatePayment })(
	UserPayment
);