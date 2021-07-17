
import propTypes from 'prop-types'

import PaymentIcon from '@material-ui/icons/Payment';

import Link from 'next/link'
export default function ListItems(props) {
    
    return (

            <Link
                href={props.data.urlPath}
             >
                <a>     <div className="boxblue">
                        </div>
                        <div className="href-t">
                             {props.data.imgSrc}
                            <div className="a-text">
                                {props.data.title}
                            </div>
                        </div>
                        
                </a>
            </Link>
       
    )
}

ListItems.propTypes = {
    data: propTypes.object,
}