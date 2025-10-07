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

let products = [];
let shoppingCart = [];

function addDataToHTML() {
  const productContainer = document.getElementById("productContainer");
  if (products) {
    products.forEach((product) => {
      const productBox = document.createElement("div");
      productBox.href = `product.html?id=${product.id}/${product.name}`;
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

      productBox.innerHTML = `
      <div class="product-img">
                    <img src="${product.image[0]}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <h3>${productName}</h3>
                    <span>
                        <p>${product.weight ? `${product.weight}g` : ""}</p>
                        <div class="prices">
                        <div class="ifor-price">${
                          product.discount ? `৳. ${product.originalprice}` : ""
                        }</div>
                        <div class="price">৳. ${productPrice.toFixed(2)}</div>
                        </div>
                        
                    </span>

                    <button class="add-to-cart" data-id="${
                      product.id
                    }">Add to Cart</button>
                </div>`;
      productContainer.appendChild(productBox);
    });
    productContainer.addEventListener("click", (event) => {
      let positionClick = event.target;
      if (positionClick.classList.contains("add-to-cart")) {
        let productId = positionClick.dataset.id;
        addToCart(productId);
      }
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
  cartBody.innerHTML = "";
  let totalQuantity = 0;
  if (shoppingCart.length > 0) {
    shoppingCart.forEach((cart) => {
      let positionProduct = products.findIndex(
        (value) => value.id == cart.productId
      );
      let info = products[positionProduct];

      let newCartItem = document.createElement("div");
      newCartItem.classList.add("cart-item");
      newCartItem.dataset.id = cart.productId;

      let cartProductName =
        info.name.length > 45 ? info.name.slice(0, 45) + "..." : info.name;

      let productPrice = info.discount
        ? info.originalprice - (info.originalprice * info.discount) / 100
        : info.originalprice;
      totalQuantity = totalQuantity + cart.quantity;
      newCartItem.innerHTML = ` <div class="item-img">
                        <img src="${info.image[0]}" alt="${info.name}">
                    </div>
                    <div class="item-details">
                        <h3>${cartProductName}</h3>
                        <p>${info.weight ? `${info.weight}g` : ""}</p>
                        <div class="quantity-pice">
                            <div class="quantity">
                                <button class="decrease">-</button>
                                <span class="count">${cart.quantity}</span>
                                <button class="increase">+</button>
                            </div>
                            <h4 class="price">৳. ${(
                              productPrice * cart.quantity
                            ).toFixed(2)}</h4>
                        </div>
                    </div>`;
      cartBody.appendChild(newCartItem);
    });
    document.getElementById("carryConunt").textContent = totalQuantity;
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
        } else {
          shoppingCart.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToMemory();
  addCartToHTML();
};

const initApp = () => {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      products = data.products;
      addDataToHTML();

      // get cart data from memory
      if (localStorage.getItem("cart")) {
        shoppingCart = JSON.parse(localStorage.getItem("cart"));
        addCartToHTML();
      }
    });
};
initApp();
