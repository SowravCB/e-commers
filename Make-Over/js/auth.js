// Authentication Module
const auth = {
  // Check if user is logged in
  isLoggedIn() {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("loggedInUser");
    return !!(token && user);
  },

  // Get current user data
  getCurrentUser() {
    try {
      const userData = localStorage.getItem("loggedInUser");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      this.logout();
      return null;
    }
  },

  // Register new user (uses backend)
  async register(userData) {
    try {
      const data = await ApiService.register(userData);

      if (!data || !data.user) {
        throw new Error(data?.error || "Registration failed");
      }

      // Save token and user
      if (data.token) ApiService.setAuthToken(data.token);
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      this.startSession();

      return { success: true, user: data.user };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: error.message || "Registration failed" };
    }
  },

  // Login user
  async login(emailOrUsername, password) {
    try {
      if (!emailOrUsername || !password) {
        throw new Error("Email/Username and password are required");
      }

      const response = await ApiService.login(emailOrUsername, password);

      if (response && response.token && response.user) {
        // Store auth token
        ApiService.setAuthToken(response.token);

        // Store user data
        localStorage.setItem("loggedInUser", JSON.stringify(response.user));

        // Start session
        this.startSession();

        return {
          success: true,
          user: response.user,
        };
      } else {
        throw new Error("Invalid server response");
      }
    } catch (error) {
      console.error("Login error:", error);
      // Clear any partial data
      this.cleanup();
      return {
        success: false,
        error: error.message || "Invalid email/username or password",
      };
    }
  },

  // Logout user
  logout() {
    try {
      // Clear all auth-related data
      this.cleanup();

      // Navigate to home page using relative path
      const currentPath = window.location.pathname;
      if (currentPath.includes("/pages/")) {
        window.location.href = "../index.html";
      } else {
        window.location.href = "./index.html";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Force cleanup and redirect
      this.cleanup();
      window.location.href = "/";
    }
  },

  // Clean up all auth-related data
  cleanup() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userSession");
    this.endSession();
  },

  // Update profile (sends to backend and refreshes local user)
  async updateProfile(profileData) {
    try {
      const updated = await ApiService.updateUserProfile(profileData);
      if (updated) {
        localStorage.setItem("loggedInUser", JSON.stringify(updated));
        return { success: true, user: updated };
      }
      return { success: false, error: "Update failed" };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, error: error.message || "Update failed" };
    }
  },

  // Session management
  startSession() {
    try {
      const session = {
        id: crypto.randomUUID(),
        startTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };
      localStorage.setItem("userSession", JSON.stringify(session));
      this.setupActivityMonitoring();
    } catch (error) {
      console.error("Error starting session:", error);
    }
  },

  endSession() {
    try {
      localStorage.removeItem("userSession");
    } catch (error) {
      console.error("Error ending session:", error);
    }
  },

  updateActivity() {
    try {
      const session = localStorage.getItem("userSession");
      if (session) {
        const sessionData = JSON.parse(session);
        sessionData.lastActivity = new Date().toISOString();
        localStorage.setItem("userSession", JSON.stringify(sessionData));
      }
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  },

  setupActivityMonitoring() {
    // Remove any existing event listeners
    const events = ["click", "keypress", "scroll", "mousemove"];
    events.forEach((event) => {
      document.removeEventListener(event, this.updateActivity);
    });

    // Add new event listeners
    events.forEach((event) => {
      document.addEventListener(event, () => this.updateActivity());
    });

    // Set up session check interval
    setInterval(() => {
      try {
        const session = localStorage.getItem("userSession");
        if (session) {
          const sessionData = JSON.parse(session);
          const lastActivity = new Date(sessionData.lastActivity);
          const now = new Date();
          // Log out after 30 minutes of inactivity
          if (now - lastActivity > 30 * 60 * 1000) {
            this.logout();
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        this.logout();
      }
    }, 60000); // Check every minute
  },
};

// Export auth module
window.auth = auth;
