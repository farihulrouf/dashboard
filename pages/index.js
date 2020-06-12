
import NavBar from '../components/NavBar.js';
import { makeStyles } from '@material-ui/core/styles';
import CONSTANTS from '../components/constant';
import MaterialPage from './dashboard/material';
import ReportPage from './dashboard/report';
import TryOutPage from './dashboard/tryout';
import { authInitialProps } from "../lib/auth";
import Router from 'next/router';
import Link from 'next/link'

const Body = ({active}) => {
  switch(active){
    case CONSTANTS.DASHBOARD.MATERIAL:
      return <MaterialPage/>
    case CONSTANTS.DASHBOARD.REPORT:
      return <ReportPage/>
    case CONSTANTS.DASHBOARD.TRYOUT:
      return <TryOutPage/>
    default:
      return <MaterialPage />
  }
}

const Index = ({auth, userId}) => {
    if(auth.user)
      return(
        <NavBar auth={auth}>
          <Body />
        </NavBar>
      )
    else
      return(
        <span>
          <Link href="./signin"><a>Sign in here</a></Link>
        </span>
      )
}

Index.getInitialProps = authInitialProps();

export default Index;