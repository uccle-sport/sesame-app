import { configureStore } from '@reduxjs/toolkit'
import {rootReducer, RootState} from './reducers'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import {apiRtk, connect} from "./query";

/**
 * ## configureStore
 * @param {Object} the state
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiRtk.middleware, thunk, store => next => action => {
    const followUp = next(action);
    const state = store.getState()
    if (state.app.deviceUuid && state.app.secret && state.app.phoneUuid) {
      connect(state.app.deviceUuid, state.app.secret, state.app.phoneUuid, store.dispatch)
    }
    return followUp  }),
})

const state = store.getState()
if (state.app.deviceUuid && state.app.secret && state.app.phoneUuid) {
  connect(state.app.deviceUuid, state.app.secret, state.app.phoneUuid, store.dispatch)
}


export type AppDispatch = typeof store.dispatch
