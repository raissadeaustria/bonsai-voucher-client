export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }
  const sessionId = req.query.session_id;

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  try {
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`
      }
    });

    const session = await response.json();

    if (session.error) {
      return res.status(400).json({ error: session.error.message });
    }

    if (session.payment_status === 'paid') {
      return res.status(200).json({
        paid: true,
        voucherCode: session.metadata.voucherCode,
        service: session.metadata.service,
        price: session.metadata.price,
        expiryDate: session.metadata.expiryDate,
        clientName: session.metadata.clientName,
        clientEmail: session.metadata.clientEmail,
        clientPhone: session.metadata.clientPhone,
        message: session.metadata.message
      });
    }

    return res.status(200).json({ paid: false });
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({ error: err.message });
  }
}
