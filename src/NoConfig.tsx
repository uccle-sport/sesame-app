import React from 'react';
import './App.css';
import Layout from "./Layout";

function NoConfig() {
    return (
        <Layout>
            <h1 className="my-auto mx-8">Sésame is not configured correctly or the configuration has been lost. Please scan the invitation QR code to fix the application.</h1>
        </Layout>
    );
}

export default NoConfig;
