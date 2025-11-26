// Advanced Analytics Functions

// Sample advanced analytics data
const advancedAnalytics = {
  salesByCategory: {
    categories: [
      "Electronics",
      "Clothing",
      "Books",
      "Home & Kitchen",
      "Sports",
      "makeup",
    ],
    data: [16000, 28000, 15000, 22000, 18000, 60000],
    growth: [12.5, 8.3, -2.1, 15.7, 5.4, 18],
  },
  geographicData: {
    regions: ["North", "South", "East", "West", "Central"],
    sales: [25000, 22000, 18000, 20000, 15000],
    orders: [520, 480, 380, 420, 320],
  },
  customerSegments: {
    segments: ["New", "Regular", "VIP", "Inactive"],
    customers: [250, 480, 120, 180],
    revenue: [12000, 35000, 25000, 5000],
  },
  comparativeData: {
    current: {
      revenue: 15799.99,
      orders: 342,
      users: 1250,
    },
    previous: {
      revenue: 14200.5,
      orders: 315,
      users: 1080,
    },
  },
};

// Initialize Category Sales Chart
function initializeCategorySalesChart() {
  const ctx = document.getElementById("categorySalesChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: advancedAnalytics.salesByCategory.categories,
      datasets: [
        {
          label: "Sales by Category",
          data: advancedAnalytics.salesByCategory.data,
          backgroundColor: [
            "#4CAF50",
            "#2196F3",
            "#FFC107",
            "#9C27B0",
            "#F44336",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Sales by Category",
        },
      },
    },
  });
}

// Initialize Geographic Distribution Chart
function initializeGeographicChart() {
  const ctx = document.getElementById("geographicChart").getContext("2d");
  new Chart(ctx, {
    type: "radar",
    data: {
      labels: advancedAnalytics.geographicData.regions,
      datasets: [
        {
          label: "Sales Distribution",
          data: advancedAnalytics.geographicData.sales,
          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgb(54, 162, 235)",
          pointBackgroundColor: "rgb(54, 162, 235)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    },
  });
}

// Initialize Customer Segments Chart
function initializeCustomerSegmentsChart() {
  const ctx = document.getElementById("customerSegmentsChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: advancedAnalytics.customerSegments.segments,
      datasets: [
        {
          data: advancedAnalytics.customerSegments.revenue,
          backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#F44336"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Revenue by Customer Segment",
        },
      },
    },
  });
}

// Update Comparative Analysis
function updateComparativeAnalysis() {
  const comparativeData = advancedAnalytics.comparativeData;
  const revenueGrowth = (
    ((comparativeData.current.revenue - comparativeData.previous.revenue) /
      comparativeData.previous.revenue) *
    100
  ).toFixed(1);
  const ordersGrowth = (
    ((comparativeData.current.orders - comparativeData.previous.orders) /
      comparativeData.previous.orders) *
    100
  ).toFixed(1);
  const usersGrowth = (
    ((comparativeData.current.users - comparativeData.previous.users) /
      comparativeData.previous.users) *
    100
  ).toFixed(1);

  document.getElementById("comparativeAnalysis").innerHTML = `
        <div class="comparative-card">
            <h4>Revenue Growth</h4>
            <p class="growth ${revenueGrowth >= 0 ? "positive" : "negative"}">
                ${revenueGrowth}%
                <span class="trend-icon ">${
                  revenueGrowth >= 0 ? "↑" : "↓"
                }</span>
            </p>
        </div>
        <div class="comparative-card">
            <h4>Orders Growth</h4>
            <p class="growth ${ordersGrowth >= 0 ? "positive" : "negative"}">
                ${ordersGrowth}%
                <span class="trend-icon">${ordersGrowth >= 0 ? "↑" : "↓"}</span>
            </p>
        </div>
        <div class="comparative-card">
            <h4>User Growth</h4>
            <p class="growth ${usersGrowth >= 0 ? "positive" : "negative"}">
                ${usersGrowth}%
                <span class="trend-icon">${usersGrowth >= 0 ? "↑" : "↓"}</span>
            </p>
        </div>
    `;
}

// Export Data to CSV
function exportToCSV(data, filename) {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Convert data to CSV format
function convertToCSV(data) {
  const headers = Object.keys(data[0]);
  const csvRows = [];
  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      return `"${value}"`;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

// Print Report
function printReport() {
  window.print();
}

// Initialize Advanced Analytics
function initializeAdvancedAnalytics() {
  initializeCategorySalesChart();
  initializeGeographicChart();
  initializeCustomerSegmentsChart();
  updateComparativeAnalysis();
}

// Event Listeners
document.getElementById("exportData").addEventListener("click", () => {
  const dataToExport = {
    salesByCategory: advancedAnalytics.salesByCategory,
    geographicData: advancedAnalytics.geographicData,
    customerSegments: advancedAnalytics.customerSegments,
  };
  exportToCSV([dataToExport], "analytics_report.csv");
});

document.getElementById("printReport").addEventListener("click", printReport);

// Initialize on load
document.addEventListener("DOMContentLoaded", initializeAdvancedAnalytics);
