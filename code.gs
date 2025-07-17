var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Mentors");

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle("VCU Engineering - Mentor Career Chat")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Generate random verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
}

// Validate VCU email format
function validateVCUEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: "Please enter an email address." };
  }
  
  email = email.trim().toLowerCase();
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Please enter a valid email address." };
  }
  
  // Check for VCU domain
  if (!email.endsWith("@vcu.edu")) {
    return { valid: false, message: "Only VCU students with @vcu.edu email addresses can access this system." };
  }
  
  return { valid: true, email: email };
}

// Send verification code to email
function sendVerificationCode(email) {
  try {
    const validation = validateVCUEmail(email);
    if (!validation.valid) {
      return { 
        success: false, 
        message: validation.message 
      };
    }
    
    const validEmail = validation.email;
    const verificationCode = generateVerificationCode();
    
    // Store verification code temporarily (expires in 10 minutes)
    const expirationTime = new Date().getTime() + (10 * 60 * 1000); // 10 minutes
    PropertiesService.getScriptProperties().setProperty(
      'verification_' + validEmail, 
      JSON.stringify({
        code: verificationCode,
        expires: expirationTime
      })
    );
    
    // Send verification email
    const emailSubject = "VCU Career Chat - Verification Code";
    const emailBody = `
Dear VCU Student,

Your verification code for VCU Career Chat is:

🔐 VERIFICATION CODE: ${verificationCode}

This code will expire in 10 minutes. Please enter this code on the website to access the mentor booking system.

If you did not request this code, please ignore this email.

Best regards,
VCU College of Engineering Career Services Team

---
This is an automated message. Please do not reply to this email.
    `;
    
    try {
      MailApp.sendEmail({
        to: validEmail,
        subject: emailSubject,
        body: emailBody
      });
      
      return { 
        success: true, 
        email: validEmail,
        message: "Verification code sent! Check your email." 
      };
      
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return { 
        success: false, 
        message: "Failed to send verification email. Please check if your email address is correct." 
      };
    }
    
  } catch (error) {
    console.error("Error in sendVerificationCode:", error);
    return { 
      success: false, 
      message: "Failed to send verification code. Please try again." 
    };
  }
}

// Verify the code and authenticate user
function verifyCodeAndAuthenticate(email, code) {
  try {
    const validation = validateVCUEmail(email);
    if (!validation.valid) {
      return { 
        success: false, 
        message: validation.message 
      };
    }
    
    const validEmail = validation.email;
    
    // Get stored verification data
    const verificationData = PropertiesService.getScriptProperties().getProperty('verification_' + validEmail);
    
    if (!verificationData) {
      return { 
        success: false, 
        message: "No verification code found. Please request a new code." 
      };
    }
    
    const parsedData = JSON.parse(verificationData);
    const currentTime = new Date().getTime();
    
    // Check if code has expired
    if (currentTime > parsedData.expires) {
      // Clean up expired code
      PropertiesService.getScriptProperties().deleteProperty('verification_' + validEmail);
      return { 
        success: false, 
        message: "Verification code has expired. Please request a new code." 
      };
    }
    
    // Check if code matches
    if (code.trim() !== parsedData.code) {
      return { 
        success: false, 
        message: "Invalid verification code. Please check your email and try again." 
      };
    }
    
    // Code is valid - clean up verification data and create session
    PropertiesService.getScriptProperties().deleteProperty('verification_' + validEmail);
    
    // Create authenticated session
    const sessionId = Utilities.getUuid();
    const sessionData = {
      email: validEmail,
      timestamp: new Date().getTime(),
      verified: true
    };
    
    PropertiesService.getScriptProperties().setProperty('session_' + sessionId, JSON.stringify(sessionData));
    
    return { 
      success: true, 
      email: validEmail,
      sessionId: sessionId,
      message: "Email verified successfully!" 
    };
    
  } catch (error) {
    console.error("Error in verifyCodeAndAuthenticate:", error);
    return { 
      success: false, 
      message: "Verification failed. Please try again." 
    };
  }
}

// Debug function to check spreadsheet columns
function debugSpreadsheetColumns() {
  try {
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    
    console.log("=== SPREADSHEET DEBUG INFO ===");
    console.log("Total columns found:", headers.length);
    console.log("Total rows found:", data.length);
    
    headers.forEach(function(header, index) {
      console.log("Column " + index + ": '" + header + "'");
    });
    
    return {
      totalColumns: headers.length,
      totalRows: data.length,
      headers: headers,
      success: true
    };
    
  } catch (error) {
    console.error("Debug error:", error);
    return { success: false, error: error.message };
  }
}

// Get mentors - requires verified email
function getMentors(userEmail) {
  try {
    // Validate the email format
    const validation = validateVCUEmail(userEmail);
    if (!validation.valid) {
      throw new Error("Invalid email: " + validation.message);
    }
    
    const studentEmail = validation.email;
    
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return [];
    }
    
    var headers = data[0];

    // Debug: Log all headers to help troubleshoot
    console.log("All spreadsheet headers:", headers);

    // Map header indexes using YOUR EXACT column names, with flexible matching
    var nameIdx = headers.indexOf("First & Last Name");
    var areaOfFocusIdx = headers.indexOf("Your area of focus (i.e. process engineering, full stack development, product R&D, etc.)");
    var industryIdx = headers.indexOf("Industry you can share about.");
    var companyIdx = headers.indexOf("Company you can share about (where you work now or have worked recently).");
    
    // Try to find the preferred email column with flexible matching (trim spaces)
    var emailIdx = -1;
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i].trim();
      if (header === "Preferred email address for students to use to contact you. This email will only be shared with the specific student(s) who sign up to talk with you.") {
        emailIdx = i;
        break;
      }
    }
    
    var slotIdx = headers.indexOf("Available Slots");
    var signupIdx = headers.indexOf("Signed-Up Students");
    
    // Try the longer conversation column name for slots
    var conversationsIdx = -1;
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i].trim();
      if (header.includes("How many conversations") && header.includes("would you be open to having")) {
        conversationsIdx = i;
        break;
      }
    }
    
    // If Available Slots doesn't exist, use the conversations column
    if (slotIdx === -1 && conversationsIdx !== -1) {
      slotIdx = conversationsIdx;
      console.log("Using conversations column for slots at index: " + slotIdx);
    }
    
    // Try the shorter "Company" column if the long one doesn't work
    if (companyIdx === -1) {
      var shortCompanyIdx = headers.indexOf("Company");
      if (shortCompanyIdx !== -1) {
        companyIdx = shortCompanyIdx;
        console.log("Using short Company column at index: " + companyIdx);
      }
    }

    // Debug: Log which columns were found
    console.log("Column mapping results:", {
      nameIdx: nameIdx,
      areaOfFocusIdx: areaOfFocusIdx,
      industryIdx: industryIdx,
      companyIdx: companyIdx,
      emailIdx: emailIdx,
      slotIdx: slotIdx,
      signupIdx: signupIdx
    });

    // Check which specific columns are missing with more helpful messages
    var missingColumns = [];
    if (nameIdx === -1) missingColumns.push("'First & Last Name'");
    if (areaOfFocusIdx === -1) missingColumns.push("'Your area of focus (i.e. process engineering, full stack development, product R&D, etc.)'");
    if (industryIdx === -1) missingColumns.push("'Industry you can share about.'");
    if (companyIdx === -1) missingColumns.push("'Company you can share about (where you work now or have worked recently).' OR 'Company'");
    if (emailIdx === -1) missingColumns.push("'Preferred email address for students to use to contact you...' (check for extra spaces)");
    if (slotIdx === -1) missingColumns.push("'Available Slots' OR conversations column");

    if (missingColumns.length > 0) {
      console.log("Column mapping debug info:");
      console.log("nameIdx:", nameIdx);
      console.log("areaOfFocusIdx:", areaOfFocusIdx);
      console.log("industryIdx:", industryIdx);
      console.log("companyIdx:", companyIdx);
      console.log("emailIdx:", emailIdx);
      console.log("slotIdx:", slotIdx);
      console.log("signupIdx:", signupIdx);
      
      throw new Error("Missing required columns: " + missingColumns.join(", ") + ". Please check column names for extra spaces or typos.");
    }

    // If Signed-Up Students column doesn't exist, add it
    if (signupIdx === -1) {
      console.log("Adding 'Signed-Up Students' column...");
      // Find the last column and add the new column
      var lastColumn = headers.length + 1;
      sheet.getRange(1, lastColumn).setValue("Signed-Up Students");
      signupIdx = lastColumn - 1; // Adjust for 0-based indexing
      
      // Refresh data to include the new column
      data = sheet.getDataRange().getValues();
      headers = data[0];
      
      console.log("Added 'Signed-Up Students' column at index " + signupIdx);
    }

    // Return mentor data
    return data.slice(1).map(function(row) {
      var signedUp = row[signupIdx] ? row[signupIdx].split(",").map(e => e.trim()) : [];
      
      return {
        name: row[nameIdx] || "",
        areaOfFocus: row[areaOfFocusIdx] || "",
        industry: row[industryIdx] || "",
        company: row[companyIdx] || "",
        email: row[emailIdx] || "",
        availableSlots: parseInt(row[slotIdx]) || 0,
        signedUpStudents: signedUp,
        isBookedByCurrentUser: signedUp.includes(studentEmail)
      };
    });
    
  } catch (error) {
    console.error("Error in getMentors:", error);
    throw new Error("Failed to load mentors: " + error.message);
  }
}

// Get detailed mentor information for profile page
function getMentorProfile(mentorName, userEmail) {
  try {
    // Validate the user email
    const validation = validateVCUEmail(userEmail);
    if (!validation.valid) {
      throw new Error("Invalid email: " + validation.message);
    }
    
    const studentEmail = validation.email;
    
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      throw new Error("No mentor data found");
    }
    
    var headers = data[0];

    // Map all column indexes for detailed profile
    var nameIdx = headers.indexOf("First & Last Name");
    var areaOfFocusIdx = headers.indexOf("Your area of focus (i.e. process engineering, full stack development, product R&D, etc.)");
    var industryIdx = headers.indexOf("Industry you can share about.");
    var companyIdx = headers.indexOf("Company you can share about (where you work now or have worked recently).");
    var majorIdx = headers.indexOf("Your major in college, if relevant.");
    var additionalInfoIdx = headers.indexOf("Any other information about yourself that might be helpful to a student in determining whom to talk with?");
    var linkedinIdx = headers.indexOf("Your LinkedIn URL, if you are comfortable with it being public to many students.");
    
    // Find preferred email column with flexible matching
    var emailIdx = -1;
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i].trim();
      if (header === "Preferred email address for students to use to contact you. This email will only be shared with the specific student(s) who sign up to talk with you.") {
        emailIdx = i;
        break;
      }
    }
    
    var slotIdx = headers.indexOf("Available Slots");
    var signupIdx = headers.indexOf("Signed-Up Students");
    
    // Try conversations column for slots if needed
    var conversationsIdx = -1;
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i].trim();
      if (header.includes("How many conversations") && header.includes("would you be open to having")) {
        conversationsIdx = i;
        break;
      }
    }
    
    if (slotIdx === -1 && conversationsIdx !== -1) {
      slotIdx = conversationsIdx;
    }
    
    // Try short company column if long one doesn't exist
    if (companyIdx === -1) {
      var shortCompanyIdx = headers.indexOf("Company");
      if (shortCompanyIdx !== -1) {
        companyIdx = shortCompanyIdx;
      }
    }

    // Find the specific mentor
    for (var i = 1; i < data.length; i++) {
      if (data[i][nameIdx] === mentorName) {
        var signedUp = data[i][signupIdx] ? data[i][signupIdx].split(",").map(e => e.trim()) : [];
        var linkedinUrl = data[i][linkedinIdx] || "";
        
        // Clean up LinkedIn URL
        if (linkedinUrl && !linkedinUrl.startsWith("http")) {
          linkedinUrl = "https://" + linkedinUrl;
        }
        
        return {
          name: data[i][nameIdx] || "",
          areaOfFocus: data[i][areaOfFocusIdx] || "",
          industry: data[i][industryIdx] || "",
          company: data[i][companyIdx] || "",
          major: data[i][majorIdx] || "",
          additionalInfo: data[i][additionalInfoIdx] || "",
          linkedinUrl: linkedinUrl,
          email: data[i][emailIdx] || "",
          availableSlots: parseInt(data[i][slotIdx]) || 0,
          signedUpStudents: signedUp,
          isBookedByCurrentUser: signedUp.includes(studentEmail)
        };
      }
    }
    
    throw new Error("Mentor not found: " + mentorName);
    
  } catch (error) {
    console.error("Error in getMentorProfile:", error);
    throw new Error("Failed to load mentor profile: " + error.message);
  }
}

// Book a slot with a mentor
function bookSlot(mentorName, userEmail) {
  try {
    // Validate the user email
    const validation = validateVCUEmail(userEmail);
    if (!validation.valid) {
      return { 
        success: false, 
        message: "Invalid email: " + validation.message 
      };
    }
    
    const studentEmail = validation.email;
    
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    
    // Get column indices using the same flexible logic as getMentors
    var nameIdx = headers.indexOf("First & Last Name");
    var slotIdx = headers.indexOf("Available Slots");
    var signupIdx = headers.indexOf("Signed-Up Students");
    
    // Find preferred email column with flexible matching
    var emailIdx = -1;
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i].trim();
      if (header === "Preferred email address for students to use to contact you. This email will only be shared with the specific student(s) who sign up to talk with you.") {
        emailIdx = i;
        break;
      }
    }
    
    var areaOfFocusIdx = headers.indexOf("Your area of focus (i.e. process engineering, full stack development, product R&D, etc.)");
    var industryIdx = headers.indexOf("Industry you can share about.");
    var companyIdx = headers.indexOf("Company you can share about (where you work now or have worked recently).");
    
    // Try alternative column names if exact match fails
    var conversationsIdx = -1;
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i].trim();
      if (header.includes("How many conversations") && header.includes("would you be open to having")) {
        conversationsIdx = i;
        break;
      }
    }
    
    if (slotIdx === -1 && conversationsIdx !== -1) {
      slotIdx = conversationsIdx;
    }
    
    if (companyIdx === -1) {
      var shortCompanyIdx = headers.indexOf("Company");
      if (shortCompanyIdx !== -1) {
        companyIdx = shortCompanyIdx;
      }
    }

    // Check if student has already booked ANY mentor
    for (var i = 1; i < data.length; i++) {
      var signedUp = data[i][signupIdx] || "";
      if (signedUp.split(",").map(e => e.trim()).includes(studentEmail)) {
        return { 
          success: false, 
          message: "You have already booked a session with another mentor. Each student can only book one mentor." 
        };
      }
    }

    // Find the selected mentor and book
    for (var i = 1; i < data.length; i++) {
      if (data[i][nameIdx] === mentorName) {
        var availableSlots = parseInt(data[i][slotIdx]) || 0;
        
        if (availableSlots <= 0) {
          return { 
            success: false, 
            message: "This mentor has no available slots remaining." 
          };
        }
        
        // Update spreadsheet - decrease slots and add student
        sheet.getRange(i + 1, slotIdx + 1).setValue(availableSlots - 1);
        
        var currentStudents = data[i][signupIdx] || "";
        var updatedStudents = currentStudents + (currentStudents ? ", " : "") + studentEmail;
        sheet.getRange(i + 1, signupIdx + 1).setValue(updatedStudents);
        
        // Get mentor details for email
        var mentorEmail = data[i][emailIdx];
        var areaOfFocus = data[i][areaOfFocusIdx];
        var industry = data[i][industryIdx];
        var company = data[i][companyIdx];
        
        // Send confirmation email
        var emailSubject = "VCU Career Chat Confirmed - " + mentorName;
        var emailBody = `
Dear ${studentEmail},

Congratulations! Your career chat session with ${mentorName} has been successfully booked.

📋 MENTOR DETAILS:
• Name: ${mentorName}
• Email: ${mentorEmail}
• Area of Focus: ${areaOfFocus}
• Industry: ${industry}
• Company: ${company}

📅 NEXT STEPS:
1. Reach out to ${mentorName} directly at: ${mentorEmail}
2. Schedule a convenient time for your 20-30 minute video call
3. The conversation should take place between Oct 6 and Nov 21
4. Prepare thoughtful questions about their career path and industry

💡 CONVERSATION TIPS:
• Ask about their day-to-day responsibilities
• Inquire about career growth opportunities
• Discuss industry trends and challenges
• Request advice for new graduates

We're excited for you to connect with ${mentorName}!

Best regards,
VCU College of Engineering Career Services Team

---
This is an automated message. Please do not reply to this email.
        `;
        
        try {
          MailApp.sendEmail({
            to: studentEmail,
            subject: emailSubject,
            body: emailBody
          });
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
          // Don't fail the booking if email fails
        }
        
        return { 
          success: true, 
          message: `Successfully booked with ${mentorName}! Check your VCU email (${studentEmail}) for confirmation details.` 
        };
      }
    }
    
    return { 
      success: false, 
      message: "Mentor not found or no longer available." 
    };
    
  } catch (error) {
    console.error("Error in bookSlot:", error);
    return { 
      success: false, 
      message: "Booking failed: " + error.message 
    };
  }
}

// Check if user has already booked a mentor
function checkUserBookingStatus(userEmail) {
  try {
    const validation = validateVCUEmail(userEmail);
    if (!validation.valid) {
      return { hasBooked: false, error: "Invalid email" };
    }
    
    const studentEmail = validation.email;
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var signupIdx = headers.indexOf("Signed-Up Students");
    var nameIdx = headers.indexOf("First & Last Name");
    
    for (var i = 1; i < data.length; i++) {
      var signedUp = data[i][signupIdx] || "";
      if (signedUp.split(",").map(e => e.trim()).includes(studentEmail)) {
        return {
          hasBooked: true,
          mentorName: data[i][nameIdx]
        };
      }
    }
    
    return { hasBooked: false };
    
  } catch (error) {
    console.error("Error checking booking status:", error);
    return { hasBooked: false, error: error.message };
  }
}
