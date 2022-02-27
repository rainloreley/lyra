import React from 'react';
import type {AppProps} from 'next/app';

import '../styles/globals.css';
import AppControlProvider from '../components/appContextProvider';

function MyApp({Component, pageProps}: AppProps) {
    return (
        <React.Fragment>
            <AppControlProvider>
                <Component {...pageProps} />
            </AppControlProvider>
        </React.Fragment>
    );
}

export default MyApp;
