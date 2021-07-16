import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Navbar from '';
// import Alert from '';
import UserInfo from '../../components/Admin/UserInfo';
import UserPayment from '../../components/Admin/UserPayment';
// Redux
import { Provider } from 'react-redux';
import store from '../../redux/admin/store';
// auth

// if (localStorage.token) {
// 	setAuthToken(localStorage.token);
// }

const Index = () => {
	return (
		<Provider store={store}>
			<Fragment>
				{/* <Navbar /> */}
				<UserInfo />
				<UserPayment />
			</Fragment>
		</Provider>
	);
};

export default Index;