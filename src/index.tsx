import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {Route, Routes} from "react-router";
import App from "./App";
import Settings from "./Settings";
import Validate from "./Validate";
import {store} from "./redux/store";
import {Helmet} from "react-helmet";
import NoConfig from "./NoConfig";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Helmet>
                <title>Sésame</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
                <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png"/>
                <link rel="manifest" href="./site.webmanifest"/>
            </Helmet>

            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                    <Route path="/validate" element={<Validate/>}/>
                    <Route path="/noconfig" element={<NoConfig/>}/>
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
