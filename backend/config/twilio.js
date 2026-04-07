const twilio = require('twilio')

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER

const recipients = [
  'whatsapp:+819039118822',
  'whatsapp:+817011822650',
]

module.exports = { client, twilioWhatsAppNumber, recipients }
