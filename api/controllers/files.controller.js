const createError = require('http-errors')
const mkdirp = require('mkdirp')
const rmdir = require('rmdir')
const { nanoid } = require('nanoid')
const zipFolder = require('zip-folder')
const filesModel = require('./../models/files.model')

module.exports = {
  save: async (req, res, next) => {
    try {
      const floderName = nanoid(24)
      const filesUpload = req.files.filesUpload
      await filesUpload.map(async (file) => {
        const floderPath = process.env.BASE_STORAGE_PATH + '\\' + floderName
        await mkdirp(floderPath)
        const filePath = floderPath + '\\' + file.name
        await file.mv(filePath)
        await filesModel.insert({ floderName, fileName: file.name })
      })
      res.status(201).send({ floderName })
    } catch (error) {
      if (error.isJoi === true) return next(createError.InternalServerError())
      next(error)
    }
  },
  download: async (req, res, next) => {
    try {
      const floderName = req.query.floderName
      const floderPath = process.env.BASE_STORAGE_PATH + '\\' + floderName
      const floderDownloadPath =
        process.env.BASE_STORAGE_PATH + '\\' + nanoid(24) + '.zip'
      await zipFolder(floderPath, floderDownloadPath, function (err) {
        if (err) {
          console.log('oh no!', err)
        } else {
          res.status(200).sendFile(floderDownloadPath)
          rmdir(floderDownloadPath)
        }
      })
    } catch (error) {
      if (error.isJoi === true) return next(createError.InternalServerError())
      next(error)
    }
  },
  show: async (req, res, next) => {
    try {
      const doesSelect = await filesModel.select()
      res.status(200).send({ doesSelect })
    } catch (error) {
      if (error.isJoi === true) return next(createError.InternalServerError())
      next(error)
    }
  },
  delete: async (req, res, next) => {
    try {
      const floderName = req.query.floderName
      const floderPath = process.env.BASE_STORAGE_PATH + '\\' + floderName
      const doesDelete = await filesModel.delete(floderName)
      await rmdir(floderPath)
      res.status(200).send({ doesDelete })
    } catch (error) {
      if (error.isJoi === true) return next(createError.InternalServerError())
      next(error)
    }
  }
}
