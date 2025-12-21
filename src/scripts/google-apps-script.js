/**
 * Google Apps Script to handle form submissions from Learn and Travel.
 * 
 * INSTRUCTIONS:
 * 1. Go to https://script.google.com/home
 * 2. Click "New Project".
 * 3. Paste this code into the editor (replace existing code).
 * 4. Save the project (Give it a name like "Learn and Travel Database").
 * 5. Click "Deploy" > "New Deployment".
 * 6. Select type: "Web App".
 * 7. Description: "v1".
 * 8. Execute as: "Me" (your email).
 * 9. Who has access: "Anyone" (This is crucial for the form to work).
 * 10. Click "Deploy".
 * 11. Copy the "Web App URL" (it ends in /exec).
 * 12. Provide this URL to the developer.
 */

function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        try {
            // FIXED: Hardcoded Sheet ID to prevent "Exception" in standalone scripts
            // Sheet URL: https://docs.google.com/spreadsheets/d/1echUoPA8XBQwdoQMf9Y4j1-Sak5Yv-46TFkL1FnZKos/edit
            var doc = SpreadsheetApp.openById('1echUoPA8XBQwdoQMf9Y4j1-Sak5Yv-46TFkL1FnZKos');
            var sheet = doc.getActiveSheet();

            var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            var nextRow = sheet.getLastRow() + 1;

            // Parse JSON body
            var data = JSON.parse(e.postData.contents);
            var newRow = [];

            // Auto-add headers if sheet is empty
            if (sheet.getLastRow() === 0) {
                var initialHeaders = ["Date", "Program ID", "Name", "Email", "Phone", "Interest", "Extra Data"];
                sheet.getRange(1, 1, 1, initialHeaders.length).setValues([initialHeaders]);
                headers = initialHeaders;
                nextRow = 2;
            }

            // Map data to headers
            // Simple version: Fixed columns
            newRow.push(new Date());
            newRow.push(data.programId || '');
            newRow.push(data.name || '');
            newRow.push(data.email || '');
            newRow.push(data.phone || '');
            newRow.push(data.interest || '');
            newRow.push(JSON.stringify(data)); // Dump everything else as JSON backup

            sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

            return ContentService
                .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
                .setMimeType(ContentService.MimeType.JSON);

        } catch (e) {
            return ContentService
                .createTextOutput(JSON.stringify({ "result": "error", "error": e }))
                .setMimeType(ContentService.MimeType.JSON);
        } finally {
            lock.releaseLock();
        }
    }
