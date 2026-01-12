let globalData = null;

// Function to load and display dashboard data
async function loadDashboardData() {
  try {
    window.adminUtils.showLoadingState();
    const response = await fetch("/data.json");
    // const response = await fetch("../../data.json");
    const data = await response.json();
    globalData = data; // Store the data globally

    // Process Orders
    const orders = data.orders;
    const recentOrders = orders.slice(0, 5); // Get 5 most recent orders
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Process Users
    const users = data.users;
    const activeUsers = users.filter((user) => user.status === "active");
    // const newUsers = users.slice(0, 10);

    // Process Products
    const products = data.products;
    const lowStockProducts = products.filter((product) => product.stock <= 10);

    // Update info boxes
    updateInfoBoxes({
      revenue: totalRevenue,
      orderCount: orders.length,
      userCount: activeUsers.length,
      lowStockCount: lowStockProducts.length,
      // userCount: newUsers.length,
    });

    // Update recent orders table
    updateRecentOrders(recentOrders);

    // Update todo list
    updateTodoList({
      orders: orders.filter((order) => order.status === "Processing").length,
      lowStock: lowStockProducts.length,
      messages: data.messages.filter((msg) => msg.status === "unread").length,
    });

    window.adminUtils.hideLoadingState();
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    window.adminUtils.showError("Failed to load dashboard data");
  }
}

// Save data back to JSON file
async function saveToJson(data) {
  try {
    //  const response = await fetch("../../data.json",
    const response = await fetch("/data.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data, null, 2),
    });

    if (!response.ok) {
      throw new Error("Failed to save data");
    }

    globalData = data; // Update global data
    return true;
  } catch (error) {
    console.error("Error saving data:", error);
    return false;
  }
}

// Handle new order submission
async function handleNewOrderSubmit(formData) {
  try {
    if (!globalData) {
      throw new Error("Data not loaded");
    }

    const newOrder = {
      id: `ORD${String(globalData.orders.length + 1).padStart(3, "0")}`,
      customerId: `USR${String(globalData.users.length + 1).padStart(3, "0")}`,
      customerName: formData.customerName,
      email: formData.email,
      products: [
        {
          id: Date.now(),
          name: formData.productName,
          quantity: parseInt(formData.quantity),
          price: parseFloat(formData.price),
        },
      ],
      total: parseFloat(formData.price) * parseInt(formData.quantity),
      status: "Processing",
      paymentMethod: formData.paymentMethod,
      orderDate: new Date().toISOString(),
      shippingAddress: {
        street: "To be updated",
        city: "To be updated",
        state: "To be updated",
        country: "Bangladesh",
        zipCode: "0000",
      },
    };

    globalData.orders.push(newOrder);
    const success = await saveToJson(globalData);

    if (success) {
      await loadDashboardData();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error adding new order:", error);
    return false;
  }
}

// Handle new todo submission
async function handleNewTodoSubmit(formData) {
  try {
    if (!globalData) {
      throw new Error("Data not loaded");
    }

    const newTodo = {
      id: `NOT${String(globalData.notifications.length + 1).padStart(3, "0")}`,
      type: "todo",
      title: formData.title,
      message: formData.description,
      status: "unread",
      createdAt: new Date().toISOString(),
      userId: "ADM001",
      dueDate: formData.dueDate,
      priority: formData.priority,
    };

    globalData.notifications.push(newTodo);
    const success = await saveToJson(globalData);

    if (success) {
      await loadDashboardData();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error adding new todo:", error);
    return false;
  }
}

// Update info boxes with real data
function updateInfoBoxes(data) {
  // Revenue box
  document.querySelector(
    ".box-info li:nth-child(1) .info-left span h3"
  ).textContent = window.adminUtils.formatCurrency(data.revenue);

  // Orders box
  document.querySelector(
    ".box-info li:nth-child(2) .info-left span h3"
  ).textContent = data.orderCount.toString();

  // Users box
  document.querySelector(
    ".box-info li:nth-child(3) .info-left span h3"
  ).textContent = data.userCount.toString();

  // Low stock box
  document.querySelector(
    ".box-info li:nth-child(4) .info-left span h3"
  ).textContent = data.lowStockCount.toString();
  // // New Users
  // document.querySelector(
  //   ".box-info li:nth-child(6) .info-left span h3"
  // ).textContent = data.newUsers.toString();
}

// Update recent orders table
function updateRecentOrders(orders) {
  const tableBody = document.querySelector(".orders table tbody");
  if (!tableBody) return;

  tableBody.innerHTML = orders
    .map(
      (order) => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${window.adminUtils.formatCurrency(order.total)}</td>
            <td><span class="status ${order.status.toLowerCase()}">${
        order.status
      }</span></td>
        </tr>
    `
    )
    .join("");
}

// Update todo list
function updateTodoList(data) {
  const todoList = document.getElementById("todoList");
  if (!todoList) return;

  const todos = [
    {
      status: "processing",
      text: `${data.orders} New Orders Need Processing`,
      time: "Today",
    },
    {
      status: "pending",
      text: `${data.lowStock} Products Low in Stock`,
      time: "Today",
    },
    {
      status: "completed",
      text: `${data.messages} Unread Customer Messages`,
      time: "Today",
    },
  ];

  todoList.innerHTML = todos
    .map(
      (todo) => `
        <li class="${todo.status}">
            <div class="list">
                <p>${todo.text}</p>
                <span class="time">${todo.time}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
            </svg>
        </li>
    `
    )
    .join("");
}

// Show add order modal
function showAddOrderModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Add New Order</h2>
      <form id="newOrderForm">
        <div class="form-group">
          <label for="customerName">Customer Name</label>
          <input type="text" id="customerName" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" required>
        </div>
        <div class="form-group">
          <label for="productName">Product Name</label>
          <input type="text" id="productName" required>
        </div>
        <div class="form-group">
          <label for="price">Price</label>
          <input type="number" id="price" min="0" step="0.01" required>
        </div>
        <div class="form-group">
          <label for="quantity">Quantity</label>
          <input type="number" id="quantity" min="1" value="1" required>
        </div>
        <div class="form-group">
          <label for="paymentMethod">Payment Method</label>
          <select id="paymentMethod" required>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>
        <div class="form-group">
          <button type="submit">Add Order</button>
          <button type="button" class="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Handle form submission
  const form = document.getElementById("newOrderForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = {
      customerName: document.getElementById("customerName").value,
      email: document.getElementById("email").value,
      productName: document.getElementById("productName").value,
      price: document.getElementById("price").value,
      quantity: document.getElementById("quantity").value,
      paymentMethod: document.getElementById("paymentMethod").value,
    };

    if (await handleNewOrderSubmit(formData)) {
      modal.remove();
      window.adminUtils.showSuccess("Order added successfully");
    } else {
      window.adminUtils.showError("Failed to add order");
    }
  });

  // Handle cancel button
  modal.querySelector(".cancel-btn").addEventListener("click", () => {
    modal.remove();
  });
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Show add todo modal
function showAddTodoModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Add New Todo</h2>
      <form id="newTodoForm">
        <div class="form-group">
          <label for="todoTitle">Title</label>
          <input type="text" id="todoTitle" required>
        </div>
        <div class="form-group">
          <label for="todoDescription">Description</label>
          <textarea id="todoDescription" required></textarea>
        </div>
        <div class="form-group">
          <label for="todoDueDate">Due Date</label>
          <input type="date" id="todoDueDate" required>
        </div>
        <div class="form-group">
          <label for="todoPriority">Priority</label>
          <select id="todoPriority" required>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div class="form-group">
          <button type="submit">Add Todo</button>
          <button type="button" class="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Handle form submission
  const form = document.getElementById("newTodoForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = {
      title: document.getElementById("todoTitle").value,
      description: document.getElementById("todoDescription").value,
      dueDate: document.getElementById("todoDueDate").value,
      priority: document.getElementById("todoPriority").value,
    };

    if (await handleNewTodoSubmit(formData)) {
      modal.remove();
      window.adminUtils.showSuccess("Todo added successfully");
    } else {
      window.adminUtils.showError("Failed to add todo");
    }
  });

  // Handle cancel button
  modal.querySelector(".cancel-btn").addEventListener("click", () => {
    modal.remove();
  });
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Sort orders
function sortOrders(sortBy) {
  if (!globalData || !globalData.orders) return;

  const orders = [...globalData.orders];
  switch (sortBy) {
    case "date":
      orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      break;
    case "amount":
      orders.sort((a, b) => b.total - a.total);
      break;
    case "status":
      orders.sort((a, b) => a.status.localeCompare(b.status));
      break;
  }

  updateRecentOrders(orders.slice(0, 5));
}

// Initialize all event listeners
function initializeEventListeners() {
  // Add order button
  const addOrderBtn = document.querySelector(".add-order-btn");
  if (addOrderBtn) {
    addOrderBtn.addEventListener("click", showAddOrderModal);
  }

  const viewAllOrders = document.querySelector(".view-all-orders-btn");
  if (viewAllOrders) {
    viewAllOrders.addEventListener("click", () => {
      window.location.href = "/admin/pages/orders.html";
    });
  }
  // Add todo button
  const addTodoBtn = document.querySelector(".add-todo-btn");
  if (addTodoBtn) {
    addTodoBtn.addEventListener("click", showAddTodoModal);
  }

  // Sort buttons for orders
  const sortButtons = document.querySelectorAll(
    ".orders .head-btn [data-sort]"
  );
  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sortBy = button.dataset.sort;
      sortOrders(sortBy);
    });
  });
}
// Menu icon functionality
const menuIcon = document.querySelector(".menu-icon");
const sidebar = document.querySelector(".sidebar");

if (menuIcon && sidebar) {
  menuIcon.addEventListener("click", () => {
    sidebar.classList.toggle("hide");
  });
}

// Close sidebar when clicking outside on small screens
document.addEventListener("click", function (e) {
  const isClickInsideSidebar = sidebar && sidebar.contains(e.target);
  const isClickOnMenuIcon = menuIcon && menuIcon.contains(e.target);

  if (
    window.innerWidth < 768 &&
    !isClickInsideSidebar &&
    !isClickOnMenuIcon &&
    !sidebar.classList.contains("hide")
  ) {
    sidebar.classList.add("hide");
  }
});

// Set initial sidebar state based on screen size
function setSidebarState() {
  if (window.innerWidth < 768) {
    sidebar.classList.add("hide");
  } else {
    sidebar.classList.remove("hide");
  }
}

// Initialize sidebar state on load
setSidebarState();

// Update sidebar state on window resize
window.addEventListener("resize", setSidebarState);

const profileIcon = document.getElementById("profileBtn");
const adminProfile = document.getElementById("adminProfile");

if (profileIcon && adminProfile) {
  profileIcon.addEventListener("click", function (e) {
    e.stopPropagation();
    adminProfile.classList.toggle("show");
  });
}
// Close profile dropdown when clicking outside
window.addEventListener("click", function (e) {
  if (adminProfile && adminProfile.classList.contains("show")) {
    if (!profileIcon.contains(e.target) && !adminProfile.contains(e.target)) {
      adminProfile.classList.remove("show");
    }
  }
});

const notificationBtn = document.getElementById("notificationBtn");
const notificationDropdown = document.getElementById("notificationDropdown");

if (notificationBtn && notificationDropdown) {
  notificationBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    notificationDropdown.classList.toggle("show");
  });
}

// Close dropdown when clicking outside
window.addEventListener("click", function (e) {
  if (notificationDropdown && notificationDropdown.classList.contains("show")) {
    if (
      !notificationBtn.contains(e.target) &&
      !notificationDropdown.contains(e.target)
    ) {
      notificationDropdown.classList.remove("show");
    }
  }
});

const logOutBtn = document.getElementById("logOutBtn");
logOutBtn.addEventListener("click", () => {
  window.location.href = "/admin/pages/adminlogin.html";
});

function printPdf() {
  window.print();
}

document.getElementById("printPdf").addEventListener("click", printPdf);

// Initialize dashboard
document.addEventListener("DOMContentLoaded", async () => {
  await loadDashboardData();
  initializeEventListeners();
});

// GSAP Animations
let tl = gsap.timeline({ defaults: { ease: "power1.out" } });
tl.from(".settings-header", { y: -50, opacity: 0, duration: 0.5 });
tl.from(".settings-section", {
  y: 50,
  opacity: 0,
  duration: 0.5,
  stagger: 0.2,
});

let sdBar = gsap.timeline();

sdBar.from(".sidebar", { y: -250, opacity: 0, duration: 0.5 });
sdBar.from(".sidebar .nav-item", {
  x: -50,
  opacity: 0,
  duration: 0.3,
  stagger: 0.2,
});

let nav = gsap.timeline();

nav.from(".navbar", { y: -50, opacity: 0, duration: 0.7, stagger: 0.3 });
nav.from(".navbar .nav-link", {
  y: -20,
  opacity: 0,
  duration: 0.3,
  stagger: 0.2,
});

nav.from(".main-container .head-title .left", {
  y: -20,
  opacity: 0,
  duration: 0.8,
});

nav.form(".main-container .box-info li", {
  y: -20,
  opacity: 0,
  duration: 0.5,
  stagger: 0.2,
});
