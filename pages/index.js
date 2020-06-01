
import NavBar from '../src/NavBar.js';
import { makeStyles } from '@material-ui/core/styles';
import CONSTANTS from '../src/constant';
import MaterialPage from './dashboard/material';
import ReportPage from './dashboard/report';
import TryOutPage from './dashboard/tryout';

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

const Index = ({active}) => {
    return(
      <NavBar>
        <Body />
      </NavBar>
    )
}

export default Index;