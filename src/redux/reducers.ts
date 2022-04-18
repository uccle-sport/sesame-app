import { combineReducers } from 'redux'
import { app } from './app'
import {apiRtk} from "./query";

/**
 * ## CombineReducers
 *
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */

export const rootReducer = combineReducers({
  app: app.reducer,
  api: apiRtk.reducer
})
export type RootState = ReturnType<typeof rootReducer>
