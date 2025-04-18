const express = require('express')
const processingRoutes = require('./routes/processingRoutes')

require('dotenv').config()

const app = express()

// Middleware
app.use(express.json())

app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))

// Routes
app.use('/processing', processingRoutes)

// Start server
const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
