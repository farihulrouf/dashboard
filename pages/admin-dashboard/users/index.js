
//import UserInfo from '../../components/Admin/UserInfo';

import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Navbar from '';
// import Alert from '';
//import UserInfo from '../../../components/Admin/UserInfo';
//import UserPayment from '../../../components/Admin/UserPayment';
// Redux
import { Provider } from 'react-redux';
import store from '../../../redux/admin/store';

import UserInfo from '../../../components/Admin/UserInfo';
import Layout from '../../../components/admin/Layout'
export default function user() {
	return(
		<Layout>
			<Provider store={store}>
				<div className="content">
					<UserInfo />
				</div>
			</Provider>
		</Layout>
	)

}