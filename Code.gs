/**
 * ====================================================================
 * INNOVFEST 2026 - SMK TELKOM MALANG (MOKLET)
 * Backend Google Apps Script (Code.gs)
 * ====================================================================
 * 
 * Script ini menangani:
 * 1. doGet(e)  : Merender halaman web (HTML) atau mengembalikan data JSON (Dashboard).
 * 2. doPost(e) : Menerima submit formulir dan menyimpannya ke Google Sheets.
 * 3. Inisialisasi otomatis header sheet jika belum dibuat.
 */

// Konfigurasi ID Spreadsheet & Nama Sheet Database
var SPREADSHEET_ID = "1C5pLCCWfqsJh-nueuYfBAL5qTq1vTQCEOjUQ2rRLhiI";
var SHEET_NAME = "Inovasi";

/**
 * Mendapatkan atau membuat sheet database dengan header yang sesuai
 */
function getOrCreateSheet() {
  var ss;
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Setup Header Kolom
    var headers = [
      "Timestamp",
      "Nama Lengkap",
      "Anggota 1",
      "Anggota 2",
      "Judul Ide",
      "Kategori Inovasi"
    ];
    sheet.appendRow(headers);
    
    // Styling Header: Warna Merah Moklet (#E21E26) dengan Teks Putih Tebal
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#E21E26");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    
    // Auto-resize kolom
    for (var i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
  return sheet;
}

/**
 * Handler HTTP GET:
 * - Jika parameter `action=getData`: Mengembalikan seluruh data dalam format JSON.
 * - Jika parameter `action=ping`: Mengembalikan status aktif (health check).
 * - Default: Merender antarmuka web (Index.html).
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "";
  var callback = (e && e.parameter && e.parameter.callback) ? e.parameter.callback : "";

  // 1. Endpoint API JSON: Mengambil data untuk Dashboard
  if (action === "getData") {
    var response = handleGetData();
    if (callback) {
      return ContentService.createTextOutput(callback + "(" + response.getContent() + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return response;
  }

  // 2. Health check
  if (action === "ping") {
    return createJsonResponse({ status: "success", message: "InnovFest API is active." });
  }

  // 3. Render Frontend Web App
  return HtmlService.createTemplateFromFile("Index")
    .evaluate()
    .setTitle("InnovFest 2026 - SMK Telkom Malang")
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Handler HTTP POST:
 * - Menerima kiriman form inovasi (JSON payload atau Form-data).
 * - Menggunakan LockService untuk mencegah tabrakan data (race condition).
 * - Menambahkan baris baru dengan Timestamp otomatis.
 */
function doPost(e) {
  // Lock untuk mencegah race condition saat banyak pengguna submit bersamaan
  var lock = LockService.getScriptLock();
  var success = lock.tryLock(10000); // Tunggu maksimal 10 detik

  if (!success) {
    return createJsonResponse({
      status: "error",
      message: "Server sedang sibuk memproses antrean data. Silakan coba lagi dalam beberapa detik."
    });
  }

  try {
    var sheet = getOrCreateSheet();
    var data = {};

    // Parsing data baik dari JSON body maupun form-urlencoded
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Validasi input wajib
    var namaLengkap = (data.namaLengkap || "").toString().trim();
    var judulIde = (data.judulIde || "").toString().trim();
    var kategoriInovasi = (data.kategoriInovasi || "").toString().trim();
    var anggota1 = (data.anggota1 || "").toString().trim();
    var anggota2 = (data.anggota2 || "").toString().trim();

    if (!namaLengkap || !judulIde || !kategoriInovasi) {
      return createJsonResponse({
        status: "error",
        message: "Nama Lengkap, Judul Ide, dan Kategori Inovasi wajib diisi!"
      });
    }

    // Format Timestamp waktu saat ini (WIB / GMT+7)
    var timestamp = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");

    // Baris baru yang akan ditambahkan
    var newRow = [
      timestamp,
      namaLengkap,
      anggota1 || "-",
      anggota2 || "-",
      judulIde,
      kategoriInovasi
    ];

    sheet.appendRow(newRow);

    return createJsonResponse({
      status: "success",
      message: "Inovasi berhasil dikirim dan tersimpan di database!",
      data: {
        timestamp: timestamp,
        namaLengkap: namaLengkap,
        judulIde: judulIde,
        kategoriInovasi: kategoriInovasi
      }
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "Terjadi kesalahan pada server: " + error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Mengambil semua baris data inovasi dari Google Sheets dan mengembalikannya sebagai JSON
 */
function handleGetData() {
  try {
    var sheet = getOrCreateSheet();
    var lastRow = sheet.getLastRow();
    
    // Jika hanya ada header atau sheet kosong
    if (lastRow <= 1) {
      return createJsonResponse({
        status: "success",
        total: 0,
        data: []
      });
    }

    var values = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
    var result = [];

    // Looping dari baris terakhir ke pertama (data terbaru muncul paling atas)
    for (var i = values.length - 1; i >= 0; i--) {
      var row = values[i];
      var formattedDate = row[0];
      if (row[0] instanceof Date) {
        formattedDate = Utilities.formatDate(row[0], "Asia/Jakarta", "dd MMM yyyy, HH:mm");
      }

      result.push({
        id: i + 1,
        timestamp: formattedDate || "-",
        namaLengkap: row[1] || "-",
        anggota1: row[2] || "-",
        anggota2: row[3] || "-",
        judulIde: row[4] || "-",
        kategoriInovasi: row[5] || "-"
      });
    }

    return createJsonResponse({
      status: "success",
      total: result.length,
      data: result
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "Gagal mengambil data: " + error.toString(),
      data: []
    });
  }
}

/**
 * Helper untuk membuat response JSON dengan header CORS yang tepat
 */
function createJsonResponse(dataObject) {
  return ContentService.createTextOutput(JSON.stringify(dataObject))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fungsi pembantu yang dapat dipanggil langsung dari google.script.run
 * jika aplikasi di-host langsung di Apps Script
 */
function getDashboardDataDirect() {
  var response = handleGetData();
  return JSON.parse(response.getContent());
}

function submitInnovationDirect(payload) {
  var mockEvent = {
    postData: {
      contents: JSON.stringify(payload)
    }
  };
  var response = doPost(mockEvent);
  return JSON.parse(response.getContent());
}
