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

      // Get product information
      const productItem = button.closest(".product-item");
      if (!productItem) return;

      const productId =
        productItem.getAttribute("data-product-id") ||
        `product_${Math.random().toString(36).substr(2, 9)}`;
      const productName =
        productItem.querySelector("h3")?.textContent || "Product";
      const productPrice =
        productItem.querySelector(".price")?.textContent || "$0.00";
      const productImage = productItem.querySelector("img")?.src || "";
      const productCategory =
        productItem.querySelector(".product-category")?.textContent ||
        "Handicrafts";

      // Toggle in wishlist
      toggleProductInWishlist(
        productId,
        productName,
        productPrice,
        productImage,
        productCategory,
        button.classList.contains("active")
      );

      // Show notification with consistent styling and wording
      if (button.classList.contains("active")) {
        // Use window.showNotification if available, otherwise use local implementation
        if (typeof window.showNotification === "function") {
          window.showNotification(
            `${productName} added to wishlist`,
            "success"
          );
        } else {
          showNotification(`${productName} added to wishlist`, "success");
        }
      } else {
        if (typeof window.showNotification === "function") {
          window.showNotification(
            `${productName} removed from wishlist`,
            "success"
          );
        } else {
          showNotification(`${productName} removed from wishlist`, "success");
        }
      }
    }
  });
}

// Toggle product in wishlist
function toggleProductInWishlist(
  productId,
  name,
  price,
  image,
  category,
  isAdding
) {
  // Get current wishlist from localStorage
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (isAdding) {
    // Check if product is already in wishlist
    const existingItem = wishlist.find(
      (item) => typeof item === "object" && item.id === productId
    );

    if (!existingItem) {
      // Add to wishlist as an object with complete information
      const wishlistItem = {
        id: productId,
        name: name,
        price: price,
        image: image,
        category: category,
      };
      wishlist.push(wishlistItem);
    }
  } else {
    // Remove from wishlist
    wishlist = wishlist.filter((item) =>
      typeof item === "string" ? item !== productId : item.id !== productId
    );
  }

  // Save updated wishlist
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  // Update header badges to refresh the wishlist count
  if (typeof window.updateHeaderBadges === "function") {
    window.updateHeaderBadges();
  } else if (typeof updateHeaderBadges === "function") {
    updateHeaderBadges();
  }

  // Force a badge update even if the direct function call doesn't work
  const wishlistBadge = document.querySelector(".wishlist-badge");
  if (wishlistBadge) {
    const validWishlistItems = wishlist.filter(
      (item) =>
        typeof item === "object" && item !== null && item.id && item.name
    );

    if (validWishlistItems.length > 0) {
      wishlistBadge.textContent = validWishlistItems.length;
      wishlistBadge.style.display = "flex";
    } else {
      wishlistBadge.style.display = "none";
    }
  }
}

// Show notification
function showNotification(message, type = "success") {
  // Check if function exists in common.js
  if (typeof window.showNotification === "function") {
    window.showNotification(message, type);
    return;
  }

  // Fallback notification implementation
  const notificationContainer =
    document.querySelector(".notification-container") ||
    (() => {
      const container = document.createElement("div");
      container.className = "notification-container";
      document.body.appendChild(container);
      return container;
    })();

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${
        type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
      }"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;

  notificationContainer.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Hide and remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);

  // Close button functionality
  notification
    .querySelector(".notification-close")
    .addEventListener("click", function () {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
}
