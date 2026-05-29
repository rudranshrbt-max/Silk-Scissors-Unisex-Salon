require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'silk-scissors-secret-key-2026';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let transporter = null;
if (process.env.SMTP_EMAIL && process.env.SMTP_EMAIL !== 'your-email@gmail.com') {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

const bookings = [];

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === (process.env.ADMIN_PASSWORD || 'admin123')) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid password' });
});

app.post('/api/book', async (req, res) => {
  const { name, phone, service, date, time, notes } = req.body;
  if (!name || !phone || !service || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const booking = { id: Date.now(), name, phone, service, date, time, notes: notes || '', status: 'pending', createdAt: new Date().toISOString() };
  bookings.push(booking);

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Silk & Scissors" <${process.env.SMTP_EMAIL}>`,
        to: process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL,
        subject: `New Booking: ${name} - ${service}`,
        html: `
          <h2>New Booking Received</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd"><a href="tel:${phone}">${phone}</a></td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Service</td><td style="padding:8px;border:1px solid #ddd">${service}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Date</td><td style="padding:8px;border:1px solid #ddd">${date}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Time</td><td style="padding:8px;border:1px solid #ddd">${time}</td></tr>
            ${notes ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Notes</td><td style="padding:8px;border:1px solid #ddd">${notes}</td></tr>` : ''}
          </table>
        `,
      });
    } catch (e) { console.error('Email send failed:', e.message); }
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `New Booking!\nName: ${name}\nPhone: ${phone}\nService: ${service}\nDate: ${date}\nTime: ${time}\nNotes: ${notes || 'N/A'}`,
      }),
    }).catch(() => {});
  } catch(e) {}

  res.json({ success: true, booking });
});

app.get('/api/bookings', authMiddleware, (req, res) => {
  res.json(bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.patch('/api/bookings/:id', authMiddleware, (req, res) => {
  const b = bookings.find(x => x.id == req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  b.status = req.body.status || b.status;
  res.json(b);
});

app.post('/api/text-inbound', (req, res) => {
  const { Body, From } = req.body;
  console.log(`SMS from ${From}: ${Body}`);
  if (transporter) {
    transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL,
      subject: `SMS from ${From}`,
      text: `Message: ${Body}\nFrom: ${From}`,
    }).catch(() => {});
  }
  res.send('<Response></Response>');
});

app.post('/api/voice-inbound', (req, res) => {
  const { Caller, CallStatus } = req.body;
  console.log(`Call from ${Caller}: ${CallStatus}`);
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="woman">Thank you for calling Silk & Scissors Unisex Salon in Chittorgarh. Our team is busy with clients right now. Please leave your name and number after the beep, and we'll call you back shortly. You can also book online at our website. Thank you!</Say>
  <Record maxLength="30" transcribeCallback="/api/voicemail-transcript" />
</Response>`;
  res.type('text/xml').send(twiml);
});

app.post('/api/voicemail-transcript', (req, res) => {
  const { TranscriptionText, Caller } = req.body;
  console.log(`Voicemail from ${Caller}: ${TranscriptionText}`);
  if (transporter) {
    transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL,
      subject: `Voicemail from ${Caller}`,
      text: `Transcript: ${TranscriptionText}`,
    }).catch(() => {});
  }
  res.send('<Response></Response>');
});

cron.schedule('*/15 * * * *', () => {
  console.log('Booking reminder check...');
});

app.listen(PORT, () => {
  console.log(`\n  Silk & Scissors Backend running on http://localhost:${PORT}`);
  console.log(`  Endpoints:`);
  console.log(`  POST /api/book        - New booking`);
  console.log(`  POST /api/admin/login - Admin auth`);
  console.log(`  GET  /api/bookings    - List bookings (auth)`);
  console.log(`  POST /api/text-inbound   - SMS handler`);
  console.log(`  POST /api/voice-inbound   - Voice handler`);
  console.log(`  POST /api/voicemail-transcript - Voicemail transcription`);
  console.log(`\n  Set .env values for email, SMS, and Telegram integration.\n`);
});
