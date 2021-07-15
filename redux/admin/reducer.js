import { GET_USERS, GET_PAYMENTS, UPDATE_USER, UPDATE_PAYMENT, SORT_COLLECTION } from './types';

const initialState = {
	users: [
		{
			_id: 1,
			username: 'Risa',
			email: 'risa@mail.com',
			signupdate: '2021/4/1',
			lastlogin: '2021/7/8',
			courses: [
				{
					_id: 'c1',
					name: 'Bahasa Jerman for Fun',
					status: 'Active',
					instructors: 'Masiga Buana',
					coursepayment: 'Success',
				},
				{
					_id: 'c2',
					name: 'Course Uji Coba',
					status: 'Active',
					instructors: 'Ramandika, Jais Anas',
					coursepayment: 'Success',
				},
				{
					_id: 'c3',
					name: 'Kelas TrashHI',
					status: 'Active',
					instructors: 'TrasHI Admin',
					coursepayment: 'Success',
				},
				{
					_id: 'c4',
					name: 'Bahasa Jerman for Serious',
					status: 'Active',
					instructors: 'Masiga Buana',
					coursepayment: 'Success',
				},
				{
					_id: 'c5',
					name: 'Fisika',
					status: 'Active',
					instructors: 'Masiga Buana',
					coursepayment: 'Success',
				},
			],
			userstatus: 'Student',
		},
		{
			_id: 2,
			username: 'Rouf',
			email: 'rouf@mail.com',
			signupdate: '2021/2/1',
			lastlogin: '2021/7/2',
			courses: [
				{
					name: 'Kelas TrashHI',
					status: 'Active',
					instructors: 'TrasHI Admin',
					coursepayment: 'Success',
				},
				{
					name: 'Bahasa Jerman for Fun',
					status: 'Active',
					instructors: 'Masiga Buana',
					coursepayment: 'Success',
				},
				{
					name: 'Bahasa Jerman for Serious',
					status: 'Active',
					instructors: 'Masiga Buana',
					coursepayment: 'Success',
				},
			],
			userstatus: 'Teacher',
		},
		{
			_id: 3,
			username: 'Haris',
			email: 'haris@mail.com',
			signupdate: '2021/1/20',
			lastlogin: '2021/7/8',
			courses: [],
			userstatus: 'Student',
		},
		{
			_id: 4,
			username: 'Nayf',
			email: 'nayf@mail.com',
			signupdate: '2020/9/24',
			lastlogin: '2020/10/10',
			courses: [
				{
					name: 'Kelas TrashHI',
					status: 'Active',
					instructors: 'TrasHI Admin',
					coursepayment: 'Success',
				},
				{
					name: 'Bahasa Jerman for Fun',
					status: 'Active',
					instructors: 'Masiga Buana',
					coursepayment: 'Success',
				},
				{
					name: 'Bahasa Jerman for Serious',
					status: 'Active',
					instructors: 'Masiga Buana',
					coursepayment: 'Success',
				},
			],
			userstatus: 'Teacher',
		},
		{
			_id: 5,
			username: 'Nur',
			email: 'nur@mail.com',
			signupdate: '2021/4/3',
			lastlogin: '2021/7/7',
			courses: [
				{
					name: 'Bahasa Jerman for Fun',
					status: 'Active',
					instructors: 'Masiga Buana',
					coursepayment: 'Success',
				},
				{
					name: 'Course Uji Coba',
					status: 'Active',
					instructors: 'Ramandika, Jais Anas',
					coursepayment: 'Success',
				},
				{
					name: 'Kelas TrashHI',
					status: 'Active',
					instructors: 'TrasHI Admin',
					coursepayment: 'Success',
				},
				{
					name: 'Fisika',
					status: 'Active',
					instructors: 'Masiga Buana',
					coursepayment: 'Success',
				},
			],
			userstatus: 'Student',
		},
	],
	payments: [
		{
			payment_number: 'p1',
			user: {
				name: 'Risa',
				email: 'risa@mail.com',
				signupdate: '2021/4/1',
				lastlogin: '2021/7/8',
			},
			course: {
				name: 'Bahasa Jerman for Fun',
				status: 'Active',
				instructors: 'Masiga Buana',
			},
			status: 'Success',
		},
		{
			payment_number: 'p2',
			user: {
				name: 'Risa',
				email: 'risa@mail.com',
				signupdate: '2021/4/1',
				lastlogin: '2021/7/8',
			},
			course: {
				name: 'Course Uji Coba',
				status: 'Active',
				instructors: 'Ramandika, Jais Anas',
			},
			status: 'Paid',
		},
		{
			payment_number: 'p3',
			user: {
				name: 'Risa',
				email: 'risa@mail.com',
				signupdate: '2021/4/1',
				lastlogin: '2021/7/8',
			},
			course: {
				name: 'Kelas TrashHI',
				status: 'Active',
				instructors: 'TrasHI Admin',
			},
			status: 'Paid',
		},
		{
			payment_number: 'p4',
			user: {
				name: 'Risa',
				email: 'risa@mail.com',
				signupdate: '2021/4/1',
				lastlogin: '2021/7/8',
			},
			course: {
				name: 'Bahasa Jerman for Serious',
				status: 'Active',
				instructors: 'Masiga Buana',
			},
			status: 'Pending',
		},
		{
			payment_number: 'p5',
			user: {
				name: 'Risa',
				email: 'risa@mail.com',
				signupdate: '2021/4/1',
				lastlogin: '2021/7/8',
			},
			course: { name: 'Fisika', status: 'Active', instructors: 'Masiga Buana' },
			status: 'Expired',
		},
		{
			payment_number: 'p6',
			user: {
				name: 'Rouf',
				email: 'rouf@mail.com',
				signupdate: '2021/2/1',
				lastlogin: '2021/7/2',
			},
			course: {
				name: 'Kelas TrashHI',
				status: 'Active',
				instructors: 'TrasHI Admin',
			},
			status: 'Paid',
		},
		{
			payment_number: 'p7',
			user: {
				name: 'Rouf',
				email: 'rouf@mail.com',
				signupdate: '2021/2/1',
				lastlogin: '2021/7/2',
			},
			course: {
				name: 'Bahasa Jerman for Fun',
				status: 'Active',
				instructors: 'Masiga Buana',
			},
			status: 'Pending',
		},
		{
			payment_number: 'p8',
			user: {
				name: 'Rouf',
				email: 'rouf@mail.com',
				signupdate: '2021/2/1',
				lastlogin: '2021/7/2',
			},
			course: {
				name: 'Bahasa Jerman for Serious',
				status: 'Active',
				instructors: 'Masiga Buana',
			},
			status: 'Expired',
		},
	],
	sorted: null,
};

// eslint-disable-next-line
export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_USERS:
			return {
				...state,
				// users: payload
			};
		case GET_PAYMENTS:
			return {
				...state,
				// payments: payload
			};
		case UPDATE_USER:
			return {
				...state,
				users: state.users.map(user => user._id === payload._id ? payload : user),
			};
		case UPDATE_PAYMENT:
			return {
				...state,
				payments: state.payments.map(payment => payment.payment_number === payload.payment_number ? payload : payment),
			};
		case SORT_COLLECTION:
			return {
				...state,
				sorted: state.users.slice().sort(function(a, b) {
				var nameA = a.username.toLowerCase(),
				nameB = b.username.toLowerCase()
				if (nameA < nameB)
				return payload ? -1 : 1
				if (nameA > nameB)
				return payload ? 1 : -1
				return 0
			})}
		default:
			return state;
	}
}
