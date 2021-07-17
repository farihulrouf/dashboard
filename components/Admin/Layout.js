
//import Link from 'next/link'
import Navbar from './Navbar'
import SideLeft from './SideLeft'




const Layout = ({ children }) => (
  
        <div>
       		<Navbar />
              {children}
       		<SideLeft />
        </div>
    
)
export default  Layout
