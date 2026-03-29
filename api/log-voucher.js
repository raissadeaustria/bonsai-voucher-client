export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sheetUrl = process.env.GOOGLE_SHEET_URL || 'https://script.google.com/macros/s/AKfycbz7mPDeXG-x3F-PSAj2a9Xjv8p31PhWaRYOUP7meizvDWwQYE74eH8YwM_6XAn48Nd2/exec';
  if (!sheetUrl) {
    return res.status(500).json({ error: 'GOOGLE_SHEET_URL not configured' });
  }

  try {
    // Google Apps Script returns 302 redirect on success - don't follow it
    const response = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      redirect: 'manual'
    });

    // 302 means the script executed successfully
    if (response.status === 302 || response.status === 200) {
      return res.status(200).json({ success: true });
    }

    const text = await response.text();
    return res.status(200).json({ success: false, status: response.status, response: text });
  } catch (err) {
    console.error('Sheet logging error:', err);
    return res.status(500).json({ error: err.message });
  }
}
