import React, {useEffect, useState} from 'react';
import './App.css';
import Layout from "./Layout";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import {useRegisterMutation} from "./redux/query";
import { v4 as uuid } from 'uuid'
import {registrationProcessWaitingForValidation, startRegistrationProcess} from "./redux/app";
import {useNavigate} from "react-router";
function Settings() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { name: nameFromState, phoneNumber, mustSendRegistration, registrationRequestId } = useAppSelector((state) => state.app)

    const [ phone, setPhone ] = useState(phoneNumber)
    const [ name, setName ] = useState(nameFromState)
    const [ phoneMissing, setPhoneMissing ] = useState(false)
    const [ register, { data: registration }] = useRegisterMutation()

    const submit = () => {
        const isPhoneOk = phone && phone.length > 6 && phone.match(/\+?[0-9 .-/]+/)
        setPhoneMissing(!isPhoneOk)
        if (isPhoneOk) {
            dispatch(startRegistrationProcess({processId: uuid(), name, phoneNumber: phone}))
        }
    }

    useEffect(() => {
        if (mustSendRegistration && registrationRequestId) {
            register(registrationRequestId)
        }
    }, [mustSendRegistration])

    useEffect(() => {
        if (registration) {
            dispatch(registrationProcessWaitingForValidation())
            navigate('/validate')
        }
    }, [registration])

    return (
        <Layout>
            <div id="settings"
                 className="bottom-0 left-0 w-screen pt-4 flex flex-col h-full">
                <div className="mx-8 text-sm text-justify" hidden={!!name && !!phoneNumber}>Please fill in the information below.<br /> Be sure to double check your phone number as it will be used to send your validation code.</div>
                <form className="flex dlex-auto mt-8 px-8 flex-col w-full">
                    <div className="relative flex w-full flex-wrap items-stretch mb-3">
                        <input id="name" name="name" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
                               className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full pr-10"/>
                        <span
                            className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="16" height="16" viewBox="0, 0, 16, 16">
  <g id="Layer_1">
    <path
        d="M15.68,8 C15.68,12.242 12.242,15.68 8,15.68 C3.758,15.68 0.32,12.242 0.32,8 C0.32,3.758 3.758,0.32 8,0.32 C12.242,0.32 15.68,3.758 15.68,8 z"
        fill-opacity="0" stroke="#000000" stroke-width="0.64" stroke-linecap="round" stroke-miterlimit="10"/>
    <path
        d="M9.579,11.369 C9.532,10.853 9.55,10.493 9.55,10.022 C9.783,9.899 10.202,9.118 10.273,8.458 C10.456,8.443 10.746,8.263 10.831,7.556 C10.876,7.176 10.695,6.962 10.584,6.895 C10.883,5.996 11.504,3.215 9.436,2.928 C9.223,2.554 8.678,2.365 7.97,2.365 C5.137,2.417 4.795,4.505 5.416,6.895 C5.306,6.962 5.124,7.176 5.169,7.556 C5.254,8.263 5.544,8.443 5.727,8.458 C5.798,9.117 6.233,9.899 6.467,10.022 C6.467,10.493 6.485,10.853 6.438,11.369 C6.035,12.454 3.962,12.539 2.767,13.585 C4.017,14.843 6.042,15.743 8.18,15.743 C10.317,15.743 12.83,14.056 13.248,13.595 C12.06,12.54 9.983,12.458 9.579,11.369 z"
        fill="#000000"/>
  </g>
</svg></span></div>
                    <div className="relative flex w-full flex-wrap items-stretch mb-3">
                        <input id="phone" name="phone" type="tel" style={phoneMissing?{borderColor: 'darkred', borderWidth: '2px'}:{}} readOnly={!!phoneNumber} placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)}
                               className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full pr-10"/>
                        <span
                            className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="16" height="16" viewBox="0, 0, 16, 16">
  <g id="Layer_1">
    <path
        d="M15,6.25 C15.414,6.25 15.75,5.914 15.75,5.5 C15.75,5.086 15.414,4.75 15,4.75 L12.125,4.75 L12.771,1.132 C12.844,0.724 12.573,0.334 12.165,0.262 C11.761,0.19 11.368,0.46 11.295,0.868 L10.602,4.75 L6.559,4.75 L7.205,1.132 C7.278,0.724 7.006,0.334 6.599,0.262 C6.195,0.19 5.802,0.46 5.729,0.868 L5.035,4.75 L1,4.75 C0.586,4.75 0.25,5.086 0.25,5.5 C0.25,5.914 0.586,6.25 1,6.25 L4.767,6.25 L4.142,9.75 L1,9.75 C0.586,9.75 0.25,10.086 0.25,10.5 C0.25,10.914 0.586,11.25 1,11.25 L3.875,11.25 L3.229,14.868 C3.156,15.276 3.427,15.665 3.835,15.738 C3.879,15.746 3.924,15.75 3.968,15.75 C4.324,15.75 4.64,15.495 4.705,15.132 L5.398,11.25 L9.441,11.25 L8.795,14.868 C8.722,15.276 8.994,15.665 9.401,15.738 C9.446,15.746 9.49,15.75 9.534,15.75 C9.891,15.75 10.207,15.495 10.271,15.132 L10.965,11.25 L15,11.25 C15.414,11.25 15.75,10.914 15.75,10.5 C15.75,10.086 15.414,9.75 15,9.75 L11.233,9.75 L11.858,6.25 L15,6.25 z M9.709,9.75 L5.666,9.75 L6.291,6.25 L10.334,6.25 L9.709,9.75 z"
        fill="#000000"/>
  </g>
</svg>
			</span>
                    </div>
                    <button id="button"
                            className="flex flex-nowrap mt-4 mb-1 mx-auto justify-center w-48 bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                            type="button" onClick={() => submit()}>
			<span className="mr-4 my-auto"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg></span>
                        <span className="pt-0.5" id="button-label">Submit</span>
                    </button>
                    <div className="self-center py-16">
                        <canvas id="qr" className="w-48 h-48"/>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default Settings;
