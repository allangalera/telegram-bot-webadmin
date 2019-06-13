import axios from 'axios'

import { loginAttempt } from './authActions'

export const SIKRIT_ATTEMPT = 'SIKRIT_ATTEMPT'
export const SIKRIT_ATTEMPT_SUCCESSFUL = 'SIKRIT_ATTEMPT_SUCCESSFUL'
export const SIKRIT_ATTEMPT_FAILED = 'SIKRIT_ATTEMPT_FAILED'

export const sikritAttempt = ({ access_token, refresh_token }) => {
  return async dispatch => {
    dispatch({
      type: SIKRIT_ATTEMPT,
      payload: {
        access_token,
      },
    })
    try {
      let res = await axios.post(
        `http://localhost:8080/auth/secret`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (res.status === 200) {
        dispatch({
          type: SIKRIT_ATTEMPT_SUCCESSFUL,
          payload: {
            message: res.data.message,
          },
        })
      } else {
        dispatch({
          type: SIKRIT_ATTEMPT_FAILED,
          payload: {
            message: 'deu ruim',
          },
        })
      }
    } catch (err) {
      if (err.response.status === 401) {
        dispatch(
          loginAttempt(
            {
              refresh_token: refresh_token,
              access_token: access_token,
            },
            sikritAttempt
          )
        )
      } else {
        dispatch({
          type: SIKRIT_ATTEMPT_FAILED,
          payload: {
            message: 'deu ruim',
          },
        })
      }
    }
  }
}
