document.addEventListener("DOMContentLoaded", function () {
  loadCartItems();

  // Proceed to Checkout button
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      window.location.href = "checkout.html";
    });
  }
});

function loadCartItems() {
  const cartContainer = document.querySelector(".cart-items");
  if (!cartContainer) return;

  // In a real app, this would come from localStorage or an API
  const cartItems = [
    {
      id: 1,
      name: "Fresh Pomegranate",
      price: 3.99,
      image: "img/pomegranate.jpg",
      quantity: 2,
    },
    {
      id: 2,
      name: "Premium Olive Oil",
      price: 12.99,
      image: "img/olive-oil.jpg",
      quantity: 1,
    },
  ];

  if (cartItems.length === 0) {
    cartContainer.innerHTML =
      '<p>Your cart is empty. <a href="products.html">Start shopping</a></p>';
    document.querySelector(".cart-total").style.display = "none";
    return;
  }

  let total = 0;

  cartItems.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-price">$${item.price.toFixed(2)}</div>
        <div class="quantity-controls">
          <button class="quantity-btn minus" data-id="${item.id}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <div class="item-total">$${itemTotal.toFixed(2)}</div>
      <div class="remove-item" data-id="${
        item.id
      }"><i class="fas fa-trash"></i></div>
    `;
    cartContainer.appendChild(cartItem);
  });

  // Update total
  document.getElementById("total-price").textContent = `$${total.toFixed(2)}`;

  // Add event listeners for quantity controls
  document.querySelectorAll(".quantity-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const itemId = this.getAttribute("data-id");
      const isPlus = this.classList.contains("plus");
      updateQuantity(itemId, isPlus);
    });
  });

  // Add event listeners for remove item
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", function () {
      const itemId = this.getAttribute("data-id");
      removeItem(itemId);
    });
  });
}

function updateQuantity(itemId, isPlus) {
  // In a real app, you would update the quantity in localStorage or via API
  alert(
    `Quantity for item ${itemId} would be ${isPlus ? "increased" : "decreased"}`
  );
  // Then reload the cart items
  loadCartItems();
}

function removeItem(itemId) {
  // In a real app, you would remove the item from localStorage or via API
  alert(`Item ${itemId} would be removed from cart`);
  // Then reload the cart items
  loadCartItems();
}
document.addEventListener("DOMContentLoaded", function () {
  // Load cart items from localStorage
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total-price");
  const cartCountElements = document.querySelectorAll(".cart-count");

  // Update cart count in header
  function updateCartCount() {
    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cartCountElements.forEach((el) => (el.textContent = totalItems));
  }

  // Render cart items
  function renderCartItems() {
    if (cartItems.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Your cart is empty</p>
          <a href="products.html" class="shop-btn">Continue Shopping</a>
        </div>
      `;
      subtotalElement.textContent = "$0.00";
      totalElement.textContent = "$0.00";
      return;
    }

    let cartHTML = "";
    let subtotal = 0;

    cartItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      cartHTML += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            <button class="cart-item-remove" data-index="${index}">Remove</button>
          </div>
          <div class="cart-item-actions">
            <div class="quantity-control">
              <button class="quantity-btn minus" data-index="${index}">-</button>
              <input type="number" class="quantity-input" value="${
                item.quantity
              }" min="1" data-index="${index}">
              <button class="quantity-btn plus" data-index="${index}">+</button>
            </div>
            <p class="cart-item-total">$${itemTotal.toFixed(2)}</p>
          </div>
        </div>
      `;
    });

    cartContainer.innerHTML = cartHTML;
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${subtotal.toFixed(2)}`;

    // Add event listeners
    document.querySelectorAll(".cart-item-remove").forEach((button) => {
      button.addEventListener("click", removeItem);
    });

    document.querySelectorAll(".quantity-btn.minus").forEach((button) => {
      button.addEventListener("click", decreaseQuantity);
    });

    document.querySelectorAll(".quantity-btn.plus").forEach((button) => {
      button.addEventListener("click", increaseQuantity);
    });

    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("change", updateQuantity);
    });
  }

  // Remove item from cart
  function removeItem(e) {
    const index = e.target.dataset.index;
    cartItems.splice(index, 1);
    saveCart();
    renderCartItems();
    updateCartCount();
  }

  // Decrease quantity
  function decreaseQuantity(e) {
    const index = e.target.dataset.index;
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity--;
      saveCart();
      renderCartItems();
      updateCartCount();
    }
  }

  // Increase quantity
  function increaseQuantity(e) {
    const index = e.target.dataset.index;
    cartItems[index].quantity++;
    saveCart();
    renderCartItems();
    updateCartCount();
  }

  // Update quantity from input
  function updateQuantity(e) {
    const index = e.target.dataset.index;
    const newQuantity = parseInt(e.target.value);

    if (newQuantity > 0) {
      cartItems[index].quantity = newQuantity;
      saveCart();
      renderCartItems();
      updateCartCount();
    } else {
      e.target.value = cartItems[index].quantity;
    }
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }

  // Initialize
  renderCartItems();
  updateCartCount();
});

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");
  const overlay = document.querySelector(".overlay");
  const closeMenu = document.querySelector(".close-menu");

  menuToggle.addEventListener("click", function () {
    nav.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // منع التمرير عند فتح القائمة
  });

  closeMenu.addEventListener("click", function () {
    nav.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  overlay.addEventListener("click", function () {
    nav.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  // إغلاق القائمة عند النقر على رابط
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", function () {
      nav.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
});
