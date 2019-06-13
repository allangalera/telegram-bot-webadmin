import mongoose from 'mongoose'
import moment from 'moment'

const Schema = mongoose.Schema

var refreshTokenDataSchema = new Schema(
  {
    refresh_token: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      index: true,
    },
    user_id: {
      type: String,
      trim: true,
      required: true,
    },
    expire_at: {
      type: Date,
      default: moment().add(1, 'days'),
      select: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  { collection: 'refresh_token' }
)

module.exports = mongoose.model('RefreshToken', refreshTokenDataSchema)
