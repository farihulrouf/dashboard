
import Link from 'next/link'

import Layout from '../../components/admin/Layout'
import { connect } from 'react-redux';
//import React, { useState } from "react";
import { Provider } from 'react-redux';
import store from '../../redux/admin/store';
 import UserPayment from '../../components/Admin/UserPayment';
 import TableHeader from '../../components/admin/TableHeader'
function admindashbboard(){
    return(
        <> 
    	<Layout /> 
           <div className="content"> 
            <Provider store={store}>
            <TableHeader />
            <UserPayment />
            </Provider>
            </div>
        </>


    )

}

export default admindashbboard