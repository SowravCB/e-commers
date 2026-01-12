// DOM Elements
const ordersTableBody = document.getElementById("ordersTableBody");
const orderSearch = document.getElementById("orderSearch");
const statusFilter = document.getElementById("statusFilter");
const orderModal = document.getElementById("orderModal");
const closeModal = document.querySelector(".close-modal");

// Initialize orders array
let orders = [];

// Fetch orders from data.json
async function fetchOrders() {
  try {
    const response = await fetch("/data.json");
    const data = await response.json();
    orders = data.orders.map((order) => ({
      id: order.id,
      customer: order.customerName,
      email: order.email,
      date: order.orderDate,
      total: order.total,
      status: order.status.toLowerCase(),
      items: order.products,
      shipping: order.shippingAddress,
      paymentMethod: order.paymentMethod,
    }));
    displayOrders(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}

// Function to display orders in the table
function displayOrders(ordersToDisplay) {
  ordersTableBody.innerHTML = ""; // Clear existing rows
  if (ordersToDisplay.length === 0) {
    ordersTableBody.innerHTML =
      '<tr><td colspan="6" class="no-results">No orders found.</td></tr>';
    return;
  }
  ordersTableBody.innerHTML = ordersToDisplay
    .map((order) => {
      const statuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];
      const options = statuses
        .map(
          (status) =>
            `<option class="${status}" value="${status}" ${
              order.status === status ? "selected" : ""
            }>${status.charAt(0).toUpperCase() + status.slice(1)}</option>`
        )
        .join("");

      return `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${formatDate(order.date)}</td>
            <td>৳. ${order.total.toFixed(2)}</td>
            <td><span class="status ${order.status}">${
        order.status.charAt(0).toUpperCase() + order.status.slice(1)
      }</span></td>
            <td class="action-buttons">
                <button class="view-btn" onclick="viewOrder('${
                  order.id
                }')">View</button>
                <select class="status-select" onchange="directUpdateStatus('${
                  order.id
                }', this.value)">
                    ${options}
                </select>
            </td>
        </tr>
    `;
    })
    .join("");
}

// New function to directly update status from the table dropdown
function directUpdateStatus(orderId, newStatus) {
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = newStatus;
    // Re-render to update the status color and selection
    displayOrders(filterOrders());
  }
}

// Format date function
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to view order details
function viewOrder(orderId) {
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;

  const orderDetails = document.getElementById("orderDetails");
  orderDetails.innerHTML = `
        <div class="order-info">
            <h3>Order #${order.id}</h3>
            <div class="customer-info">
            <div><span>Customer Name :</span><p>${order.customer}</p></div>
            <div><span>Email :</span><p>${order.email}</p></div>
            <div><span>Status :</span><p class="status ${order.status}">${
    order.status.charAt(0).toUpperCase() + order.status.slice(1)
  }</p></div>
            <div><span>Date :</span><p>${formatDate(order.date)}</p></div>
            <div><span>Payment Method :</span><p>${
              order.paymentMethod
            }</p></div>
            </div>
            
            <h4>Order Items</h4>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items
                      .map(
                        (item) => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>৳. ${item.price.toFixed(2)}</td>
                            <td>৳. ${(item.quantity * item.price).toFixed(
                              2
                            )}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="text-align: right;"><strong>Total Amount:</strong></td>
                        <td><strong>৳. ${order.total.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
            
            <div class="shipping-info">
                <h4>Shipping Address</h4>
                <p>${order.shipping.street}</p>
                <p>${order.shipping.city}, ${order.shipping.state}</p>
                <p>${order.shipping.country} - ${order.shipping.zipCode}</p>
            </div>
        </div>
    `;

  // orderModal.style.display = "flex";
  orderModal.classList.add("show");
}

// Function to filter orders based on search and status
function filterOrders() {
  const searchTerm = orderSearch.value.toLowerCase();
  const statusTerm = statusFilter.value.toLowerCase();

  return orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm) ||
      order.customer.toLowerCase().includes(searchTerm);
    const matchesStatus = !statusTerm || order.status === statusTerm;
    return matchesSearch && matchesStatus;
  });
}

// Event Listeners
orderSearch.addEventListener("input", () => {
  displayOrders(filterOrders());
});

statusFilter.addEventListener("change", () => {
  displayOrders(filterOrders());
});

closeModal.addEventListener("click", () => {
  // orderModal.style.display = "none";
  orderModal.classList.remove("show");
});

window.addEventListener("click", (e) => {
  if (e.target === orderModal) {
    // orderModal.style.display = "none";
    orderModal.classList.remove("show");
  }
});

// Initial load
fetchOrders();

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

nav.from(".navbar", { y: -50, opacity: 0, duration: 0.5 });
nav.from(".navbar .nav-link", {
  y: -20,
  opacity: 0,
  duration: 0.3,
  stagger: 0.2,
});

nav.from(".main-container .head-title .left", {
  y: -20,
  opacity: 0,
  duration: 0.3,
});

nav.from(".orders-container", {
  y: 50,
  opacity: 0,
  duration: 0.5,
  stagger: 0.2,
});
