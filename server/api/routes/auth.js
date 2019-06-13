import express from 'express'
import jwt from 'jsonwebtoken'
import randtoken from 'rand-token'
import moment from 'moment'

import User from '../../models/User'
import RefreshToken from '../../models/RefreshToken'
import validateAuth from '../middleware/validateAuth'

var router = express.Router()

router.post('/token/', async (req, res, next) => {
  try {
    let refreshToken = await RefreshToken.findOne({
      refresh_token: req.body.refresh_token,
      expire_at: { $gte: moment() },
    }).exec()

    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized! Filed to find token.' })
      return false
    }

    const user = await User.findOne({ _id: refreshToken.user_id }).exec()

    if (user.role !== 'admin')
      res.status(401).json({ message: 'Unauthorized! User needs to be admin.' })

    await refreshToken.delete()

    const refresh_token = randtoken.uid(256)

    refreshToken = RefreshToken({
      refresh_token,
      expire_at: moment().add(1, 'days'),
      user_id: user._id,
    })

    await refreshToken.save()

    if (!user)
      res
        .status(401)
        .json({ message: 'Unauthorized! User related to token not found.' })

    const access_token = jwt.sign(
      { telegram_id: user.telegram_id },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m',
      }
    )

    res.status(200).json({
      refresh_token,
      access_token,
      user: {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    })
  } catch (e) {
    if (e.statusCode !== undefined) {
      res.status(e.statusCode).json(e)
    } else {
      res.status(500).json(e)
    }
  }
})

module.exports = router
