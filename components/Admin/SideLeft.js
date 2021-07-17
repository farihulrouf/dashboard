


import InfoIcon from '@material-ui/icons/Info';
import ListItems from './ListItems'

import Link from '@material-ui/core/Link';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';

import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

export default function SideLeft(){
    const sideNavdatas = [
        {
            imgSrc: <AccountCircleOutlinedIcon />,
            imgAlt: "Information",
            title: "User Information",
            "urlPath": "/admin-dashboard/users"
        },
        
        {
            imgSrc: <PaymentIcon />,
            imgAlt: "student",
            title: "Payment Information",
            "urlPath": "/admin-dashboard/payment"
        }
    ]    

   return (

        <div className="sidebar">
             
             {sideNavdatas.map((sideNavdata,index) =>(
                  <ListItems
                    key={index}
                    data={sideNavdata}
                    >          
                   </ListItems>
              ))}
       

        </div>
      
    ) 
}
