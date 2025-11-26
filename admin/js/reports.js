// Initialize Charts
function initializeCharts() {
  // Sales Chart
  const salesCtx = document.getElementById("salesChart").getContext("2d");
  const salesChart = new Chart(salesCtx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Monthly Sales",
          data: [12000, 19000, 15000, 25000, 22000, 30000],
          borderColor: "#008000",
          tension: 0.4,
          fill: true,
          backgroundColor: "rgba(0, 128, 0, 0.1)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });

  // Revenue Chart
  const revenueCtx = document.getElementById("revenueChart").getContext("2d");
  const revenueChart = new Chart(revenueCtx, {
    type: "bar",
    data: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "Revenue",
          data: [65000, 85000, 95000, 120000],
          backgroundColor: "rgba(0, 128, 0, 0.7)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });

  // Product Performance Chart
  const productCtx = document.getElementById("productChart").getContext("2d");
  const productChart = new Chart(productCtx, {
    type: "doughnut",
    data: {
      labels: ["Electronics", "Clothing", "Furniture", "Others"],
      datasets: [
        {
          data: [35, 25, 20, 20],
          backgroundColor: [
            "rgba(0, 128, 0, 0.7)",
            "rgba(0, 128, 0, 0.5)",
            "rgba(0, 128, 0, 0.3)",
            "rgba(0, 128, 0, 0.1)",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

// Generate Reports Table
function generateReportsTable() {
  const tableBody = document.getElementById("reportTableBody");
  const reports = [
    { id: "REP001", type: "Sales", date: "2025-10-12", status: "Completed" },
    {
      id: "REP002",
      type: "Inventory",
      date: "2025-10-11",
      status: "Processing",
    },
    { id: "REP003", type: "Customer", date: "2025-10-10", status: "Completed" },
    { id: "REP004", type: "Financial", date: "2025-10-09", status: "Pending" },
  ];

  tableBody.innerHTML = reports
    .map(
      (report) => `
        <tr>
            <td>${report.id}</td>
            <td>${report.type}</td>
            <td>${report.date}</td>
            <td><span class="status ${report.status.toLowerCase()}">${
        report.status
      }</span></td>
            <td>
                <button class="action-btn" onclick="viewReport('${
                  report.id
                }')">View</button>
                <button class="action-btn" onclick="downloadReport('${
                  report.id
                }')">Download</button>
            </td>
        </tr>
    `
    )
    .join("");
}

// Handle Report Generation
function handleReportGeneration() {
  const dateRange = document.getElementById("dateRange").value;
  const reportType = document.getElementById("reportType").value;
  const category = document.getElementById("category").value;

  // Simulate report generation
  console.log(
    `Generating ${reportType} report for last ${dateRange} days in ${category} category`
  );
  // Add actual report generation logic here
}

// View Report
function viewReport(reportId) {
  // Implement view report logic
  console.log(`Viewing report ${reportId}`);
}

// Download Report
function downloadReport(reportId) {
  // Implement download report logic
  console.log(`Downloading report ${reportId}`);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  initializeCharts();
  generateReportsTable();

  // Add event listeners for filters
  document
    .getElementById("dateRange")
    .addEventListener("change", handleReportGeneration);
  document
    .getElementById("reportType")
    .addEventListener("change", handleReportGeneration);
  document
    .getElementById("category")
    .addEventListener("change", handleReportGeneration);

  // Generate report button
  document
    .getElementById("generate-report")
    .addEventListener("click", handleReportGeneration);
});
