
import Navbar from './Navbar'
import SideLeft from './SideLeft'


export default function Layout({ children }) {
    return(
        <div>
       		<Navbar />
              {children}
       		<SideLeft />
        </div>
    )
}