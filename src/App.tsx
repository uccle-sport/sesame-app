import React, {useEffect, useState} from 'react';
import './App.css';
import Layout from "./Layout";
// @ts-ignore
import background from "./img/bg.jpeg";
import {useCloseMutation, useOpenMutation, usePingQuery} from "./redux/query";
import {useAppSelector} from "./redux/hooks";

function App() {
    const pingData = useAppSelector((state) => state.app.status)
    const [ dynProgress, setDynProgress ] = useState(0)
    const { open, closed, closing, opening } = (pingData ?? { open: false, closed: false, closing: false, opening: false })
    const [ openDoor ] = useOpenMutation()
    const [ closeDoor ] = useCloseMutation()
    const progress = closed ? '100%' : open ? '0' : `${dynProgress}%`

    const message = open ? 'The bike shed is open' :
        closed ? 'The bike shed is closed' :
            opening ? 'The bike shed is opening' :
                closing ? 'The bike shed is closing' :
                    'The status of the bike shed is unknown'

    const buttonLabel = open ? 'Close' :
        closed ? 'Open' :
            'Please wait'

    useEffect(() => {
        if (opening) {
            setDynProgress(99)
        } else if (closing) {
            setDynProgress(1)
        }
    }, [opening, closing])

    useEffect(() => {
        if (opening && dynProgress>0) {
            setTimeout(() => setDynProgress(dynProgress-1), 600)
        } else if (closing && dynProgress<100) {
            setTimeout(() => setDynProgress(dynProgress+1), 600)
        }
    }, [dynProgress])

    const toggle = () => {
        if (open) { closeDoor() }
        if (closed) { openDoor() }
    }

    return (
        <Layout>
            <div id="main" className="flex flex-col h-full justify-center bg-white">
                <div className="w-full mt-8 flex-1 text-center bg" style={{backgroundImage: `url(${background})`, backgroundSize: "contain", backgroundRepeat: 'no-repeat', backgroundPosition: 'center bottom'}} ><span className="text-lg">Welcome to Sésame<br/>The bike shed remote control.</span>
                </div>
                <div id="status" className="mx-auto py-4 grow-1 text-center my-2">{message}</div>
                <div className="relative pt-1 px-16 grow-1 py-4 my-2">
                    <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-pink-200">
                        <div id="progress" style={{width: (!pingData?'100%':progress)}} className={`${!pingData?'indeterminate ':''}shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500`}/>
                    </div>
                </div>
                <div className="mx-auto grow-1 mb-8">
                    <button id="button"
                            className={
                        `flex flex-nowrap justify-center w-48 text-white font-bold uppercase text-sm px-6 py-3 rounded-full shadow outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${open || closed ? 'bg-pink-500 active:bg-pink-600 hover:shadow-lg' : 'bg-pink-200'}`}
                            type="button" disabled={!open && !closed} onClick={() => toggle()}>
			<span className="mr-4 my-auto"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img"
                                                width="1em"
                                                height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><path
                d="M16 9.226l-8-6.21l-8 6.21V6.694l8-6.21l8 6.21zM14 9v6h-4v-4H6v4H2V9l6-4.5z"
                fill="currentColor"/></svg></span>
                        <span id="button-label">{buttonLabel}</span>
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default App;
