import React from 'react'
import { withRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'

import NotAuthorized from './NotAuthorized'

const Home = () => {
  const { access_token, refresh_token } = useSelector(state => state.auth)

  if (access_token === null && refresh_token === null) {
    return <NotAuthorized />
  }
  return <div>OI</div>
}

export default withRouter(Home)
