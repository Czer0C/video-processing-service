const express = require('express')
const { processVideo } = require('../workers/videoWorker')

const router = express.Router()

router.get('/', async (req, res) => {
  const { filePath, fileName } = req.query

  const t = await processVideo(filePath, fileName)

  console.log(t)

  res.status(200).json({
    message: 'Processing route',
  })
})

module.exports = router
