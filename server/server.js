const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "..", "data.json");

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "assets")));

// Helper functions
async function readDataFile() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data file:", error);
    return {
      products: [],
      users: [],
      orders: [],
      notifications: [],
      messages: [],
    };
  }
}

async function writeDataFile(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing data file:", error);
    return false;
  }
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      req.user = user;
      next();
    }
  );
}

// Routes

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const data = await readDataFile();
    res.json(data.products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

// Get single product
app.get("/api/products/:id", async (req, res) => {
  try {
    const data = await readDataFile();
    const product = data.products.find((p) => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product" });
  }
});

// User registration
app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    const data = await readDataFile();

    // Check if user already exists
    if (data.users.some((u) => u.email === email)) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Add user to data
    data.users.push(newUser);
    await writeDataFile(data);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// User login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await readDataFile();

    // Find user
    const user = data.users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Debug logging for login attempts (remove in production)
    console.log("Login attempt for:", email);
    console.log(
      "Stored password (first 30 chars):",
      String(user.password).slice(0, 30)
    );

    // Check password.
    // Support both bcrypt-hashed passwords and plain-text passwords (legacy/dev).
    let validPassword = false;
    try {
      if (
        typeof user.password === "string" &&
        (user.password.startsWith("$2a$") ||
          user.password.startsWith("$2b$") ||
          user.password.startsWith("$2y$"))
      ) {
        // bcrypt-hashed password
        validPassword = await bcrypt.compare(password, user.password);
      } else {
        // plaintext (development/legacy) fallback
        validPassword = password === user.password;
      }
    } catch (pwErr) {
      console.error("Password check error:", pwErr);
      validPassword = false;
    }

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// Get user profile
app.get("/api/users/profile", authenticateToken, async (req, res) => {
  try {
    const data = await readDataFile();
    const user = data.users.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
});

// Get user by id (admin or owner)
app.get("/api/users/:id", authenticateToken, async (req, res) => {
  try {
    const data = await readDataFile();
    const user = data.users.find((u) => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only allow if requester is the same user or an admin
    if (req.user.id !== req.params.id) {
      const requester = data.users.find((u) => u.id === req.user.id);
      if (!requester || requester.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

// Update user profile
app.put("/api/users/profile", authenticateToken, async (req, res) => {
  try {
    const data = await readDataFile();
    const userIndex = data.users.findIndex((u) => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user data
    const existingUser = data.users[userIndex];

    // Extract password change fields (if any)
    const { currentPassword, newPassword, ...otherUpdates } = req.body;

    // Prevent changing immutable fields
    delete otherUpdates.id;
    delete otherUpdates.email; // keep email immutable for now

    // Prepare updates object
    const updates = { ...otherUpdates };

    // Handle password change: if newPassword is provided, verify currentPassword first
    if (typeof newPassword !== "undefined") {
      // Must provide currentPassword to change password
      if (!currentPassword) {
        return res
          .status(400)
          .json({ error: "Current password required to change password" });
      }

      // Verify current password (support bcrypt and plaintext)
      let currentMatches = false;
      try {
        if (
          typeof existingUser.password === "string" &&
          (existingUser.password.startsWith("$2a$") ||
            existingUser.password.startsWith("$2b$") ||
            existingUser.password.startsWith("$2y$"))
        ) {
          currentMatches = await bcrypt.compare(
            currentPassword,
            existingUser.password
          );
        } else {
          currentMatches = currentPassword === existingUser.password;
        }
      } catch (pwErr) {
        console.error("Error verifying current password:", pwErr);
        return res
          .status(500)
          .json({ error: "Error verifying current password" });
      }

      if (!currentMatches) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Hash new password and set it
      try {
        const hashed = await bcrypt.hash(newPassword, 10);
        updates.password = hashed;
      } catch (pwErr) {
        console.error("Error hashing new password:", pwErr);
        return res.status(500).json({ error: "Error updating password" });
      }
    } else {
      // Keep existing password when not changing
      updates.password = existingUser.password;
    }

    const updatedUser = {
      ...existingUser,
      ...updates,
    };

    data.users[userIndex] = updatedUser;
    await writeDataFile(data);

    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
});

// Get user orders
app.get("/api/users/orders", authenticateToken, async (req, res) => {
  try {
    const data = await readDataFile();
    // Support both `userId` and legacy `customerId` in orders
    const userOrders = data.orders.filter(
      (order) =>
        order.userId === req.user.id || order.customerId === req.user.id
    );
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
});

// Get another user's orders (admin or owner)
app.get("/api/users/:id/orders", authenticateToken, async (req, res) => {
  try {
    const data = await readDataFile();
    const id = req.params.id;

    // Only allow if requester is the same user or an admin
    if (req.user.id !== id) {
      const requester = data.users.find((u) => u.id === req.user.id);
      if (!requester || requester.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    const userOrders = data.orders.filter(
      (order) => order.userId === id || order.customerId === id
    );
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user orders" });
  }
});

// Create new order
app.post("/api/orders", authenticateToken, async (req, res) => {
  try {
    const data = await readDataFile();
    const newOrder = {
      id: Date.now().toString(),
      userId: req.user.id,
      ...req.body,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    data.orders.push(newOrder);
    await writeDataFile(data);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Error creating order" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
