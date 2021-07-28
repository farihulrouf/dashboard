

import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//import React, { useState } from "react";
import { Provider } from 'react-redux';
import store from '../../../redux/admin/store';

import UserInfo from '../../../components/Admin/UserInfo';
import Layout from '../../../components/admin/Layout'
import HeaderTable from '../../../components/admin/HeaderTable'
import TableHeader from '../../../components/admin/TableHeader'
import TableCustomize from '../../../components/admin/TableCustomize'

export default function user() {

	
	//const [value, setValue] = useState("");

	return(

		<Layout>
			<Provider store={store}>
				<div className="content">
					<TableHeader />
					 <TableCustomize />
				</div>
			</Provider>
		</Layout>
	)

}