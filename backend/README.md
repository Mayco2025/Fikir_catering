# Fikir Catering Backend - WhatsApp Notifications

This backend server handles order submissions and sends automatic WhatsApp notifications via Twilio.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Twilio Account

1. Go to https://www.twilio.com and sign up (free trial available)
2. Get your credentials from Twilio Console:
   - Account SID
   - Auth Token
   - WhatsApp Sandbox Number (for testing) or approved WhatsApp Business Number

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Twilio credentials:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   PORT=3000
   ```

### 4. Run the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### POST /api/submit-order
Submits an order and sends WhatsApp notifications.

**Request Body:**
```json
{
  "name": "Customer Name",
  "phone": "080-1234-5678",
  "orderDetails": "Order description",
  "deliveryTime": "Tomorrow at 6 PM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order submitted and WhatsApp notifications sent"
}
```

### GET /api/health
Health check endpoint.

## Deployment Options

### Option 1: Deploy to Railway (Recommended - Free tier available)
1. Go to https://railway.app
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy

### Option 2: Deploy to Render (Free tier available)
1. Go to https://render.com
2. Create a new Web Service
3. Connect your repository
4. Add environment variables
5. Deploy

### Option 3: Deploy to Heroku
1. Install Heroku CLI
2. Create Heroku app
3. Set environment variables
4. Deploy

## Twilio WhatsApp Setup

### For Testing (Sandbox):
1. Go to Twilio Console → Messaging → Try it out → Send a WhatsApp message
2. Follow instructions to join the sandbox
3. Use the sandbox number provided

### For Production:
1. Apply for WhatsApp Business API access in Twilio Console
2. Get approved WhatsApp Business Number
3. Update `TWILIO_WHATSAPP_NUMBER` in `.env`

## Notes

- Make sure your Twilio account has WhatsApp messaging enabled
- For production, you'll need an approved WhatsApp Business Number
- The free tier includes limited messages per month

