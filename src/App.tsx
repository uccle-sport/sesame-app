import React, {useEffect, useState, useTransition} from 'react';
import './App.css';
import Layout from "./Layout";
// @ts-ignore
import background from "./img/bg.jpeg";
import {useCloseMutation, useOpenMutation, usePingQuery} from "./redux/query";
import {useAppSelector} from "./redux/hooks";
import {home} from "./icons"
import {useTranslation} from "react-i18next";

function App() {
    const { t }: { t: (key: string) => string } = useTranslation()
    const pingData = useAppSelector((state) => state.app.status)
    const [ dynProgress, setDynProgress ] = useState(0)
    const { open, closed, closing, opening } = (pingData ?? { open: false, closed: false, closing: false, opening: false })
    const [ openDoor ] = useOpenMutation()
    const [ closeDoor ] = useCloseMutation()
    const progress = closed ? '100%' : open ? '0' : `${dynProgress}%`

    const message = open ? t('Main.open') :
        closed ? t('Main.closed') :
            opening ? t('Main.opening') :
                closing ? t('Main.closing') :
                    t('Main.unknown')

    const buttonLabel = open ? t('Main.closeShed') :
        closed ? t('Main.openShed') :
            t('Main.waiting')

    useEffect(() => {
        if (opening) {
            setDynProgress(99)
        } else if (closing) {
            setDynProgress(1)
        }
    }, [opening, closing])

    useEffect(() => {
        if (opening && dynProgress>0) {
            setTimeout(() => setDynProgress(dynProgress-1), 400)
        } else if (closing && dynProgress<100) {
            setTimeout(() => setDynProgress(dynProgress+1), 400)
        }
    }, [dynProgress])

    const toggle = () => {
        if (open) { closeDoor() }
        if (closed) { openDoor() }
    }

    return (
        <Layout>
            <div id="main" className="flex flex-col h-full justify-center bg-white">
                <div className="w-full mt-4 flex-1 text-center bg" style={{backgroundImage: `url(${background})`, backgroundSize: "contain", backgroundRepeat: 'no-repeat', backgroundPosition: 'center bottom'}} ><span className="text-lg">{t('Main.welcome')}<br/>{t('Main.subtitle')}</span>
                </div>
                <div id="status" className="mx-auto grow-1 text-center mt-2">{message}</div>
                <div className="relative pt-1 px-16 grow-1 py-4 my-2">
                    <div className="overflow-hidden h-5 mb-4 text-xs flex rounded-lg bg-pink-200">
                        <div id="progress" style={{width: (!pingData?'100%':progress)}} className={`${!pingData?'indeterminate ':''}shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500`}/>
                    </div>
                </div>
                <div className="mx-auto grow-1 mb-24">
                    <button id="button"
                            className={
                        `flex flex-nowrap justify-center items-center text-white font-bold uppercase text-sm px-6 py-3 rounded-full shadow outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${open || closed ? 'bg-pink-500 active:bg-pink-600 hover:shadow-lg' : 'bg-pink-200'}`}
                            type="button" disabled={!open && !closed} onClick={() => toggle()}>
			<span className="mr-4 my-auto">{home()}</span>
                        <span id="button-label">{buttonLabel}</span>
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default App;
