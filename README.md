# Silk & Scissors Unisex Salon — Complete Website

**Location:** Pratap Nagar, Chittorgarh, Rajasthan  
**Phone:** +91 7665469604  
**Category:** Unisex Salon (Hair, Beauty, Spa, Bridal)

---

## Project Structure

```
silk-scissors-salon/
├── index.html            # Complete frontend (open directly in browser)
├── backend/
│   ├── server.js         # Node.js backend (bookings, email, SMS, voice)
│   ├── package.json      # Dependencies
│   ├── .env              # Configuration secrets
│   └── .env.example      # Template for .env
```

## Quick Start (Frontend Only)

Open `index.html` in any browser. That's it.

All features work client-side:
- 3D animated hero (Three.js)
- Booking system (localStorage)
- WhatsApp integration
- Google Maps embed
- Admin panel (Ctrl+B to open)

## Full Stack (with Backend)

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure .env

Edit `backend/.env` with your SMTP, Telegram, or Twilio credentials.

### 3. Start server

```bash
npm start
```

Server runs on `http://localhost:3000`.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/book` | Create booking |
| POST | `/api/admin/login` | Admin auth |
| GET | `/api/bookings` | List bookings (auth required) |
| PATCH | `/api/bookings/:id` | Update booking status |
| POST | `/api/text-inbound` | Twilio SMS webhook |
| POST | `/api/voice-inbound` | Twilio voice webhook |
| POST | `/api/voicemail-transcript` | Voicemail transcription |

## Features

### Frontend
- **3D Three.js hero** — animated geometric shapes with gold aesthetic
- **Luxury design** — gold/black/cream palette, Playfair Display typography
- **Full booking system** — date, time slots, service selection, double-booking prevention
- **Admin panel** — press `Ctrl+B` to view all bookings
- **WhatsApp chat** — floating button with pre-filled message
- **Emergency booking** — sticky "Urgent? Call Now" and "Quick Book" buttons
- **Google Maps** — embedded map with directions link
- **Testimonials** — 6 realistic client reviews
- **Services** — 9 service cards with descriptions and pricing
- **Gallery** — 8-item grid layout
- **SEO optimized** — meta tags, Open Graph, JSON-LD schema, geo tags
- **Scroll reveal animations** — IntersectionObserver-based fade-in
- **Fully responsive** — mobile-first with hamburger menu
- **Analytics ready** — UTM parameter tracking

### Backend
- **Booking API** — RESTful booking management
- **Email notifications** — SMTP (Gmail, etc.) on new booking
- **Telegram alerts** — instant notification on new booking
- **SMS handler** — Twilio webhook for inbound texts
- **Voice handler** — IVR with voicemail transcription
- **Admin auth** — JWT-based admin authentication
- **Cron reminders** — automated booking checkups

## Customization

### Replace placeholder images
Edit the gallery items and about image section in `index.html`:
- Line 320: About section image placeholder
- Line 336-343: Gallery item text

### Change colors
CSS variables at the top of `<style>`:
```css
--gold: #C9A96E;
--gold-light: #E8D5A3;
--gold-dark: #A8883E;
--black: #0D0D0D;
```

### Add real logo
Replace the SVG logo in the nav with your image:
```html
<img src="logo.png" alt="Silk & Scissors" height="36">
```

## Deployment

### Option 1: Static hosting (Vercel, Netlify, Cloudflare Pages)
Deploy the `index.html` file directly. Free tiers support custom domains and HTTPS.

### Option 2: Full stack (Railway, Render, Fly.io)
Deploy the entire project. Set environment variables from `.env`.

### Option 3: VPS (DigitalOcean, Linode)
```bash
git clone https://github.com/yourusername/silk-scissors-salon
cd silk-scissors-salon/backend
npm install
npm start
```

Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name silk-scissors
```

## Google Business Profile Optimization

1. Claim your GBP at https://business.google.com
2. Use exact NAP: **Silk & Scissors Unisex Salon**, **Pratap Nagar Chohra, opposite Dominos Pizza, near Friends Collection, Pratap Nagar, Chittorgarh, Rajasthan 312001**, **+91 7665469604**
3. Upload 20+ photos, including storefront, interiors, and work samples
4. Enable messaging and booking
5. Post weekly updates
6. Respond to all reviews within 24 hours
7. Add the website URL to your profile

---

Built with precision. Like every cut at Silk & Scissors.
