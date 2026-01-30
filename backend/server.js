// Backend server for WhatsApp notifications via Twilio
// Run with: node server.js
// Make sure to install: npm install express twilio dotenv cors

const express = require('express');
const twilio = require('twilio');
const path = require('path');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the parent directory (root of the project)
app.use(express.static(path.join(__dirname, '..')));

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
        const { name, phone, orderDetails, deliveryTime } = req.body;

        // Validate required fields
        if (!name || !phone || !orderDetails) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: name, phone, orderDetails' 
            });
        }

        // Format WhatsApp message
        const whatsappMessage = `🍽️ *New Order from Fikir Catering Website*

👤 *Name:* ${name}
📞 *Phone:* ${phone}
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

// Serve index.html for root and other routes (for SPA)
app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Local access: http://localhost:${PORT}`);
    console.log(`Network access: http://YOUR_IP:${PORT}`);
    console.log(`Order endpoint: http://localhost:${PORT}/api/submit-order`);
    console.log(`\nTo access from your phone:`);
    console.log(`1. Make sure your phone is on the same Wi-Fi network`);
    console.log(`2. Find your computer's IP address:`);
    console.log(`   - macOS: System Settings > Network > Wi-Fi (or run: ipconfig getifaddr en0)`);
    console.log(`   - Or check: ifconfig | grep "inet " | grep -v 127.0.0.1`);
    console.log(`3. Open http://YOUR_IP:${PORT} on your phone's browser`);
});

