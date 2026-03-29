// =============================================================
// Google Apps Script — Paste this into your Google Sheet
// =============================================================
// SETUP:
// 1. Create a new Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Delete the default code and paste this entire file
// 4. Click Deploy > New deployment
// 5. Select "Web app", set "Who has access" to "Anyone"
// 6. Click Deploy, copy the URL
// 7. Paste the URL into voucher-client.html (GOOGLE_SHEET_URL variable)
// =============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Voucher Code',
        'Status',
        'Service',
        'Price (Kc)',
        'Recipient Name',
        'Recipient Email',
        'Recipient Phone',
        'Personal Message',
        'Date Created',
        'Expiry Date',
        'Payment Status'
      ]);
      // Bold headers
      sheet.getRange(1, 1, 1, 11).setFontWeight('bold');
    }

    sheet.appendRow([
      data.voucherCode || '',
      'Created',
      data.service || '',
      data.price || '',
      data.clientName || '',
      data.clientEmail || '',
      data.clientPhone || '',
      data.message || '',
      data.dateCreated || '',
      data.expiryDate || '',
      'Paid (Client App)'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Allow GET requests for testing
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Voucher tracker is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
