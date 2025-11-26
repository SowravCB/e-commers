// Products Module
const productsModule = {
  async loadProducts() {
    try {
      const response = await ApiService.request("/products", {
        method: "GET",
      });

      if (response.ok) {
        const products = response.data;
        this.displayProducts(products);
      } else {
        console.error("Failed to load products:", response.error);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  },

  displayProducts(products) {
    const productsContainer = document.querySelector(".products-container");
    if (!productsContainer) return;

    productsContainer.innerHTML = products
      .map(
        (product) => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-actions">
                        <button class="add-to-cart" data-id="${
                          product.id
                        }">Add to Cart</button>
                        <button class="add-to-wishlist" data-id="${
                          product.id
                        }">♡</button>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <p class="description">${product.description}</p>
                </div>
            </div>
        `
      )
      .join("");

    this.setupProductEventListeners();
  },

  setupProductEventListeners() {
    // Add to cart buttons
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        if (!auth.isLoggedIn()) {
          window.location.href = "./pages/login.html";
          return;
        }
        const productId = button.dataset.id;
        try {
          await ApiService.addToCart(productId);
          // Show success message
          showMessage("Product added to cart!", "success");
        } catch (error) {
          showMessage("Failed to add product to cart", "error");
        }
      });
    });

    // Add to wishlist buttons
    document.querySelectorAll(".add-to-wishlist").forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        if (!auth.isLoggedIn()) {
          window.location.href = "./pages/login.html";
          return;
        }
        const productId = button.dataset.id;
        try {
          await ApiService.addToWishlist(productId);
          button.textContent = "♥";
          button.classList.add("active");
          showMessage("Product added to wishlist!", "success");
        } catch (error) {
          showMessage("Failed to add product to wishlist", "error");
        }
      });
    });
  },
};

// Helper function to show messages
function showMessage(text, type = "success") {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  document.body.appendChild(message);
  setTimeout(() => message.remove(), 3000);
}

// Load products when the page loads
document.addEventListener("DOMContentLoaded", () => {
  productsModule.loadProducts();
});
