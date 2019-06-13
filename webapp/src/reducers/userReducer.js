import {
  LOGIN_ATTEMPT_SUCCESSFUL,
  LOGIN_ATTEMPT_FAILED,
} from '../actions/authActions'

const initialState = {
  username: null,
  first_name: null,
  last_name: null,
}

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_ATTEMPT_SUCCESSFUL:
      return {
        ...state,
        username: action.payload.username,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
      }
    case LOGIN_ATTEMPT_FAILED:
      return {
        username: null,
        first_name: null,
        last_name: null,
      }
    default:
      return state
  }
}
