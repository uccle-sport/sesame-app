import { createSlice, PayloadAction} from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

const params: URLSearchParams | undefined = new URLSearchParams(window.location.href.split("?")[1])

const pathHasIds = window.location.href.match(/https?:\/\/.+?\/([a-fA-F0-9-]{36})\/(.+?)\/?$/);
const secretFromPath = pathHasIds ? pathHasIds[2] : undefined
const uuidFromPath = pathHasIds ? pathHasIds[1] : undefined

const secret = secretFromPath ?? params?.get('secret') ?? localStorage.getItem('sesame.secret')
const deviceUuid = uuidFromPath ?? params?.get('uuid') ?? localStorage.getItem('sesame.device.uuid')
const name = params?.get('name') ?? localStorage.getItem('sesame.name')
const phoneNumber = params?.get('phoneNumber') ?? localStorage.getItem('sesame.phone.number')
const phoneUuid = params?.get('phone_uuid') ?? localStorage.getItem('sesame.phone.uuid') ?? uuid()

secret && localStorage.setItem('sesame.secret', secret)
deviceUuid && localStorage.setItem('sesame.device.uuid', deviceUuid)
name && localStorage.setItem('sesame.name', name)
phoneNumber && localStorage.setItem('sesame.phone.number', phoneNumber)
localStorage.setItem('sesame.phone.uuid', phoneUuid)

const root = window.location.href.replace(/(https?:\/\/.+?)\/.+/, '$1');
const manifestUrl = URL.createObjectURL(new Blob([JSON.stringify(
    {
        short_name: "Sésame",
        name: "Sésame bike shed remote",
        icons: [
            {
                src: `${root}/android-chrome-192x192.png`,
                type: "image/png",
                sizes: "192x192"
            },
            {
                src: `${root}/android-chrome-512x512.png`,
                type: "image/png",
                sizes: "512x512"
            },
            {
                src: `${root}/apple-touch-icon.png`,
                type: "image/png",
                sizes: "180x180"
            },
            {
                src: `${root}/favicon.ico`,
                sizes: "48x48",
                type: "image/x-icon"
            },
            {
                src: `${root}/favicon-16x16.png`,
                sizes: "16x16",
                type: "image/png",
            },
            {
                src: `${root}/favicon-32x32.png`,
                sizes: "32x32",
                type: "image/png",
            }
        ],
        start_url: `${root}/${deviceUuid}/${secret}`,
        display: "standalone",
        orientation: "portrait",
        theme_color: "#000000",
        background_color: "#ffffff"
    }, null, ' ')], {type: 'application/json'}))


export interface AppState {
    name: string
    phoneNumber: string
    phoneUuid: string
    secret?: string
    deviceUuid?: string
    registrationRequestId?: string
    waitingForValidation: boolean
    mustSendRegistration: boolean
    status: { open: boolean, closed: boolean, closing: boolean, opening: boolean }
    manifestUrl: string
}

const initialState = {
    name,
    phoneNumber,
    phoneUuid,
    secret,
    deviceUuid,
    waitingForValidation: false,
    status: {open: false, closed: false, closing: false, opening: false},
    manifestUrl
} as AppState

export const app = createSlice({
    name: 'app',
    initialState,
    reducers: {
        startRegistrationProcess: (state, { payload: { processId, name, phoneNumber} }: PayloadAction<{ processId: string, name: string, phoneNumber: string }>) => {
            state.registrationRequestId = processId
            state.name = name
            state.phoneNumber = phoneNumber
            state.mustSendRegistration = true

            name && localStorage.setItem('sesame.name', name)
            phoneNumber && localStorage.setItem('sesame.phone.number', phoneNumber)
        },
        updateRegistration: (state, { payload: { name } }: PayloadAction<{ name: string }>) => {
            state.registrationRequestId = undefined
            state.name = name
            state.mustSendRegistration = true
            name && localStorage.setItem('sesame.name', name)
        },
        registrationProcessWaitingForValidation: (state) => {
            state.waitingForValidation = true
            state.mustSendRegistration = false
        },
        cancelRegistrationProcess: (state) => {
            state.registrationRequestId = undefined
            state.waitingForValidation = false
        },
        setAppStatus(state, { payload: { open, closed, closing, opening } }: PayloadAction<{open: boolean, closed: boolean, closing: boolean, opening: boolean }>) {
            state.status = { open, closed, closing, opening }
        }
    }
})

export const { startRegistrationProcess, updateRegistration, cancelRegistrationProcess, registrationProcessWaitingForValidation, setAppStatus } = app.actions
