// Backend server for WhatsApp notifications via Twilio
// Run with: node server.js
// Make sure to install: npm install express twilio dotenv cors

const express = require('express');
const twilio = require('twilio');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Twilio configuration (get these from Twilio Console)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Format: whatsapp:+14155238886

// Validate environment variables
if (!accountSid || !authToken || !twilioWhatsAppNumber) {
    console.error('❌ Error: Missing Twilio credentials in .env file!');
    console.error('Please create a .env file with:');
    console.error('TWILIO_ACCOUNT_SID=your_account_sid');
    console.error('TWILIO_AUTH_TOKEN=your_auth_token');
    console.error('TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886');
    process.exit(1);
}

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// WhatsApp recipient numbers
const recipientNumbers = [
    'whatsapp:+819039118822',  // +81 9039 118822
    'whatsapp:+817011822650'   // +81 7011 822650
];

// Order submission endpoint
app.post('/api/submit-order', async (req, res) => {
    try {
        const { name, phone, orderType, deliveryAddress, orderDetails, deliveryTime } = req.body;

        // Validate required fields
        if (!name || !phone || !deliveryAddress || !orderDetails) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: name, phone, deliveryAddress, orderDetails' 
            });
        }

        // Format WhatsApp message
        const orderTypeLabel = orderType === 'pickup' ? 'Pickup Location' : 'Delivery Address';
        const whatsappMessage = `🍽️ *New Order from Fikir Catering Website*

👤 *Name:* ${name}
📞 *Phone:* ${phone}
${orderType === 'pickup' ? '🏪' : '📍'} *${orderTypeLabel}:* ${deliveryAddress}
📋 *Order Details:*
${orderDetails}

⏰ *Delivery/Pickup Time:* ${deliveryTime || 'Not specified'}

---
This order was submitted from the website.`;

        // Send WhatsApp messages to both numbers
        const sendPromises = recipientNumbers.map(recipient => {
            return client.messages.create({
                from: twilioWhatsAppNumber,
                to: recipient,
                body: whatsappMessage
            });
        });

        // Wait for all messages to be sent
        await Promise.all(sendPromises);

        console.log('WhatsApp messages sent successfully');
        
        res.json({ 
            success: true, 
            message: 'Order submitted and WhatsApp notifications sent' 
        });

    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process order',
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Order endpoint: http://localhost:${PORT}/api/submit-order`);
});

