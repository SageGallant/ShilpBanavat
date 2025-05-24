// Shilp Banavat - Premium Handicrafts E-commerce
// Homepage JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Initialize homepage features
  loadFeaturedProducts();
  loadTrendingProducts();
  initializeWishlistButtons();
});

// Function to load featured products from data file
async function loadFeaturedProducts() {
  try {
    // Load products data
    const response = await fetch("js/data/products.json");
    if (!response.ok) {
      throw new Error("Failed to load products data");
    }

    const products = await response.json();

    // Filter for new products (for New Arrivals section)
    const newProducts = products.filter((product) => product.isNew).slice(0, 4);

    // Render new products to the new arrivals section
    renderProductsToSection(newProducts, ".new-arrivals .product-grid");
  } catch (error) {
    console.error("Error loading featured products:", error);
  }
}

// Function to load trending products from data file
async function loadTrendingProducts() {
  try {
    // Load products data
    const response = await fetch("js/data/products.json");
    if (!response.ok) {
      throw new Error("Failed to load products data");
    }

    const products = await response.json();

    // Filter for bestseller products (for Trending Now section)
    const trendingProducts = products
      .filter((product) => product.isBestseller)
      .slice(0, 4);

    // Render trending products to the trending section
    renderProductsToSection(
      trendingProducts,
      ".trending-section .product-grid"
    );
  } catch (error) {
    console.error("Error loading trending products:", error);
  }
}

// Function to render products to a section
function renderProductsToSection(products, sectionSelector) {
  const sectionContainer = document.querySelector(sectionSelector);
  if (!sectionContainer) return;

  // Clear existing products
  sectionContainer.innerHTML = "";

  // Generate HTML for each product
  products.forEach((product) => {
    // Format price
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(product.price);

    // Create product element
    const productItem = document.createElement("div");
    productItem.className = "product-item";

    // Add sale badge if on sale
    let saleBadge = "";
    if (product.isOnSale && product.originalPrice > product.price) {
      const discountPercent = Math.round(
        (1 - product.price / product.originalPrice) * 100
      );
      saleBadge = `<span class="sale-badge">-${discountPercent}%</span>`;
    }

    // Format original price if on sale
    let originalPriceHtml = "";
    if (product.isOnSale && product.originalPrice > product.price) {
      const formattedOriginalPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(product.originalPrice);
      originalPriceHtml = `<span class="original-price">${formattedOriginalPrice}</span>`;
    }

    // Product HTML
    productItem.innerHTML = `
            <div class="product-image">
                <a href="pages/product-detail.html?id=${product.id}">
                    <img src="${
                      product.imagePrimary || "images/placeholder.jpg"
                    }" alt="${product.name}">
                    ${saleBadge}
                </a>
                <button class="wishlist-btn" data-product-id="${
                  product.id
                }"></button>
            </div>
            <div class="product-info">
                <h3><a href="pages/product-detail.html?id=${product.id}">${
      product.name
    }</a></h3>
                <p class="price">${formattedPrice} ${originalPriceHtml}</p>
            </div>
        `;

    sectionContainer.appendChild(productItem);
  });
}

// Initialize wishlist functionality
function initializeWishlistButtons() {
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("wishlist-btn")) {
      const button = event.target;
      button.classList.toggle("active");

      // Get product ID
      const productId = button.getAttribute("data-product-id");

      // Toggle in wishlist
      toggleProductInWishlist(productId);

      // Show notification
      if (button.classList.contains("active")) {
        showNotification("Product added to wishlist");
      } else {
        showNotification("Product removed from wishlist");
      }
    }
  });
}

// Toggle product in wishlist
function toggleProductInWishlist(productId) {
  // Get current wishlist from localStorage
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Check if product is already in wishlist
  const index = wishlist.indexOf(productId);

  if (index === -1) {
    // Add to wishlist
    wishlist.push(productId);
  } else {
    // Remove from wishlist
    wishlist.splice(index, 1);
  }

  // Save updated wishlist
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Hide and remove notification
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}
