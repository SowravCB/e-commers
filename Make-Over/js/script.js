// const { createElement } = require("react");

const categoryBoxes = document.querySelectorAll(".category-box");
const overlay = document.getElementById("overlay");

categoryBoxes.forEach((box) => {
  const dropdown = box.querySelector(".dorpdown-box");
  if (dropdown) {
    box.addEventListener("mouseover", () => {
      dropdown.classList.add("show");
      overlay.classList.add("show");
      overlay.style.top = "110px";
      overlay.style.zIndex = "0";
    });
    box.addEventListener("mouseout", () => {
      dropdown.classList.remove("show");
      overlay.classList.remove("show");
      overlay.style.top = "0";
    });
  }
});

// Handle profile icon click
const profileIcon = document.getElementById("profileIcon");
if (profileIcon) {
  profileIcon.addEventListener("click", () => {
    if (auth.isLoggedIn()) {
      // If user is logged in, redirect to account page
      window.location.href = "./pages/account.html";
    } else {
      // If user is not logged in, redirect to login page
      window.location.href = "./pages/login.html";
    }
  });
}

// Update bottom bar profile link
const bottomBarProfileLink = document.querySelector("#bottomBar a:last-child");
if (bottomBarProfileLink) {
  bottomBarProfileLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (auth.isLoggedIn()) {
      window.location.href = "/Make-Over/pages/account.html";
    } else {
      window.location.href = "/Make-Over/pages/login.html";
    }
  });
}

const wishList = document.getElementById("wishList");
wishList.addEventListener("click", () => {
  const wishListBox = document.getElementById("wishListBox");
  wishListBox.classList.toggle("open");
  const isOpen = wishListBox.classList.contains("open");
  if (isOpen) {
    overlay.classList.add("show");
    overlay.style.top = "0";
    overlay.style.zIndex = "5";
    document.body.style.overflow = "hidden";
  } else {
    overlay.classList.remove("show");
    overlay.style.zIndex = "0";
    document.body.style.overflow = "";
  }
  const closeWishlist = wishListBox.querySelector("#closeWishlist");
  closeWishlist.addEventListener("click", () => {
    wishListBox.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
  });
  overlay.addEventListener("click", () => {
    wishListBox.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
  });
});

const cart = document.getElementById("cartIcon");
cart.addEventListener("click", () => {
  const cartBox = document.getElementById("cartBox");
  cartBox.classList.toggle("open");
  const isOpen = cartBox.classList.contains("open");
  if (isOpen) {
    overlay.classList.add("show");
    overlay.style.top = "0";
    overlay.style.zIndex = "5";
    document.body.style.overflow = "hidden";
  } else {
    overlay.classList.remove("show");
    overlay.style.zIndex = "0";
    document.body.style.overflow = "";
  }
  const closeBtn = cartBox.querySelector("#closeCart");
  closeBtn.addEventListener("click", () => {
    cartBox.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
  });
  overlay.addEventListener("click", () => {
    cartBox.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
  });
});

const mobileCategoryBtn = document.getElementById("mobileCategoryBtn");
mobileCategoryBtn.addEventListener("click", () => {
  const mobileCategoryBox = document.getElementById("mobileCategoryBox");
  mobileCategoryBox.classList.toggle("open");
  const isOpenBox = mobileCategoryBox.classList.contains("open");
  if (isOpenBox) {
    overlay.classList.add("show");
    overlay.style.top = "0";
    overlay.style.zIndex = "5";
    document.body.style.overflow = "hidden";
  } else {
    overlay.classList.remove("show");
    overlay.style.zIndex = "0";
    document.body.style.overflow = "";
  }
  const closeMenuBtn = mobileCategoryBox.querySelector("#closeMenu");
  closeMenuBtn.addEventListener("click", () => {
    mobileCategoryBox.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
  });
  overlay.addEventListener("click", () => {
    mobileCategoryBox.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
  });
});

let products = null;
let shoppingCart = []; // Initialize as empty array

// Initialize cart from localStorage if it exists
if (localStorage.getItem("cart")) {
  shoppingCart = JSON.parse(localStorage.getItem("cart"));
}

const searchInput = document.getElementById("searchbox");
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );
  addDataToHTML(filteredProducts);
});

function addDataToHTML(productsToDisplay) {
  const productContainer = document.getElementById("productContainer");
  productContainer.innerHTML = "";
  const source = productsToDisplay || products;
  if (source) {
    source.forEach((product) => {
      const productBox = document.createElement("div");
      productBox.classList = "product-box";
      productBox.dataset.id = product.id;

      let productName =
        product.name.length > 70
          ? product.name.slice(0, 70) + "..."
          : product.name;

      let productPrice = product.discount
        ? product.originalprice -
          (product.originalprice * product.discount) / 100
        : product.originalprice;

      const mainImage = Array.isArray(product.image)
        ? product.image.find((img) => img.isMain)?.url || product.image[0]
        : product.image;

      productBox.innerHTML = `
        <div class="product-img">
                      <img src="${mainImage}" alt="${product.name}">
                  </div>
                  <div class="product-details">
                      <h3>${productName}</h3>
                      <span>
                          ${product.weight ? `<p>${product.weight}</p>` : ""}
                          <div class="prices">
                          <div class="ifor-price">${
                            product.discount
                              ? `৳. ${product.originalprice}`
                              : ""
                          }</div>
                          <div class="price">৳. ${productPrice.toFixed(2)}</div>
                          </div>
                          
                      </span>

                      <button class="add-to-cart" data-id="${
                        product.id
                      }">Add to Cart</button>
                  </div>`;
      productContainer.appendChild(productBox);

      // Add click event for the entire product box
      productBox.addEventListener("click", (event) => {
        // Check if clicked element is not the Add to Cart button
        if (!event.target.classList.contains(".add-to-cart")) {
          window.location.href = `/Make-Over/pages/details.html?id=${product.id}`;
        }
      });

      // Add click event for the Add to Cart button
      const addToCartBtn = productBox.querySelector(".add-to-cart");
      addToCartBtn.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent product box click event
        let productId = event.target.dataset.id;
        addToCart(productId);

        addToCartBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="20px" fill="currentcolor"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg> Added!`;
        addToCartBtn.style.background = "#FF3EA3";

        setTimeout(() => {
          addToCartBtn.textContent = "Add to Cart";
          addToCartBtn.style.background = "";
        }, 2000);
      });
    });
  }
}

const cartBody = document.querySelector(".cart-body");

const addToCart = (productId) => {
  let positionThisProductInCart = shoppingCart.findIndex(
    (value) => value.productId == productId
  );
  if (shoppingCart.length <= 0) {
    shoppingCart = [{ productId: productId, quantity: 1 }];
  } else if (positionThisProductInCart < 0) {
    shoppingCart.push({
      productId: productId,
      quantity: 1,
    });
  } else {
    shoppingCart[positionThisProductInCart].quantity =
      shoppingCart[positionThisProductInCart].quantity + 1;
  }
  const cartMessage = document.getElementById("cartMessage");
  cartMessage.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-patch-check-fill" viewBox="0 0 16 16">
    <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
  </svg> Items Added to your Cart!`;
  // cartMessage.textContent = "Items added to your cart!";
  cartMessage.style.opacity = "1";
  cartMessage.style.visibility = "visible";
  cartMessage.style.transform = "translate(-50%,15px)";
  cartMessage.style.transition = "all .3s ease";
  cartMessage.style.background = "#a3d5a5";
  cartMessage.style.color = "#007800";
  // cartMessage.style.top = "0";
  // cartMessage.style.left = "50%";
  // cartMessage.style.zIndex = "15";
  setTimeout(() => {
    cartMessage.style.opacity = "0";
    cartMessage.style.visibility = "hidden";
    cartMessage.style.transform = "translate(-50%,-60px)";
  }, 2000);
  addCartToHTML();
  addCartToMemory();
};

const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(shoppingCart));
};
const addCartToHTML = () => {
  if (!products || !Array.isArray(products)) {
    console.error("Products not loaded yet");
    return;
  }

  cartBody.innerHTML = "";
  let totalQuantity = 0;
  let subtotal = 0;
  if (shoppingCart.length > 0) {
    shoppingCart.forEach((cart) => {
      let positionProduct = products.findIndex(
        (value) => value.id == cart.productId
      );
      if (positionProduct === -1) {
        console.error(`Product with ID ${cart.productId} not found`);
        return;
      }
      let info = products[positionProduct];

      let newCartItem = document.createElement("div");
      newCartItem.classList.add("cart-item");
      newCartItem.dataset.id = cart.productId;

      let cartProductName =
        info.name.length > 45 ? info.name.slice(0, 45) + "..." : info.name;

      let productPrice = info.discount
        ? info.originalprice - (info.originalprice * info.discount) / 100
        : info.originalprice;

      const mainImage = Array.isArray(info.image)
        ? info.image.find((img) => img.isMain)?.url || info.image[0]
        : info.image;

      totalQuantity = totalQuantity + cart.quantity;
      subtotal += productPrice * cart.quantity;
      newCartItem.innerHTML = ` <div class="item-img">
                          <img src="${mainImage}" alt="${info.name}">
                      </div>
                      <div class="item-details">
                          <h3>${cartProductName}</h3>
                          <div class="weath-delete">
                          ${info.weight ? `<p>${info.weight}</p>` : ""}
                            <button class="delete-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                              </svg>
                            </button>
                          </div>
                          
                          <div class="quantity-pice">
                              <div class="quantity">
                                  <button class="decrease">-</button>
                                  <span class="count">${cart.quantity}</span>
                                  <button class="increase">+</button>
                              </div>
                              <div class="price-box">
                              <h5 class="or-price">${
                                info.discount ? `৳. ${info.originalprice}` : ""
                              }</h5>
                              <h4 class="price">৳. ${(
                                productPrice * cart.quantity
                              ).toFixed(2)}</h4></div>
                          </div>
                      </div>`;
      cartBody.appendChild(newCartItem);
    });
    document.getElementById("carryConunt").textContent = totalQuantity;
    document.getElementById(
      "cartSubtotal"
    ).textContent = `৳. ${subtotal.toFixed(2)}`;
  }
};

cartBody.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("decrease") ||
    positionClick.classList.contains("increase")
  ) {
    let productId = positionClick.closest(".cart-item").dataset.id;
    let type = "increase";
    if (positionClick.classList.contains("decrease")) {
      type = "decrease";
    }
    changeQuantity(productId, type);
  }
});

const changeQuantity = (productId, type) => {
  let positionItemInCart = shoppingCart.findIndex(
    (value) => value.productId == productId
  );
  if (positionItemInCart >= 0) {
    switch (type) {
      case "increase":
        shoppingCart[positionItemInCart].quantity =
          shoppingCart[positionItemInCart].quantity + 1;
        break;

      default:
        let valueChange = shoppingCart[positionItemInCart].quantity - 1;
        if (valueChange > 0) {
          shoppingCart[positionItemInCart].quantity = valueChange;
        }
        // else {
        //   shoppingCart.splice(positionItemInCart, 1);
        // }
        break;
    }
  }
  addCartToMemory();
  addCartToHTML();
};

cartBody.addEventListener("click", (e) => {
  if (e.target.closest(".delete-btn")) {
    let productId = e.target.closest(".cart-item").dataset.id;
    let positionItemInCart = shoppingCart.findIndex(
      (value) => value.productId == productId
    );

    shoppingCart.splice(positionItemInCart, 1);
    addCartToMemory();
    addCartToHTML();
  }
});

// Carousel
const slides = document.querySelectorAll(".slide");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");
const dotsContainer = document.querySelector(".dots");
let index = 0;
let startX = 0;
let endX = 0;

// Create dots
slides.forEach((_, i) => {
  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("active");
  dotsContainer.appendChild(dot);
});
const dots = document.querySelectorAll(".dots span");

function showSlide(i) {
  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));
  slides[i].classList.add("active");
  dots[i].classList.add("active");
}

function nextSlide() {
  index = (index + 1) % slides.length;
  showSlide(index);
}

function prevSlide() {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
}

next.addEventListener("click", nextSlide);
prev.addEventListener("click", prevSlide);
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    index = i;
    showSlide(index);
  });
});

// Auto-slide every 5 seconds
let autoSlide = setInterval(nextSlide, 5000);

// Swipe detection for mobile
const hero = document.querySelector(".hero");

hero.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

hero.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const diff = startX - endX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextSlide(); // swipe left
    } else {
      prevSlide(); // swipe right
    }
  }
}

// Optional: Pause on hover (desktop)
// hero.addEventListener("mouseenter", () => clearInterval(autoSlide));
// hero.addEventListener(
//   "mouseleave",
//   () => (autoSlide = setInterval(nextSlide, 5000))
// );

const initApp = async () => {
  try {
    // Fetch products from API
    products = await ApiService.getProducts();

    // Add products to HTML
    addDataToHTML();

    // Update cart after products are loaded
    if (localStorage.getItem("cart")) {
      shoppingCart = JSON.parse(localStorage.getItem("cart"));
      updateCartDisplay();
    }
  } catch (error) {
    console.error("Error loading products:", error);
    document.getElementById("productContainer").innerHTML =
      '<div class="error-message">Unable to load products. Please try again later.</div>';
  }

  if (localStorage.getItem("wishlist")) {
    const wishlistData = JSON.parse(localStorage.getItem("wishlist"));
    updateWishListDisplay(wishlistData);
  }
};

// Function to update cart display
const updateCartDisplay = () => {
  if (!products) {
    console.error("Products not loaded yet");
    return;
  }

  // Update carry count
  const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("carryConunt").textContent = totalItems;

  // Update cart items
  addCartToHTML();
};
initApp();

let navbar = gsap.timeline({ paused: true });
navbar.from(".navbar", { y: -100, opacity: 0, duration: 0.5, stagger: 0.4 });
navbar.play();
navbar.from(".navbar .category", {
  y: -50,
  opacity: 0,
  duration: 0.5,
  stagger: 0.2,
});
navbar.from(".bottom-bar", {
  y: 50,
  opacity: 0,
  duration: 0.5,
  stagger: 0.2,
});
