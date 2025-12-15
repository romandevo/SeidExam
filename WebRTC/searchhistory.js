// ---------- AYARLAR (BURAYI DEĞİŞTİR) ----------
const SMS_SHEET_ID = '1TgPEDNC2WKdsWulEpMT2Qy3nPL9-Cg1cq5YOXC-eUmg'; // -> Google Sheet ID
const SHEET_NAME = 'Sheet1'; // sheet sekme adı
// ------------------------------------------------

// ------------------ doPost: Pub/Sub push endpoint ------------------
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      console.log('doPost: no postData');
      return ContentService.createTextOutput('NO_DATA');
    }

    // Pub/Sub mesajı base64 encoded içinden çıkar
    const pubsubMessage = JSON.parse(e.postData.contents);
    if (!pubsubMessage.message || !pubsubMessage.message.data) {
      console.log('doPost: no message data');
      return ContentService.createTextOutput('NO_MSG');
    }

    const encoded = pubsubMessage.message.data;
    const decodedStr = Utilities.newBlob(
      Utilities.base64Decode(encoded)
    ).getDataAsString();
    const decoded = JSON.parse(decodedStr);

    // decoded içinden historyId alabiliriz (bilgisel)
    const historyId = decoded.historyId || null;
    console.log('doPost: historyId=', historyId);

    // Gelen bildirime göre yeni gelen mailleri işle
    processNewSmsEmails();

    return ContentService.createTextOutput('OK');
  } catch (err) {
    console.error('doPost error:', err);
    return ContentService.createTextOutput('ERROR:' + String(err));
  }
}

// --------------- Gelen sms etiketli e-postaları işleyen fonksiyon ---------------
function processNewSmsEmails() {
  const labelName = 'sms-forward';
  const ss = SpreadsheetApp.openById(SMS_SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    console.error('Sheet bulunamadi:', SHEET_NAME);
    return;
  }

  // Sadece etiketli thread'leri al
  const label = GmailApp.getUserLabelByName(labelName);
  if (!label) {
    console.error('Label bulunamadi:', labelName);
    return;
  }

  const threads = label.getThreads();
  if (!threads || threads.length === 0) {
    console.log('Yeni etiketli thread yok.');
    return;
  }

  threads.forEach(thread => {
    const messages = thread.getMessages();
    messages.forEach(msg => {
      // Eğer gerekiyorsa unread kontrolü yapabilirsin. Burada tüm mesajları işliyoruz.
      const rawBody = msg.getPlainBody();
      const parsed = extractSmsData(rawBody);

      if (parsed) {
        const cache = CacheService.getScriptCache();
        const smsHash = generateSmsHash(parsed.from, parsed.text, parsed.date);

        // Daha önce işlendi mi?
        if (cache.get(smsHash)) {
          console.log('Duplicate SMS atlandı:', smsHash);
          return;
        }

        // Cache'e yaz (6 saat)
        cache.put(smsHash, '1', 21600);
      }

      // parsed null ise ham kaydı da istersen buraya yazabilirsin
      if (parsed) {
        sheet.appendRow([parsed.from, parsed.text, parsed.date, new Date()]);
      } else {
        // Parsing hatası olursa ham gövdeyi kaydet (opsiyonel)
        sheet.appendRow([
          'unknown',
          rawBody,
          new Date(msg.getDate()),
          new Date(), // created_at
        ]);
      }
    });

    // Thread işlendi → etiketi kaldır (tekrar işlenmesin)
    thread.removeLabel(label);
  });

  console.log('processNewSmsEmails: tamamlandi. Threads islemesi bitti.');
}

// ------------------ SMS içeriğini ayrıştıran yardımcı (parser) ------------------
function extractSmsData(body) {
  try {
    // Normalleştir: \r kaldır, trim, satırlara ayır
    const normalized = (body || '').replace(/\r/g, ''); // const normalized = body.replace(/\r/g, '');
    const lines = normalized
      .split('\n')
      .map(l => l.trim())
      .filter(l => l !== '');

    // From: ... satırını bul
    const fromLine = lines.find(l => /^From:/i.test(l));
    // Received At: ... satırını bul
    const dateLine = lines.find(l => /^Received At:/i.test(l));

    let from = '';
    let date = '';
    let text = '';

    if (fromLine) from = fromLine.replace(/^From:/i, '').trim();
    if (dateLine) date = dateLine.replace(/^Received At:/i, '').trim();

    // Body: fromLine sonrası ile dateLine öncesi arası
    if (fromLine && dateLine) {
      const start = lines.indexOf(fromLine);
      const end = lines.indexOf(dateLine);
      if (end > start + 0) {
        const bodyLines = lines.slice(start + 1, end);
        text = bodyLines.join('\n').trim();
      } else {
        // beklenmeyen layout -> tüm satırlardan çıkar
        text = lines.join('\n').trim();
      }
    } else {
      // Eğer beklenen etiketler yoksa fallback: body'nin ilki kısa olarak mesaj kabul et
      // burada ihtiyaca göre geliştirilebilir
      text = lines.join('\n').trim();
    }

    // Boş değilse döndür
    if (from || text || date) {
      return {
        from: from || 'unknown',
        text: text || '',
        date: date || new Date().toString(),
      };
    }
    return null;
  } catch (err) {
    console.error('extractSmsData error', err);
    return null;
  }
}

// ------------------ Yardımcı: Gmail API ile label ID listeleme (Advanced Service gerekli) ------------------
function listLabels() {
  try {
    // Advanced Service olan Gmail API etkin olmalı (Resources -> Advanced Google Services -> Gmail API ON)
    const res = Gmail.Users.Labels.list('me');
    const labels = res.labels || [];
    labels.forEach(l => Logger.log(l.name + ' → ' + l.id));
    return labels;
  } catch (err) {
    console.error('listLabels error:', err);
    throw err;
  }
}

// ------------------ enableGmailPush: Gmail'i Pub/Sub'a kayıt etme (Advanced Service gerekli) ------------------
function enableGmailPush(labelId) {
  // labelId örn: "Label_12"
  const topicName = 'projects/sms-realtime-481010/topics/gmail-push-topic'; // değiştirilecekse burayı güncelle

  try {
    // Gmail API kullanılarak watch çağrısı
    const req = {
      labelIds: [labelId],
      topicName: topicName,
    };

    const result = Gmail.Users.watch(req, 'me');
    Logger.log('enableGmailPush result: %s', JSON.stringify(result));
    return result;
  } catch (err) {
    console.error('enableGmailPush error:', err);
    throw err;
  }
}

function enableGmailPushAuto() {
  const LABEL_ID = 'Label_8652507836914564732'; // sms-forward
  const TOPIC = 'projects/sms-realtime-481010/topics/gmail-push-topic';

  const req = {
    labelIds: [LABEL_ID],
    topicName: TOPIC,
  };

  const res = Gmail.Users.watch(req, 'me');
  Logger.log('Push renewed: ' + JSON.stringify(res));
  return res;
}

function testGmailWatch() {
  try {
    const res = Gmail.Users.watch({
      userId: 'me',
      resource: {
        labelIds: ['INBOX'],
        topicName: 'projects/YOUR_PROJECT/topics/YOUR_TOPIC',
      },
    });
    Logger.log(res);
  } catch (e) {
    Logger.log('ERROR: ' + e);
  }
}

// ------------------ Delete SMS after 150 days (cleanup) ------------------
function cleanupExpiredSms() {
  const ss = SpreadsheetApp.openById(SMS_SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);

  const DAYS_TO_KEEP = 150;
  const now = new Date();
  const cutoff = new Date(now.getTime() - DAYS_TO_KEEP * 24 * 60 * 60 * 1000);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  // created_at = 4. kolon
  const createdAtValues = sheet.getRange(2, 4, lastRow - 1, 1).getValues();

  const rowsToDelete = [];

  createdAtValues.forEach((row, i) => {
    const createdAt = row[0];
    if (createdAt instanceof Date && createdAt < cutoff) {
      rowsToDelete.push(i + 2);
    }
  });

  // When deleting rows going in REVERSE order is essential
  rowsToDelete.reverse().forEach(r => sheet.deleteRow(r));

  Logger.log(
    'cleanupExpiredSms: number of deleted records = ' + rowsToDelete.length
  );
}

// ------------------ SMS duplicate kontrol için hash ------------------
function generateSmsHash(from, text, date) {
  const raw = `${from}|${text}|${date}`;
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return bytes.map(b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
}

function doGet(e) {
  const ss = SpreadsheetApp.openById(SMS_SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);

  const since = e.parameter.since ? new Date(e.parameter.since) : null;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return ContentService.createTextOutput('[]').setMimeType(
      ContentService.MimeType.JSON
    );
  }

  const values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();

  const rows = values
    .filter(r => {
      if (!since) return true;
      return r[2] && new Date(r[2]) > since;
    })
    .map(r => ({
      from: r[0],
      body: r[1],
      date: r[2],
      created_at: r[3],
    }));

  return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(
    ContentService.MimeType.JSON
  );
}
