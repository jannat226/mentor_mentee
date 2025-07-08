<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VCU Engineering - Mentor Career Chat</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">

  <style>
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      background-color: #f9fafb;
      color: #111827;
    }

    header {
      background-color: #1e3a8a;
      color: white;
      padding: 20px;
      text-align: center;
    }

    main {
      max-width: 1000px;
      margin: auto;
      padding: 20px;
    }

    .filter-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    input[type="text"], select {
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #ccc;
      flex-grow: 1;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background-color: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    th, td {
      padding: 12px;
      border-bottom: 1px solid #eee;
      text-align: left;
    }

    th {
      background-color: #f3f4f6;
    }

    .book-btn {
      background-color: #1e40af;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
    }

    .book-btn:hover {
      background-color: #2563eb;
    }

    .full-btn {
      background-color: #d1d5db;
      color: #9ca3af;
      cursor: not-allowed;
    }

    .loader {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #1e40af;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: inline-block;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-message {
      text-align: center;
      color: #6b7280;
      font-size: 16px;
      padding: 20px;
    }

    .error-message {
      color: red;
      text-align: center;
      padding: 20px;
    }

    footer {
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      margin-top: 40px;
      padding: 20px;
    }
  </style>
</head>
<body>

  <header>
    <h1>🎓 VCU Engineering - Mentor Career Chat</h1>
    <p>Select a mentor below to book a session.</p>
  </header>

  <main>
    <!-- Filter Inputs -->
    <div class="filter-bar">
      <input type="text" id="searchName" placeholder="Search by Name..." onkeyup="filterMentors()">
      <input type="text" id="searchCompany" placeholder="Filter by Company..." onkeyup="filterMentors()">
      <select id="filterIndustry" onchange="filterMentors()">
        <option value="">All Industries</option>
      </select>
    </div>

    <!-- Mentor Table -->
    <div id="loading" class="loading-message">
      <span class="loader"></span> Loading mentors...
    </div>
    <table id="mentorsTable" style="display: none;">
      <thead>
        <tr>
          <th>Name</th>
          <th>Area of Focus</th>
          <th>Industry</th>
          <th>Company</th>
          <th>Available Slots</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="mentorsTableBody"></tbody>
    </table>
  </main>

  <footer>
    &copy; 2025 VCU College of Engineering 
  </footer>

  <script>
    let allMentors = [];

    function refreshMentors() {
      document.getElementById("loading").style.display = "block";
      document.getElementById("mentorsTable").style.display = "none";
      document.getElementById("mentorsTableBody").innerHTML = "";

      google.script.run
        .withSuccessHandler(function(data) {
          allMentors = data;
          populateFilters();
          displayMentors(allMentors);
          document.getElementById("loading").style.display = "none";
          document.getElementById("mentorsTable").style.display = "table";
        })
        .withFailureHandler(function(error) {
          document.getElementById("loading").style.display = "none";
          document.getElementById("mentorsTable").style.display = "none";
          document.getElementById("mentorsTableBody").innerHTML = "<tr><td colspan='6' class='error-message'>⚠️ Error loading mentors: " + error + "</td></tr>";
        })
        .getMentors();
    }

    function displayMentors(mentors) {
      var tbody = document.getElementById("mentorsTableBody");
      tbody.innerHTML = "";

      if (mentors.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No mentors found.</td></tr>";
        return;
      }

      mentors.forEach(function(mentor) {
        var row = document.createElement("tr");

        // Action cell
        var actionCell = document.createElement("td");
        if (mentor.availableSlots <= 0) {
          var fullButton = document.createElement("button");
          fullButton.textContent = "Full";
          fullButton.disabled = true;
          fullButton.classList.add("book-btn", "full-btn");
          actionCell.appendChild(fullButton);
        } else {
          var bookButton = document.createElement("button");
          bookButton.textContent = "Book";
          bookButton.classList.add("book-btn");
          bookButton.onclick = function() {
            book(mentor.name);
          };
          actionCell.appendChild(bookButton);
        }

        // Populate other columns
        row.innerHTML = `
          <td>${mentor.name}</td>
          <td>${mentor.areaOfFocus}</td>
          <td>${mentor.industry}</td>
          <td>${mentor.company}</td>
          <td>${mentor.availableSlots}</td>
        `;
        row.appendChild(actionCell);
        tbody.appendChild(row);
      });
    }

    function populateFilters() {
      const industries = [...new Set(allMentors.map(m => m.industry))];
      const filterIndustry = document.getElementById("filterIndustry");
      filterIndustry.innerHTML = "<option value=''>All Industries</option>";

      industries.forEach(ind => {
        const option = document.createElement("option");
        option.value = ind;
        option.textContent = ind;
        filterIndustry.appendChild(option);
      });
    }

    function filterMentors() {
      let queryName = document.getElementById("searchName").value.toLowerCase();
      let queryCompany = document.getElementById("searchCompany").value.toLowerCase();
      let selectedIndustry = document.getElementById("filterIndustry").value;

      let filtered = allMentors.filter(function(mentor) {
        let matchesName = !queryName || mentor.name.toLowerCase().includes(queryName);
        let matchesCompany = !queryCompany || mentor.company.toLowerCase().includes(queryCompany);
        let matchesIndustry = !selectedIndustry || mentor.industry === selectedIndustry;
        return matchesName && matchesCompany && matchesIndustry;
      });

      displayMentors(filtered);
    }

    function book(mentorName) {
      var studentEmail = prompt("Enter your email address:");
      if (!studentEmail) return;

      studentEmail = studentEmail.trim().toLowerCase();

      google.script.run
        .withSuccessHandler(function(result) {
          if (!result.success) {
            alert(result.message);
            return;
          }

          alert("Successfully booked with " + mentorName + "!");
          refreshMentors();
        })
        .bookSlot(mentorName, studentEmail);
    }

    window.onload = refreshMentors;
  </script>
</body>
</html>
