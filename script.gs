function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const params = e.parameter;
    
    Logger.log('Received params:', params); // לוג לבדיקה
    
    // בדיקה שכל השדות הנדרשים קיימים
    if (!params.name) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'חסר שם מלא'
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }

    // הוספת תאריך ושעת הרישום
    const timestamp = new Date().toLocaleString('he-IL');
    
    // הוספת השורה לגיליון
    sheet.appendRow([
      timestamp,
      params.name,
      params.wishes || '',
      params.event || 'ברית מילה - משפחת עטר',
      params.date || '15.9.25 - 10:00'
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'הנתונים נשמרו בהצלחה'
    }))
    .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error:', error); // לוג לבדיקה
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}