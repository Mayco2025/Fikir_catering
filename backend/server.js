require('dotenv').config()
const express = require('express')
const cors = require('cors')

// Validate required env vars on startup
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER } = process.env
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
  console.error('❌ Missing Twilio credentials. Check your .env file:')
  console.error('  TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER')
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/submit-order', require('./routes/orders'))
app.use('/api/health',       require('./routes/health'))

// 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`   Order endpoint: http://localhost:${PORT}/api/submit-order`)
  console.log(`   Health check:   http://localhost:${PORT}/api/health`)
})
