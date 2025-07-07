var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Mentors");

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle("VCU Engineering - Mentor Career Chat");
}

// Get all mentors with available slots
function getMentors() {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  // 🔁 Map header names to indexes
  var nameIdx = headers.indexOf("First & Last Name");
  var areaOfFocusIdx = headers.indexOf("Your area of focus (i.e. process engineering, full stack development, product R&D, etc.)");
  var industryIdx = headers.indexOf("Industry you can share about.");
  var companyIdx = headers.indexOf("Company"); // ✅ Shorter Company column
  var emailIdx = headers.indexOf("Email Address"); // ✅ Use Email Address instead
  var slotIdx = headers.indexOf("Available Slots");

  // Filter out full mentors
  var mentors = data.slice(1).filter(function(row) {
    return row[slotIdx] > 0;
  });

  return mentors.map(function(row) {
    return {
      name: row[nameIdx],
      areaOfFocus: row[areaOfFocusIdx],
      industry: row[industryIdx],
      company: row[companyIdx],
      email: row[emailIdx],
      availableSlots: parseInt(row[slotIdx]) || 0
    };
  });
}

// Book a slot with a mentor
function bookSlot(mentorName, studentEmail) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var nameIdx = headers.indexOf("First & Last Name");
  var slotIdx = headers.indexOf("Available Slots");
  var signupIdx = headers.indexOf("Signed-Up Students");
  var emailIdx = headers.indexOf("Email Address");
  var areaOfFocusIdx = headers.indexOf("Your area of focus (i.e. process engineering, full stack development, product R&D, etc.)");
  var industryIdx = headers.indexOf("Industry you can share about.");
  var companyIdx = headers.indexOf("Company");

  for (var i = 1; i < data.length; i++) {
    if (data[i][nameIdx] === mentorName && data[i][slotIdx] > 0) {
      // Decrease available slots
      sheet.getRange(i + 1, slotIdx + 1).setValue(data[i][slotIdx] - 1);

      // Update signed-up students list
      var currentStudents = data[i][signupIdx] || "";
      sheet.getRange(i + 1, signupIdx + 1).setValue(currentStudents + (currentStudents ? ", " : "") + studentEmail);

      // Get mentor info for email
      var mentorEmail = data[i][emailIdx];
      var areaOfFocus = data[i][areaOfFocusIdx];
      var industry = data[i][industryIdx];
      var company = data[i][companyIdx];

      // Send confirmation email to student
      MailApp.sendEmail({
        to: studentEmail,
        subject: "Career Chat Confirmation with " + mentorName,
        body: "Great news! Your career chat with " + mentorName + " has been confirmed.\n\n" +
              "Here are their details:\n" +
              "Email: " + mentorEmail + "\n" +
              "Area of Focus: " + areaOfFocus + "\n" +
              "Industry: " + industry + "\n" +
              "Company: " + company + "\n\n" +
              "Please reach out to them directly to schedule your call."
      });

      break;
    }
  }

  return true;
}
