/**
 * Google Apps Script Webhook cho Khảo Sát Xung Đột TKI (Thomas-Kilmann)
 * Tự động ghi nhận dữ liệu phản hồi vào Google Sheets với đầy đủ 51 cột
 * Đảm bảo nguyên tắc bảo toàn 100% câu trả lời từ Q1 đến Q30 (Question-Level Data Integrity)
 */

const SPREADSHEET_ID = "1P8SO3aUPCgcDXkv4EujiWBXdRGSyJml6pWMs5B10cgM";
const SHEET_RESPONSES = "Danh Sách Phản Hồi";
const SHEET_STATS = "Thống Kê Tổng Quan";

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "TKI Conflict Assessment Webhook API is running",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const rawData = e.postData ? e.postData.contents : null;
    if (!rawData) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "No data payload received"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(rawData);
    const ss = SPREADSHEET_ID && SPREADSHEET_ID !== "TKI_SPREADSHEET_ID_PLACEHOLDER" 
      ? SpreadsheetApp.openById(SPREADSHEET_ID) 
      : SpreadsheetApp.getActiveSpreadsheet();

    let sheet = ss.getSheetByName(SHEET_RESPONSES);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_RESPONSES);
    }

    const timestamp = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "yyyy-MM-dd HH:mm:ss");
    const fullName = data.fullName || "Khách ẩn danh";
    const email = data.email || "";
    const organization = data.organization || "";
    const mode = data.mode || "cloud_sync";
    const dominantMode = data.dominantMode || "";
    const secondaryMode = data.secondaryMode || "";

    const scores = data.scores || {};
    const cp = scores.competing || { rawScore: 0, percentileBand: "medium" };
    const cl = scores.collaborating || { rawScore: 0, percentileBand: "medium" };
    const co = scores.compromising || { rawScore: 0, percentileBand: "medium" };
    const av = scores.avoiding || { rawScore: 0, percentileBand: "medium" };
    const ac = scores.accommodating || { rawScore: 0, percentileBand: "medium" };

    const coords = data.matrixCoords || { assertiveness: 50, cooperativeness: 50 };
    const overused = (data.overusedModes || []).join(", ");
    const underused = (data.underusedModes || []).join(", ");

    const row = [
      timestamp,
      fullName,
      email,
      organization,
      mode,
      dominantMode,
      secondaryMode,
      cp.rawScore,
      cp.percentileBand,
      cl.rawScore,
      cl.percentileBand,
      co.rawScore,
      co.percentileBand,
      av.rawScore,
      av.percentileBand,
      ac.rawScore,
      ac.percentileBand,
      coords.assertiveness + "%",
      coords.cooperativeness + "%",
      overused || "Không",
      underused || "Không"
    ];

    // Append 30 questions answers (Q1 to Q30)
    const answers = data.answers || {};
    for (let i = 1; i <= 30; i++) {
      const ans = answers[i] || answers[String(i)] || "";
      row.push(typeof ans === "object" ? (ans.choice || ans.option || "") : String(ans));
    }

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Recorded TKI assessment successfully",
      dominantMode: dominantMode,
      rowNumber: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
