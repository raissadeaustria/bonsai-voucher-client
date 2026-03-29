export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sheetUrl = process.env.GOOGLE_SHEET_URL;
  if (!sheetUrl) {
    return res.status(500).json({ error: 'GOOGLE_SHEET_URL not configured' });
  }

  try {
    const response = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      redirect: 'follow'
    });

    const text = await response.text();
    return res.status(200).json({ success: true, response: text });
  } catch (err) {
    console.error('Sheet logging error:', err);
    return res.status(500).json({ error: err.message });
  }
}
