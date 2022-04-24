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
import {useTranslation} from "react-i18next";

function Settings() {
    const { t }: { t: (key: string) => string } = useTranslation()

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
                //Normalise
                const normalisedPhone = phone
                    .replace(/[^+0-9]/g, '')
                    .replace(/^04([0-9]{2})([0-9]{3})([0-9]{3})/, '+32 4$1 $2 $3')
                    .replace(/^06([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})/, '+33 6 $1 $2 $3 $4')
                dispatch(startRegistrationProcess({processId: uuid(), name, phoneNumber: normalisedPhone}))
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
                     hidden={!!phoneNumber}>{t('Settings.info-1')}<br/> {t('Settings.info-2')}
                </div>
                <div className="mx-8 text-sm text-justify"
                     hidden={!phoneNumber || (!rights || rights.confirmed)}>{t('Settings.info-3')}
                </div>
                <form className="flex dlex-auto mt-4 px-8 flex-col w-full">
                    <div className="relative flex w-full flex-wrap items-stretch mb-3">
                        <input id="name" name="name" type="text" placeholder={t('Settings.name')} value={name}
                               onChange={(e) => setName(e.target.value)}
                               className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full pr-10"/>
                        <span
                            className="z-10 h-full leading-snug absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">{userCircle()}</span>
                    </div>
                    <div className="relative flex w-full flex-wrap items-stretch mb-3">
                        <input id="phone" name="phone" type="tel"
                               style={phoneMissing ? {borderColor: 'darkred', borderWidth: '2px'} : {}}
                               readOnly={!!phoneNumber && rights && rights.confirmed} placeholder={t('Settings.mobile-phone')} value={phone}
                               onChange={(e) => setPhone(e.target.value)}
                               className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full pr-10"/>
                        <span
                            className="z-10 h-full leading-snug absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">{hashtag()}</span>
                    </div>
                    <button id="button" disabled={registrationIsLoading}
                            className="flex flex-nowrap mt-4 mb-1 mx-auto justify-center bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                            type="button" onClick={() => submit()}>
			            <span className="mr-4 my-auto">{checkCircle()}</span>
                        <span className="pt-0.5" id="button-label">{(!phoneNumber||mustSendRegistration)?t('Settings.submit'):(rights && !rights.confirmed)?t('Settings.validate'):t('Settings.update')}</span>
                    </button>
                </form>
                <h1 hidden={!rights || !rights.canLock} className="px-9 py-4 mt-8 mb-4 bg-primary-content">{t('Settings.advanced')}</h1>
                <div hidden={!rights || !rights.canLock}>
                    <div className="mx-8 flex flex-nowrap items-center">
                        <label className="label cursor-pointer">
                            <input type="checkbox" checked={!!delay} className="checkbox checkbox-primary"
                                   onChange={(e) => setDelay(e.target.checked ? 5 : 0)}/>
                            <span
                                className="nowrap grow-2 mr-2 text-sm whitespace-nowrap pl-2">{t('Settings.keep-open')} </span>
                        </label>
                        <input hidden={!delay} type="range" min="1" max="120" value={delay}
                               onChange={(e) => setDelay(parseInt(e.target.value))}
                               className="flex-auto range range-primary"/>
                        <div hidden={!delay}
                             className="nowrap grow-2 text-sm whitespace-nowrap ml-2">{twoDigits(openUntil.getHours()) + ':' + twoDigits(openUntil.getMinutes())}</div>
                    </div>
                </div>
                <h1 className="px-9 py-4 mt-4 mb-4 bg-primary-content">{t('Settings.give-access')}</h1>
                <div className="self-center h-full pt-4">
                    <QRCode size={200}
                            value={window.location.href.replace(/(https?:\/\/.+?)\/.*/, "$1") + `/${deviceUuid}/${secret}`}/>
                </div>
            </div>
        </Layout>
    );
}

export default Settings;
