import React from 'react'
import { useDispatch } from 'react-redux'
import { loginAttempt } from '../actions/auth/index'

const NotAuthorized = () => {
  const dispatch = useDispatch()
  return (
    <div className="App">
      <div className="App-header">
        <h1>Nao autorizado. vá até o bot para se conectar</h1>
        <button onClick={() => dispatch(loginAttempt('qq coisa'))}>
          teste
        </button>
      </div>
    </div>
  )
}

export default NotAuthorized
