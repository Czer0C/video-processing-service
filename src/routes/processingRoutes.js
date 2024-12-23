const express = require('express')
const { processVideo } = require('../workers/videoWorker')

const router = express.Router()

router.get('/', async (req, res) => {
  const { filePath, fileName } = req.query

  res.status(200).json({
    message: 'Processing route',
  })

  const t = processVideo(filePath, fileName)

  console.log(t)
})

module.exports = router
