// DOM Elements
const productsTableBody = document.getElementById("productsTableBody");
const productSearch = document.getElementById("productSearch");
const categoryFilter = document.getElementById("categoryFilter");
const productModal = document.getElementById("productModal");
const productForm = document.getElementById("productForm");
const addProductBtn = document.getElementById("addProductBtn");

// Initialize products array
let products = [];

// Fetch products data from data.json
async function fetchProducts() {
  try {
    const response = await fetch("../../data.json");
    const data = await response.json();
    products = data.products.map((product) => ({
      id: product.id,
      name: product.name,
      // category: Array.isArray(product.category)
      //   ? product.category[0]
      //   : product.category,
      category: product.category,
      price: product.originalprice || product.price,
      stock: product.stock,
      // image: Array.isArray(product.image) ? product.image[0] : product.image,
      image: product.image,
      description: product.description,
      weight: product.weight,
      discount: product.discount || 0,
      brand: product.brand || product.brands,
      features: product.features,
    }));
    displayProducts(products);
    updateCategoryFilter();
  } catch (error) {
    console.error("Error fetching products:", error);
    productsTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: red;">
                    Error loading products. Please try again later.
                </td>
            </tr>
        `;
  }
}

// Function to display products in the table
function displayProducts(productsToDisplay) {
  productsTableBody.innerHTML = productsToDisplay
    .map(
      (product) => `
        <tr>
            <td>
                <img src="${product.image[0]}" alt="${
        product.name
      }" class="product-thumbnail">
            </td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>৳. ${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="view-btn" onclick="viewProduct(${
                  product.id
                })">View</button>
                <button class="edit-btn" onclick="editProduct(${
                  product.id
                })">Edit</button>
                <button class="delete-btn" onclick="deleteProduct(${
                  product.id
                })">Delete</button>
            </td>
        </tr>
    `
    )
    .join("");
}

// Function to update category filter options
function updateCategoryFilter() {
  const categories = new Set(
    products.map((product) =>
      Array.isArray(product.category) ? product.category[0] : product.category
    )
  );

  categoryFilter.innerHTML = `
        <option value="">All Categories</option>
        ${[...categories]
          .map(
            (category) => `
            <option value="${category.toLowerCase()}">${category}</option>
        `
          )
          .join("")}
    `;
}

// Function to filter products
function filterProducts() {
  const searchTerm = productSearch.value.toLowerCase();
  const categoryTerm = categoryFilter.value.toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);
    const matchesCategory =
      !categoryTerm ||
      (Array.isArray(product.category)
        ? product.category.some((cat) => cat.toLowerCase() === categoryTerm)
        : product.category.toLowerCase() === categoryTerm);

    return matchesSearch && matchesCategory;
  });
}

// Function to open add product modal
function openAddProductModal() {
  productForm.reset();
  // productModal.style.display = "flex";

  productModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

// Function to close product modal
function closeProductModal() {
  // productModal.style.display = "none";
  productModal.classList.remove("show");
  document.body.style.overflow = "auto";
  productForm.reset();
}

// Function to view product details
function viewProduct(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  let productPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const productViewModal = document.getElementById("productViewModal");

  productViewModal.innerHTML = `
  <div class= "product-info">
    <div class= "info-header">
      <h3>Product # ${product.id}</h3>
      <button class="close-modal">&times;</button>
    </div>
    <div class="pro-modal-body">
      <div class="info-left">
        <img src="${product.image[0]}">
      </div>

      <div class="info-right">
        <h1>${product.name}</h1>

        ${product.weight ? `<p class="size">Size : ${product.weight}</p>` : ""}

        <div class="price">
        ৳. ${productPrice.toFixed(2)}

        ${
          product.discount ? ` <span>৳. ${product.price.toFixed(2)}</span>` : ""
        }

           ${product.discount ? `<span>${product.discount}% OFF</span>` : ""}
        </div>

        ${
          product.description
            ? `<div class="description"><h4>Description:</h4>  <p>${product.description}</p></div>`
            : ""
        }


        ${
          product.category
            ? `<div class="category"><h4>Category:</h4> <p>${product.category}</p></div>`
            : ""
        }

        ${
          product.brand
            ? `<div class="brand"><h4>Brand:</h4> <p>${product.brand}</p></div>`
            : ""
        }  

      ${
        product.features
          ? `<div class="fe-box"><h4>Features:</h4>
          <ul>
          ${
            product.features
              ? product.features.map((f) => `<li> ${f}</li>`).join("")
              : ""
          }
          </ul>
        </div>`
          : ""
      }
        
      </div>
    </div>
  </div>
  `;

  productViewModal.classList.add("show");
  document.body.style.overflow = "hidden";

  const closeButton = productViewModal.querySelector(".close-modal");
  closeButton.addEventListener("click", () => {
    productViewModal.classList.remove("show");
    document.body.style.overflow = "auto";
  });

  window.addEventListener("click", (e) => {
    if (e.target === productViewModal) {
      productViewModal.classList.remove("show");
      document.body.style.overflow = "auto";
    }
  });
}

// Function to edit product
function editProduct(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  document.getElementById("productName").value = product.name;
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productStock").value = product.stock;
  document.getElementById("productImage").value = product.image[0];
  document.getElementById("productDiscount").value = product.discount;
  document.getElementById("productDescription").value = product.description;
  // document.getElementById("productWeight").value = product.weight;
  // document.getElementById("productBrand").value = product.brand;
  // document.getElementById("productFeatures").value =
  //   product.features.join(", ");

  productForm.dataset.productId = productId;
  productModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

// Function to delete product
function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    products = products.filter((product) => product.id !== productId);
    displayProducts(filterProducts());
  }
}

// Event Listeners
productSearch.addEventListener("input", () => {
  displayProducts(filterProducts());
});

categoryFilter.addEventListener("change", () => {
  displayProducts(filterProducts());
});

addProductBtn.addEventListener("click", openAddProductModal);

document.querySelector("#productImage").addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById("productImage").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  input.click();
});

const multiSelect = document.getElementById("productCategory");
const dropdownBtn = multiSelect.querySelector(".dropdown-btn");
const dropdownList = multiSelect.querySelector(".dropdown-list");
const selectedTags = document.getElementById("selectedTags");

let selectedCategories = [];

dropdownBtn.addEventListener("click", () => {
  multiSelect.classList.toggle("show");
});

dropdownList.addEventListener("change", (e) => {
  const value = e.target.value;
  if (e.target.checked) {
    if (!selectedCategories.includes(value)) {
      selectedCategories.push(value);
    }
  } else {
    selectedCategories = selectedCategories.filter((v) => v !== value);
  }
  updateTags();
});

function updateTags() {
  selectedTags.innerHTML = "";
  selectedCategories.forEach((cat) => {
    const tag = document.createElement("div");
    tag.classList.add("tag");
    tag.innerHTML = `${cat} <span data-value="${cat}">×</span>`;
    selectedTags.appendChild(tag);
  });
}

selectedTags.addEventListener("click", (e) => {
  if (e.target.tagName === "SPAN") {
    const value = e.target.dataset.value;
    selectedCategories = selectedCategories.filter((v) => v !== value);
    dropdownList.querySelector(`input[value="${value}"]`).checked = false;
    updateTags();
  }
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!multiSelect.contains(e.target)) {
    multiSelect.classList.remove("show");
  }
});

productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const productId = productForm.dataset.productId;

  const productData = {
    name: document.getElementById("productName").value,
    category: selectedCategories,
    price: parseFloat(document.getElementById("productPrice").value),
    discount: parseFloat(document.getElementById("productDiscount").value),
    stock: parseInt(document.getElementById("productStock").value),
    image: Array.from(document.getElementById("productImage").src),
    description: document.getElementById("productDescription").value,
    // weight: document.getElementById("productWeight").value,
    // brand: document.getElementById("productBrand").value,
    // features:
  };

  if (productId) {
    // Edit existing product
    const productIndex = products.findIndex(
      (p) => p.id === parseInt(productId)
    );
    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...productData };
    }
  } else {
    // Add new product
    const newProduct = {
      id: products.length + 1,
      ...productData,
      // features: [],
    };
    products.push(newProduct);
  }

  displayProducts(filterProducts());
  closeProductModal();
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === productModal) {
    closeProductModal();
  }
});

// Close button for modal
document.querySelectorAll(".close-modal, .cancel-btn").forEach((button) => {
  button.addEventListener("click", closeProductModal);
});

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});
