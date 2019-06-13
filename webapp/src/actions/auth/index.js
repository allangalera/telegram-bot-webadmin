import { LOGIN_REQUEST } from './types'

export const loginAttempt = payload => {
  return {
    type: LOGIN_REQUEST,
    payload: payload,
  }
}
