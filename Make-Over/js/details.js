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

  // ✅ fixed image path
  container.innerHTML = `
    <div class="product-detail-card">
      <div class="product-detail-img">
        <img src="${product.image[0]}" alt="${product.name}" class="main-image">
        <div class="product-detail-thumbnails">
          ${product.image
            .map(
              (imgSrc, index) => `
            <img src="${imgSrc}" alt="${product.name} ${
                index + 1
              }" class="thumbnail">
          `
            )
            .join("")}
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
    recommendedProductsContainer.innerHTML += `
      <div class="recommended-product-card">
        <div class="recommended-product-img"> 
          <img src="${product.image[0]}" alt="${product.name}">
        </div>
        <div class="recommended-product-info">
          <h3>${product.name}</h3>
          <div class="prices">
          ${product.weight ? `<p>${product.weight}</p>` : ""}
          <div class="price-values">
            ${
              product.discount
                ? `<span class="original-price">৳ ${product.originalprice.toFixed(
                    2
                  )}</span>`
                : ""
            } <span class="final-price">৳ ${productPrice.toFixed(2)}</span>
          </div>
          </div>
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

//# sourceMappingURL=details.js.map
