/**
 * 컬러인에듀센터 신청폼 → Google Sheets 연동 스크립트
 *
 * 설치 방법은 같은 폴더의 README.md 를 참고하세요.
 */

var SHEET_NAME = '신청내역';
var HEADERS = ['타임스탬프', '서비스', '이름', '연락처', '희망 일정', '문의 내용'];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet_();

    sheet.appendRow([
      new Date(),
      data.service || '',
      data.name || '',
      data.phone || '',
      data.preferredDate || '',
      data.message || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
