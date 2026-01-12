// Shared utility functions for admin panel
window.adminUtils = {
  // Format currency amount
  formatCurrency: (amount) => {
    return `৳. ${parseFloat(amount).toFixed(2)}`;
  },

  // Format date to local string
  formatDate: (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  // Format relative time
  formatRelativeTime: (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffTime = Math.abs(now - past);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  },

  // Show loading state
  showLoadingState: () => {
    const loader = document.createElement("div");
    loader.className = "loader";
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
  },

  // Hide loading state
  hideLoadingState: () => {
    const loader = document.querySelector(".loader");
    if (loader) {
      loader.remove();
    }
  },

  // Show success notification
  showSuccess: (message) => {
    const notification = document.createElement("div");
    notification.className = "notification success";
    notification.innerHTML = `
            <span class="message">${message}</span>
            <button class="close">&times;</button>
        `;
    document.body.appendChild(notification);

    // Add click handler for close button
    const closeBtn = notification.querySelector(".close");
    closeBtn.addEventListener("click", () => {
      notification.remove();
    });

    // Remove notification after timeout
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.remove();
      }
    }, 5000);
  },

  // Show error notification
  showError: (message) => {
    const notification = document.createElement("div");
    notification.className = "notification error";
    notification.innerHTML = `
            <span class="message">${message}</span>
            <button class="close">&times;</button>
        `;
    document.body.appendChild(notification);

    // Add click handler for close button
    const closeBtn = notification.querySelector(".close");
    closeBtn.addEventListener("click", () => {
      notification.remove();
    });

    // Remove notification after timeout
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.remove();
      }
    }, 5000);
  },
};

// Calculate percentage change
function calculatePercentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return (((current - previous) / previous) * 100).toFixed(1);
}

// Show loading state
function showLoadingState() {
  const loadingOverlay = document.createElement("div");
  loadingOverlay.className = "loading-overlay";
  loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading...</div>
    `;
  document.body.appendChild(loadingOverlay);
}

// Hide loading state
function hideLoadingState() {
  const overlay = document.querySelector(".loading-overlay");
  if (overlay) {
    overlay.remove();
  }
}

// Show error message
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 3000);
}

// Format status
function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

// Get status color class
function getStatusColorClass(status) {
  const statusMap = {
    pending: "warning",
    processing: "info",
    completed: "success",
    cancelled: "danger",
  };
  return statusMap[status.toLowerCase()] || "default";
}

// Format phone number
function formatPhoneNumber(phone) {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}

// Truncate text
function truncateText(text, length = 30) {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

// Show success message
function showSuccess(message) {
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.textContent = message;
  document.body.appendChild(successDiv);
  setTimeout(() => successDiv.remove(), 3000);
}

// Export functions
window.adminUtils = {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  calculatePercentageChange,
  showLoadingState,
  hideLoadingState,
  showError,
  showSuccess,
  formatStatus,
  getStatusColorClass,
  formatPhoneNumber,
  truncateText,
};
