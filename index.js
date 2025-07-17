<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VCU Engineering - Mentor Career Chat</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: #333;
    }

    /* Authentication Screen Styles */
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .auth-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      text-align: center;
    }

    .auth-card h1 {
      color: #1e3a8a;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .auth-card .subtitle {
      color: #6b7280;
      font-size: 16px;
      margin-bottom: 30px;
      line-height: 1.5;
    }

    .email-input, .code-input {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 16px;
      margin-bottom: 20px;
      transition: border-color 0.2s ease;
      text-align: center;
    }

    .code-input {
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 4px;
      font-family: monospace;
    }

    .email-input:focus, .code-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .email-input::placeholder, .code-input::placeholder {
      color: #9ca3af;
      letter-spacing: normal;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 400;
    }

    .auth-btn {
      background: #4285f4;
      color: white;
      border: none;
      border-radius: 12px;
      padding: 14px 24px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s ease;
      margin-bottom: 15px;
    }

    .auth-btn:hover:not(:disabled) {
      background: #3367d6;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
    }

    .auth-btn:active {
      transform: translateY(0);
    }

    .auth-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
    }

    .secondary-btn {
      background: transparent;
      color: #6b7280;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s ease;
    }

    .secondary-btn:hover:not(:disabled) {
      border-color: #3b82f6;
      color: #3b82f6;
    }

    .requirement-note {
      background: #f3f4f6;
      border-radius: 12px;
      padding: 16px;
      font-size: 14px;
      color: #6b7280;
      border-left: 4px solid #1e3a8a;
      text-align: left;
    }

    .verification-note {
      background: #eff6ff;
      border-radius: 12px;
      padding: 16px;
      font-size: 14px;
      color: #1e40af;
      border-left: 4px solid #3b82f6;
      text-align: left;
      margin-bottom: 20px;
    }

    .error-message {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 12px;
      border-radius: 8px;
      margin: 15px 0;
      font-size: 14px;
    }

    .success-message {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #059669;
      padding: 12px;
      border-radius: 8px;
      margin: 15px 0;
      font-size: 14px;
    }

    .info-message {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e40af;
      padding: 12px;
      border-radius: 8px;
      margin: 15px 0;
      font-size: 14px;
    }

    /* Loading spinner for auth */
    .auth-loader {
      border: 3px solid #f3f4f6;
      border-top: 3px solid #4285f4;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
      display: inline-block;
      margin-right: 10px;
    }

    /* Main App Styles */
    .main-app {
      background: #f9fafb;
      min-height: 100vh;
    }

    .app-header {
      background: #1e3a8a;
      color: white;
      padding: 20px;
      text-align: center;
      position: relative;
    }

    .app-header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .app-header .subtitle {
      font-size: 16px;
      opacity: 0.9;
    }

    .user-info {
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      font-size: 14px;
    }

    .user-email {
      background: rgba(255,255,255,0.2);
      padding: 8px 12px;
      border-radius: 20px;
      font-weight: 500;
    }

    .logout-btn {
      background: #dc2626;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: background 0.2s ease;
    }

    .logout-btn:hover {
      background: #b91c1c;
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    /* Already Booked Alert */
    .booking-alert {
      background: #fffbeb;
      border: 1px solid #fbbf24;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 30px;
      text-align: center;
    }

    .booking-alert h3 {
      color: #92400e;
      margin-bottom: 10px;
    }

    /* Filter Bar */
    .filter-bar {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .filter-input {
      flex: 1;
      min-width: 200px;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s ease;
    }

    .filter-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Mentor Table */
    .mentors-table {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background: #f8fafc;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
    }

    td {
      padding: 16px;
      border-bottom: 1px solid #f3f4f6;
      vertical-align: top;
    }

    tr:hover {
      background: #f9fafb;
    }

    .mentor-name {
      font-weight: 600;
      color: #1f2937;
    }

    .book-btn {
      background: #059669;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .book-btn:hover {
      background: #047857;
      transform: translateY(-1px);
    }

    .full-btn, .booked-btn {
      background: #e5e7eb;
      color: #6b7280;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: not-allowed;
      font-size: 14px;
      font-weight: 500;
    }

    .booked-btn {
      background: #fef3c7;
      color: #92400e;
    }

    /* Loading Animation */
    .loading-container {
      text-align: center;
      padding: 60px 20px;
    }

    .loader {
      border: 4px solid #f3f4f6;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Mentor Profile Modal */
    .profile-modal {
      display: none;
      position: fixed;
      z-index: 1001;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.6);
      animation: fadeIn 0.2s ease;
    }

    .profile-modal-content {
      background: white;
      margin: 3% auto;
      padding: 0;
      border-radius: 12px;
      width: 90%;
      max-width: 700px;
      max-height: 85vh;
      overflow-y: auto;
      animation: slideIn 0.3s ease;
    }

    .profile-header {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: white;
      padding: 30px;
      border-radius: 12px 12px 0 0;
      position: relative;
    }

    .profile-close {
      position: absolute;
      top: 15px;
      right: 20px;
      color: white;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s ease;
    }

    .profile-close:hover {
      background: rgba(255,255,255,0.2);
    }

    .profile-name {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .profile-company {
      font-size: 16px;
      opacity: 0.9;
    }

    .profile-body {
      padding: 30px;
    }

    .profile-section {
      margin-bottom: 25px;
    }

    .profile-section h3 {
      color: #1f2937;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .profile-section p {
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 8px;
    }

    .profile-highlight {
      background: #f8fafc;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
    }

    .profile-stats {
      display: flex;
      gap: 20px;
      margin-bottom: 25px;
    }

    .profile-stat {
      background: #f3f4f6;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      flex: 1;
    }

    .profile-stat-number {
      font-size: 24px;
      font-weight: 700;
      color: #1e3a8a;
      display: block;
    }

    .profile-stat-label {
      font-size: 14px;
      color: #6b7280;
      margin-top: 4px;
    }

    .linkedin-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #0066cc;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .linkedin-link:hover {
      color: #004499;
    }

    .profile-actions {
      display: flex;
      gap: 15px;
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #e5e7eb;
    }

    .profile-book-btn {
      background: #059669;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      flex: 1;
      transition: all 0.2s ease;
    }

    .profile-book-btn:hover:not(:disabled) {
      background: #047857;
      transform: translateY(-1px);
    }

    .profile-book-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
    }

    .profile-back-btn {
      background: #f3f4f6;
      color: #374151;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
    }

    .profile-back-btn:hover {
      background: #e5e7eb;
    }

    /* Profile Loading State */
    .profile-loading {
      text-align: center;
      padding: 60px 30px;
      color: #6b7280;
    }

    .profile-loading-spinner {
      border: 4px solid #f3f4f6;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    .profile-loading h4 {
      font-size: 18px;
      margin-bottom: 8px;
      color: #374151;
    }

    .profile-loading p {
      font-size: 14px;
      color: #9ca3af;
    }

    .profile-skeleton {
      padding: 30px;
    }

    .skeleton-line {
      height: 16px;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
      margin-bottom: 12px;
    }

    .skeleton-line.short {
      width: 60%;
    }

    .skeleton-line.medium {
      width: 80%;
    }

    .skeleton-line.long {
      width: 100%;
    }

    .skeleton-stats {
      display: flex;
      gap: 20px;
      margin-bottom: 25px;
    }

    .skeleton-stat {
      flex: 1;
      height: 80px;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 8px;
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
      display: none;
      position: fixed;
      z-index: 2000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.6);
      animation: fadeIn 0.2s ease;
    }

    .confirm-modal-content {
      background: white;
      margin: 20% auto;
      padding: 30px;
      border-radius: 12px;
      width: 90%;
      max-width: 450px;
      text-align: center;
      animation: slideIn 0.3s ease;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .confirm-modal h3 {
      color: #1f2937;
      margin-bottom: 20px;
      font-size: 20px;
      font-weight: 600;
    }

    .confirm-modal p {
      color: #6b7280;
      margin-bottom: 25px;
      line-height: 1.5;
    }

    .confirm-modal-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .confirm-ok-btn {
      background: #059669;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      min-width: 100px;
      transition: all 0.2s ease;
    }

    .confirm-ok-btn:hover {
      background: #047857;
      transform: translateY(-1px);
    }

    .confirm-cancel-btn {
      background: #6b7280;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      min-width: 100px;
      transition: all 0.2s ease;
    }

    .confirm-cancel-btn:hover {
      background: #4b5563;
    }
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: white;
      margin: 10% auto;
      padding: 30px;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      text-align: center;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { transform: translateY(-50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .modal h3 {
      color: #1f2937;
      margin-bottom: 15px;
      font-size: 20px;
    }

    .modal-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 25px;
    }

    .confirm-btn {
      background: #059669;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
    }

    .cancel-btn {
      background: #6b7280;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
    }

    .hidden {
      display: none;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .user-info {
        position: static;
        margin-top: 15px;
        justify-content: center;
      }

      .filter-bar {
        flex-direction: column;
      }

      .filter-input {
        min-width: auto;
      }

      th, td {
        padding: 12px 8px;
        font-size: 14px;
      }

      .modal-content {
        margin: 20% auto;
        padding: 20px;
      }

      .modal-buttons {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>

  <!-- Email Input Screen -->
  <div id="emailScreen" class="auth-container">
    <div class="auth-card">
      <h1>🎓 VCU Career Chat</h1>
      <p class="subtitle">Connect with industry professionals and alumni for personalized career guidance</p>
      
      <div id="emailMessage"></div>
      
      <input 
        type="email" 
        id="emailInput" 
        class="email-input" 
        placeholder="Enter your VCU email (e.g., student@vcu.edu)"
        onkeypress="handleEmailEnterKey(event)"
      >
      
      <button id="sendCodeBtn" class="auth-btn" onclick="handleSendCode()">
        Send Verification Code
      </button>
      
      <div class="requirement-note">
        <strong>Email Verification Required:</strong>
        <ul style="margin: 10px 0; padding-left: 20px; text-align: left;">
          <li>Enter your real @vcu.edu email address</li>
          <li>We'll send a 6-digit verification code to confirm</li>
          <li>Only verified VCU students can access mentors</li>
          <li>Each student can book only one mentor session</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Verification Code Screen -->
  <div id="verificationScreen" class="auth-container hidden">
    <div class="auth-card">
      <h1>📧 Check Your Email</h1>
      <p class="subtitle">We've sent a verification code to your VCU email address</p>
      
      <div class="verification-note">
        <strong>📬 Email sent to:</strong> <span id="verificationEmail"></span><br>
        <strong>⏱️ Code expires in:</strong> 10 minutes
      </div>
      
      <div id="verificationMessage"></div>
      
      <input 
        type="text" 
        id="codeInput" 
        class="code-input" 
        placeholder="Enter 6-digit code"
        maxlength="6"
        onkeypress="handleCodeEnterKey(event)"
        oninput="formatCodeInput(this)"
      >
      
      <button id="verifyBtn" class="auth-btn" onclick="handleVerifyCode()">
        Verify and Sign In
      </button>
      
      <button class="secondary-btn" onclick="showEmailScreen()">
        ← Use Different Email
      </button>
    </div>
  </div>

  <!-- Main Application -->
  <div id="mainApp" class="main-app hidden">
    <header class="app-header">
      <h1>🎓 VCU Engineering - Mentor Career Chat</h1>
      <p class="subtitle">Select a mentor below to book your career conversation</p>
      <div class="user-info">
        <span class="user-email" id="userEmail">✅ Verified</span>
        <button class="logout-btn" onclick="handleLogout()">Logout</button>
      </div>
    </header>

    <div class="main-content">
      <!-- Already Booked Alert -->
      <div id="bookingAlert" class="booking-alert hidden">
        <h3>✅ You have already booked a mentor session</h3>
        <p>You are scheduled to meet with <strong id="bookedMentorName"></strong>. Check your email for contact details.</p>
      </div>

      <!-- Filter Controls -->
      <div class="filter-bar">
        <input type="text" class="filter-input" id="searchName" placeholder="Search by mentor name..." onkeyup="filterMentors()">
        <input type="text" class="filter-input" id="searchCompany" placeholder="Filter by company..." onkeyup="filterMentors()">
        <select class="filter-input" id="filterIndustry" onchange="filterMentors()">
          <option value="">All Industries</option>
        </select>
      </div>

      <!-- Loading State -->
      <div id="loadingState" class="loading-container">
        <div class="loader"></div>
        <p>Loading mentors...</p>
      </div>

      <!-- Mentors Table -->
      <div id="mentorsTable" class="mentors-table hidden">
        <table>
          <thead>
            <tr>
              <th>Mentor Name</th>
              <th>Area of Focus</th>
              <th>Industry</th>
              <th>Company</th>
              <th>Available Slots</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="mentorsTableBody"></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Custom Confirmation Modal -->
  <div id="confirmModal" class="confirm-modal">
    <div class="confirm-modal-content">
      <h3 id="confirmTitle">Confirm Booking</h3>
      <p id="confirmMessage"></p>
      <div class="confirm-modal-buttons">
        <button class="confirm-cancel-btn" onclick="closeConfirmModal()">Cancel</button>
        <button class="confirm-ok-btn" onclick="confirmBookingChoice()">OK</button>
      </div>
    </div>
  </div>

  <!-- Mentor Profile Modal -->
  <div id="profileModal" class="profile-modal">
    <div class="profile-modal-content">
      <div class="profile-header">
        <span class="profile-close" onclick="closeProfileModal()">&times;</span>
        <div class="profile-name" id="profileName"></div>
        <div class="profile-company" id="profileCompany"></div>
      </div>
      
      <div class="profile-body">
        <!-- Loading State -->
        <div id="profileLoadingState" class="profile-loading hidden">
          <div class="profile-loading-spinner"></div>
          <h4>Loading Profile...</h4>
          <p>Getting mentor details</p>
        </div>

        <!-- Skeleton Loading -->
        <div id="profileSkeleton" class="profile-skeleton hidden">
          <div class="skeleton-stats">
            <div class="skeleton-stat"></div>
            <div class="skeleton-stat"></div>
          </div>
          
          <div class="skeleton-line long"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line short"></div>
          <br>
          
          <div class="skeleton-line long"></div>
          <div class="skeleton-line medium"></div>
          <br>
          
          <div class="skeleton-line short"></div>
          <div class="skeleton-line medium"></div>
        </div>

        <!-- Actual Profile Content -->
        <div id="profileContent" class="hidden">
          <div class="profile-stats">
            <div class="profile-stat">
              <span class="profile-stat-number" id="profileSlots">0</span>
              <div class="profile-stat-label">Available Slots</div>
            </div>
            <div class="profile-stat">
              <span class="profile-stat-number" id="profileBooked">0</span>
              <div class="profile-stat-label">Students Booked</div>
            </div>
          </div>

          <div class="profile-section">
            <h3>🎯 Area of Focus</h3>
            <div class="profile-highlight">
              <p id="profileFocus"></p>
            </div>
          </div>

          <div class="profile-section">
            <h3>🏢 Professional Background</h3>
            <p><strong>Industry:</strong> <span id="profileIndustry"></span></p>
            <p><strong>Company:</strong> <span id="profileCompanyDetail"></span></p>
            <p id="profileMajorSection"><strong>College Major:</strong> <span id="profileMajor"></span></p>
          </div>

          <div class="profile-section" id="profileLinkedInSection">
            <h3>🔗 Connect</h3>
            <a id="profileLinkedIn" class="linkedin-link" target="_blank">
              <span>View LinkedIn Profile</span>
              <span>↗</span>
            </a>
          </div>

          <div class="profile-section" id="profileAdditionalSection">
            <h3>💡 Additional Information</h3>
            <p id="profileAdditional"></p>
          </div>

          <div class="profile-actions">
            <button class="profile-back-btn" onclick="closeProfileModal()">← Back to List</button>
            <button id="profileBookBtn" class="profile-book-btn" onclick="bookFromProfile()">Book Session</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Booking Confirmation Modal -->
  <div id="bookingModal" class="modal">
    <div class="modal-content">
      <h3>Confirm Your Booking</h3>
      <p>Are you sure you want to book a career chat session with:</p>
      <p><strong id="modalMentorName"></strong></p>
      <p>A confirmation email will be sent to <strong id="modalUserEmail"></strong></p>
      
      <div id="bookingMessage"></div>
      
      <div class="modal-buttons">
        <button class="confirm-btn" onclick="confirmBooking()">Yes, Book Session</button>
        <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  </div>

  <script>
    let allMentors = [];
    let selectedMentor = null;
    let currentUserEmail = null;
    let userBookingStatus = null;
    let currentProfile = null;
    let pendingBookingMentor = null;

    // Initialize the application
    function initializeApp() {
      showEmailScreen();
    }

    // Show email input screen
    function showEmailScreen() {
      document.getElementById("emailScreen").classList.remove("hidden");
      document.getElementById("verificationScreen").classList.add("hidden");
      document.getElementById("mainApp").classList.add("hidden");
      
      // Focus on email input
      setTimeout(() => {
        document.getElementById("emailInput").focus();
      }, 100);
    }

    // Show verification screen
    function showVerificationScreen(email) {
      document.getElementById("emailScreen").classList.add("hidden");
      document.getElementById("verificationScreen").classList.remove("hidden");
      document.getElementById("mainApp").classList.add("hidden");
      document.getElementById("verificationEmail").textContent = email;
      
      // Focus on code input
      setTimeout(() => {
        document.getElementById("codeInput").focus();
      }, 100);
    }

    // Show main application
    function showMainApp() {
      document.getElementById("emailScreen").classList.add("hidden");
      document.getElementById("verificationScreen").classList.add("hidden");
      document.getElementById("mainApp").classList.remove("hidden");
      document.getElementById("userEmail").textContent = "✅ " + currentUserEmail;
    }

    // Show message functions
    function showEmailMessage(message, type = "info") {
      const messageDiv = document.getElementById("emailMessage");
      if (message) {
        let className = "info-message";
        if (type === "error") className = "error-message";
        if (type === "success") className = "success-message";
        
        messageDiv.innerHTML = `<div class="${className}">${message}</div>`;
      } else {
        messageDiv.innerHTML = "";
      }
    }

    function showVerificationMessage(message, type = "info") {
      const messageDiv = document.getElementById("verificationMessage");
      if (message) {
        let className = "info-message";
        if (type === "error") className = "error-message";
        if (type === "success") className = "success-message";
        
        messageDiv.innerHTML = `<div class="${className}">${message}</div>`;
      } else {
        messageDiv.innerHTML = "";
      }
    }

    // Handle Enter key in email input
    function handleEmailEnterKey(event) {
      if (event.key === 'Enter') {
        handleSendCode();
      }
    }

    // Handle Enter key in code input
    function handleCodeEnterKey(event) {
      if (event.key === 'Enter') {
        handleVerifyCode();
      }
    }

    // Format code input (numbers only)
    function formatCodeInput(input) {
      input.value = input.value.replace(/[^0-9]/g, '');
    }

    // Handle send verification code
    function handleSendCode() {
      const emailInput = document.getElementById("emailInput");
      const sendCodeBtn = document.getElementById("sendCodeBtn");
      const email = emailInput.value.trim();
      
      if (!email) {
        showEmailMessage("Please enter your VCU email address.", "error");
        emailInput.focus();
        return;
      }
      
      // Show loading state
      sendCodeBtn.disabled = true;
      sendCodeBtn.innerHTML = '<div class="auth-loader"></div>Sending code...';
      showEmailMessage("Sending verification code to your email...", "info");
      
      // Send verification code
      google.script.run
        .withSuccessHandler(function(result) {
          if (result.success) {
            showEmailMessage("Verification code sent! Check your email.", "success");
            setTimeout(() => {
              showVerificationScreen(result.email);
            }, 1500);
          } else {
            sendCodeBtn.disabled = false;
            sendCodeBtn.innerHTML = 'Send Verification Code';
            showEmailMessage(result.message, "error");
            emailInput.focus();
          }
        })
        .withFailureHandler(function(error) {
          console.error("Send code failed:", error);
          sendCodeBtn.disabled = false;
          sendCodeBtn.innerHTML = 'Send Verification Code';
          showEmailMessage("Failed to send verification code. Please try again.", "error");
          emailInput.focus();
        })
        .sendVerificationCode(email);
    }

    // Handle verify code
    function handleVerifyCode() {
      const emailInput = document.getElementById("emailInput");
      const codeInput = document.getElementById("codeInput");
      const verifyBtn = document.getElementById("verifyBtn");
      const email = emailInput.value.trim();
      const code = codeInput.value.trim();
      
      if (!code || code.length !== 6) {
        showVerificationMessage("Please enter the 6-digit verification code.", "error");
        codeInput.focus();
        return;
      }
      
      // Show loading state
      verifyBtn.disabled = true;
      verifyBtn.innerHTML = '<div class="auth-loader"></div>Verifying...';
      showVerificationMessage("Verifying your code...", "info");
      
      // Verify code
      google.script.run
        .withSuccessHandler(function(result) {
          if (result.success) {
            currentUserEmail = result.email;
            showVerificationMessage("Verification successful! Loading mentors...", "success");
            setTimeout(() => {
              showMainApp();
              checkUserBooking();
            }, 1500);
          } else {
            verifyBtn.disabled = false;
            verifyBtn.innerHTML = 'Verify and Sign In';
            showVerificationMessage(result.message, "error");
            codeInput.focus();
            codeInput.select();
          }
        })
        .withFailureHandler(function(error) {
          console.error("Verification failed:", error);
          verifyBtn.disabled = false;
          verifyBtn.innerHTML = 'Verify and Sign In';
          showVerificationMessage("Verification failed. Please try again.", "error");
          codeInput.focus();
        })
        .verifyCodeAndAuthenticate(email, code);
    }

    // Handle logout
    function handleLogout() {
      currentUserEmail = null;
      userBookingStatus = null;
      allMentors = [];
      
      // Reset all form elements and states
      document.getElementById("emailInput").value = "";
      document.getElementById("codeInput").value = "";
      
      // Reset send code button to normal state
      const sendCodeBtn = document.getElementById("sendCodeBtn");
      sendCodeBtn.disabled = false;
      sendCodeBtn.innerHTML = 'Send Verification Code';
      
      // Reset verify button to normal state
      const verifyBtn = document.getElementById("verifyBtn");
      verifyBtn.disabled = false;
      verifyBtn.innerHTML = 'Verify and Sign In';
      
      // Clear any messages
      showEmailMessage("");
      showVerificationMessage("");
      
      // Show email screen with logout message
      showEmailScreen();
      showEmailMessage("You have been logged out.", "info");
    }

    // Check if user has already booked a mentor
    function checkUserBooking() {
      google.script.run
        .withSuccessHandler(function(bookingStatus) {
          userBookingStatus = bookingStatus;
          if (bookingStatus.hasBooked) {
            document.getElementById("bookingAlert").classList.remove("hidden");
            document.getElementById("bookedMentorName").textContent = bookingStatus.mentorName;
          }
          loadMentors();
        })
        .withFailureHandler(function(error) {
          console.error("Error checking booking status:", error);
          loadMentors();
        })
        .checkUserBookingStatus(currentUserEmail);
    }

    // Load mentors data
    function loadMentors() {
      document.getElementById("loadingState").classList.remove("hidden");
      document.getElementById("mentorsTable").classList.add("hidden");

      google.script.run
        .withSuccessHandler(function(mentors) {
          allMentors = mentors;
          populateFilters();
          displayMentors(allMentors);
          document.getElementById("loadingState").classList.add("hidden");
          document.getElementById("mentorsTable").classList.remove("hidden");
        })
        .withFailureHandler(function(error) {
          document.getElementById("loadingState").classList.add("hidden");
          document.getElementById("mentorsTableBody").innerHTML = 
            `<tr><td colspan="6" class="error-message">Error loading mentors: ${error}</td></tr>`;
          document.getElementById("mentorsTable").classList.remove("hidden");
        })
        .getMentors(currentUserEmail);
    }

    // Display mentors in table
    function displayMentors(mentors) {
      const tbody = document.getElementById("mentorsTableBody");
      tbody.innerHTML = "";

      if (mentors.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6' style='text-align:center; padding: 40px;'>No mentors found.</td></tr>";
        return;
      }

      mentors.forEach(function(mentor) {
        const row = document.createElement("tr");

        // Action button logic
        let actionButton = "";
        if (userBookingStatus && userBookingStatus.hasBooked) {
          if (mentor.isBookedByCurrentUser) {
            actionButton = '<button class="booked-btn">Your Mentor</button>';
          } else {
            actionButton = '<button class="full-btn">Already Booked</button>';
          }
        } else if (mentor.availableSlots <= 0) {
          actionButton = '<button class="full-btn">Full</button>';
        } else {
          // Create a unique ID for each book button
          const buttonId = 'book-btn-' + mentors.indexOf(mentor);
          actionButton = `<button class="book-btn" id="${buttonId}" onclick="openBookingModal('${mentor.name.replace(/'/g, "\\'").replace(/"/g, "&quot;")}')">Book Session</button>`;
        }

        row.innerHTML = `
          <td><a href="javascript:void(0)" class="mentor-name-link" onclick="showMentorProfile('${mentor.name.replace(/'/g, "\\'").replace(/"/g, "&quot;")}')">${mentor.name}</a></td>
          <td>${mentor.areaOfFocus}</td>
          <td>${mentor.industry}</td>
          <td>${mentor.company}</td>
          <td>${mentor.availableSlots}</td>
          <td>${actionButton}</td>
        `;
        
        tbody.appendChild(row);
      });
    }

    // Show mentor profile modal with proper loading state
    function showMentorProfile(mentorName) {
      console.log("Showing profile for:", mentorName);
      
      // Open modal immediately with loading state
      document.getElementById("profileModal").style.display = "block";
      
      // Clear header and show loading
      document.getElementById("profileName").textContent = "Loading...";
      document.getElementById("profileCompany").textContent = "";
      
      // Show skeleton loading and hide content
      document.getElementById("profileLoadingState").classList.add("hidden");
      document.getElementById("profileSkeleton").classList.remove("hidden");
      document.getElementById("profileContent").classList.add("hidden");
      
      google.script.run
        .withSuccessHandler(function(mentorProfile) {
          console.log("Profile loaded:", mentorProfile);
          currentProfile = mentorProfile;
          
          // Hide loading states and show content
          document.getElementById("profileSkeleton").classList.add("hidden");
          document.getElementById("profileContent").classList.remove("hidden");
          
          // Display the actual profile
          displayMentorProfile(mentorProfile);
        })
        .withFailureHandler(function(error) {
          console.error("Error loading mentor profile:", error);
          
          // Hide loading and show error in the modal
          document.getElementById("profileSkeleton").classList.add("hidden");
          document.getElementById("profileLoadingState").classList.remove("hidden");
          
          // Update loading state to show error
          document.querySelector("#profileLoadingState h4").textContent = "Failed to Load";
          document.querySelector("#profileLoadingState p").textContent = "Please try again";
          document.querySelector(".profile-loading-spinner").style.display = "none";
          
          // Auto-close after 2 seconds
          setTimeout(() => {
            closeProfileModal();
          }, 2000);
        })
        .getMentorProfile(mentorName, currentUserEmail);
    }

    // Display mentor profile data
    function displayMentorProfile(mentor) {
      console.log("Displaying profile for:", mentor.name);
      
      document.getElementById("profileName").textContent = mentor.name || "Unknown";
      document.getElementById("profileCompany").textContent = mentor.company || "Company not specified";
      document.getElementById("profileSlots").textContent = mentor.availableSlots || 0;
      document.getElementById("profileBooked").textContent = mentor.signedUpStudents ? mentor.signedUpStudents.length : 0;
      document.getElementById("profileFocus").textContent = mentor.areaOfFocus || "Not specified";
      document.getElementById("profileIndustry").textContent = mentor.industry || "Not specified";
      document.getElementById("profileCompanyDetail").textContent = mentor.company || "Not specified";
      
      // Handle optional fields
      const majorSection = document.getElementById("profileMajorSection");
      if (mentor.major && mentor.major.trim() && mentor.major.trim() !== "") {
        document.getElementById("profileMajor").textContent = mentor.major;
        majorSection.style.display = "block";
      } else {
        majorSection.style.display = "none";
      }

      const linkedInSection = document.getElementById("profileLinkedInSection");
      if (mentor.linkedinUrl && mentor.linkedinUrl.trim() && mentor.linkedinUrl.trim() !== "") {
        document.getElementById("profileLinkedIn").href = mentor.linkedinUrl;
        linkedInSection.style.display = "block";
      } else {
        linkedInSection.style.display = "none";
      }

      const additionalSection = document.getElementById("profileAdditionalSection");
      if (mentor.additionalInfo && mentor.additionalInfo.trim() && mentor.additionalInfo.trim() !== "") {
        document.getElementById("profileAdditional").textContent = mentor.additionalInfo;
        additionalSection.style.display = "block";
      } else {
        additionalSection.style.display = "none";
      }

      // Configure book button
      const bookBtn = document.getElementById("profileBookBtn");
      if (userBookingStatus && userBookingStatus.hasBooked) {
        if (mentor.isBookedByCurrentUser) {
          bookBtn.textContent = "Your Mentor";
          bookBtn.disabled = true;
          bookBtn.style.background = "#fbbf24";
        } else {
          bookBtn.textContent = "Already Booked";
          bookBtn.disabled = true;
          bookBtn.style.background = "#9ca3af";
        }
      } else if (mentor.availableSlots <= 0) {
        bookBtn.textContent = "Full - No Slots";
        bookBtn.disabled = true;
        bookBtn.style.background = "#9ca3af";
      } else {
        bookBtn.textContent = "Book Session";
        bookBtn.disabled = false;
        bookBtn.style.background = "#059669";
      }
    }

    // Close mentor profile modal and reset loading states
    function closeProfileModal() {
      document.getElementById("profileModal").style.display = "none";
      currentProfile = null;
      
      // Reset loading states for next time
      document.getElementById("profileLoadingState").classList.add("hidden");
      document.getElementById("profileSkeleton").classList.add("hidden");
      document.getElementById("profileContent").classList.add("hidden");
      
      // Reset error state elements
      document.querySelector("#profileLoadingState h4").textContent = "Loading Profile...";
      document.querySelector("#profileLoadingState p").textContent = "Getting mentor details";
      document.querySelector(".profile-loading-spinner").style.display = "block";
    }

    // Book from profile modal with custom confirmation
    function bookFromProfile() {
      if (currentProfile) {
        // Show custom confirmation modal
        showConfirmModal(currentProfile.name);
      }
    }

    // Direct booking modal opener (skips first confirmation since it was already shown)
    function openBookingModalDirect(mentorName) {
      console.log("Opening booking modal directly for:", mentorName);
      
      selectedMentor = mentorName;
      document.getElementById("modalMentorName").textContent = mentorName;
      document.getElementById("modalUserEmail").textContent = currentUserEmail;
      document.getElementById("bookingMessage").innerHTML = "";
      document.getElementById("bookingModal").style.display = "block";
      
      console.log("Direct booking modal opened for:", selectedMentor);
    }

    // Show custom confirmation modal
    function showConfirmModal(mentorName) {
      pendingBookingMentor = mentorName;
      document.getElementById("confirmTitle").textContent = "Confirm Booking";
      document.getElementById("confirmMessage").innerHTML = 
        `Book a career chat session with <strong>${mentorName}</strong>?<br><br>` +
        `Remember: You can only book ONE mentor session.`;
      document.getElementById("confirmModal").style.display = "block";
    }

    // Show custom error modal instead of alert
    function showErrorMessage(title, message) {
      document.getElementById("confirmTitle").textContent = title;
      document.getElementById("confirmMessage").innerHTML = message;
      
      // Hide OK button and only show Cancel (which acts as "Close")
      const okBtn = document.querySelector(".confirm-ok-btn");
      const cancelBtn = document.querySelector(".confirm-cancel-btn");
      okBtn.style.display = "none";
      cancelBtn.textContent = "Close";
      
      document.getElementById("confirmModal").style.display = "block";
    }

    // Reset confirmation modal to normal state
    function resetConfirmModal() {
      const okBtn = document.querySelector(".confirm-ok-btn");
      const cancelBtn = document.querySelector(".confirm-cancel-btn");
      const buttonsDiv = document.querySelector(".confirm-modal-buttons");
      
      okBtn.style.display = "inline-block";
      cancelBtn.textContent = "Cancel";
      buttonsDiv.style.display = "flex";
    }

    // Close custom confirmation modal
    function closeConfirmModal() {
      document.getElementById("confirmModal").style.display = "none";
      pendingBookingMentor = null;
      resetConfirmModal(); // Reset modal state
    }

    // Handle confirmation choice - Complete booking directly
    function confirmBookingChoice() {
      console.log("Confirming booking for:", pendingBookingMentor);
      
      if (!pendingBookingMentor) {
        console.error("No mentor selected for booking");
        showErrorMessage("Error", "No mentor selected. Please try again.");
        return;
      }
      
      if (!currentUserEmail) {
        console.error("No user email for booking");
        showErrorMessage("Session Error", "Please refresh and sign in again.");
        return;
      }
      
      // Update confirmation modal to show booking in progress
      document.getElementById("confirmTitle").textContent = "Booking Session...";
      document.getElementById("confirmMessage").innerHTML = 
        `<div class="loading-container"><div class="loader"></div><p>Booking your session with ${pendingBookingMentor}...</p></div>`;
      
      // Hide buttons during booking
      document.querySelector(".confirm-modal-buttons").style.display = "none";
      
      // Complete the booking directly
      google.script.run
        .withSuccessHandler(function(result) {
          console.log("Booking result:", result);
          if (result.success) {
            document.getElementById("confirmTitle").textContent = "Booking Confirmed!";
            document.getElementById("confirmMessage").innerHTML = 
              `<div class="success-message">${result.message}</div>`;
            
            // Show close button
            document.querySelector(".confirm-modal-buttons").style.display = "flex";
            document.querySelector(".confirm-ok-btn").style.display = "none";
            document.querySelector(".confirm-cancel-btn").textContent = "Close";
            
            // Refresh booking status after 2 seconds
            setTimeout(() => {
              closeConfirmModal();
              checkUserBooking(); // Refresh to show booking status
            }, 3000);
          } else {
            document.getElementById("confirmTitle").textContent = "Booking Failed";
            document.getElementById("confirmMessage").innerHTML = 
              `<div class="error-message">${result.message}</div>`;
            
            // Show close button
            document.querySelector(".confirm-modal-buttons").style.display = "flex";
            document.querySelector(".confirm-ok-btn").style.display = "none";
            document.querySelector(".confirm-cancel-btn").textContent = "Close";
          }
        })
        .withFailureHandler(function(error) {
          console.error("Booking failed:", error);
          document.getElementById("confirmTitle").textContent = "Booking Failed";
          document.getElementById("confirmMessage").innerHTML = 
            `<div class="error-message">Booking failed: ${error}</div>`;
          
          // Show close button
          document.querySelector(".confirm-modal-buttons").style.display = "flex";
          document.querySelector(".confirm-ok-btn").style.display = "none";
          document.querySelector(".confirm-cancel-btn").textContent = "Close";
        })
        .bookSlot(pendingBookingMentor, currentUserEmail);
    }

    // Open booking confirmation modal with custom confirmation
    function openBookingModal(mentorName) {
      console.log("Opening booking modal for:", mentorName);
      
      // Validate we have a mentor name and user email
      if (!mentorName) {
        console.error("No mentor name provided");
        showErrorMessage("Error", "No mentor selected. Please try again.");
        return;
      }
      
      if (!currentUserEmail) {
        console.error("No user email found");
        showErrorMessage("Session Error", "Please refresh the page and sign in again.");
        return;
      }
      
      // Show custom confirmation modal instead of browser confirm
      showConfirmModal(mentorName);
    }

    // Close booking modal
    function closeModal() {
      document.getElementById("bookingModal").style.display = "none";
      document.getElementById("bookingMessage").innerHTML = "";
    }

    // Confirm booking
    function confirmBooking() {
      console.log("Confirming booking for:", selectedMentor);
      
      if (!selectedMentor) {
        console.error("No mentor selected for booking");
        alert("Error: No mentor selected");
        return;
      }
      
      if (!currentUserEmail) {
        console.error("No user email for booking");
        alert("Error: Please refresh and sign in again");
        return;
      }
      
      const messageDiv = document.getElementById("bookingMessage");
      messageDiv.innerHTML = '<div class="loading-container"><div class="loader"></div><p>Booking your session...</p></div>';

      google.script.run
        .withSuccessHandler(function(result) {
          console.log("Booking result:", result);
          if (result.success) {
            messageDiv.innerHTML = `<div class="success-message">${result.message}</div>`;
            setTimeout(() => {
              closeModal();
              checkUserBooking(); // Refresh to show booking status
            }, 2000);
          } else {
            messageDiv.innerHTML = `<div class="error-message">${result.message}</div>`;
          }
        })
        .withFailureHandler(function(error) {
          console.error("Booking failed:", error);
          messageDiv.innerHTML = `<div class="error-message">Booking failed: ${error}</div>`;
        })
        .bookSlot(selectedMentor, currentUserEmail);
    }

    // Populate filter dropdowns
    function populateFilters() {
      const industries = [...new Set(allMentors.map(m => m.industry).filter(i => i))];
      const filterIndustry = document.getElementById("filterIndustry");
      filterIndustry.innerHTML = "<option value=''>All Industries</option>";

      industries.forEach(industry => {
        const option = document.createElement("option");
        option.value = industry;
        option.textContent = industry;
        filterIndustry.appendChild(option);
      });
    }

    // Filter mentors based on search criteria
    function filterMentors() {
      const nameQuery = document.getElementById("searchName").value.toLowerCase();
      const companyQuery = document.getElementById("searchCompany").value.toLowerCase();
      const selectedIndustry = document.getElementById("filterIndustry").value;

      const filtered = allMentors.filter(function(mentor) {
        const matchesName = !nameQuery || mentor.name.toLowerCase().includes(nameQuery);
        const matchesCompany = !companyQuery || mentor.company.toLowerCase().includes(companyQuery);
        const matchesIndustry = !selectedIndustry || mentor.industry === selectedIndustry;
        return matchesName && matchesCompany && matchesIndustry;
      });

      displayMentors(filtered);
    }

    // Start the application when page loads
    window.onload = initializeApp;
  </script>
</body>
</html>
