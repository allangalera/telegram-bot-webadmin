import { authReducer } from './authReducer'
import { userReducer } from './userReducer'
import { combineReducers } from 'redux'

export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
})
