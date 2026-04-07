const express = require('express')
const router = express.Router()
const { client, twilioWhatsAppNumber, recipients } = require('../config/twilio')

router.post('/', async (req, res) => {
  try {
    const { name, phone, deliveryType, deliveryAddress, orderDetails, deliveryTime } = req.body

    if (!name || !phone || !orderDetails) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, phone, orderDetails',
      })
    }

    const deliveryTypeText = deliveryType === 'delivery' ? 'Delivery' : 'Pickup'
    const addressLine = deliveryType === 'delivery' && deliveryAddress
      ? `📍 *Delivery Address:* ${deliveryAddress}\n`
      : deliveryType === 'pickup'
        ? `📍 *Pickup Location:* Kitasenju Station\n`
        : ''

    const whatsappMessage =
`🍽️ *New Order from Fikir Catering Website*

👤 *Name:* ${name}
📞 *Phone:* ${phone}
🚚 *Delivery Type:* ${deliveryTypeText}
${addressLine}📋 *Order Details:*
${orderDetails}

⏰ *Delivery/Pickup Time:* ${deliveryTime || 'Not specified'}

---
This order was submitted from the website.`

    const sendPromises = recipients.map((to) =>
      client.messages.create({
        from: twilioWhatsAppNumber,
        to,
        body: whatsappMessage,
      })
    )

    await Promise.all(sendPromises)
    console.log('WhatsApp messages sent successfully')

    res.json({ success: true, message: 'Order submitted and WhatsApp notifications sent' })
  } catch (error) {
    console.error('Error processing order:', error)
    res.status(500).json({ success: false, error: 'Failed to process order', details: error.message })
  }
})

module.exports = router
