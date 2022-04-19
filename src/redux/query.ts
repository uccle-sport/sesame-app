import { io, Socket } from "socket.io-client";
import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {AppState, cancelRegistrationProcess, setAppStatus} from "./app";
import {AppDispatch} from "./store";

let socket: Socket | undefined = undefined
let socketFingerPrint: string = undefined

const MESSAGE_HOST = "https://msg-gw.icure.cloud"
const PROCESS_ID = "91c91afa-565c-4773-bb9d-93b925bb3ee7"
const UUID = 'a58afe0e-02dc-431b-8155-0351140099e4';

function getError(e: FetchBaseQueryError): FetchBaseQueryError & { message?: string } {
    const err = e as any
    return { status: err.status, originalStatus: err.originalStatus, error: err.error, message: err.message }
}

const guard = async <T>(guardedInputs: unknown[], lambda: () => Promise<T>): Promise<{ error: FetchBaseQueryError & { message?: string } } | { data: T | undefined }> => {
    if (guardedInputs.some((x) => !x)) {
        return { data: undefined }
    }
    try {
        const res = await lambda()
        return { data: (Array.isArray(res) ? res.map((x) => ({ ...x })) : { ...res }) as T }
    } catch (e) {
        return { data: undefined, error: getError(e as FetchBaseQueryError) }
    }
}

function ping(secret: string, deviceUuid: string, phoneUuid: string): Promise<{
    connected: boolean,
    lastEvent: number | undefined,
    opening: boolean,
    closing: boolean,
    open: boolean,
    closed: boolean
}> {
    return new Promise((resolve, reject) => {
        if (!socket) {
            reject('no connection');
            return
        }
        socket.emit('ping', {token: secret, uuid: deviceUuid, pid: phoneUuid}, (resp: any) => {
            console.log(JSON.stringify(resp, null, ' '));
            if (resp.status === 200) {
                const r = resp.response
                const ev = (r.events && r.events.length && r.events[r.events.length - 1] || undefined) as { date: string } | undefined
                resolve({
                    connected: true,
                    lastEvent: +(ev?.date ?? 0),
                    opening: r.opening ?? false,
                    closing: r.closing ?? false,
                    open: r.open ?? false,
                    closed: r.closed ?? false
                })
            } else {
                reject(resp)
            }
        })
    });
}

export const connect = (uuid: string, token: string, pid: string, dispatch: AppDispatch) => {
    if (uuid && token && pid && socketFingerPrint !== `${uuid}:${pid}:${token}`) {
        socketFingerPrint = `${uuid}:${pid}:${token}`
        socket && socket.disconnect()
        socket = window.location.href.includes('localhost') ? io('http://localhost:5000', {
            query: {
                uuid,
                pid,
                token
            }
        }) : io({query: {uuid, pid, token}})
        if (socket) {
            socket.on('notify', (msg) => {
                dispatch(setAppStatus(msg))
            })
            const thisSocket = socket
            const refreshStatus = () => {
                ping(token, uuid, pid).then((res) => {
                    dispatch(setAppStatus(res))
                })
                if (thisSocket === socket) {
                    setTimeout(() => refreshStatus(), 60000)
                }
            }
            refreshStatus()
        }
    }
}

export const apiRtk = createApi({
    reducerPath: 'api',
    tagTypes: ['Api'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${MESSAGE_HOST}/rus`
    }),
    endpoints: (build) => ({
        completeProcess: build.mutation<string,{requestId: string, validationCode: string}>({
            query: ({requestId, validationCode}) => ({
                url:`/process/validate/${requestId}-${validationCode}`,
                responseHandler: 'text'
            })
        }),
        ping: build.query<{ connected: boolean, lastEvent?: number, opening: boolean, closing: boolean, closed: boolean, open: boolean }|undefined, void>({
            async queryFn(arg, { getState }) {
                const { secret, deviceUuid, phoneUuid } = (getState() as { app: AppState }).app
                return guard([], () => ping(secret, deviceUuid, phoneUuid))
            }
        }),
        rights: build.query<{ canLock: boolean, confirmed: boolean }|undefined, void>({
            async queryFn(arg, { getState }) {
                const { secret, deviceUuid, phoneUuid } = (getState() as { app: AppState }).app
                return guard([], () => new Promise<{canLock: boolean, confirmed: boolean}>((resolve, reject) => {
                    if (!socket) { reject('no connection'); return }
                    socket.emit('rights', {token: secret, uuid: deviceUuid, pid: phoneUuid}, (resp: { status: number, response: { canLock: boolean, confirmed: boolean } }) => {
                        console.log(JSON.stringify(resp, null, ' '));
                        if (resp.status === 200) {
                            resolve(resp.response)
                        } else {
                            reject(resp)
                        }
                    })
                }))
            }
        }),
        open: build.mutation<boolean|undefined, void>({
            async queryFn(arg, { getState }) {
                const { secret, deviceUuid, phoneUuid } = (getState() as { app: AppState }).app
                return guard([], () => new Promise((resolve, reject) => {
                    if (!socket) { reject('no connection'); return }
                    socket.emit('open', {token: secret, uuid: deviceUuid, pid: phoneUuid}, (resp: any) => {
                        console.log(JSON.stringify(resp, null, ' '));
                        if (resp.status === 200) {
                            resolve(true)
                        } else {
                            reject(resp)
                        }
                    })
                }))
            }
        }),
        close: build.mutation<boolean|undefined, void>({
            async queryFn(arg, { getState }) {
                const { secret, deviceUuid, phoneUuid } = (getState() as { app: AppState }).app
                return guard([], () => new Promise((resolve, reject) => {
                    if (!socket) { reject('no connection'); return }
                    socket.emit('close', {token: secret, uuid: deviceUuid, pid: phoneUuid}, (resp: any) => {
                        console.log(JSON.stringify(resp, null, ' '));
                        if (resp.status === 200) {
                            resolve(true)
                        } else {
                            reject(resp)
                        }
                    })
                }))
            }
        }),
        keepOpen: build.mutation<boolean|undefined, number>({
            async queryFn(arg, { getState }) {
                const { secret, deviceUuid, phoneUuid } = (getState() as { app: AppState }).app
                return guard([], () => new Promise((resolve, reject) => {
                    if (!socket) { reject('no connection'); return }
                    socket.emit('keepOpen', {token: secret, uuid: deviceUuid, pid: phoneUuid}, (resp: any) => {
                        console.log(JSON.stringify(resp, null, ' '));
                        if (resp.status === 200) {
                            resolve(true)
                        } else {
                            reject(resp)
                        }
                    })
                }))
            }
        }),
        registerAndValidate: build.mutation<boolean|undefined, string>({
            async queryFn(requestId, { getState, dispatch }) {
                const { secret, deviceUuid, phoneUuid, phoneNumber, name } = (getState() as { app: AppState }).app
                return guard([], () => new Promise((resolve, reject) => {
                    if (!socket) { reject('no connection'); return }
                    socket.emit('registerPid', {token: secret, uuid: deviceUuid, pid: phoneUuid, phone: phoneNumber, name}, (resp: any) => {
                        console.log(JSON.stringify(resp, null, ' '));
                        if (resp.status === 200) {
                            fetch (`${MESSAGE_HOST}/rus/process/${PROCESS_ID}/${requestId}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({deviceUuid, pid: phoneUuid, name, 'g-recaptcha-response': UUID ,from: phoneNumber.replace(/[^+0-9]/g,'')})}).then((r) => {
                                if (r.status === 200) {
                                    resolve(true)
                                } else {
                                    dispatch(cancelRegistrationProcess())
                                    reject('Cannot access message server')
                                }
                            }).catch((e) => {
                                dispatch(cancelRegistrationProcess())
                                reject('Cannot access message server: ' + e);
                            })
                        } else {
                            dispatch(cancelRegistrationProcess())
                            reject(resp)
                        }
                    })
                }))
            }
        }),
        register: build.mutation<boolean|undefined, void>({
            async queryFn(arg, { getState, dispatch }) {
                const { secret, deviceUuid, phoneUuid, phoneNumber, name } = (getState() as { app: AppState }).app
                return guard([], () => new Promise((resolve, reject) => {
                    if (!socket) { reject('no connection'); return }
                    socket.emit('registerPid', {token: secret, uuid: deviceUuid, pid: phoneUuid, phone: phoneNumber, name}, (resp: any) => {
                        console.log(JSON.stringify(resp, null, ' '));
                        if (resp.status === 200) {
                            resolve(true)
                        } else {
                            dispatch(cancelRegistrationProcess())
                            reject(resp)
                        }
                    })
                }))
            }
        }),
    }),

})

export const { useOpenMutation, useCloseMutation, useRegisterMutation, useRegisterAndValidateMutation, useCompleteProcessMutation, usePingQuery, useRightsQuery, useKeepOpenMutation } = apiRtk
