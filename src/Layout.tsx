import React, {useEffect} from 'react';
import './App.css';
import {useNavigate} from "react-router";
import {useAppSelector} from "./redux/hooks";
import {useRightsQuery} from "./redux/query";
import {useTranslation} from "react-i18next";

function Layout(props: {children: JSX.Element}) {
    const { t }: { t: (key: string) => string } = useTranslation()
    const navigate = useNavigate()

    const { phoneNumber, secret, deviceUuid, waitingForValidation } = useAppSelector((state) => state.app)
    const { data: rights } = useRightsQuery()

    useEffect(() => {
        if (!secret || ! deviceUuid) {
            navigate('/noconfig')
        } else if (!phoneNumber || (rights && !rights.confirmed && !waitingForValidation)) {
            navigate('/settings')
        }
    }, [phoneNumber, secret, deviceUuid, rights, waitingForValidation] )

  return (
<div className="flex flex-col bg-white h-full">
    <div className="flex flex-wrap items-center justify-between px-2 py-3 bg-primary">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
            <div className="flex justify-between w-auto px-4">
                <button
                    className="text-md min-w-fit font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
                    onClick={() => navigate(`/${deviceUuid}/${secret}`)}>
                    {t('Header.sesame')}
                </button>
            </div>
            <div className="flex flex-grow items-center" id="example-navbar-warning">
                <button
                    className="text-md min-w-fit ml-auto flex items-center uppercase font-bold leading-snug text-white hover:opacity-75 active:opacity-50"
                    onClick={() => navigate('/settings')}>
                    {t('Header.settings')}
                </button>
            </div>
        </div>
    </div>
    <div className="flex-auto overflow-hidden text-info">{props.children}</div>
</div>
  );
}

export default Layout;
