document.addEventListener("DOMContentLoaded", function () {
  // Load cart items from localStorage
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const orderItemsContainer = document.getElementById("order-items");
  const orderSubtotalElement = document.getElementById("order-subtotal");
  const orderTotalElement = document.getElementById("order-total");
  const checkoutForm = document.getElementById("checkout-form");
  const creditCardForm = document.getElementById("credit-card-form");
  const paymentMethods = document.querySelectorAll('input[name="payment"]');

  // Update cart count in header
  function updateCartCount() {
    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    document
      .querySelectorAll(".cart-count")
      .forEach((el) => (el.textContent = totalItems));
  }

  // Render order summary
  function renderOrderSummary() {
    if (cartItems.length === 0) {
      orderItemsContainer.innerHTML = "<p>Your cart is empty</p>";
      orderSubtotalElement.textContent = "$0.00";
      orderTotalElement.textContent = "$0.00";
      return;
    }

    let orderHTML = "";
    let subtotal = 0;

    cartItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      orderHTML += `
        <div class="order-item">
          <span class="order-item-name">${
            item.name
          } <span class="order-item-qty">x${item.quantity}</span></span>
          <span class="order-item-price">$${itemTotal.toFixed(2)}</span>
        </div>
      `;
    });

    orderItemsContainer.innerHTML = orderHTML;
    orderSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    orderTotalElement.textContent = `$${subtotal.toFixed(2)}`;
  }

  // Toggle credit card form based on payment method
  function togglePaymentMethod() {
    const selectedMethod = document.querySelector(
      'input[name="payment"]:checked'
    ).value;
    if (selectedMethod === "credit-card") {
      creditCardForm.style.display = "block";
    } else {
      creditCardForm.style.display = "none";
    }
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!checkoutForm.checkValidity()) {
      alert("Please fill in all required fields");
      return;
    }

    // Prepare order data
    const formData = new FormData(checkoutForm);
    const orderData = {
      customer: Object.fromEntries(formData),
      items: cartItems,
      total: parseFloat(orderTotalElement.textContent.substring(1)),
      date: new Date().toISOString(),
    };

    // In a real application, you would send this data to your server
    console.log("Order submitted:", orderData);

    // Show success message
    alert("Thank you for your order! Your order has been placed successfully.");

    // Clear cart and redirect
    localStorage.removeItem("cart");
    window.location.href = "index.html";
  }

  // Initialize
  updateCartCount();
  renderOrderSummary();
  togglePaymentMethod();

  // Event listeners
  paymentMethods.forEach((method) => {
    method.addEventListener("change", togglePaymentMethod);
  });

  checkoutForm.addEventListener("submit", handleSubmit);
});
