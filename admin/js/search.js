// Search functionality for admin panel
let searchTimeout;
let searchResults = [];

// Initialize search functionality
function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  // Create search results container
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-results";
  searchInput.parentElement.appendChild(searchContainer);

  // Add event listeners
  searchInput.addEventListener("input", handleSearch);
  document.addEventListener("click", (e) => {
    if (
      !searchInput.contains(e.target) &&
      !searchContainer.contains(e.target)
    ) {
      searchContainer.style.display = "none";
    }
  });
}

// Handle search input
async function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  const searchContainer = document.querySelector(".search-results");

  if (searchTerm.length < 2) {
    searchContainer.style.display = "none";
    return;
  }

  // Clear previous timeout
  clearTimeout(searchTimeout);

  // Set new timeout to prevent too many requests
  searchTimeout = setTimeout(async () => {
    try {
      const response = await fetch("../../data.json");
      const data = await response.json();

      // Perform search across all data types
      searchResults = [
        ...searchProducts(data.products, searchTerm),
        ...searchOrders(data.orders, searchTerm),
        ...searchUsers(data.users, searchTerm),
      ];

      displaySearchResults(searchResults);
    } catch (error) {
      console.error("Error searching:", error);
    }
  }, 300);
}

// Search in products
function searchProducts(products, term) {
  return products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.some((cat) => cat.toLowerCase().includes(term))
    )
    .map((product) => ({
      type: "product",
      id: product.id,
      title: product.name,
      subtitle: `${product.category.join(", ")} - ৳${product.originalprice}`,
      url: "/admin/pages/products.html",
    }));
}

// Search in orders
function searchOrders(orders, term) {
  return orders
    .filter(
      (order) =>
        order.id.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term)
    )
    .map((order) => ({
      type: "order",
      id: order.id,
      title: `Order ${order.id}`,
      subtitle: `${order.customerName} - ৳${order.total}`,
      url: "/admin/pages/orders.html",
    }));
}

// Search in users
function searchUsers(users, term) {
  return users
    .filter(
      (user) =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    )
    .map((user) => ({
      type: "user",
      id: user.id,
      title: `${user.firstName} ${user.lastName}`,
      subtitle: user.email,
      url: "/admin/pages/customers.html",
    }));
}

// Display search results
function displaySearchResults(results) {
  const searchContainer = document.querySelector(".search-results");

  if (results.length === 0) {
    searchContainer.innerHTML =
      '<div class="no-results">No results found</div>';
    searchContainer.style.display = "block";
    return;
  }

  const html = results
    .slice(0, 5)
    .map(
      (result) => `
            <a href="${result.url}" class="search-item ${result.type}">
                <div class="search-item-content">
                    <div class="search-item-title">${result.title}</div>
                    <div class="search-item-subtitle">${result.subtitle}</div>
                </div>
                <div class="search-item-type">${result.type}</div>
            </a>
        `
    )
    .join("");

  searchContainer.innerHTML = html;
  searchContainer.style.display = "block";
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeSearch);
