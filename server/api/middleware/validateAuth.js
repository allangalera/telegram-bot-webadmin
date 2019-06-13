import jwt from 'jsonwebtoken'

const validateAuth = function(req, res, next) {
  const token = getToken(req)
  if (!token) {
    res.status(401).send('Unauthorized: No token provided')
  } else {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token')
      } else {
        req.email = decoded.email
        next()
      }
    })
  }
}

const getToken = req => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    // Authorization: Bearer g1jipjgi1ifjioj
    // Handle token presented as a Bearer token in the Authorization header
    return req.headers.authorization.split(' ')[1]
  } else if (req.query && req.query.token) {
    // Handle token presented as URI param
    return req.query.token
  } else if (req.cookies && req.cookies.token) {
    // Handle token presented as a cookie parameter
    return req.cookies.token
  }
  // If we return null, we couldn't find a token.
  // In this case, the JWT middleware will return a 401 (unauthorized) to the client for this request
  return null
}
module.exports = validateAuth
