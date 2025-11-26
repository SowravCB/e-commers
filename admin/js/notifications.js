// Notifications functionality for admin panel
let notifications = [];

// Initialize notifications
async function initializeNotifications() {
  await loadNotifications();
  setupNotificationListeners();
}

// Load notifications from data.json
async function loadNotifications() {
  try {
    const response = await fetch("../../data.json");
    const data = await response.json();
    notifications = data.notifications || [];
    updateNotificationBadge();
    displayNotifications();
  } catch (error) {
    console.error("Error loading notifications:", error);
    showErrorNotification("Failed to load notifications");
  }
}

// Setup notification button click listener
function setupNotificationListeners() {
  const notificationBtn = document.getElementById("notificationBtn");
  const notificationDropdown = document.getElementById("notificationDropdown");

  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      notificationDropdown.classList.add("show");
      if (notificationDropdown.classList.contains("show")) {
        markNotificationsAsRead();
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !notificationBtn.contains(e.target) &&
        !notificationDropdown.contains(e.target)
      ) {
        notificationDropdown.classList.remove("show");
      }
    });
  }
}

// Update notification badge
function updateNotificationBadge() {
  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const badge = document.querySelector(".notification-badge");

  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? "block" : "none";
  }
}

// Display notifications in dropdown
function displayNotifications() {
  const dropdown = document.getElementById("notificationDropdown");
  if (!dropdown) return;

  const notificationsList = notifications
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(
      (notification) => `
            <div class="notification-item ${notification.status}" data-id="${
        notification.id
      }">
                <div class="notification-icon ${notification.type}">
                    ${getNotificationIcon(notification.type)}
                </div>
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <span class="notification-time">${formatNotificationTime(
                      notification.createdAt
                    )}</span>
                </div>
            </div>
        `
    )
    .join("");

  dropdown.innerHTML = `
        <div class="notification-header">
            <h3>Notifications</h3>
            ${
              notifications.length > 0
                ? `<button class="mark-all-read">Mark all as read</button>`
                : ""
            }
        </div>
        <div class="notification-list">
            ${
              notificationsList ||
              '<div class="no-notifications">No notifications</div>'
            }
        </div>
        ${
          notifications.length > 5
            ? '<a href="#" class="view-all">View all notifications</a>'
            : ""
        }
    `;

  // Add click handler for "Mark all as read"
  const markAllBtn = dropdown.querySelector(".mark-all-read");
  if (markAllBtn) {
    markAllBtn.addEventListener("click", markNotificationsAsRead);
  }
}

// Get appropriate icon for notification type
function getNotificationIcon(type) {
  const icons = {
    order: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm0-80h480v-640h-80v280l-100-60-100 60v-280H240v640Zm0 0v-640 640Zm200-360 100-60 100 60-100-60-100 60Z" /></svg>`,
    stock: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg>`,
    message: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>`,
  };
  return icons[type] || icons.message;
}

// Format notification time to relative time
function formatNotificationTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // difference in seconds

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  return date.toLocaleDateString();
}

// Mark all notifications as read
function markNotificationsAsRead() {
  notifications.forEach((notification) => {
    notification.status = "read";
  });
  updateNotificationBadge();
  displayNotifications();
}

// Show error notification
function showErrorNotification(message) {
  const notification = document.createElement("div");
  notification.className = "error-notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeNotifications);
