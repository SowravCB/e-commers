// DOM Elements
const dateRange = document.getElementById("dateRange");
const totalRevenue = document.getElementById("totalRevenue");
const totalOrders = document.getElementById("totalOrders");
const activeUsers = document.getElementById("activeUsers");
const avgOrderValue = document.getElementById("avgOrderValue");
const topProductsTable = document.getElementById("topProductsTable");
const recentTransactionsTable = document.getElementById(
  "recentTransactionsTable"
);

// Chart contexts
const revenueCtx = document.getElementById("revenueChart").getContext("2d");
const ordersCtx = document.getElementById("ordersChart").getContext("2d");
const productsCtx = document.getElementById("productsChart").getContext("2d");
const usersCtx = document.getElementById("usersChart").getContext("2d");

let analyticsData = {
  revenue: { total: 0, growth: 50, history: [] },
  orders: { total: 0, growth: 0, history: [] },
  users: { active: 0, growth: 0, history: [] },
  avgOrder: { value: 0, growth: 0 },
  topProducts: [],
  recentTransactions: [],
};

// Fetch and process data
async function fetchData() {
  try {
    const response = await fetch("../../data.json");
    const data = await response.json();

    // Process Orders
    const orders = data.orders;
    const totalOrderValue = orders.reduce((sum, order) => sum + order.total, 0);

    // Calculate total revenue and average order value
    analyticsData.revenue.total = totalOrderValue;
    analyticsData.orders.total = orders.length;
    analyticsData.avgOrder.value = totalOrderValue / orders.length;

    // Process Users
    const activeUserCount = data.users.filter(
      (user) => user.status === "active"
    ).length;
    analyticsData.users.active = activeUserCount;

    // Process Products for top products
    const productSales = new Map();
    orders.forEach((order) => {
      order.products.forEach((product) => {
        const totalSale = product.price * product.quantity;
        if (productSales.has(product.name)) {
          const existing = productSales.get(product.name);
          productSales.set(product.name, {
            sales: existing.sales + product.quantity,
            revenue: existing.revenue + totalSale,
          });
        } else {
          productSales.set(product.name, {
            sales: product.quantity,
            revenue: totalSale,
          });
        }
      });
    });

    // Convert to array and sort by revenue
    analyticsData.topProducts = Array.from(productSales.entries())
      .map(([name, data]) => ({
        name,
        sales: data.sales,
        revenue: data.revenue,
        growth: (
          ((data.revenue - data.revenue * 0.9) / (data.revenue * 0.9)) *
          100
        ).toFixed(1),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Process recent transactions
    analyticsData.recentTransactions = orders
      .map((order) => ({
        id: order.id,
        customer: order.customerName,
        amount: order.total,
        status: order.status.toLowerCase(),
      }))
      .slice(0, 5);

    // Generate sample history data based on current values
    const generateHistory = (current) => {
      const history = [];
      for (let i = 6; i >= 0; i--) {
        const randomFactor = 0.95 + Math.random() * 0.1;
        history.push(current * randomFactor * (i / 6));
      }
      return history;
    };

    analyticsData.revenue.history = generateHistory(totalOrderValue);
    analyticsData.orders.history = generateHistory(orders.length);
    analyticsData.users.history = generateHistory(activeUserCount);

    // Calculate growth percentages
    const calculateGrowth = (history) => {
      const current = history[history.length - 1];
      const previous = history[history.length - 2];
      return (((current - previous) / previous) * 100).toFixed(1);
    };

    analyticsData.revenue.growth = calculateGrowth(
      analyticsData.revenue.history
    );
    analyticsData.orders.growth = calculateGrowth(analyticsData.orders.history);
    analyticsData.users.growth = calculateGrowth(analyticsData.users.history);
    analyticsData.avgOrder.growth = calculateGrowth(
      analyticsData.revenue.history
    );

    // Update dashboard
    updateMetrics();
    initializeCharts();
    updateTables();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Update dashboard metrics
function updateMetrics() {
  // Update card values
  // totalRevenue.textContent = `ট. ${analyticsData.revenue.total.toFixed(2)}`;
  // totalOrders.textContent = analyticsData.orders.total;
  // activeUsers.textContent = analyticsData.users.active;
  // avgOrderValue.textContent = `ট. ${analyticsData.avgOrder.value.toFixed(2)}`;

  // // Update growth indicators
  // document.getElementById("revenueGrowth").textContent = `${
  //   analyticsData.revenue.growth > 0 ? "↑" : "↓"
  // }${analyticsData.revenue.growth} %`;
  // document.getElementById("ordersGrowth").textContent = `${
  //   analyticsData.orders.growth > 0 ? "↑" : "↓"
  // }${analyticsData.orders.growth} %`;
  // document.getElementById("usersGrowth").textContent = `${
  //   analyticsData.users.growth > 0 ? "↑" : "↓"
  // }${analyticsData.users.growth} %`;
  // document.getElementById("avgOrderGrowth").textContent = `${
  //   analyticsData.avgOrder.growth > 0 ? "↑" : "↓"
  // }${analyticsData.avgOrder.growth} %`;

  document.getElementById("analytics-cards").innerHTML = `
                    <div class="card">
                        <div class="card-info">
                            <h3>Total Revenue</h3>
                            <p>ট. ${analyticsData.revenue.total.toFixed(2)}</p>
                            <p class="growth ${
                              analyticsData.revenue.growth > 0
                                ? "positive"
                                : "negative"
                            }">
                            <span>${analyticsData.revenue.growth} % </span>
                            <span>${
                              analyticsData.revenue.growth > 0 ? "↑" : "↓"
                            }</span>
                          </p>
                        </div>
                        <div class="card-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                fill="currentColor">
                                <path
                                    d="M320-414v-306h120v306l-60-56-60 56Zm200 60v-526h120v406L520-354ZM120-216v-344h120v224L120-216Zm0 98 258-258 142 122 224-224h-64v-80h200v200h-80v-64L524-146 382-268 232-118H120Z" />
                            </svg>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-info">
                            <h3>Total Orders</h3>
                            <p> ${analyticsData.orders.total}</p>
                            <p class="growth ${
                              analyticsData.orders.growth > 0
                                ? "positive"
                                : "negative"
                            }">
                            <span>${analyticsData.orders.growth} % </span>
                            <span>${
                              analyticsData.orders.growth > 0 ? "↑" : "↓"
                            }</span>
                          </p>
                        </div>
                        <div class="card-icon">
                             <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                fill="currentColor">
                                <path
                                    d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm0-80h480v-640h-80v280l-100-60-100 60v-280H240v640Zm0 0v-640 640Zm200-360 100-60 100 60-100-60-100 60Z" />
                            </svg>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-info">
                            <h3>Active User</h3>
                            <p> ${analyticsData.users.active}</p>
                            <p class="growth ${
                              analyticsData.users.growth > 0
                                ? "positive"
                                : "negative"
                            }">
                            <span >${analyticsData.users.growth} % </span>
                            <span>${
                              analyticsData.users.growth > 0 ? "↑" : "↓"
                            }</span>
                          </p>
                        </div>
                        <div class="card-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                fill="currentColor">
                                <path
                                    d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z" />
                            </svg>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-info">
                            <h3>Avg Order Value</h3>
                            <p>ট. ${analyticsData.avgOrder.value.toFixed(2)}</p>
                            <p class="growth ${
                              analyticsData.avgOrder.growth > 0
                                ? "positive"
                                : "negative"
                            }">
                            <span>${analyticsData.avgOrder.growth} % </span>
                            <span>${
                              analyticsData.avgOrder.growth > 0 ? "↑" : "↓"
                            }</span>
                          </p>
                        </div>
                        <div class="card-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                fill="currentColor">
                                <path d=" M260-361v-40H160v-80h200v-80H200q-17 0-28.5-11.5T160-601v-160q0-17
                                11.5-28.5T200-801h60v-40h80v40h100v80H240v80h160q17 0 28.5 11.5T440-601v160q0 17-11.5
                                28.5T400-401h-60v40h-80Zm298 240L388-291l56-56 114 114 226-226 56 56-282 282Z" />
                            </svg>
                        </div>
                    </div>
  `;
}

// Initialize charts
function initializeCharts() {
  // Revenue Chart
  new Chart(revenueCtx, {
    type: "line",
    data: {
      labels: getLast7Days(),
      datasets: [
        {
          label: "Revenue",
          data: analyticsData.revenue.history,
          borderColor: "#4CAF50",
          tension: 0.3,
          fill: true,
          backgroundColor: "rgba(76, 175, 80, 0.1)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  // Orders Chart
  new Chart(ordersCtx, {
    type: "bar",
    data: {
      labels: getLast7Days(),
      datasets: [
        {
          label: "Orders",
          data: analyticsData.orders.history,
          backgroundColor: "#2196F3",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  // Top Products Chart
  new Chart(productsCtx, {
    type: "doughnut",
    data: {
      labels: analyticsData.topProducts.map((product) => product.name),
      datasets: [
        {
          data: analyticsData.topProducts.map((product) => product.sales),
          backgroundColor: [
            "#4CAF50",
            "#2196F3",
            "#FFC107",
            "#9C27B0",
            "#F44336",
          ],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  // Users Growth Chart
  new Chart(usersCtx, {
    type: "line",
    data: {
      labels: getLast7Days(),
      datasets: [
        {
          label: "Active Users",
          data: analyticsData.users.history,
          borderColor: "#FFC107",
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

// Update tables
function updateTables() {
  // Top Products Table
  topProductsTable.innerHTML = analyticsData.topProducts
    .map(
      (product) => `
        <tr>
            <td>${product.name}</td>
            <td>${product.sales}</td>
            <td>$${product.revenue.toFixed(2)}</td>
            <td>
                <span class="growth ${
                  product.growth >= 0 ? "positive" : "negative"
                }">
                    ${product.growth > 0 ? "+" : ""}${product.growth}%
                </span>
            </td>
        </tr>
    `
    )
    .join("");

  // Recent Transactions Table
  recentTransactionsTable.innerHTML = analyticsData.recentTransactions
    .map(
      (transaction) => `
        <tr>
            <td>${transaction.id}</td>
            <td>${transaction.customer}</td>
            <td>$${transaction.amount.toFixed(2)}</td>
            <td><span class="status ${transaction.status}">${
        transaction.status
      }</span></td>
        </tr>
    `
    )
    .join("");
}

// Helper function to get last 7 days
function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
  }
  return days;
}

// Event Listeners
dateRange.addEventListener("change", () => {
  // Here you would typically fetch new data based on the selected date range
  // For now, we'll just simulate a refresh of the current data
  updateMetrics();
  initializeCharts();
  updateTables();
});

// Initialize dashboard
function initializeDashboard() {
  updateMetrics();
  initializeCharts();
  updateTables();
}

// Call initialization on load
initializeDashboard();
// Call initialization on load
fetchData();
