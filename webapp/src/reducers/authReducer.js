import {
  LOGIN_REQUEST,
  LOGIN_REQUEST_SUCCESSFUL,
  LOGIN_REQUEST_FAILED,
} from '../actions/auth/types'

const initialState = {
  access_token: null,
  refresh_token: null,
}

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
      }
    case LOGIN_REQUEST_SUCCESSFUL:
      return {
        ...state,
        access_token: action.payload.access_token,
        refresh_token: action.payload.refresh_token,
      }
    case LOGIN_REQUEST_FAILED:
      return {
        ...state,
        access_token: null,
        refresh_token: null,
      }
    default:
      return state
  }
}
