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
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
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
    <table id="mentorsTable">
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
      <tbody></tbody>
    </table>
  </main>

  <footer>
    &copy; 2025 VCU College of Engineering | Powered by Google Apps Script
  </footer>

  <script>
    let allMentors = [];

    // Load mentors and populate filters
    function refreshMentors() {
      google.script.run.withSuccessHandler(function(data) {
        allMentors = data;
        populateFilters();
        displayMentors(allMentors);
      }).getMentors();
    }

    // Display filtered mentors
    function displayMentors(mentors) {
      var tbody = document.querySelector("#mentorsTable tbody");
      tbody.innerHTML = "";

      if (mentors.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No available mentors match your search.</td></tr>";
        return;
      }

      mentors.forEach(function(mentor) {
        var row = document.createElement("tr");
        row.innerHTML = `
          <td>${mentor.name}</td>
          <td>${mentor.areaOfFocus}</td>
          <td>${mentor.industry}</td>
          <td>${mentor.company}</td>
          <td>${mentor.availableSlots}</td>
          <td>
            <button class="book-btn" onclick="bookSlot('${mentor.name}')">Book</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    }

    // Populate unique industries for filter dropdown
    function populateFilters() {
      const industries = [...new Set(allMentors.map(m => m.industry))];
      const industrySelect = document.getElementById("filterIndustry");

      industries.forEach(ind => {
        const option = document.createElement("option");
        option.value = ind;
        option.textContent = ind;
        industrySelect.appendChild(option);
      });
    }

    // Apply all filters
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

    // Book a slot
    function bookSlot(mentorName) {
      var studentEmail = prompt("Enter your email address:");
      if (studentEmail) {
        google.script.run.withSuccessHandler(refreshMentors).bookSlot(mentorName, studentEmail);
      }
    }

    window.onload = refreshMentors;
  </script>
</body>
</html>
