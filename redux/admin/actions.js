import axios from 'axios';

import {
	GET_USERS,
	GET_PAYMENTS,
	UPDATE_USER,
	UPDATE_PAYMENT,
	SORT_COLLECTION,
} from './types';

// Get all users
export const getUsers = () => async (dispatch) => {
	try {
		// const res = await axios.get('/api/users');

		dispatch({
			type: GET_USERS,
			// payload: res.data,
		});
	} catch (err) {
		console.log("couldn't get users");
	}
};

// Get all payments
export const getPayments = () => async (dispatch) => {
	try {
		// const res = await axios.get('/api/payments');

		dispatch({
			type: GET_PAYMENTS,
			// payload: res.data,
		});
	} catch (err) {
		console.log("couldn't get payments");
	}
};

// Update user info
export const updateUserInfo = (formData) => async (dispatch) => {
	// const config = {
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	}
	// }
	dispatch({
		type: UPDATE_USER,
		payload: formData,
	});
	// try {
	// 	const res = await axios.put(`/api/users/${user._id}`, formData, config)

	// } catch (err) {
	// 	console.log("couldn't update user")
	// }
};

// Update payment
export const updatePayment = (formData) => async (dispatch) => {
	// const config = {
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	}
	// }
	dispatch({
		type: UPDATE_PAYMENT,
		payload: formData,
	});
	// try {
	// 	const res = await axios.put(`/api/payments/${payment._id}`, formData, config)

	// } catch (err) {
	// 	console.log("couldn't update payment")
	// }
};

// Sort name
export const sortCollection = (direction) => async (dispatch) => {
	dispatch({
		type: SORT_COLLECTION,
		payload: direction,
	});
};
