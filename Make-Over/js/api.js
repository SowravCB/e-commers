const API_BASE_URL = "http://localhost:3000/api";

// For debugging
console.log("API Service initialized. Base URL:", API_BASE_URL);

// Define ApiService globally
class ApiService {
  static getAuthToken() {
    return localStorage.getItem("authToken");
  }

  static setAuthToken(token) {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }

  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    console.log(
      "Making request to:",
      url,
      "with token:",
      token ? "present" : "missing"
    );

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API response error:", response.status, data);

        // Handle token-related errors
        if (response.status === 401) {
          this.logout();
          window.location.href = "/Make-Over/pages/login.html";
          throw new Error("Unauthorized: Invalid or expired token");
        }

        throw new Error(
          data.error || `HTTP ${response.status}: Something went wrong`
        );
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Auth endpoints
  static async login(email, password) {
    try {
      console.log("Attempting login...", { email });

      const data = await this.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response:", data);

      if (data && data.token) {
        this.setAuthToken(data.token);
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  static async register(userData) {
    const data = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    this.setAuthToken(data.token);
    return data;
  }

  // Products endpoints
  static async getProducts() {
    return await this.request("/products");
  }

  static async getProduct(id) {
    return await this.request(`/products/${id}`);
  }

  // User profile endpoints
  static async getUserProfile() {
    // Get logged-in user from localStorage or request from server
    const userData = localStorage.getItem("loggedInUser");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Verify with server if needed
        return await this.request("/users/profile");
      } catch (error) {
        console.error("Error parsing stored user data", error);
      }
    }
    // If not in localStorage, fetch from server
    return await this.request("/users/profile");
  }

  static async updateUserProfile(profileData) {
    // Get user ID from localStorage
    const userData = localStorage.getItem("loggedInUser");
    if (!userData) {
      throw new Error("No user logged in");
    }
    const user = JSON.parse(userData);
    return await this.request(`/users/${encodeURIComponent(user.id)}`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Admin / lookup endpoints
  static async getUserById(id) {
    return await this.request(`/users/${encodeURIComponent(id)}`);
  }

  // Orders endpoints
  static async getUserOrders() {
    return await this.request("/users/orders");
  }

  static async getUserOrdersById(id) {
    return await this.request(`/users/${encodeURIComponent(id)}/orders`);
  }

  static async createOrder(orderData) {
    return await this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  // Logout
  static logout() {
    this.setAuthToken(null);
    localStorage.removeItem("loggedInUser");
  }

  // Cart endpoints
  static async addToCart(itemId) {
    return await this.request("/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId: itemId }),
    });
  }

  // Wishlist endpoints
  static async removeFromWishlist(itemId) {
    return await this.request(
      `/wishlist/remove/${encodeURIComponent(itemId)}`,
      {
        method: "DELETE",
      }
    );
  }
}

// Make sure ApiService is defined globally
if (typeof window !== "undefined") {
  window.ApiService = ApiService;
}
