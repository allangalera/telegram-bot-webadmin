import { call, put, takeEvery } from 'redux-saga/effects'
import Api from '../services/api'
import {
  LOGIN_REQUEST,
  LOGIN_REQUEST_SUCCESSFUL,
  LOGIN_REQUEST_FAILED,
} from '../actions/auth/types'

function* login(action) {
  try {
    const user = yield call(Api.login, action.payload.refresh_token)
    yield put({ type: LOGIN_REQUEST_SUCCESSFUL, user: user })
  } catch (e) {
    yield put({ type: LOGIN_REQUEST_FAILED, message: e.message })
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_REQUEST, login)
}

export default authSaga
