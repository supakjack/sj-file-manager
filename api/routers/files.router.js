const express = require('express')
const router = express.Router()
const fileController = require('../controllers/files.controller')

router.post('/save', fileController.save)
router.delete('/delete', fileController.delete)
router.get('/list', fileController.list)

module.exports = router
