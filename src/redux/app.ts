import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'
import {io, Socket} from "socket.io-client";

const params: URLSearchParams | undefined = new URLSearchParams(window.location.href.split("?")[1])

const secret = params?.get('secret') ?? localStorage.getItem('sesame.secret')
const deviceUuid = params?.get('uuid') ?? localStorage.getItem('sesame.device.uuid')
const name = params?.get('name') ?? localStorage.getItem('sesame.name')
const phoneNumber = params?.get('phoneNumber') ?? localStorage.getItem('sesame.phone.number')
const phoneUuid = params?.get('phone_uuid') ?? localStorage.getItem('sesame.phone.uuid') ?? uuid()

secret && localStorage.setItem('sesame.secret', secret)
deviceUuid && localStorage.setItem('sesame.device.uuid', deviceUuid)
name && localStorage.setItem('name', name)
phoneNumber && localStorage.setItem('phoneNumber', phoneNumber)
localStorage.setItem('sesame.phone.uuid', phoneUuid)

export interface AppState {
    name: string
    phoneNumber: string
    phoneUuid: string
    secret?: string
    deviceUuid?: string
    registrationRequestId?: string
    waitingForValidation: boolean
    mustSendRegistration: boolean
}

const initialState = { name, phoneNumber, phoneUuid, secret, deviceUuid, waitingForValidation: false } as AppState
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
        registrationProcessWaitingForValidation: (state) => {
            state.waitingForValidation = true
            state.mustSendRegistration = false
        },
        cancelRegistrationProcess: (state) => {
            state.registrationRequestId = undefined
            state.waitingForValidation = false
        }

    }
})

export const { startRegistrationProcess, cancelRegistrationProcess, registrationProcessWaitingForValidation } = app.actions
