const express = require('express')
const router = express.Router()
const fileController = require('../controllers/files.controller')

router.post('/save', fileController.save)
router.delete('/delete', fileController.delete)
router.get('/download', fileController.download)
router.get('/show', fileController.show)

module.exports = router
