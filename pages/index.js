
import React, { useState } from 'react'
import NavBar from '../components/Navbar/NavBar.js';
import CONSTANTS from '../components/constant';
import MaterialPage from './dashboard/material';
import ReportPage from './dashboard/report';
import TryOutPage from './dashboard/tryout';
import { authInitialProps } from "../lib/auth";
import Home from '../components/Home';

const Body = ({active, auth}) => {
  switch(active){
    case CONSTANTS.DASHBOARD.MATERIAL:
      return <MaterialPage auth />
    case CONSTANTS.DASHBOARD.REPORT:
      return <ReportPage auth />
    case CONSTANTS.DASHBOARD.TRYOUT:
      return <TryOutPage auth />
    default:
      return <MaterialPage auth/>
  }
}

const Index = ({auth, userId}) => {

    if(!!auth.user && Object.keys(auth.user).length !== 0 && auth.constructor === Object)
      return(
        <NavBar mode={0} auth={auth}>
          <Body auth={auth} />
        </NavBar>
      )
    else
      return(
        <span>
          <NavBar mode={1}>
            <Home />
          </NavBar>
        </span>
      )
}

Index.getInitialProps = authInitialProps();

export default Index;