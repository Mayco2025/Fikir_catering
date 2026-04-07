# Fikir Catering — CLAUDE.md

## Project Overview

**Fikir Catering Japan** is an online catering service website based in Japan that sells authentic Ethiopian cuisine, currently focused on **injera** (Ethiopian flatbread). The site is deployed via GitHub Pages at `www.fikircatering.shop`.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, Tailwind CSS (CDN), vanilla JS |
| Styling | `css/styles.css` (custom styles on top of Tailwind) |
| Email | EmailJS (CDN) |
| Backend | Node.js + Express (`backend/server.js`) |
| Notifications | Twilio WhatsApp API — sends order alerts to the owner's phone |
| Deployment | GitHub Pages (frontend only) |

## Project Structure

```
/
├── index.html          # Single-page site (all sections: home, menu, about, order)
├── css/styles.css      # Custom CSS overrides
├── js/                 # Frontend JavaScript
├── images/             # Logo, cover photo, food images
├── assets/             # Static assets
├── CNAME               # Custom domain: www.fikircatering.shop
└── backend/
    ├── server.js       # Express server — handles /api/submit-order
    ├── package.json
    └── .env            # Twilio credentials (not committed)
```

## How Orders Work

1. Customer fills out the order form on the website.
2. Frontend sends a POST to `/api/submit-order` on the backend.
3. Backend (Twilio) sends a WhatsApp message to the owner's two numbers:
   - `+81 9039 118822`
   - `+81 7011 822650`

## Running the Backend Locally

```bash
cd backend
npm install
cp env.example .env   # Fill in your Twilio credentials
npm start             # or: npm run dev (uses nodemon)
```

Backend runs on port 3000 by default (`PORT` env var overrides this).

## Required Environment Variables (`backend/.env`)

```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

**Never commit `.env` to git.**

## Key Business Details

- **Product**: Injera (Ethiopian flatbread) and Ethiopian cuisine catering
- **Location**: Serves anywhere in Japan
- **Phone**: 080-3911-8822 / 070-1182-2650
- **Domain**: www.fikircatering.shop
- **Orders**: Require advance notice for delivery/pickup (noted in the UI)

## Deployment

The frontend is deployed via **GitHub Pages** from the `main` branch root. The backend (`backend/`) is **not** deployed on GitHub Pages — it must be run separately on a server or hosting platform (e.g., Railway, Render, Fly.io) for order notifications to work.

To deploy frontend changes: commit and push to `main`. GitHub Pages will auto-update.

## Development Notes

- The site is a **single HTML file** (`index.html`) — all sections live there.
- Tailwind is loaded via CDN; no build step needed for the frontend.
- Menu items currently omit prices for "coming soon" items.
- Mobile responsiveness is important — test on small screens when editing the layout.
