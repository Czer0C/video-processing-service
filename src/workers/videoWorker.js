const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const bucket = require('../config/gcs')

const fs = require('fs')

const processVideo = async (filePath, fileName, processingId) => {
  try {
    const outputDir = path.join('processed', fileName)

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Transcoding to HLS
    await new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .output(`${outputDir}/output.m3u8`)
        .outputOptions([
          '-codec: copy',
          '-start_number 0',
          '-hls_time 10',
          '-hls_list_size 0',
          '-f hls',
        ])
        .on('end', resolve)
        .on('error', (err, stdout, stderr) => {
          console.error('Error:', err.message)
          console.error('FFmpeg stderr:', stderr)
        })
        .run()
    })

    // Generate Thumbnail
    const thumbnailPath = `${outputDir}/thumbnail.png`
    await new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .screenshots({
          timestamps: [5],
          filename: 'thumbnail.png',
          folder: outputDir,
        })
        .on('end', resolve)
        .on('error', reject)
    })

    // Upload to GCS
    await bucket.upload(`${outputDir}/output.m3u8`, {
      destination: `videos/${fileName}/output.m3u8`,
    })

    await bucket.upload(thumbnailPath, {
      destination: `thumbnails/${fileName}.png`,
    })

    //!TODO: from processingId updating status in db and push notifi or whatever

    console.log('Processing complete. Files uploaded.')
  } catch (err) {
    console.error('Error processing video:', err)
    throw err
  }
}

module.exports = { processVideo }
