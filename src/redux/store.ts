import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './reducers'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import {apiRtk} from "./query";

/**
 * ## configureStore
 * @param {Object} the state
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiRtk.middleware, thunk, logger),
})
export type AppDispatch = typeof store.dispatch
