
//import Link from 'next/link'
import Navbar from './Navbar'
import SideLeft from './SideLeft'
import Link from 'next/link'

export default function Layout({ children }) {
    return(
        <div>
       		<Navbar />
              {children}
       		<SideLeft />
        </div>
    )
}