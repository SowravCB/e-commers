// DOM Elements
const usersTableBody = document.getElementById("usersTableBody");
const userSearch = document.getElementById("userSearch");
const roleFilter = document.getElementById("roleFilter");
const statusFilter = document.getElementById("statusFilter");
const userModal = document.getElementById("userModal");
const userDetailsModal = document.getElementById("userDetailsModal");
const userForm = document.getElementById("userForm");
const modalTitle = document.getElementById("modalTitle");

// Initialize users array
let users = [];

// Fetch users data from data.json
async function fetchUsers() {
  try {
    const response = await fetch("../../data.json");
    const data = await response.json();
    users = data.users.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      password: user.password,
      role: user.role,
      status: user.status,
      joinedDate: user.registeredDate,
      lastLogin: user.lastLogin,
      orders: user.orderCount || 0,
      totalSpent: user.totalSpent || 0,
      avatar: user.avatar,
      phone: user.phone,
    }));
    displayUsers(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    // Show error message to user
    usersTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: red;">
                    Error loading users. Please try again later.
                </td>
            </tr>
        `;
  }
}

// Function to display users in the table
function displayUsers(usersToDisplay) {
  usersTableBody.innerHTML = usersToDisplay
    .map(
      (user) => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="role ${user.role}">${
        user.role.charAt(0).toUpperCase() + user.role.slice(1)
      }</span></td>
            <td><span class="status ${user.status}">${
        user.status.charAt(0).toUpperCase() + user.status.slice(1)
      }</span></td>
            <td>${formatDate(user.joinedDate)}</td>
            <td>
                <button class="view-btn" onclick="viewUser('${
                  user.id
                }')">View</button>
                <button class="edit-btn" onclick="editUser('${
                  user.id
                }')">Edit</button>
                <button class="delete-btn" onclick="deleteUser('${
                  user.id
                }')">Delete</button>
            </td>
        </tr>
    `
    )
    .join("");
}

// Format date function
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to open add user modal
function openAddUserModal() {
  modalTitle.textContent = "Add New User";
  userForm.reset();
  // userModal.style.display = "flex";
  userModal.classList.add("show");
}

// Function to close user modal
function closeUserModal() {
  // userModal.style.display = "none";
  userModal.classList.remove("show");
  userForm.reset();
}

// Function to view user details
function viewUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  const userDetails = document.getElementById("userDetails");
  userDetails.innerHTML = `
        <div class="user-info">
        <div class="img-name">
        <img src="${
          user.avatar || "/assets/svg/default-profile-img.png"
        }" alt="Profile Picture" class="user-avatar">
        <div class="name-id">
          <h3>${user.name}</h3>
          <p><strong>User ID : </strong> ${user.id}</p>
            </div>
        </div>
        <div class="info-grid">
<div><span>Email :</span><p>${user.email}</p></div>
<div><span>Role :</span><p class="role ${user.role}">${user.role}</p></div>
<div><span>Phone Number :</span><p>${user.phone}</p></div>
<div><span>Status :</span><p class="status ${user.status}">${
    user.status
  }</p></div>

<div><span>Joined Date :</span><p>${formatDate(user.joinedDate)}</p></div>
<div><span>Last Login :</span><p>${formatDate(user.lastLogin)}</p></div>

</div>


            <div class="user-stats">
                <div><span>Total Orders</span><p>${user.orders}</p></div>
                <div><span>Total Spands</span><p>৳. ${user.totalSpent.toFixed(
                  2
                )}</p></div>
            </div>
        </div>
    `;

  // userDetailsModal.style.display = "flex";
  userDetailsModal.classList.add("show");
}

// Function to edit user
function editUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  modalTitle.textContent = "Edit User";
  document.getElementById("userName").value = user.name;
  document.getElementById("userEmail").value = user.email;
  document.getElementById("userRole").value = user.role;
  document.getElementById("userStatus").value = user.status;
  document.getElementById("userPassword").value = ""; // Clear password field

  userForm.dataset.userId = userId;
  // userModal.style.display = "flex";
  userModal.classList.add("show");
}

// Function to delete user
function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    users = users.filter((user) => user.id !== userId);
    displayUsers(filterUsers());
  }
}

// Function to filter users based on search and filters
function filterUsers() {
  const searchTerm = userSearch.value.toLowerCase();
  const roleTerm = roleFilter.value.toLowerCase();
  const statusTerm = statusFilter.value.toLowerCase();

  return users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.id.toLowerCase().includes(searchTerm);
    const matchesRole = !roleTerm || user.role === roleTerm;
    const matchesStatus = !statusTerm || user.status === statusTerm;
    return matchesSearch && matchesRole && matchesStatus;
  });
}

// Event Listeners
userSearch.addEventListener("input", () => {
  displayUsers(filterUsers());
});

roleFilter.addEventListener("change", () => {
  displayUsers(filterUsers());
});

statusFilter.addEventListener("change", () => {
  displayUsers(filterUsers());
});

userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const userId = userForm.dataset.userId;
  const userData = {
    name: document.getElementById("userName").value,
    email: document.getElementById("userEmail").value,
    role: document.getElementById("userRole").value,
    status: document.getElementById("userStatus").value,
    password: document.getElementById("userPassword").value,
  };

  if (userId) {
    // Edit existing user
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData };
    }
  } else {
    // Add new user
    const newUser = {
      id: `USR${String(users.length + 1).padStart(3, "0")}`,
      ...userData,
      joinedDate: new Date().toISOString().split("T")[0],
      lastLogin: "-",
      orders: 0,
      totalSpent: 0,
    };
    users.push(newUser);
  }

  displayUsers(filterUsers());
  closeUserModal();
});

// Close modals when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === userModal || e.target === userDetailsModal) {
    // userModal.style.display = "none";
    userModal.classList.remove("show");
    // userDetailsModal.style.display = "none";
    userDetailsModal.classList.remove("show");
  }
});

// Close buttons for modals
document.querySelectorAll(".close-modal").forEach((button) => {
  button.addEventListener("click", () => {
    // userModal.style.display = "none";
    userModal.classList.remove("show");
    // userDetailsModal.style.display = "none";
    userDetailsModal.classList.remove("show");
  });
});

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  fetchUsers();
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

nav.from(".users-container", {
  y: 50,
  opacity: 0,
  duration: 0.5,
  stagger: 0.2,
});
