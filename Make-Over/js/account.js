document.addEventListener("DOMContentLoaded", () => {
  // Initialize with authentication check
  if (!ApiService.getAuthToken()) {
    window.location.href = "/Make-Over/pages/login.html";
    return;
  }

  // DOM Elements
  const elements = {
    userAvatar: document.getElementById("userAvatar"),
    userName: document.getElementById("userName"),
    userEmail: document.getElementById("userEmail"),
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    profileEmail: document.getElementById("profileEmail"),
    profilePhone: document.getElementById("profilePhone"),
    profileAddress: document.getElementById("profileAddress"),
    logoutBtn: document.getElementById("logoutBtn"),
    sidebarButtons: document.querySelectorAll(
      ".sidebar-menu button[data-section]"
    ),
    sections: document.querySelectorAll(".account-section"),
    changePasswordForm: document.getElementById("changePasswordForm"),
    editProfileBtn: document.getElementById("editProfileBtn"),
    notificationSettings: {
      emailNotif: document.getElementById("emailNotif"),
      orderUpdates: document.getElementById("orderUpdates"),
      promotions: document.getElementById("promotions"),
    },
  };

  // Load user data and initialize page
  ApiService.getUserProfile()
    .then((userData) => {
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      setupPage(elements, userData);
    })
    .catch((error) => {
      console.error("Error loading user data:", error);
      showMessage("Error loading user data. Please try again.", "error");
    });
});

// Set up page with user data
function setupPage(elements, userData) {
  // Update profile display
  updateProfileDisplay(elements, userData);

  // Set up navigation
  setupNavigation(elements.sidebarButtons, elements.sections);

  // Set up profile editing
  setupProfileEditing(elements, userData);

  // Set up password change
  setupPasswordChange(elements.changePasswordForm);

  // Set up notifications
  setupNotifications(elements.notificationSettings, userData.id);

  // Set up logout
  setupLogout(elements.logoutBtn);

  // Load dynamic content
  loadOrders();
  loadWishlist();
}

// Update profile display
function updateProfileDisplay(elements, userData) {
  const {
    userAvatar,
    userName,
    userEmail,
    firstName,
    lastName,
    profileEmail,
    profilePhone,
    profileAddress,
  } = elements;

  userAvatar.src = userData.avatar || "/assets/svg/default-profile-img.png";
  const fullName = `${userData.firstName} ${userData.lastName}`;
  userName.textContent = fullName || "Unknown User";
  userEmail.textContent = userData.email;

  firstName.textContent = userData.firstName || "Not added";
  firstName.className = userData.firstName ? "" : "empty";

  lastName.textContent = userData.lastName || "Not added";
  lastName.className = userData.lastName ? "" : "empty";

  profileEmail.textContent = userData.email;
  profileEmail.className = userData.email ? "" : "empty";

  profilePhone.textContent = userData.phone || "Not added";
  profilePhone.className = userData.phone ? "" : "empty";

  profileAddress.textContent = userData.address || "Not added";
  profileAddress.className = userData.address ? "" : "empty";
}

// Set up navigation
function setupNavigation(buttons, sections) {
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetSection = button.dataset.section;
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      sections.forEach((section) => {
        section.classList.remove("active");
        if (section.id === targetSection) {
          section.classList.add("active");
        }
      });
    });
  });
}

// Set up profile editing
function setupProfileEditing(elements, userData) {
  const { editProfileBtn, firstName, lastName, profilePhone, profileAddress } =
    elements;

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      if (editProfileBtn.textContent === "Edit Profile") {
        // Enable editing
        firstName.innerHTML = `<input type="text" id="editFirstName" value="${
          firstName.textContent === "Not added" ? "" : firstName.textContent
        }">`;
        lastName.innerHTML = `<input type="text" id="editLastName" value="${
          lastName.textContent === "Not added" ? "" : lastName.textContent
        }">`;
        profilePhone.innerHTML = `<input type="tel" id="editPhone" value="${
          profilePhone.textContent === "Not added"
            ? ""
            : profilePhone.textContent
        }">`;
        profileAddress.innerHTML = `<textarea id="editAddress">${
          profileAddress.textContent === "Not added"
            ? ""
            : profileAddress.textContent
        }</textarea>`;

        editProfileBtn.textContent = "Save Changes";
      } else {
        // Save changes
        saveProfileChanges(elements, userData);
      }
    });
  }
}

// Save profile changes
async function saveProfileChanges(elements, userData) {
  try {
    const updatedData = {
      firstName: document.getElementById("editFirstName").value,
      lastName: document.getElementById("editLastName").value,
      phone: document.getElementById("editPhone").value,
      address: document.getElementById("editAddress").value,
    };

    const updatedUser = await ApiService.updateUserProfile(updatedData);
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    updateProfileDisplay(elements, updatedUser);

    elements.editProfileBtn.textContent = "Edit Profile";
    showMessage("Profile updated successfully!", "success");
  } catch (error) {
    console.error("Error saving profile:", error);
    showMessage("Error saving changes. Please try again.", "error");
  }
}

// Set up password change
function setupPasswordChange(form) {
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const currentPassword = form.querySelector("#currentPassword").value;
      const newPassword = form.querySelector("#newPassword").value;
      const confirmPassword = form.querySelector("#confirmNewPassword").value;

      if (newPassword !== confirmPassword) {
        showMessage("New passwords do not match", "error");
        return;
      }

      try {
        const updated = await ApiService.updateUserProfile({
          currentPassword,
          newPassword,
        });

        // Update local user and UI if server returned updated user
        if (updated) {
          localStorage.setItem("loggedInUser", JSON.stringify(updated));
          updateProfileDisplay(elements, updated);
        }

        form.reset();
        showMessage("Password updated successfully!", "success");
      } catch (error) {
        showMessage("Error updating password. Please try again.", "error");
      }
    });
  }
}

// Set up notifications
function setupNotifications(settings, userId) {
  Object.entries(settings).forEach(([key, element]) => {
    if (element) {
      element.addEventListener("change", async () => {
        try {
          const preferences = {
            emailNotifications: settings.emailNotif.checked,
            orderUpdates: settings.orderUpdates.checked,
            promotions: settings.promotions.checked,
          };

          await ApiService.updateUserProfile({ preferences });
          localStorage.setItem(
            `preferences_${userId}`,
            JSON.stringify(preferences)
          );
          showMessage("Preferences saved!", "success");
        } catch (error) {
          showMessage("Error saving preferences", "error");
        }
      });
    }
  });
}

// Set up logout
function setupLogout(logoutBtn) {
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      ApiService.logout();
      // account.html is inside pages/, so go up one level
      window.location.href = "../index.html";
    });
  }
}

// Load orders
async function loadOrders() {
  const ordersList = document.getElementById("ordersList");
  if (!ordersList) return;

  try {
    const orders = await ApiService.getUserOrders();

    if (!orders || orders.length === 0) {
      ordersList.innerHTML = '<div class="no-orders">No orders found</div>';
      return;
    }

    ordersList.innerHTML = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(
        (order) => `
                <div class="order-item">
                    <div class="order-header">
                        <h3>Order #${order.id}</h3>
                        <span class="order-date">${new Date(
                          order.createdAt
                        ).toLocaleDateString()}</span>
                        <span class="order-status ${order.status}">${
          order.status
        }</span>
                    </div>
                    <div class="order-details">
                        ${order.items
                          .map(
                            (item) => `
                            <div class="order-product">
                                <img src="${item.image}" alt="${item.name}">
                                <div class="product-info">
                                    <h4>${item.name}</h4>
                                    <p>Quantity: ${item.quantity}</p>
                                    <p>Price: $${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                        <div class="order-total">
                            <p>Total: $${order.total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            `
      )
      .join("");
  } catch (error) {
    console.error("Error loading orders:", error);
    ordersList.innerHTML = '<div class="error">Error loading orders</div>';
  }
}

// Load wishlist
async function loadWishlist() {
  const wishlistItems = document.getElementById("wishlistItems");
  if (!wishlistItems) return;

  try {
    const userData = await ApiService.getUserProfile();
    const wishlist = userData.wishlist || [];

    if (wishlist.length === 0) {
      wishlistItems.innerHTML =
        '<p class="empty-message">Your wishlist is empty</p>';
      return;
    }

    wishlistItems.innerHTML = wishlist
      .map(
        (item) => `
                <div class="wishlist-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>$${item.price.toFixed(2)}</p>
                        <button class="add-to-cart" data-id="${
                          item.id
                        }">Add to Cart</button>
                        <button class="remove-from-wishlist" data-id="${
                          item.id
                        }">Remove</button>
                    </div>
                </div>
            `
      )
      .join("");

    // Add event listeners to buttons
    setupWishlistButtons(wishlistItems);
  } catch (error) {
    console.error("Error loading wishlist:", error);
    wishlistItems.innerHTML = '<div class="error">Error loading wishlist</div>';
  }
}

// Set up wishlist buttons
function setupWishlistButtons(container) {
  container.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const itemId = button.dataset.id;
        await ApiService.addToCart(itemId);
        showMessage("Item added to cart!", "success");
      } catch (error) {
        showMessage("Error adding item to cart", "error");
      }
    });
  });

  container.querySelectorAll(".remove-from-wishlist").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const itemId = button.dataset.id;
        await ApiService.removeFromWishlist(itemId);
        await loadWishlist();
        showMessage("Item removed from wishlist", "success");
      } catch (error) {
        showMessage("Error removing item from wishlist", "error");
      }
    });
  });
}

// Show message helper
function showMessage(text, type = "success") {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  document.querySelector(".account-content").prepend(message);
  setTimeout(() => message.remove(), 3000);
}
