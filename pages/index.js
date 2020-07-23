
import NavBar from '../components/NavBar.js';
import { makeStyles } from '@material-ui/core/styles';
import CONSTANTS from '../components/constant';
import MaterialPage from './dashboard/material';
import ReportPage from './dashboard/report';
import TryOutPage from './dashboard/tryout';
import { authInitialProps } from "../lib/auth";
import Router from 'next/router';
import Link from 'next/link'

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
        <NavBar auth={auth}>
          <Body auth={auth} />
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