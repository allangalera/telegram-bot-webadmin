import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loginAttempt } from '../actions/authActions'

class Token extends Component {
  componentDidMount() {
    this.props.onLogin({
      history: this.props.history,
      refresh_token: this.props.match.params.token,
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Aqui eu vou ler seu token e ver se da pra logar</h1>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onLogin: data => {
    dispatch(loginAttempt(data))
  },
})

export default connect(
  null,
  mapDispatchToProps
)(Token)
