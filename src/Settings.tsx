import React, {useEffect, useState} from 'react';
import QRCode from "react-qr-code";

import './App.css';
import Layout from "./Layout";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import {useRegisterMutation, useRegisterAndValidateMutation, useRightsQuery} from "./redux/query";
import {v4 as uuid} from 'uuid'
import {registrationProcessWaitingForValidation, startRegistrationProcess, updateRegistration} from "./redux/app";
import {useNavigate} from "react-router";
import {checkCircle,userCircle,hashtag} from "./icons"

function Settings() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { name: nameFromState, phoneNumber, mustSendRegistration, registrationRequestId, deviceUuid, secret } = useAppSelector((state) => state.app)
    const { data: rights } = useRightsQuery()
    const [ delay, setDelay ] = useState(0)
    const [ openUntil, setOpenUntil ] = useState(new Date())
    const [ phone, setPhone ] = useState(phoneNumber)
    const [ name, setName ] = useState(nameFromState)
    const [ phoneMissing, setPhoneMissing ] = useState(false)
    const [ register, { data: registration, isLoading: registrationIsLoading }] = useRegisterMutation()
    const [ registerAndValidate, { data: validatedRegistration }] = useRegisterAndValidateMutation()

    const twoDigits = (n:number) => n<10?'0'+n:''+n

    useEffect(() => {
        setOpenUntil(new Date(+new Date() + delay * 60 * 1000))
    }, [delay])

    const submit = () => {
        const isPhoneOk = phone && phone.length > 6 && phone.match(/\+?[0-9 .-/]+/)
        setPhoneMissing(!isPhoneOk)
        if (isPhoneOk) {
            if (rights && !rights.confirmed) {
                dispatch(startRegistrationProcess({processId: uuid(), name, phoneNumber: phone}))
            } else {
                dispatch(updateRegistration({name}))
            }
        }
    }

    useEffect(() => {
        if (mustSendRegistration) {
            if (registrationRequestId) {
                registerAndValidate(registrationRequestId)
            } else {
                register()
            }
        }
    }, [mustSendRegistration])

    useEffect(() => {
        if (validatedRegistration) {
            dispatch(registrationProcessWaitingForValidation())
            navigate('/validate')
        }
    }, [validatedRegistration])

    return (
        <Layout>
            <div id="settings" className="bottom-0 left-0 w-screen flex flex-col h-full pt-2">
                <div className="mx-8 text-sm text-justify"
                     hidden={!!phoneNumber}>Please fill in the information
                    below.<br/> Be sure to double check your phone number as it will be used to send your validation
                    code.
                </div>
                <div className="mx-8 text-sm text-justify"
                     hidden={!!phoneNumber && (!rights || rights.confirmed)}>Your phone number has not been confirmed. Please double check the information below and press the validate button.
                </div>
                <form className="flex dlex-auto mt-4 px-8 flex-col w-full">
                    <div className="relative flex w-full flex-wrap items-stretch mb-3">
                        <input id="name" name="name" type="text" placeholder="Name" value={name}
                               onChange={(e) => setName(e.target.value)}
                               className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full pr-10"/>
                        <span
                            className="z-10 h-full leading-snug absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">{userCircle()}</span>
                    </div>
                    <div className="relative flex w-full flex-wrap items-stretch mb-3">
                        <input id="phone" name="phone" type="tel"
                               style={phoneMissing ? {borderColor: 'darkred', borderWidth: '2px'} : {}}
                               readOnly={!!phoneNumber} placeholder="Phone number" value={phone}
                               onChange={(e) => setPhone(e.target.value)}
                               className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full pr-10"/>
                        <span
                            className="z-10 h-full leading-snug absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">{hashtag()}</span>
                    </div>
                    <button id="button" disabled={registrationIsLoading}
                            className="flex flex-nowrap mt-4 mb-1 mx-auto justify-center w-48 bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                            type="button" onClick={() => submit()}>
			            <span className="mr-4 my-auto">{checkCircle()}</span>
                        <span className="pt-0.5" id="button-label">{!phoneNumber?'Submit':(rights && !rights.confirmed)?'Validate':'Update'}</span>
                    </button>
                </form>
                <h1 hidden={!rights || !rights.canLock} className="px-9 py-4 mt-8 mb-4 bg-primary-content">Advanced</h1>
                <div hidden={!rights || !rights.canLock}>
                    <div className="mx-8 flex flex-nowrap items-center">
                        <label className="label cursor-pointer">
                            <input type="checkbox" checked={!!delay} className="checkbox checkbox-primary"
                                   onChange={(e) => setDelay(e.target.checked ? 5 : 0)}/>
                            <span
                                className="nowrap grow-2 mr-2 text-sm whitespace-nowrap pl-2">Keep shed open until </span>
                        </label>
                        <input hidden={!delay} type="range" min="1" max="120" value={delay}
                               onChange={(e) => setDelay(parseInt(e.target.value))}
                               className="flex-auto range range-primary"/>
                        <div hidden={!delay}
                             className="nowrap grow-2 text-sm whitespace-nowrap ml-2">{twoDigits(openUntil.getHours()) + ':' + twoDigits(openUntil.getMinutes())}</div>
                    </div>
                </div>
                <h1 className="px-9 py-4 mt-4 mb-4 bg-primary-content">Share access</h1>
                <div className="self-center h-full pt-4">
                    <QRCode size={200}
                            value={window.location.href.replace(/(https?:\/\/.+?)\/.*/, "$1") + `?uuid=${deviceUuid}&secret=${secret}`}/>
                </div>
            </div>
        </Layout>
    );
}

export default Settings;
