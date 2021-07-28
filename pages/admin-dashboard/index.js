
import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
 
import { authInitialProps } from '../../lib/auth';
import { connect } from 'react-redux';
import store from '../../redux/admin/store';
import { Provider } from 'react-redux';
import UserInfo from '../../components/admin/UserInfo';
import Layout from '../../components/admin/Layout';

import TableHeader from '../../components/admin/TableHeader';
export default function admindashbboard() {
	return(
		<>
			<Layout />
			<div className="content">
				<Provider store={store}>
					<TableHeader />
					<UserInfo />
				</Provider>
			</div>
		</>
	)
}

admindashbboard.getInitialProps = authInitialProps(true);

 