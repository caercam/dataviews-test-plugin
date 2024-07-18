import { createRoot } from '@wordpress/element';

import App from './App';

const root = document.getElementById( 'dataviews-test' );

root && createRoot( root ).render( <App /> );