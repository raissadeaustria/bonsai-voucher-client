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
      sheet.getRange(1, 1, 1, 11).setFontWeight('bold');
    }

    // Read from form parameters
    var p = e.parameter;

    sheet.appendRow([
      p.voucherCode || '',
      'Created',
      p.service || '',
      p.price || '',
      p.clientName || '',
      p.clientEmail || '',
      p.clientPhone || '',
      p.message || '',
      p.dateCreated || '',
      p.expiryDate || '',
      'Paid (Client App)'
    ]);

    return ContentService
      .createTextOutput('OK')
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    return ContentService
      .createTextOutput('Error: ' + err.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Voucher tracker is running')
    .setMimeType(ContentService.MimeType.TEXT);
}
