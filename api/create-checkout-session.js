export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const { price, service, voucherCode, expiryDate, clientName, clientEmail, clientPhone, message } = req.body;

  // Stripe uses smallest currency unit (haléře for CZK, 1 CZK = 100 haléřů)
  const amountInHalere = price * 100;

  const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'https://bonsai-voucher-client.vercel.app';

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'success_url': `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${origin}/?canceled=true`,
        'line_items[0][price_data][currency]': 'czk',
        'line_items[0][price_data][product_data][name]': service,
        'line_items[0][price_data][unit_amount]': amountInHalere.toString(),
        'line_items[0][quantity]': '1',
        'metadata[voucherCode]': voucherCode,
        'metadata[service]': service,
        'metadata[price]': price.toString(),
        'metadata[expiryDate]': expiryDate,
        'metadata[clientName]': clientName || '',
        'metadata[clientEmail]': clientEmail || '',
        'metadata[clientPhone]': clientPhone || '',
        'metadata[message]': message || ''
      }).toString()
    });

    const session = await response.json();

    if (session.error) {
      return res.status(400).json({ error: session.error.message });
    }

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message });
  }
}
