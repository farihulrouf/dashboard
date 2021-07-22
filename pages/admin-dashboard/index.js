import { authInitialProps } from '../../lib/auth';
import Link from 'next/link';

import Layout from '../../components/admin/Layout';

function admindashbboard() {
	return <Layout />;
}

admindashbboard.getInitialProps = authInitialProps(true);

export default admindashbboard;
