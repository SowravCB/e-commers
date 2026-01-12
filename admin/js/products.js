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
    .map((product) => {
      // Find the main image
      const mainImage = Array.isArray(product.image)
        ? product.image.find((img) => img.isMain)?.url || product.image[0]
        : product.image;

      return `
          <tr>
              <td>
                  <img src="${mainImage}" alt="${
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
        `;
    })
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
  selectedCategories = [];
  updateTags();

  // Clear uploaded images
  const uploadedImages = window.getUploadedImages();
  uploadedImages.length = 0;
  renderImages();

  // Clear form dataset
  delete productForm.dataset.productId;
}

// Function to view product details
function viewProduct(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  let productPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const productViewModal = document.getElementById("productViewModal");

  const mainImage = Array.isArray(product.image)
    ? product.image.find((img) => img.isMain)?.url || product.image[0]
    : product.image;

  productViewModal.innerHTML = `
  <div class= "product-info">
    <div class= "info-header">
      <h3>Product # ${product.id}</h3>
      <button class="close-modal">&times;</button>
    </div>
    <div class="pro-modal-body">
      <div class="info-left">
        <div class="main-image">
          <img src="${mainImage}">
        </div>
        <div class="sub-images">
          ${
            Array.isArray(product.image)
              ? product.image
                  .filter((img) => !img.isMain)
                  .map((img) => `<img src="${img.url}">`)
                  .join("")
              : ""
          }
        </div>
        
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

  // Handle category - could be string or array
  const categoryArray = Array.isArray(product.category)
    ? product.category
    : [product.category];
  selectedCategories = categoryArray;
  updateTags();

  document.getElementById("productPrice").value = product.price;
  document.getElementById("productStock").value = product.stock;
  document.getElementById("productDiscount").value = product.discount;
  document.getElementById("productDescription").value = product.description;

  // Load existing images into the upload preview
  const uploadedImages = window.getUploadedImages();
  uploadedImages.length = 0; // Clear existing
  if (product.image && product.image.length > 0) {
    product.image.forEach((imgUrl, index) => {
      uploadedImages.push({
        id: Date.now() + Math.random(),
        url: imgUrl,
        file: null,
        isMain: index === 0,
      });
    });
    renderImages();
  }

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

// image upload handle and preview functionality
document.addEventListener("DOMContentLoaded", function () {
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("fileInput");
  const imagePreview = document.getElementById("imagePreview");

  let uploadedImages = [];

  // Drag & drop handle
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    uploadArea.classList.add("drag-over");
  }

  function unhighlight() {
    uploadArea.classList.remove("drag-over");
  }

  // Handle dropped files
  uploadArea.addEventListener("drop", handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  fileInput.addEventListener("change", (e) => {
    const files = e.target.files;
    handleFiles(files);
  });

  function handleFiles(files) {
    [...files].forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file.`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds the 5MB size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        uploadedImages.push({
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file,
          isMain: uploadedImages.length === 0,
        });

        renderImages();
      };

      reader.readAsDataURL(file);
    });
  }

  function renderImages() {
    imagePreview.innerHTML = "";

    if (uploadedImages.length === 0) {
      imagePreview.innerHTML = `
        <div class="image-preview empty-state">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--hover-color); padding: 20px;">
            <div style="font-size: 32px; margin-bottom: 8px;">🖼️</div>
            <div style="font-size: 14px; text-align: center;">No images uploaded yet</div>
          </div>
        </div>
      `;
      return;
    }

    uploadedImages.forEach((img, index) => {
      const imgElement = document.createElement("div");
      imgElement.className = "image-preview";
      imgElement.innerHTML = `
        <img src="${img.url}" alt="Product image ${index + 1}">
        <div class="image-actions">
          <button type="button" class="image-btn delete" onclick="window.deleteImage(${index})">✕</button>
          <button type="button" class="image-btn set-main" onclick="window.setAsMain(${index})">★</button>
        </div>
        ${img.isMain ? '<div class="main-badge">Main</div>' : ""}
      `;

      imagePreview.appendChild(imgElement);
    });
  }

  // Delete image function
  window.deleteImage = function (index) {
    if (confirm("Delete this image?")) {
      const wasMain = uploadedImages[index].isMain;
      uploadedImages.splice(index, 1);

      if (wasMain && uploadedImages.length > 0) {
        uploadedImages[0].isMain = true;
      }

      renderImages();
    }
  };

  // Set as main image function
  window.setAsMain = function (index) {
    uploadedImages.forEach((img, i) => {
      img.isMain = i === index;
    });
    renderImages();
  };

  // Expose uploadedImages for form submission
  window.getUploadedImages = function () {
    return uploadedImages;
  };
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

  const uploadedImages = window.getUploadedImages();

  // Validate that at least one image is uploaded
  if (uploadedImages.length === 0) {
    alert("Please upload at least one product image");
    return;
  }

  const productId = productForm.dataset.productId;

  // Extract image URLs from uploaded images
  const imageUrls = uploadedImages.map((img) => ({
    url: img.url,
    isMain: img.isMain,
  }));

  const productData = {
    name: document.getElementById("productName").value,
    category:
      selectedCategories.length > 0 ? selectedCategories : ["uncategorized"],
    price: parseFloat(document.getElementById("productPrice").value),
    discount: parseFloat(document.getElementById("productDiscount").value) || 0,
    stock: parseInt(document.getElementById("productStock").value),
    image: imageUrls,
    description: document.getElementById("productDescription").value,
    weight: document.getElementById("productWeight").value,
    brand: document.getElementById("productBrand").value,
    features: document
      .getElementById("ProductFeatures")
      .value.split(",")
      .map((f) => f.trim())
      .filter((f) => f !== ""),
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
      id: Math.max(...products.map((p) => p.id), 0) + 1,
      ...productData,
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

// GSAP Animations
// let tl = gsap.timeline({ defaults: { ease: "power1.out" } });
// tl.from(".settings-header", { y: -50, opacity: 0, duration: 0.5 });
// tl.from(".settings-section", {
//   y: 50,
//   opacity: 0,
//   duration: 0.5,
//   stagger: 0.2,
// });

let sdBar = gsap.timeline();

sdBar.from(".sidebar", { y: -250, opacity: 0, duration: 0.5 });
sdBar.from(".sidebar .nav-item", {
  x: -50,
  opacity: 0,
  duration: 0.3,
  stagger: 0.2,
});

let nav = gsap.timeline();

nav.from(".navbar", { y: -50, opacity: 0, duration: 0.5 });
nav.from(".navbar .nav-link", {
  y: -20,
  opacity: 0,
  duration: 0.3,
  stagger: 0.2,
});

nav.from(".main-container .head-title .left", {
  y: -20,
  opacity: 0,
  duration: 0.3,
});

nav.from(".products-container", {
  y: 50,
  opacity: 0,
  duration: 0.5,
  stagger: 0.2,
});
