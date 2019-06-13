import mongoose from 'mongoose'

const Schema = mongoose.Schema

var userDataSchema = new Schema(
  {
    telegram_id: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
    },
    first_name: {
      type: String,
      trim: true,
    },
    last_name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
      trim: true,
    },
    updated_at: {
      type: Date,
      default: Date.now,
      select: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  { collection: 'users' }
)

module.exports = mongoose.model('User', userDataSchema)
