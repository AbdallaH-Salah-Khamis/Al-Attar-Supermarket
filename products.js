document.addEventListener("DOMContentLoaded", function () {
  // Initialize cart count
  updateCartCount();

  // Load products
  loadProducts();

  // Setup event listeners for filters
  setupFilters();
});

// Sample product data - in a real app, this would come from an API
const products = [
  {
    id: 1,
    name: "Fresh Pomegranate",
    price: 3.99,
    image: "img/pomegranate.jpeg",
    category: "vegetables",
    featured: true,
    badge: "Seasonal",
  },
  {
    id: 2,
    name: "Premium Olive Oil",
    price: 12.99,
    image: "img/olive-oil.jpeg",
    category: "oils",
    featured: true,
  },
  {
    id: 3,
    name: "Za'atar Spice Mix",
    price: 5.99,
    oldPrice: 7.99,
    image: "img/zaatar.jpeg",
    category: "spices",
    badge: "Sale",
  },
  {
    id: 4,
    name: "Fresh Baklava",
    price: 8.99,
    image: "img/baklava.jpeg",
    category: "sweets",
    featured: true,
  },
  {
    id: 5,
    name: "Homemade Hummus",
    price: 4.99,
    image: "img/hummus.jpeg",
    category: "dips",
  },
  {
    id: 6,
    name: "Feta Cheese",
    price: 6.99,
    image: "img/feta.jpeg",
    category: "dairy",
  },
  {
    id: 7,
    name: "Pita Bread",
    price: 2.99,
    image: "img/pita.jpeg",
    category: "bakery",
  },
  {
    id: 8,
    name: "Medjool Dates",
    price: 7.99,
    image: "img/dates.jpeg",
    category: "dried-fruits",
    badge: "Popular",
  },
  {
    id: 9,
    name: "Fresh Mint",
    price: 1.99,
    image: "img/mint.jpeg",
    category: "vegetables",
  },
  {
    id: 10,
    name: "Tahini Paste",
    price: 5.49,
    image: "img/tahini.jpeg",
    category: "dips",
  },
  {
    id: 11,
    name: "Arabic Coffee",
    price: 9.99,
    image: "img/coffee.jpeg",
    category: "beverages",
  },
  {
    id: 12,
    name: "Rose Water",
    price: 4.49,
    image: "img/rose-water.jpeg",
    category: "beverages",
  },
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function loadProducts(filteredProducts = products) {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";

  if (filteredProducts.length === 0) {
    productsContainer.innerHTML =
      '<div class="no-products">No products found matching your criteria.</div>';
    return;
  }

  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      ${
        product.badge
          ? `<span class="product-badge">${product.badge}</span>`
          : ""
      }
      <div class="product-img-container">
        <img src="${product.image}" alt="${product.name}" class="product-img">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <span class="product-category">${formatCategory(
          product.category
        )}</span>
        <div class="product-price">
          $${product.price.toFixed(2)}
          ${
            product.oldPrice
              ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>`
              : ""
          }
        </div>
        <button class="add-to-cart" data-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
    productsContainer.appendChild(productCard);
  });

  // Add event listeners to all Add to Cart buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      addToCart(productId);
    });
  });
}

function formatCategory(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function setupFilters() {
  const searchInput = document.getElementById("product-search");
  const categorySelect = document.getElementById("category-select");
  const sortSelect = document.getElementById("sort-select");
  const searchBtn = document.getElementById("search-btn");

  // Debounce search function
  let searchTimeout;
  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      filterProducts();
    }, 300);
  });

  searchBtn.addEventListener("click", filterProducts);
  categorySelect.addEventListener("change", filterProducts);
  sortSelect.addEventListener("change", filterProducts);
}

function filterProducts() {
  const searchTerm = document
    .getElementById("product-search")
    .value.toLowerCase();
  const category = document.getElementById("category-select").value;
  const sortOption = document.getElementById("sort-select").value;

  let filtered = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  filtered.sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default: // 'featured'
        return (
          (b.featured || false) - (a.featured || false) ||
          a.name.localeCompare(b.name)
        );
    }
  });

  loadProducts(filtered);
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update UI
  updateCartCount();

  // Visual feedback
  const button = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
  if (button) {
    button.textContent = "Added to Cart!";
    button.classList.add("added");
    setTimeout(() => {
      button.textContent = "Add to Cart";
      button.classList.remove("added");
    }, 2000);
  }
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems > 0 ? `Cart (${totalItems})` : "Cart";
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
