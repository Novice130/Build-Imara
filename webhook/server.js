const http = require('http');

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_LjsPaaur_EcwbCvYqG5nZg2RyZWnds2Ch';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'syedsalman726@gmail.com';
const PORT = process.env.PORT || 3001;

async function sendEmail({ subject, html }) {
  const body = JSON.stringify({
    from: 'Build Imara <Salman@buildimara.com>',
    to: [NOTIFY_EMAIL],
    subject,
    html,
  });

  const url = new URL('https://api.resend.com/emails');
  return new Promise((resolve, reject) => {
    const req = require('https').request(
      { hostname: 'api.resend.com', path: '/emails', method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
      },
      (res) => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const server = http.createServer((req, res) => {
  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (req.method !== 'POST' || req.url !== '/webhook/cal') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const payload = JSON.parse(body);
      const { triggerEvent, payload: p } = payload;

      if (triggerEvent === 'BOOKING_CREATED' || triggerEvent === 'BOOKING_REQUESTED') {
        const attendee = p?.attendees?.[0] || {};
        const startTime = p?.startTime ? new Date(p.startTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A';
        const endTime = p?.endTime ? new Date(p.endTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A';

        const html = `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
            <div style="background:#003a53;padding:16px 24px;border-radius:8px;margin-bottom:24px">
              <h1 style="color:#fff;font-size:20px;margin:0">🏠 New Consultation Booked — Build Imara</h1>
            </div>
            <p style="color:#374151;font-size:15px">A new consultation has been booked on your calendar.</p>
            <table style="width:100%;border-collapse:collapse;margin-top:16px">
              <tr><td style="padding:10px;background:#f9fafb;font-weight:600;color:#003a53;width:140px">Name</td><td style="padding:10px;border-bottom:1px solid #e5e7eb">${attendee.name || 'N/A'}</td></tr>
              <tr><td style="padding:10px;background:#f9fafb;font-weight:600;color:#003a53">Email</td><td style="padding:10px;border-bottom:1px solid #e5e7eb">${attendee.email || 'N/A'}</td></tr>
              <tr><td style="padding:10px;background:#f9fafb;font-weight:600;color:#003a53">Phone</td><td style="padding:10px;border-bottom:1px solid #e5e7eb">${attendee.phoneNumber || 'N/A'}</td></tr>
              <tr><td style="padding:10px;background:#f9fafb;font-weight:600;color:#003a53">Date &amp; Time</td><td style="padding:10px;border-bottom:1px solid #e5e7eb">${startTime} – ${endTime}</td></tr>
              <tr><td style="padding:10px;background:#f9fafb;font-weight:600;color:#003a53">Event</td><td style="padding:10px;border-bottom:1px solid #e5e7eb">${p?.title || 'Consultation'}</td></tr>
              <tr><td style="padding:10px;background:#f9fafb;font-weight:600;color:#003a53">Notes</td><td style="padding:10px">${p?.description || 'None'}</td></tr>
            </table>
            <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:8px;border-left:4px solid #1b6d24">
              <p style="margin:0;color:#1b6d24;font-size:13px">💡 Log in to <a href="https://cal.com" style="color:#003a53">cal.com</a> to manage this booking.</p>
            </div>
            <p style="color:#9ca3af;font-size:12px;margin-top:24px">Build Imara · Hyderabad · Quality Homes. Affordable Prices. Your Trust.</p>
          </div>`;

        const result = await sendEmail({
          subject: `📅 New Booking: ${attendee.name || 'Someone'} — ${startTime}`,
          html,
        });
        console.log(`[${triggerEvent}] Email sent:`, result.status, result.body);
      } else {
        console.log(`[${triggerEvent}] Event received (no email sent)`);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ received: true }));
    } catch (err) {
      console.error('Webhook error:', err);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Build Imara webhook server running on port ${PORT}`);
  console.log(`Webhook endpoint: POST /webhook/cal`);
  console.log(`Notifications → ${NOTIFY_EMAIL}`);
});
