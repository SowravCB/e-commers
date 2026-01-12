// DOM Elements
const profileForm = document.getElementById("profileForm");
const securityForm = document.getElementById("securityForm");
const emailNotifications = document.getElementById("emailNotifications");
const orderNotifications = document.getElementById("orderNotifications");
const stockNotifications = document.getElementById("stockNotifications");
const themeInputs = document.querySelectorAll('input[name="theme"]');

// Load user data
async function loadUserData() {
  try {
    const response = await fetch("../../data.json");
    const data = await response.json();
    const adminUser = data.users.find((user) => user.role === "admin");

    if (adminUser) {
      document.getElementById("profilePicture").src = adminUser.avatar;
      document.getElementById("firstName").value = adminUser.firstName;
      document.getElementById("lastName").value = adminUser.lastName;
      document.getElementById("email").value = adminUser.email;
      document.getElementById("phone").value = adminUser.phone;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
}

// Handle profile form submission
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
  };

  // Here you would typically send this data to your backend
  console.log("Profile update:", formData);
  showNotification("Profile updated successfully!");
});

// Handle security form submission
securityForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    showNotification("New passwords do not match!", "error");
    return;
  }

  // Here you would typically verify the current password and update with the new one
  console.log("Password update initiated");
  showNotification("Password updated successfully!");
  securityForm.reset();
});

const currentPassword = document.getElementById("currentPassword");
const currentPassVisibleIcon = document.getElementById(
  "currentPassVisibleIcon"
);
currentPassVisibleIcon.addEventListener("click", () => {
  if (currentPassword.type === "password") {
    currentPassword.type = "text";
  } else {
    currentPassword.type = "password";
  }
});

const newPasswordInput = document.getElementById("newPassword");
const newPassVisibleIcon = document.getElementById("newPassVisibleIcon");
newPassVisibleIcon.addEventListener("click", () => {
  if (newPasswordInput.type === "password") {
    newPasswordInput.type = "text";
  } else {
    newPasswordInput.type = "password";
  }
});
const confirmPassword = document.getElementById("confirmPassword");
const ConfirmPassVisibleIcon = document.getElementById(
  "ConfirmPassVisibleIcon"
);
ConfirmPassVisibleIcon.addEventListener("click", () => {
  if (confirmPassword.type === "password") {
    confirmPassword.type = "text";
  } else {
    confirmPassword.type = "password";
  }
});

// Handle notification toggles
function handleNotificationChange(type, enabled) {
  // Here you would typically update user preferences in your backend
  console.log(`${type} notifications ${enabled ? "enabled" : "disabled"}`);
  showNotification(`${type} notifications ${enabled ? "enabled" : "disabled"}`);
}

emailNotifications.addEventListener("change", (e) => {
  handleNotificationChange("Email", e.target.checked);
});

orderNotifications.addEventListener("change", (e) => {
  handleNotificationChange("Order", e.target.checked);
});

stockNotifications.addEventListener("change", (e) => {
  handleNotificationChange("Stock", e.target.checked);
});

// Handle theme changes
function handleThemeChange(theme) {
  document.body.classList.remove("light-theme", "dark-theme");
  document.body.classList.add(`${theme}-theme`);
  localStorage.setItem("theme", theme);
  showNotification(`Theme changed to ${theme} mode`);
}

themeInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    handleThemeChange(e.target.value);
  });
});

// Show notification
function showNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Add notification to page
  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Handle file upload for profile picture
document.querySelector(".change-avatar-btn").addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById("profilePicture").src = e.target.result;
        showNotification("Profile picture updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  input.click();
});

// Load saved preferences
function loadSavedPreferences() {
  // Load saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  document.getElementById(`${savedTheme}Theme`).checked = true;
  handleThemeChange(savedTheme);

  // Load notification preferences (you might want to load these from your backend)
  const savedPreferences = JSON.parse(
    localStorage.getItem("notificationPreferences")
  ) || {
    email: true,
    order: true,
    stock: false,
  };

  emailNotifications.checked = savedPreferences.email;
  orderNotifications.checked = savedPreferences.order;
  stockNotifications.checked = savedPreferences.stock;
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadUserData();
  loadSavedPreferences();
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
