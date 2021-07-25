import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Provider } from 'react-redux';
import store from '../../../redux/admin/store';
import { authInitialProps } from '../../../lib/auth';

import UserInfo from '../../../components/Admin/UserInfo';
import Layout from '../../../components/admin/Layout';

import TableHeader from '../../../components/admin/TableHeader';
export default function user() {
	return (
		<Layout>
			<Provider store={store}>
				<div className="content">
					<TableHeader />
					<UserInfo />
				</div>
			</Provider>
		</Layout>
	);
}

user.getInitialProps = authInitialProps(true);
