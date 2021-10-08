const express = require('express')
const createError = require('http-errors')
const morgan = require('morgan')
const cors = require('cors')
const fileupload = require('express-fileupload')
require('dotenv').config()

const filesRouter = require('./routers/files.router')

const app = express()
app.use(cors())
app.use(fileupload());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/files', filesRouter)

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
