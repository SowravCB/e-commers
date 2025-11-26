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
        throw new Error(data.error || "Something went wrong");
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
    return await this.request("/users/profile");
  }

  static async updateUserProfile(profileData) {
    return await this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Orders endpoints
  static async getUserOrders() {
    return await this.request("/users/orders");
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
}

// Make sure ApiService is defined globally
if (typeof window !== "undefined") {
  window.ApiService = ApiService;
}
