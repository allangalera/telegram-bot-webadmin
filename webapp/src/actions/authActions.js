import axios from 'axios'

export const LOGIN_ATTEMPT = 'LOGIN_ATTEMPT'
export const LOGIN_ATTEMPT_SUCCESSFUL = 'LOGIN_ATTEMPT_SUCCESSFUL'
export const LOGIN_ATTEMPT_FAILED = 'LOGIN_ATTEMPT_FAILED'

export const loginAttempt = (
  { history, access_token, refresh_token },
  callback
) => {
  return async dispatch => {
    dispatch({
      type: LOGIN_ATTEMPT,
      payload: {
        refresh_token,
      },
    })
    try {
      let res = await axios.post(
        `http://localhost:8080/auth/token/`,
        { refresh_token },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (res.status !== 200) {
        dispatch({
          type: LOGIN_ATTEMPT_FAILED,
          payload: {
            message: 'deu ruim',
          },
        })
      } else {
        dispatch({
          type: LOGIN_ATTEMPT_SUCCESSFUL,
          payload: {
            access_token: res.data.access_token,
            refresh_token: res.data.refresh_token,
            user: {
              username: res.data.user.username,
              first_name: res.data.user.first_name,
              last_name: res.data.user.last_name,
            },
          },
        })
        if (history !== undefined) {
          history.push('/')
        }
        if (callback !== undefined) {
          dispatch(
            callback({
              access_token: res.data.access_token,
              refresh_token: res.data.refresh_token,
            })
          )
        }
      }
    } catch (err) {
      dispatch({
        type: LOGIN_ATTEMPT_FAILED,
        payload: {
          message: 'deu ruim',
        },
      })
    }
  }
}
