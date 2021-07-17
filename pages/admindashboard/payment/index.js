

import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Provider } from 'react-redux';
import store from '../../../redux/admin/store';

import UserPayment from '../../../components/Admin/UserPayment';
import Layout from '../../../components/admin/Layout'
export default function payment() {
	return(
		<Layout>
			<Provider store={store}>
				<div className="content">
					<UserPayment />
				</div>
			</Provider>
		</Layout>
	)

}


