import { applyMiddleware, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'

import { rootReducer } from '../reducers/index'
import authSaga from '../sagas/auth'

const sagaMiddleware = createSagaMiddleware()

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['auth', 'user'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// export const store = createStore(reducers, applyMiddleware(thunk, logger))

export const store = createStore(
  persistedReducer,
  applyMiddleware(sagaMiddleware, logger)
)
export const persistor = persistStore(store)

sagaMiddleware.run(authSaga)
