/**
 * Janssen & Veronica Wedding RSVP — Google Apps Script backend
 *
 * Sheet layout expected on the bound spreadsheet:
 *   Tab "Guests":     A=Name, B=Pax, C=Token  (Token column is added/filled by generateTokens())
 *   Tab "Responses":  auto-created on first POST; columns documented in doPost()
 *
 * Deploy: Extensions > Apps Script, paste this file, then Deploy > New deployment > Web app:
 *   - Execute as:    Me
 *   - Who has access: Anyone
 * Copy the /exec URL and put it in frontend/src/App.tsx (APPS_SCRIPT_URL).
 *
 * One-time setup: from the Apps Script editor, run generateTokens() once to create
 * the Token column and fill any blank rows with unique tokens. Safe to re-run; it
 * only writes tokens for rows that don't have one.
 */

const GUESTS_SHEET = 'Guests';
const RESPONSES_SHEET = 'Responses';

function getGuestsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(GUESTS_SHEET) || ss.getSheets()[0];
}

function makeToken_() {
  return Utilities.getUuid().replace(/-/g, '').substring(0, 10);
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run once from the Apps Script editor to populate the Token column.
 * Adds a "Token" header in column C if missing, then fills any empty
 * token cells with a fresh 10-char unique ID. Existing tokens are kept.
 */
function generateTokens() {
  const sheet = getGuestsSheet_();
  const lastRow = sheet.getLastRow();

  const headerCell = sheet.getRange(1, 3);
  if (headerCell.getValue() !== 'Token') {
    headerCell.setValue('Token');
  }

  if (lastRow < 2) return;

  const tokens = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
  const seen = new Set(tokens.map(function (r) { return String(r[0] || ''); }).filter(Boolean));
  let written = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (!tokens[i][0]) {
      let t;
      do { t = makeToken_(); } while (seen.has(t));
      seen.add(t);
      tokens[i][0] = t;
      written++;
    }
  }

  sheet.getRange(2, 3, tokens.length, 1).setValues(tokens);
  Logger.log('generateTokens: wrote ' + written + ' new tokens');
}

function getGuestByToken_(token) {
  if (!token) return { status: 'error', message: 'Missing token' };
  const sheet = getGuestsSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { status: 'not_found' };

  const data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  const t = String(token).trim();
  for (let i = 0; i < data.length; i++) {
    if (String(data[i][2]).trim() === t) {
      return {
        status: 'success',
        name: String(data[i][0]),
        maxGuests: Math.max(1, Number(data[i][1]) || 1),
        token: t
      };
    }
  }
  return { status: 'not_found' };
}

function doGet(e) {
  const params = (e && e.parameter) || {};
  const action = String(params.action || '').toLowerCase();

  if (action === 'getguest') {
    return jsonResponse_(getGuestByToken_(params.token));
  }

  return jsonResponse_({ status: 'error', message: 'Unknown action' });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    const guest = getGuestByToken_(body.token);
    if (guest.status !== 'success') {
      return jsonResponse_({ status: 'error', message: 'Invalid or missing token' });
    }

    const requested = Number(body.guestCount);
    if (!requested || requested < 1) {
      return jsonResponse_({ status: 'error', message: 'Jumlah tamu tidak valid' });
    }
    if (requested > guest.maxGuests) {
      return jsonResponse_({
        status: 'error',
        message: 'Jumlah tamu melebihi batas (maks. ' + guest.maxGuests + ')'
      });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let responses = ss.getSheetByName(RESPONSES_SHEET);
    if (!responses) {
      responses = ss.insertSheet(RESPONSES_SHEET);
      responses.appendRow([
        'Timestamp', 'Token', 'Invited Name', 'RSVP Name',
        'Phone', 'Guest Count', 'Max Guests', 'Message'
      ]);
    }

    responses.appendRow([
      new Date(),
      guest.token,
      guest.name,
      String(body.name || guest.name),
      String(body.phone || ''),
      requested,
      guest.maxGuests,
      String(body.message || '')
    ]);

    return jsonResponse_({ status: 'success' });
  } catch (err) {
    return jsonResponse_({ status: 'error', message: String(err) });
  }
}
