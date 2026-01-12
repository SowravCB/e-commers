// ============================================
// ACCOUNT PAGE INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", initializeAccount);

async function initializeAccount() {
  try {
    // Verify authentication
    const token = ApiService.getAuthToken();
    if (!token) {
      console.warn("No auth token found. Redirecting to login.");
      window.location.href = "/Make-Over/pages/login.html";
      return;
    }

    // Get DOM elements
    const elements = getDOMElements();
    if (!elements) {
      console.error("Required DOM elements not found");
      alert("Page initialization failed. Please refresh.");
      return;
    }

    // Load and display user profile
    const userData = await ApiService.getUserProfile();
    if (!userData) {
      throw new Error("Failed to load user profile");
    }

    // Store user data
    localStorage.setItem("loggedInUser", JSON.stringify(userData));

    // Set up page
    setupPage(elements, userData);

    // Load additional data
    await Promise.all([loadOrders(), loadWishlist()]);

    // Try to load preferred user if specified
    attemptLoadPreferredUser(elements, userData);
  } catch (error) {
    handleInitializationError(error);
  }
}

// ============================================
// DOM ELEMENT RETRIEVAL
// ============================================

function getDOMElements() {
  try {
    const requiredElements = {
      userAvatar: "userAvatar",
      userName: "userName",
      userEmail: "userEmail",
      firstName: "firstName",
      lastName: "lastName",
      profileEmail: "profileEmail",
      profilePhone: "profilePhone",
      profileAddress: "profileAddress",
      logoutBtn: "logoutBtn",
      changePasswordForm: "changePasswordForm",
      editProfileBtn: "editProfileBtn",
      emailNotif: "emailNotif",
      orderUpdates: "orderUpdates",
      promotions: "promotions",
      ordersList: "ordersList",
      wishlistItems: "wishlistItems",
      accountContent: "account-content",
    };

    const elements = {};
    const missingElements = [];

    // Check required elements
    for (const [key, id] of Object.entries(requiredElements)) {
      const element = document.getElementById(id);
      if (!element && key !== "accountContent") {
        missingElements.push(id);
      }
      if (element) {
        elements[key] = element;
      }
    }

    // Check class-based element
    const accountContent = document.querySelector(".account-content");
    if (accountContent) {
      elements.accountContent = accountContent;
    }

    if (missingElements.length > 0) {
      console.warn("Missing DOM elements:", missingElements);
    }

    return elements;
  } catch (error) {
    console.error("Error retrieving DOM elements:", error);
    return null;
  }
}

// ============================================
// PAGE SETUP
// ============================================

function setupPage(elements, userData) {
  try {
    // Update profile display
    updateProfileDisplay(elements, userData);

    // Set up navigation
    const sidebarButtons = document.querySelectorAll(
      ".sidebar-menu button[data-section]"
    );
    const sections = document.querySelectorAll(".account-section");
    setupNavigation(sidebarButtons, sections);

    // Set up profile editing
    setupProfileEditing(elements, userData);

    // Set up password change
    if (elements.changePasswordForm) {
      setupPasswordChange(elements.changePasswordForm, elements);
    }

    // Set up notifications
    const notificationSettings = {
      emailNotif: elements.emailNotif,
      orderUpdates: elements.orderUpdates,
      promotions: elements.promotions,
    };
    setupNotifications(
      notificationSettings,
      userData.id,
      userData.preferences || {},
      true
    );

    // Set up logout
    if (elements.logoutBtn) {
      setupLogout(elements.logoutBtn);
    }
  } catch (error) {
    console.error("Error setting up page:", error);
    showMessage("Error setting up account page. Please refresh.", "error");
  }
}

// ============================================
// PROFILE DISPLAY
// ============================================

function updateProfileDisplay(elements, userData) {
  try {
    if (!userData) {
      console.warn("No user data provided to updateProfileDisplay");
      return;
    }

    // Update avatar
    if (elements.userAvatar) {
      elements.userAvatar.src =
        userData.avatar || "/assets/svg/default-profile-img.png";
      elements.userAvatar.onerror = () => {
        elements.userAvatar.src = "/assets/svg/default-profile-img.png";
      };
    }

    // Update name and email in header
    if (elements.userName) {
      const fullName = `${userData.firstName || ""} ${
        userData.lastName || ""
      }`.trim();
      elements.userName.textContent = fullName || "Unknown User";
    }

    if (elements.userEmail) {
      elements.userEmail.textContent = userData.email || "No email";
    }

    // Update profile details
    const profileFields = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileEmail: userData.email,
      profilePhone: userData.phone,
      profileAddress: userData.address,
    };

    for (const [elementKey, value] of Object.entries(profileFields)) {
      const element = elements[elementKey];
      if (element) {
        element.textContent = value || "Not added";
        element.className = value ? "" : "empty";
      }
    }
  } catch (error) {
    console.error("Error updating profile display:", error);
  }
}

// ============================================
// NAVIGATION
// ============================================

function setupNavigation(buttons, sections) {
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetSection = button.dataset.section;
      if (!targetSection) return;

      // Update button active state
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Update section visibility
      sections.forEach((section) => {
        section.classList.remove("active");
        if (section.id === targetSection) {
          section.classList.add("active");
        }
      });
    });
  });
}

// ============================================
// PROFILE EDITING
// ============================================

function setupProfileEditing(elements, userData) {
  if (!elements.editProfileBtn) return;

  elements.editProfileBtn.addEventListener("click", async () => {
    const isEditing = elements.editProfileBtn.textContent === "Edit Profile";

    if (isEditing) {
      enableProfileEditing(elements);
    } else {
      await saveProfileChanges(elements, userData);
    }
  });
}

function enableProfileEditing(elements) {
  const fields = {
    firstName: elements.firstName,
    lastName: elements.lastName,
    profilePhone: elements.profilePhone,
    profileAddress: elements.profileAddress,
  };

  for (const [fieldName, element] of Object.entries(fields)) {
    if (!element) continue;

    const currentValue = element.textContent;
    const displayValue = currentValue === "Not added" ? "" : currentValue;

    if (fieldName === "profileAddress") {
      element.innerHTML = `<textarea id="edit${fieldName}" class="profile-edit-field">${displayValue}</textarea>`;
    } else {
      const inputType = fieldName === "profilePhone" ? "tel" : "text";
      element.innerHTML = `<input type="${inputType}" id="edit${fieldName}" class="profile-edit-field" value="${displayValue}">`;
    }
  }

  elements.editProfileBtn.textContent = "Save Changes";
}

async function saveProfileChanges(elements, userData) {
  try {
    const updatedData = {
      firstName: document.getElementById("editfirstName")?.value || "",
      lastName: document.getElementById("editlastName")?.value || "",
      phone: document.getElementById("editprofilePhone")?.value || "",
      address: document.getElementById("editprofileAddress")?.value || "",
    };

    const updatedUser = await ApiService.updateUserProfile(updatedData);

    if (updatedUser) {
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      updateProfileDisplay(elements, updatedUser);
      showMessage("Profile updated successfully!", "success");
    }

    elements.editProfileBtn.textContent = "Edit Profile";
  } catch (error) {
    console.error("Error saving profile:", error);
    showMessage("Error saving profile. Please try again.", "error");
    updateProfileDisplay(elements, userData);
    elements.editProfileBtn.textContent = "Edit Profile";
  }
}

// ============================================
// PASSWORD CHANGE
// ============================================

function setupPasswordChange(form, elements) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const currentPassword = form.querySelector("#currentPassword")?.value || "";
    const newPassword = form.querySelector("#newPassword")?.value || "";
    const confirmPassword =
      form.querySelector("#confirmNewPassword")?.value || "";

    // Validation
    if (!currentPassword || !newPassword) {
      showMessage("Please fill in all password fields.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("New passwords do not match.", "error");
      return;
    }

    if (newPassword.length < 6) {
      showMessage("Password must be at least 6 characters long.", "error");
      return;
    }

    try {
      await ApiService.updateUserProfile({
        currentPassword,
        newPassword,
      });

      form.reset();
      showMessage("Password updated successfully!", "success");
    } catch (error) {
      console.error("Error updating password:", error);
      showMessage(
        "Error updating password. Please check your current password.",
        "error"
      );
    }
  });
}

// ============================================
// NOTIFICATIONS
// ============================================

function setupNotifications(
  settings,
  userId,
  initialPreferences = {},
  isOwner = true
) {
  // Get or initialize preferences
  const cached = localStorage.getItem(`preferences_${userId}`);
  const preferences = cached ? JSON.parse(cached) : initialPreferences;

  // Initialize checkbox states
  const checkboxMap = {
    emailNotif: "emailNotifications",
    orderUpdates: "orderUpdates",
    promotions: "promotions",
  };

  for (const [key, prefKey] of Object.entries(checkboxMap)) {
    const checkbox = settings[key];
    if (checkbox) {
      checkbox.checked = !!preferences[prefKey];

      if (isOwner) {
        checkbox.addEventListener("change", () =>
          handlePreferenceChange(settings, userId)
        );
      } else {
        checkbox.disabled = true;
      }
    }
  }

  // Make labels clickable
  setupNotificationLabels(isOwner);
}

async function handlePreferenceChange(settings, userId) {
  try {
    const preferences = {
      emailNotifications: settings.emailNotif?.checked || false,
      orderUpdates: settings.orderUpdates?.checked || false,
      promotions: settings.promotions?.checked || false,
    };

    await ApiService.updateUserProfile({ preferences });
    localStorage.setItem(`preferences_${userId}`, JSON.stringify(preferences));
    showMessage("Preferences saved!", "success");
  } catch (error) {
    console.error("Error saving preferences:", error);
    showMessage("Error saving preferences. Please try again.", "error");
  }
}

function setupNotificationLabels(isOwner) {
  document.querySelectorAll(".notif-label").forEach((label) => {
    if (label.dataset.clickHandlerAttached === "1") return;

    label.dataset.clickHandlerAttached = "1";

    label.addEventListener("click", (e) => {
      if (e.target?.tagName?.toLowerCase() === "input") return;

      const input = label.querySelector('input[type="checkbox"]');
      if (input && !input.disabled && isOwner) {
        input.checked = !input.checked;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  });
}

// ============================================
// LOGOUT
// ============================================

function setupLogout(logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // Clear localStorage
    const currentUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );
    const userId = currentUser.id;

    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("preferredUserId");

    if (userId) {
      localStorage.removeItem(`preferences_${userId}`);
    }

    // Logout via API
    ApiService.logout();

    // Redirect to login
    window.location.href = "/Make-Over/pages/login.html";
  });
}

// ============================================
// ORDERS
// ============================================

async function loadOrders(userId = null) {
  const ordersList = document.getElementById("ordersList");
  if (!ordersList) return;

  try {
    ordersList.innerHTML = '<div class="loading">Loading orders...</div>';

    const orders = userId
      ? await ApiService.getUserOrdersById(userId)
      : await ApiService.getUserOrders();

    if (!orders || orders.length === 0) {
      ordersList.innerHTML = '<div class="no-orders">No orders found.</div>';
      return;
    }

    const ordersHTML = orders
      .sort((a, b) => {
        const dateA = new Date(b.orderDate || b.createdAt);
        const dateB = new Date(a.orderDate || a.createdAt);
        return dateA - dateB;
      })
      .map((order) => renderOrderItem(order))
      .join("");

    ordersList.innerHTML = ordersHTML;
  } catch (error) {
    console.error("Error loading orders:", error);
    handleDataLoadError(ordersList, error);
  }
}

function renderOrderItem(order) {
  const date = new Date(order.orderDate || order.createdAt);
  const formattedDate = date.toLocaleDateString();
  const products = order.products || order.items || [];

  const productsHTML = products
    .map((item) => renderOrderProduct(item))
    .join("");

  return `
    <div class="order-item">
      <div class="order-header">
        <h3>Order #${order.id}</h3>
        <span class="order-date">${formattedDate}</span>
        <span class="order-status ${order.status}">${order.status}</span>
      </div>
      <div class="order-details">
        ${productsHTML}
        <div class="order-total">
          <p>Total: $${parseFloat(order.total).toFixed(2)}</p>
        </div>
      </div>
    </div>
  `;
}

function renderOrderProduct(item) {
  const imageHTML = item.image
    ? `<img src="${item.image}" alt="${item.name}" onerror="this.src='/assets/svg/default-product.png'">`
    : '<div class="product-image-placeholder">No Image</div>';

  return `
    <div class="order-product">
      ${imageHTML}
      <div class="product-info">
        <h4>${item.name}</h4>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: $${parseFloat(item.price).toFixed(2)}</p>
      </div>
    </div>
  `;
}

// ============================================
// WISHLIST
// ============================================

async function loadWishlist(user = null) {
  const wishlistItems = document.getElementById("wishlistItems");
  if (!wishlistItems) return;

  try {
    wishlistItems.innerHTML = '<div class="loading">Loading wishlist...</div>';

    const userData = user || (await ApiService.getUserProfile());
    if (!userData) {
      throw new Error("Unable to load user data");
    }

    const wishlist = userData.wishlist || userData.items || [];

    if (wishlist.length === 0) {
      wishlistItems.innerHTML =
        '<p class="empty-message">Your wishlist is empty.</p>';
      return;
    }

    const wishlistHTML = wishlist
      .map((item) => renderWishlistItem(item))
      .join("");

    wishlistItems.innerHTML = wishlistHTML;

    // Set up buttons
    setupWishlistButtons(wishlistItems);
  } catch (error) {
    console.error("Error loading wishlist:", error);
    handleDataLoadError(wishlistItems, error);
  }
}

function renderWishlistItem(item) {
  // ============================================
  // ACCOUNT PAGE INITIALIZATION
  // ============================================

  document.addEventListener("DOMContentLoaded", initializeAccount);

  async function initializeAccount() {
    try {
      // Verify authentication
      const token = ApiService.getAuthToken();
      if (!token) {
        console.warn("No auth token found. Redirecting to login.");
        window.location.href = "/Make-Over/pages/login.html";
        return;
      }

      // Get DOM elements
      const elements = getDOMElements();
      if (!elements) {
        console.error("Required DOM elements not found");
        alert("Page initialization failed. Please refresh.");
        return;
      }

      // Load and display user profile
      const userData = await ApiService.getUserProfile();
      if (!userData) {
        throw new Error("Failed to load user profile");
      }

      // Store user data
      localStorage.setItem("loggedInUser", JSON.stringify(userData));

      // Set up page
      setupPage(elements, userData);

      // Load additional data
      await Promise.all([loadOrders(), loadWishlist()]);

      // Try to load preferred user if specified
      attemptLoadPreferredUser(elements, userData);
    } catch (error) {
      handleInitializationError(error);
    }
  }

  // ============================================
  // DOM ELEMENT RETRIEVAL
  // ============================================

  function getDOMElements() {
    try {
      const requiredElements = {
        userAvatar: "userAvatar",
        userName: "userName",
        userEmail: "userEmail",
        firstName: "firstName",
        lastName: "lastName",
        profileEmail: "profileEmail",
        profilePhone: "profilePhone",
        profileAddress: "profileAddress",
        logoutBtn: "logoutBtn",
        changePasswordForm: "changePasswordForm",
        editProfileBtn: "editProfileBtn",
        emailNotif: "emailNotif",
        orderUpdates: "orderUpdates",
        promotions: "promotions",
        ordersList: "ordersList",
        wishlistItems: "wishlistItems",
        accountContent: "account-content",
      };

      const elements = {};
      const missingElements = [];

      // Check required elements
      for (const [key, id] of Object.entries(requiredElements)) {
        const element = document.getElementById(id);
        if (!element && key !== "accountContent") {
          missingElements.push(id);
        }
        if (element) {
          elements[key] = element;
        }
      }

      // Check class-based element
      const accountContent = document.querySelector(".account-content");
      if (accountContent) {
        elements.accountContent = accountContent;
      }

      if (missingElements.length > 0) {
        console.warn("Missing DOM elements:", missingElements);
      }

      return elements;
    } catch (error) {
      console.error("Error retrieving DOM elements:", error);
      return null;
    }
  }

  // ============================================
  // PAGE SETUP
  // ============================================

  function setupPage(elements, userData) {
    try {
      // Update profile display
      updateProfileDisplay(elements, userData);

      // Set up navigation
      const sidebarButtons = document.querySelectorAll(
        ".sidebar-menu button[data-section]"
      );
      const sections = document.querySelectorAll(".account-section");
      setupNavigation(sidebarButtons, sections);

      // Set up profile editing
      setupProfileEditing(elements, userData);

      // Set up password change
      if (elements.changePasswordForm) {
        setupPasswordChange(elements.changePasswordForm, elements);
      }

      // Set up notifications
      const notificationSettings = {
        emailNotif: elements.emailNotif,
        orderUpdates: elements.orderUpdates,
        promotions: elements.promotions,
      };
      setupNotifications(
        notificationSettings,
        userData.id,
        userData.preferences || {},
        true
      );

      // Set up logout
      if (elements.logoutBtn) {
        setupLogout(elements.logoutBtn);
      }
    } catch (error) {
      console.error("Error setting up page:", error);
      showMessage("Error setting up account page. Please refresh.", "error");
    }
  }

  // ============================================
  // PROFILE DISPLAY
  // ============================================

  function updateProfileDisplay(elements, userData) {
    try {
      if (!userData) {
        console.warn("No user data provided to updateProfileDisplay");
        return;
      }

      // Update avatar
      if (elements.userAvatar) {
        elements.userAvatar.src =
          userData.avatar || "/assets/svg/default-profile-img.png";
        elements.userAvatar.onerror = () => {
          elements.userAvatar.src = "/assets/svg/default-profile-img.png";
        };
      }

      // Update name and email in header
      if (elements.userName) {
        const fullName = `${userData.firstName || ""} ${
          userData.lastName || ""
        }`.trim();
        elements.userName.textContent = fullName || "Unknown User";
      }

      if (elements.userEmail) {
        elements.userEmail.textContent = userData.email || "No email";
      }

      // Update profile details
      const profileFields = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileEmail: userData.email,
        profilePhone: userData.phone,
        profileAddress: userData.address,
      };

      for (const [elementKey, value] of Object.entries(profileFields)) {
        const element = elements[elementKey];
        if (element) {
          element.textContent = value || "Not added";
          element.className = value ? "" : "empty";
        }
      }
    } catch (error) {
      console.error("Error updating profile display:", error);
    }
  }

  // ============================================
  // NAVIGATION
  // ============================================

  function setupNavigation(buttons, sections) {
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetSection = button.dataset.section;
        if (!targetSection) return;

        // Update button active state
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        // Update section visibility
        sections.forEach((section) => {
          section.classList.remove("active");
          if (section.id === targetSection) {
            section.classList.add("active");
          }
        });
      });
    });
  }

  // ============================================
  // PROFILE EDITING
  // ============================================

  function setupProfileEditing(elements, userData) {
    if (!elements.editProfileBtn) return;

    elements.editProfileBtn.addEventListener("click", async () => {
      const isEditing = elements.editProfileBtn.textContent === "Edit Profile";

      if (isEditing) {
        enableProfileEditing(elements);
      } else {
        await saveProfileChanges(elements, userData);
      }
    });
  }

  function enableProfileEditing(elements) {
    const fields = {
      firstName: elements.firstName,
      lastName: elements.lastName,
      profilePhone: elements.profilePhone,
      profileAddress: elements.profileAddress,
    };

    for (const [fieldName, element] of Object.entries(fields)) {
      if (!element) continue;

      const currentValue = element.textContent;
      const displayValue = currentValue === "Not added" ? "" : currentValue;

      if (fieldName === "profileAddress") {
        element.innerHTML = `<textarea id="edit${fieldName}" class="profile-edit-field">${displayValue}</textarea>`;
      } else {
        const inputType = fieldName === "profilePhone" ? "tel" : "text";
        element.innerHTML = `<input type="${inputType}" id="edit${fieldName}" class="profile-edit-field" value="${displayValue}">`;
      }
    }

    elements.editProfileBtn.textContent = "Save Changes";
  }

  async function saveProfileChanges(elements, userData) {
    try {
      const updatedData = {
        firstName: document.getElementById("editfirstName")?.value || "",
        lastName: document.getElementById("editlastName")?.value || "",
        phone: document.getElementById("editprofilePhone")?.value || "",
        address: document.getElementById("editprofileAddress")?.value || "",
      };

      const updatedUser = await ApiService.updateUserProfile(updatedData);

      if (updatedUser) {
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        updateProfileDisplay(elements, updatedUser);
        showMessage("Profile updated successfully!", "success");
      }

      elements.editProfileBtn.textContent = "Edit Profile";
    } catch (error) {
      console.error("Error saving profile:", error);
      showMessage("Error saving profile. Please try again.", "error");
      updateProfileDisplay(elements, userData);
      elements.editProfileBtn.textContent = "Edit Profile";
    }
  }

  // ============================================
  // PASSWORD CHANGE
  // ============================================

  function setupPasswordChange(form, elements) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const currentPassword =
        form.querySelector("#currentPassword")?.value || "";
      const newPassword = form.querySelector("#newPassword")?.value || "";
      const confirmPassword =
        form.querySelector("#confirmNewPassword")?.value || "";

      // Validation
      if (!currentPassword || !newPassword) {
        showMessage("Please fill in all password fields.", "error");
        return;
      }

      if (newPassword !== confirmPassword) {
        showMessage("New passwords do not match.", "error");
        return;
      }

      if (newPassword.length < 6) {
        showMessage("Password must be at least 6 characters long.", "error");
        return;
      }

      try {
        await ApiService.updateUserProfile({
          currentPassword,
          newPassword,
        });

        form.reset();
        showMessage("Password updated successfully!", "success");
      } catch (error) {
        console.error("Error updating password:", error);
        showMessage(
          "Error updating password. Please check your current password.",
          "error"
        );
      }
    });
  }

  // ============================================
  // NOTIFICATIONS
  // ============================================

  function setupNotifications(
    settings,
    userId,
    initialPreferences = {},
    isOwner = true
  ) {
    // Get or initialize preferences
    const cached = localStorage.getItem(`preferences_${userId}`);
    const preferences = cached ? JSON.parse(cached) : initialPreferences;

    // Initialize checkbox states
    const checkboxMap = {
      emailNotif: "emailNotifications",
      orderUpdates: "orderUpdates",
      promotions: "promotions",
    };

    for (const [key, prefKey] of Object.entries(checkboxMap)) {
      const checkbox = settings[key];
      if (checkbox) {
        checkbox.checked = !!preferences[prefKey];

        if (isOwner) {
          checkbox.addEventListener("change", () =>
            handlePreferenceChange(settings, userId)
          );
        } else {
          checkbox.disabled = true;
        }
      }
    }

    // Make labels clickable
    setupNotificationLabels(isOwner);
  }

  async function handlePreferenceChange(settings, userId) {
    try {
      const preferences = {
        emailNotifications: settings.emailNotif?.checked || false,
        orderUpdates: settings.orderUpdates?.checked || false,
        promotions: settings.promotions?.checked || false,
      };

      await ApiService.updateUserProfile({ preferences });
      localStorage.setItem(
        `preferences_${userId}`,
        JSON.stringify(preferences)
      );
      showMessage("Preferences saved!", "success");
    } catch (error) {
      console.error("Error saving preferences:", error);
      showMessage("Error saving preferences. Please try again.", "error");
    }
  }

  function setupNotificationLabels(isOwner) {
    document.querySelectorAll(".notif-label").forEach((label) => {
      if (label.dataset.clickHandlerAttached === "1") return;

      label.dataset.clickHandlerAttached = "1";

      label.addEventListener("click", (e) => {
        if (e.target?.tagName?.toLowerCase() === "input") return;

        const input = label.querySelector('input[type="checkbox"]');
        if (input && !input.disabled && isOwner) {
          input.checked = !input.checked;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    });
  }

  // ============================================
  // LOGOUT
  // ============================================

  function setupLogout(logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Clear localStorage
      const currentUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "{}"
      );
      const userId = currentUser.id;

      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("preferredUserId");

      if (userId) {
        localStorage.removeItem(`preferences_${userId}`);
      }

      // Logout via API
      ApiService.logout();

      // Redirect to login
      window.location.href = "/Make-Over/pages/login.html";
    });
  }

  // ============================================
  // ORDERS
  // ============================================

  async function loadOrders(userId = null) {
    const ordersList = document.getElementById("ordersList");
    if (!ordersList) return;

    try {
      ordersList.innerHTML = '<div class="loading">Loading orders...</div>';

      const orders = userId
        ? await ApiService.getUserOrdersById(userId)
        : await ApiService.getUserOrders();

      if (!orders || orders.length === 0) {
        ordersList.innerHTML = '<div class="no-orders">No orders found.</div>';
        return;
      }

      const ordersHTML = orders
        .sort((a, b) => {
          const dateA = new Date(b.orderDate || b.createdAt);
          const dateB = new Date(a.orderDate || a.createdAt);
          return dateA - dateB;
        })
        .map((order) => renderOrderItem(order))
        .join("");

      ordersList.innerHTML = ordersHTML;
    } catch (error) {
      console.error("Error loading orders:", error);
      handleDataLoadError(ordersList, error);
    }
  }

  function renderOrderItem(order) {
    const date = new Date(order.orderDate || order.createdAt);
    const formattedDate = date.toLocaleDateString();
    const products = order.products || order.items || [];

    const productsHTML = products
      .map((item) => renderOrderProduct(item))
      .join("");

    return `
    <div class="order-item">
      <div class="order-header">
        <h3>Order #${order.id}</h3>
        <span class="order-date">${formattedDate}</span>
        <span class="order-status ${order.status}">${order.status}</span>
      </div>
      <div class="order-details">
        ${productsHTML}
        <div class="order-total">
          <p>Total: $${parseFloat(order.total).toFixed(2)}</p>
        </div>
      </div>
    </div>
  `;
  }

  function renderOrderProduct(item) {
    const imageHTML = item.image
      ? `<img src="${item.image}" alt="${item.name}" onerror="this.src='/assets/svg/default-product.png'">`
      : '<div class="product-image-placeholder">No Image</div>';

    return `
    <div class="order-product">
      ${imageHTML}
      <div class="product-info">
        <h4>${item.name}</h4>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: $${parseFloat(item.price).toFixed(2)}</p>
      </div>
    </div>
  `;
  }

  // ============================================
  // WISHLIST
  // ============================================

  async function loadWishlist(user = null) {
    const wishlistItems = document.getElementById("wishlistItems");
    if (!wishlistItems) return;

    try {
      wishlistItems.innerHTML =
        '<div class="loading">Loading wishlist...</div>';

      const userData = user || (await ApiService.getUserProfile());
      if (!userData) {
        throw new Error("Unable to load user data");
      }

      const wishlist = userData.wishlist || userData.items || [];

      if (wishlist.length === 0) {
        wishlistItems.innerHTML =
          '<p class="empty-message">Your wishlist is empty.</p>';
        return;
      }

      const wishlistHTML = wishlist
        .map((item) => renderWishlistItem(item))
        .join("");

      wishlistItems.innerHTML = wishlistHTML;

      // Set up buttons
      setupWishlistButtons(wishlistItems);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      handleDataLoadError(wishlistItems, error);
    }
  }

  function renderWishlistItem(item) {
    const imageHTML = item.image
      ? `<img src="${item.image}" alt="${item.name}" onerror="this.src='/assets/svg/default-product.png'">`
      : '<div class="product-image-placeholder">No Image</div>';

    return `
    <div class="wishlist-item">
      ${imageHTML}
      <div class="item-details">
        <h3>${item.name}</h3>
        <p>$${parseFloat(item.price).toFixed(2)}</p>
        <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
        <button class="remove-from-wishlist" data-id="${
          item.id
        }">Remove</button>
      </div>
    </div>
  `;
  }

  function setupWishlistButtons(container) {
    // Add to cart
    container.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          const itemId = button.dataset.id;
          if (!itemId) {
            showMessage("Error: Item ID not found.", "error");
            return;
          }

          await ApiService.addToCart(itemId);
          showMessage("Item added to cart!", "success");
        } catch (error) {
          console.error("Error adding to cart:", error);
          showMessage("Error adding item to cart.", "error");
        }
      });
    });

    // Remove from wishlist
    container.querySelectorAll(".remove-from-wishlist").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          const itemId = button.dataset.id;
          if (!itemId) {
            showMessage("Error: Item ID not found.", "error");
            return;
          }

          await ApiService.removeFromWishlist(itemId);
          await loadWishlist();
          showMessage("Item removed from wishlist.", "success");
        } catch (error) {
          console.error("Error removing from wishlist:", error);
          showMessage("Error removing item from wishlist.", "error");
        }
      });
    });
  }

  // ============================================
  // PREFERRED USER
  // ============================================

  async function attemptLoadPreferredUser(elements, currentUser) {
    try {
      const params = new URLSearchParams(window.location.search);
      const preferredId =
        params.get("user") || localStorage.getItem("preferredUserId");

      if (!preferredId || preferredId === currentUser.id) return;

      const otherUser = await ApiService.getUserById(preferredId);
      if (!otherUser) return;

      localStorage.setItem("preferredUserId", preferredId);

      // Update display
      updateProfileDisplay(elements, otherUser);

      // Set up as read-only
      const notificationSettings = {
        emailNotif: elements.emailNotif,
        orderUpdates: elements.orderUpdates,
        promotions: elements.promotions,
      };
      setupNotifications(
        notificationSettings,
        otherUser.id,
        otherUser.preferences || {},
        false
      );

      // Load other user's data
      await Promise.all([loadOrders(otherUser.id), loadWishlist(otherUser)]);

      // Disable editing
      if (elements.editProfileBtn) {
        elements.editProfileBtn.disabled = true;
        elements.editProfileBtn.textContent = "View Only";
      }
    } catch (error) {
      console.warn("Unable to load preferred user profile:", error);
    }
  }

  // ============================================
  // MESSAGING & ERROR HANDLING
  // ============================================

  function showMessage(text, type = "success") {
    const accountContent = document.querySelector(".account-content");

    if (!accountContent) {
      console.warn("Account content not found. Using alert instead.");
      alert(text);
      return;
    }

    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.textContent = text;

    accountContent.prepend(message);

    setTimeout(() => {
      message.remove();
    }, 3000);
  }

  function handleInitializationError(error) {
    console.error("Initialization error:", error);

    const errorMessage = error.message || "Unknown error";

    // Check if it's a token error
    if (
      error.message?.includes("401") ||
      error.message?.includes("unauthorized") ||
      error.message?.includes("Invalid") ||
      error.message?.includes("token")
    ) {
      console.warn("Token error detected. Redirecting to login.");
      ApiService.logout();
      window.location.href = "/Make-Over/pages/login.html";
      return;
    }

    // Show error message
    const accountContent = document.querySelector(".account-content");
    if (accountContent) {
      showMessage(`Error: ${errorMessage}`, "error");
    } else {
      alert(`Error: ${errorMessage}`);
    }
  }

  function handleDataLoadError(container, error) {
    console.error("Data load error:", error);

    // Check if it's a token error
    if (
      error.message?.includes("401") ||
      error.message?.includes("unauthorized") ||
      error.message?.includes("Invalid") ||
      error.message?.includes("token")
    ) {
      console.warn("Token error. Redirecting to login.");
      ApiService.logout();
      window.location.href = "/Make-Over/pages/login.html";
      return;
    }

    // Show generic error in container
    const errorMessage = error.message || "Error loading data";
    container.innerHTML = `<div class="error">Failed to load data: ${errorMessage}</div>`;
  }

  const imageHTML = item.image
    ? `<img src="${item.image}" alt="${item.name}" onerror="this.src='/assets/svg/default-product.png'">`
    : '<div class="product-image-placeholder">No Image</div>';

  return `
    <div class="wishlist-item">
      ${imageHTML}
      <div class="item-details">
        <h3>${item.name}</h3>
        <p>$${parseFloat(item.price).toFixed(2)}</p>
        <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
        <button class="remove-from-wishlist" data-id="${
          item.id
        }">Remove</button>
      </div>
    </div>
  `;
}

function setupWishlistButtons(container) {
  // Add to cart
  container.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const itemId = button.dataset.id;
        if (!itemId) {
          showMessage("Error: Item ID not found.", "error");
          return;
        }

        await ApiService.addToCart(itemId);
        showMessage("Item added to cart!", "success");
      } catch (error) {
        console.error("Error adding to cart:", error);
        showMessage("Error adding item to cart.", "error");
      }
    });
  });

  // Remove from wishlist
  container.querySelectorAll(".remove-from-wishlist").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const itemId = button.dataset.id;
        if (!itemId) {
          showMessage("Error: Item ID not found.", "error");
          return;
        }

        await ApiService.removeFromWishlist(itemId);
        await loadWishlist();
        showMessage("Item removed from wishlist.", "success");
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        showMessage("Error removing item from wishlist.", "error");
      }
    });
  });
}

// ============================================
// PREFERRED USER
// ============================================

async function attemptLoadPreferredUser(elements, currentUser) {
  try {
    const params = new URLSearchParams(window.location.search);
    const preferredId =
      params.get("user") || localStorage.getItem("preferredUserId");

    if (!preferredId || preferredId === currentUser.id) return;

    const otherUser = await ApiService.getUserById(preferredId);
    if (!otherUser) return;

    localStorage.setItem("preferredUserId", preferredId);

    // Update display
    updateProfileDisplay(elements, otherUser);

    // Set up as read-only
    const notificationSettings = {
      emailNotif: elements.emailNotif,
      orderUpdates: elements.orderUpdates,
      promotions: elements.promotions,
    };
    setupNotifications(
      notificationSettings,
      otherUser.id,
      otherUser.preferences || {},
      false
    );

    // Load other user's data
    await Promise.all([loadOrders(otherUser.id), loadWishlist(otherUser)]);

    // Disable editing
    if (elements.editProfileBtn) {
      elements.editProfileBtn.disabled = true;
      elements.editProfileBtn.textContent = "View Only";
    }
  } catch (error) {
    console.warn("Unable to load preferred user profile:", error);
  }
}

// ============================================
// MESSAGING & ERROR HANDLING
// ============================================

function showMessage(text, type = "success") {
  const accountContent = document.querySelector(".account-content");

  if (!accountContent) {
    console.warn("Account content not found. Using alert instead.");
    alert(text);
    return;
  }

  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;

  accountContent.prepend(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
}

function handleInitializationError(error) {
  console.error("Initialization error:", error);

  const errorMessage = error.message || "Unknown error";

  // Check if it's a token error
  if (
    error.message?.includes("401") ||
    error.message?.includes("unauthorized") ||
    error.message?.includes("Invalid") ||
    error.message?.includes("token")
  ) {
    console.warn("Token error detected. Redirecting to login.");
    ApiService.logout();
    window.location.href = "/Make-Over/pages/login.html";
    return;
  }

  // Show error message
  const accountContent = document.querySelector(".account-content");
  if (accountContent) {
    showMessage(`Error: ${errorMessage}`, "error");
  } else {
    alert(`Error: ${errorMessage}`);
  }
}

function handleDataLoadError(container, error) {
  console.error("Data load error:", error);

  // Check if it's a token error
  if (
    error.message?.includes("401") ||
    error.message?.includes("unauthorized") ||
    error.message?.includes("Invalid") ||
    error.message?.includes("token")
  ) {
    console.warn("Token error. Redirecting to login.");
    ApiService.logout();
    window.location.href = "/Make-Over/pages/login.html";
    return;
  }

  // Show generic error in container
  const errorMessage = error.message || "Error loading data";
  container.innerHTML = `<div class="error">Failed to load data: ${errorMessage}</div>`;
}
