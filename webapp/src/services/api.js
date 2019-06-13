import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
})

export default {
  login: async refresh_token => {
    let res = await instance.post(
      `/auth/token/`,
      { refresh_token },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    console.log(res)
    return res
  },
}
