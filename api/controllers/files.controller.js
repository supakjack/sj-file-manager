const createError = require('http-errors')
const mkdirp = require('mkdirp')
const rmdir = require('rmdir')
const { nanoid } = require('nanoid')
const filesModel = require('./../models/files.model')

module.exports = {
  save: async (req, res, next) => {
    try {
      const floderName = nanoid(24)
      const filesUpload = req.files.filesUpload
      const ref_id = req.query.ref_id
      // console.log(filesUpload);
      if (filesUpload[0]) {
        console.log('array')
        await filesUpload.map(async (file) => {
          const floderPath = process.env.BASE_STORAGE_PATH + '/' + floderName
          await mkdirp(floderPath)
          const filePath = floderPath + '/' + file.name
          await file.mv(filePath)
          await filesModel.insert({ floderName, fileName: file.name, ref_id })
        })
        res.status(201).send({ floderName })
      } else {
        console.log('not array')
        const floderPath = process.env.BASE_STORAGE_PATH + '/' + floderName
        await mkdirp(floderPath)
        const filePath = floderPath + '/' + filesUpload.name
        await filesUpload.mv(filePath)
        await filesModel.insert({
          floderName,
          fileName: filesUpload.name,
          ref_id
        })
        res.status(201).send({ floderName })
      }
    } catch (error) {
      if (error.isJoi === true) return next(createError.InternalServerError())
      next(error)
    }
  },
  list: async (req, res, next) => {
    try {
      const data = await filesModel.select()
      res.status(200).send({ data })
    } catch (error) {
      if (error.isJoi === true) return next(createError.InternalServerError())
      next(error)
    }
  },
  delete: async (req, res, next) => {
    try {
      const floderName = req.query.floderName
      const floderPath = process.env.BASE_STORAGE_PATH + '/' + floderName
      const doesDelete = await filesModel.delete(floderName)
      await rmdir(floderPath)
      res.status(200).send({ doesDelete })
    } catch (error) {
      if (error.isJoi === true) return next(createError.InternalServerError())
      next(error)
    }
  }
}
