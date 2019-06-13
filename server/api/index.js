import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import opn from 'opn'

import authRoutes from './routes/auth'

const dotenvError = dotenv.config()

if (dotenvError.error) {
  throw dotenvError.error
}

const init = async () => {
  try {
    const port = process.env.SERVER_PORT || 8080

    var winston = require('./config/winston')

    let mongoUrl = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

    const mongo = await mongoose.connect(mongoUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
    })

    console.log('MongoDB connected successfully.')

    const app = express()

    const apiLimiter = rateLimit({
      windowMs: 60 * 60 * 1000,
      max: 5000,
      message: 'Too many requests from this IP, please try again after an hour',
    })

    app.use(cors())

    app.use(apiLimiter)

    app.use(bodyParser.json({ type: 'application/json' }))

    app.use(morgan('combined', { stream: winston.stream }))

    app.get('/', (req, res) => {
      res.status(200).json({ message: `I'm alive` })
    })

    app.use('/auth', authRoutes)

    await app.listen(port)

    console.log(`Server is running on port ${port}.`)

    // if (process.env.NODE_ENV === 'dev') {
    //   opn(`http://localhost:${port}`)
    // }
  } catch (e) {
    // console.log(e)
  }
}

init()
