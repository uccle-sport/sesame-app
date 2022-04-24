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
import NoConfig from "./NoConfig";
import SesameHelmet from "./SesameHelmet";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <SesameHelmet />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/:deviceUuid/:secret" element={<App/>}/>
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
