document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id"); // get ?id= from URL

  // ✅ fixed path (data.json is in root)
  fetch("/data.json")
    .then((response) => response.json())
    .then((data) => {
      products = data.products;

      // ✅ find the specific product
      const product = products.find((p) => p.id == productId);
      if (product) {
        displayProductDetails(product);
        displayRecommendedProducts();
      } else {
        document.getElementById("productDetailContainer").innerHTML =
          "<p>Product not found!</p>";
      }

      // ✅ Load cart from localStorage
      if (localStorage.getItem("cart")) {
        shoppingCart = JSON.parse(localStorage.getItem("cart"));
        addCartToHTML();
      }

      // setupCartInteractions();
    })
    .catch((err) => console.error("Error loading data.json:", err));
});

// ✅ Show product details
function displayProductDetails(product) {
  document.title = product.name + " - Product Details";
  const container = document.getElementById("productDetailContainer");
  let productPrice = product.discount
    ? product.originalprice - (product.originalprice * product.discount) / 100
    : product.originalprice;

  const pMainImage = Array.isArray(product.image)
    ? product.image.find((img) => img.isMain)?.url || product.image[0]
    : product.image;

  // ✅ fixed image path
  container.innerHTML = `
    <div class="product-detail-card">
      <div class="product-detail-img">
        <img src="${pMainImage}" alt="${product.name}" class="main-image">
        <div class="product-detail-thumbnails">
          ${
            Array.isArray(product.image)
              ? product.image
                  .map(
                    (img) => `
            <img src="${img.url}" alt="${product.name}" class="thumbnail">
          `
                  )
                  .join("")
              : ""
          }
        </div>
      </div>
      <div class="product-detail-info">
        <h1>${product.name}</h1>
      <span>
        ${product.weight ? `<p>Size : ${product.weight}</p>` : ""}
      </span>
        <div class="prices">
        <span class="final-price">৳ ${productPrice.toFixed(2)}</span>
          ${
            product.discount
              ? `<span class="original-price">৳ ${product.originalprice.toFixed(
                  2
                )}</span>`
              : ""
          }
          ${product.discount ? `<span class="devider"></span>` : ""}
          ${
            product.discount
              ? `<span class="discount">${product.discount}% OFF</span>`
              : ""
          }
          
        </div>
        
        <div class="product-actions">
          <button class="add-to-wishlist-detail" data-id="${product.id}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
            </svg>
          </button>
          <div class="quantity-selector">
            <button class="decrease-qty">-</button>
            <span class="quantity-value">1</span>
            <button class="increase-qty">+</button>
            </div>
          <button class="add-to-cart-detail" data-id="${product.id}">
            Add to Cart
          </button>
        </div>
        <div class="product-description">
          <h4>Description: </h4>
          <p>${product.description}</p>
        </div>
       ${
         product.brands
           ? `<div class="product-brands">
            <h4>Brand: </h4>
            <p> ${product.brands}</p>
       </div>`
           : ""
       }
       ${
         product.category
           ? `<div class="product-category"> <h4>Category: </h4>
           <p>${product.category}</p>
           </div>`
           : ""
       }

       ${
         product.features
           ? `<div class="product-features">
          <h4>Features:</h4>
          <ul>
            ${product.features.map((feature) => `<li>${feature}</li>`).join("")}
          </ul>
          </div>`
           : ""
       }
        </div>
    </div>
  `;

  const thumbnails = container.querySelector(".product-detail-thumbnails");
  const mainImage = container.querySelector(".product-detail-img img");
  thumbnails.addEventListener("mouseover", (e) => {
    if (e.target.tagName === "IMG") {
      mainImage.src = e.target.src;
    }
  });

  document
    .querySelector(".add-to-cart-detail")
    .addEventListener("click", (e) => {
      addToCart(e.target.dataset.id);
    });

  // ✅ Quantity selector functionality
  const decreaseBtn = container.querySelector(".decrease-qty");
  const increaseBtn = container.querySelector(".increase-qty");
  const quantityValue = container.querySelector(".quantity-value");
  let quantity = 1;
  decreaseBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      quantityValue.textContent = quantity;
    }
  });
  increaseBtn.addEventListener("click", () => {
    quantity++;
    quantityValue.textContent = quantity;
  });

  // ✅ Add event listener to wishlist button
  const addToWishlistBtn = container.querySelector(".add-to-wishlist-detail");
  addToWishlistBtn.addEventListener("click", (e) => {
    if (e.target.closest(".add-to-wishlist-detail")) {
      const productId = e.target.closest(".add-to-wishlist-detail").dataset.id;
      addToWishlist(productId);
      e.target.closest(".add-to-wishlist-detail").classList.add("active");
    }

    console.log("Added to wishlist:", product.id);
  });
}

const recommendedProductsContainer = document.getElementById(
  "recommendedProducts"
);

// ✅ Show recommended products
function displayRecommendedProducts() {
  const recommendedProducts = products
    .sort(() => Math.random() - 0.5) // random shuffle
    .slice(0, 8);
  // const recommendedProducts = products.slice(0, 4);
  recommendedProductsContainer.innerHTML = "";
  recommendedProducts.forEach((product) => {
    let productPrice = product.discount
      ? product.originalprice - (product.originalprice * product.discount) / 100
      : product.originalprice;

    const pMainImage = Array.isArray(product.image)
      ? product.image.find((img) => img.isMain)?.url || product.image[0]
      : product.image;
    recommendedProductsContainer.innerHTML += `
      <div class="recommended-product-card">
        <div class="recommended-product-img"> 
          <img src="${pMainImage}" alt="${product.name}">
        </div>
        <div class="recommended-product-info">
          <h3>${product.name}</h3>
          <span class="prices">
          ${product.weight ? `<p>${product.weight}</p>` : ""}
          <div class="price-values">
            ${
              product.discount
                ? `<div class="original-price">৳ ${product.originalprice}</div>`
                : ""
            } <div class="final-price">৳ ${productPrice.toFixed(2)}</div>
          </div>
          </span>
          <button class="add-to-cart-recommended" data-id="${product.id}">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  });

  // ✅ Add event listeners to recommended products' add to cart buttons
  document.querySelectorAll(".add-to-cart-recommended").forEach((button) => {
    button.addEventListener("click", (e) => {
      addToCart(e.target.dataset.id);
    });
  });
}
// ✅ Add product to wishlist
function addToWishlist(productId) {
  if (!wishlist.find((id) => id == productId)) {
    wishlist.push(productId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }

  addWishlistToHTML();
  addWishlistToMemory();
}

// Initialize wishlist from localStorage
let wishlist = [];
if (localStorage.getItem("wishlist")) {
  wishlist = JSON.parse(localStorage.getItem("wishlist"));
}

const addWishlistToMemory = () => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

const addWishlistToHTML = () => {
  const wishlistBody = document.querySelector(".wishlist-body");
  wishlistBody.innerHTML = "";
  wishlist.forEach((id) => {
    const product = products.find((p) => p.id == id);
    let wishlistProductName =
      product.name.length > 45
        ? product.name.slice(0, 45) + "..."
        : product.name;

    let proFinalPrice = product.discount
      ? product.originalprice - (product.originalprice * product.discount) / 100
      : product.originalprice;

    const mainImage = Array.isArray(product.image)
      ? product.image.find((img) => img.isMain)?.url || product.image[0]
      : product.image;
    if (product) {
      wishlistBody.innerHTML += `
        <div class="wishlist-item">
          <img src="${mainImage}" alt="${product.name}">
          <div class="wishlist-item-info">
            <h4>${wishlistProductName}</h4>
            <div class="weight-price">
              ${
                product.weight
                  ? `<span class="weight">${product.weight}</span>`
                  : ""
              }
              <div class="price-box">
              ${
                product.discount
                  ? `<span class="original-price">৳. ${product.originalprice}</span>`
                  : ""
              }
              <span class="final-price">৳. ${proFinalPrice.toFixed(2)}</span>
              </div>
            </div>
            <div class="action-box">
            <button class="remove-from-wishlist" data-id="${product.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
                              </svg>
            </button>
            <button class="add-to-cart-from-wishlist" data-id="${
              product.id
            }">Add to Cart</button>
            </div>
          </div>
        </div>
      `;
    }
  });

  // Add event listeners to remove buttons using event delegation
  wishlistBody.addEventListener("click", (e) => {
    if (e.target.closest(".remove-from-wishlist")) {
      const productId = e.target.closest(".remove-from-wishlist").dataset.id;
      wishlist = wishlist.filter((id) => id != productId);
      addWishlistToHTML();
      addWishlistToMemory();
    }

    if (e.target.closest(".add-to-cart-from-wishlist")) {
      const productId = e.target.closest(".add-to-cart-from-wishlist").dataset
        .id;
      addToCart(productId);
      // Remove from wishlist after adding to cart
      wishlist = wishlist.filter((id) => id != productId);
      addWishlistToHTML();
      addWishlistToMemory();
    }
  });
};

// Handle profile icon click
const detailProfileIcon = document.getElementById("profileIcon");
if (detailProfileIcon) {
  detailProfileIcon.addEventListener("click", (e) => {
    e.preventDefault();
    if (auth.isLoggedIn()) {
      // If user is logged in, redirect to account page
      window.location.href = "/Make-Over/pages/account.html";
    } else {
      // If user is not logged in, redirect to login page
      window.location.href = "./pages/login.html";
    }
  });
}

// Update bottom bar profile link
const detailBottomBarProfileLink = document.querySelector(
  "#bottomBar a:last-child"
);
if (detailBottomBarProfileLink) {
  detailBottomBarProfileLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (auth.isLoggedIn()) {
      window.location.href = "/Make-Over/pages/account.html";
    } else {
      window.location.href = "/Make-Over/pages/login.html";
    }
  });
}
