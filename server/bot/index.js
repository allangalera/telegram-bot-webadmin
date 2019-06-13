import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import randtoken from 'rand-token'
import moment from 'moment'

import User from '../models/User'
import RefreshToken from '../models/RefreshToken'

const dotenvError = dotenv.config()

if (dotenvError.error) {
  throw dotenvError.error
}

let mongoUrl = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

const mongo = mongoose.connect(mongoUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
})

const TOKEN = process.env.BOT_TOKEN

const bot = new TelegramBot(TOKEN, { polling: true })

bot.onText(/\/start/, async (msg, match) => {
  try {
    if (msg.from.is_bot) return false
    if (msg.chat.type !== 'private') return false
    const chatId = msg.chat.id
    const user = await User.findOne({ telegram_id: msg.from.id }).exec()
    if (user) return false
    let SYSTEM_ADMIN_ID = parseInt(process.env.SYSTEM_ADMIN_ID)
    let userRole = 'user'
    
    if (SYSTEM_ADMIN_ID !== undefined && SYSTEM_ADMIN_ID === msg.from.id) {
      userRole = 'admin'
    }
    const newUser = new User({
      telegram_id: msg.from.id,
      username: msg.from.username,
      first_name: msg.from.first_name,
      last_name: msg.from.last_name,
      role: userRole,
    })

    const savedUser = await newUser.save()

    bot.sendMessage(chatId, 'Olá')
  } catch (err) {
    console.log(err)
  }
})

bot.onText(/\/update_me/, async (msg, match) => {
  try {
    if (msg.from.is_bot) return false
    if (msg.chat.type !== 'private') return false
    const user = await User.findOne({ telegram_id: msg.from.id }).exec()

    if (!user) return false

    const chatId = msg.chat.id
    user.username = msg.from.username
    user.first_name = msg.from.first_name
    user.last_name = msg.from.last_name

    await user.save()
    bot.sendMessage(chatId, 'Telegram profile updated')
  } catch (err) {
    console.log(err)
    bot.sendMessage(chatId, 'Failed to save profile')
  }
})

bot.onText(/\/delete_me/, async (msg, match) => {
  try {
    if (msg.from.is_bot) return false
    if (msg.chat.type !== 'private') return false
    const user = await User.findOne({ telegram_id: msg.from.id }).exec()

    if (!user) return false

    const chatId = msg.chat.id
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Are you sure?',
              callback_data: 'edit',
            },
          ],
        ],
      },
    }
    bot.sendMessage(chatId, 'Vou te deletar, vagabundo', opts)
  } catch (err) {
    console.log(err)
    bot.sendMessage(chatId, 'Failed to delete profile')
  }
})

// bot.onText(/\/get_token/, async (msg, match) => {
//   try {
//     if (msg.from.is_bot) return false
//     if (msg.chat.type !== 'private') return false
//     const user = await User.findOne({ telegram_id: msg.from.id }).exec()
//
//     if (!user) return false
//
//     if (user.role !== 'admin') return false
//
//     const chatId = msg.chat.id
//
//     const refresh_token = randtoken.uid(256)
//     const refreshToken = RefreshToken({
//       refresh_token,
//       expire_at: moment().add(2, 'minutes'),
//       user_id: user._id,
//     })
//     console.log(msg)
//     await refreshToken.save()
//     bot.sendMessage(
//       chatId,
//       `[Click to Access Web App](http://10.0.75.1:3000/token/${refresh_token})\nThis link is only valid for 2 minutes.`,
//       {
//         parse_mode: 'markdown',
//       }
//     )
//   } catch (err) {
//     console.log(err)
//   }
// })

// Handle callback queries
bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data
  const msg = callbackQuery.message

  const user = await User.findOne({ telegram_id: callbackQuery.from.id }).exec()

  console.log(user)

  console.log(callbackQuery)

  if (!user) return false

  if (action === 'edit') {
    let opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Are you FUCKING sure?',
              callback_data: 'forsure',
            },
          ],
        ],
      },
    }

    bot.editMessageText(callbackQuery.message.text, opts)
  }

  if (action === 'forsure') {
    let opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
    }

    user.delete()

    bot.editMessageText('Account deleted', opts)
  }
})
