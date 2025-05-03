// Load featured products
document.addEventListener("DOMContentLoaded", function () {
  loadFeaturedProducts();

  // Newsletter form submission
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      // Here you would typically send this to your server
      alert(`Thank you for subscribing with ${email}!`);
      this.reset();
    });
  }
});

function loadFeaturedProducts() {
  const featuredContainer = document.querySelector(
    ".featured-products .content"
  );
  if (!featuredContainer) return;

  // Simulated product data - in a real app, this would come from an API
  const featuredProducts = [
    {
      id: 1,
      name: "Fresh Pomegranate",
      price: 3.99,
      image: "img/pomegranate.jpg",
      category: "Fruits",
    },
    {
      id: 2,
      name: "Premium Olive Oil",
      price: 12.99,
      image: "img/olive-oil.jpg",
      category: "Oils",
    },
    {
      id: 3,
      name: "Za'atar Spice Mix",
      price: 5.99,
      image: "img/zaatar.jpg",
      category: "Spices",
    },
    {
      id: 4,
      name: "Fresh Baklava",
      price: 8.99,
      image: "img/baklava.jpg",
      category: "Sweets",
    },
  ];

  featuredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "card product-card";
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-img">
      <div class="info">
        <div class="name">${product.name}</div>
        <div class="category">${product.category}</div>
        <div class="price">$${product.price.toFixed(2)}</div>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    `;
    featuredContainer.appendChild(productCard);
  });

  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      addToCart(productId);
    });
  });
}

function addToCart(productId) {
  // In a real app, you would add the product to the cart (localStorage or API)
  alert(`Product ${productId} added to cart!`);
  // Update cart count in header
  updateCartCount();
}

function updateCartCount() {
  const cartLink = document.querySelector('nav a[href="cart.html"]');
  if (cartLink) {
    // Get current count or default to 0
    let count = parseInt(cartLink.getAttribute("data-count")) || 0;
    count++;
    cartLink.setAttribute("data-count", count);
    cartLink.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${count})`;
  }
}
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
