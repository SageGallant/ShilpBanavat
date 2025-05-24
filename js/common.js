// Shilp Banavat - Premium Handicrafts E-commerce
// Common JavaScript functionality across all pages

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Apply fixed header to all pages
  applyFixedHeader();

  initHeader();
  initWishlistButtons();
  updateHeaderBadges(); // Initialize badges on page load
  initSmoothScroll();

  // Load search.js if not already loaded
  if (typeof initSearch === "undefined") {
    loadScript("js/search.js", function () {
      if (typeof initSearch === "function") {
        initSearch();
      }
    });
  }
});

// Apply fixed header to all pages
function applyFixedHeader() {
  // Add fixed-header class to header
  const header = document.querySelector(".header");
  if (header && !header.classList.contains("fixed-header")) {
    header.classList.add("fixed-header");
  }

  // Add has-fixed-header class to body
  if (!document.body.classList.contains("has-fixed-header")) {
    document.body.classList.add("has-fixed-header");
  }
}

// Load a script dynamically
function loadScript(src, callback) {
  // Check if we're on a subpage or the main page
  const isSubpage = window.location.pathname.includes("/pages/");

  // Fix the path based on current location
  let scriptPath;
  if (isSubpage) {
    // If we're in a subpage and the script path doesn't start with '../'
    scriptPath = src.startsWith("../") ? src : "../" + src;
  } else {
    // If we're on the main page and the script path starts with '../'
    scriptPath = src.startsWith("../") ? src.substring(3) : src;
  }

  const script = document.createElement("script");
  script.src = scriptPath;
  script.onload = callback;
  script.onerror = function () {
    console.error("Failed to load script: " + scriptPath);
  };
  document.head.appendChild(script);
}

// Smooth scrolling behavior for all links
function initSmoothScroll() {
  // Apply to all links that lead to an anchor on the same page
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Get header height dynamically from CSS variable
        const headerHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-height"
          ) || "118"
        );

        // Calculate position accounting for fixed header
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Apply smooth scrolling behavior to navigation links pointing to other pages
  const pageLinks = document.querySelectorAll('a[href*="#"]:not([href^="#"])');

  pageLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      const isCurrentPage = href.includes(window.location.pathname);

      if (isCurrentPage) {
        e.preventDefault();
        const targetId = href.substring(href.indexOf("#"));
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Get header height dynamically from CSS variable
          const headerHeight = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--header-height"
            ) || "118"
          );

          // Calculate position accounting for fixed header
          const elementPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

// Header scroll effect and mobile navigation
function initHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  let lastScrollTop = 0;
  let ticking = false;

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (!ticking) {
      window.requestAnimationFrame(function () {
        // Add scrolled class for styling
        if (scrollTop > 100) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }

        ticking = false;
      });

      ticking = true;
    }
  });

  // Mobile navigation toggle
  const mobileToggle = document.createElement("button");
  mobileToggle.className = "mobile-nav-toggle";
  mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
  header.querySelector(".header-right").prepend(mobileToggle);

  mobileToggle.addEventListener("click", function () {
    header.querySelector(".main-navigation").classList.toggle("active");
    if (header.querySelector(".main-navigation").classList.contains("active")) {
      mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
      mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });

  // Add badge containers to cart and wishlist icons
  const cartIcon = header.querySelector(".fa-shopping-bag");
  const wishlistIcon = header.querySelector(".fa-heart");

  if (cartIcon && !cartIcon.parentElement.querySelector(".badge")) {
    const cartBadge = document.createElement("span");
    cartBadge.className = "badge cart-badge";
    cartIcon.parentElement.appendChild(cartBadge);
  }

  if (wishlistIcon && !wishlistIcon.parentElement.querySelector(".badge")) {
    const wishlistBadge = document.createElement("span");
    wishlistBadge.className = "badge wishlist-badge";
    wishlistIcon.parentElement.appendChild(wishlistBadge);
  }
}

// Update header badges for cart and wishlist
function updateHeaderBadges() {
  // Update cart badge
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const uniqueItemCount = cart.length; // Count unique items in cart
  const cartBadge = document.querySelector(".cart-badge");

  if (cartBadge) {
    if (uniqueItemCount > 0) {
      cartBadge.textContent = uniqueItemCount;
      cartBadge.style.display = "flex";
    } else {
      cartBadge.style.display = "none";
    }
  }

  // Update wishlist badge
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistCount = wishlist.length;
  const wishlistBadge = document.querySelector(".wishlist-badge");

  if (wishlistBadge) {
    if (wishlistCount > 0) {
      wishlistBadge.textContent = wishlistCount;
      wishlistBadge.style.display = "flex";
    } else {
      wishlistBadge.style.display = "none";
    }
  }
}

// Make the function globally available
window.updateHeaderBadges = updateHeaderBadges;

// Wishlist functionality
function initWishlistButtons() {
  const wishlistBtns = document.querySelectorAll(
    ".wishlist-btn, .add-to-wishlist"
  );

  wishlistBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const icon = this.querySelector("i");
      icon.classList.toggle("fas");
      icon.classList.toggle("far");

      // Get product info
      const productElement =
        this.closest(".product-item") ||
        document.querySelector(".product-detail");
      if (!productElement) return;

      let productId = productElement.getAttribute("data-product-id");
      if (!productId) {
        // Generate a random ID if none exists
        productId = "product_" + Math.random().toString(36).substr(2, 9);
        productElement.setAttribute("data-product-id", productId);
      }

      let productName = "Product";
      let productPrice = "$0.00";

      const nameElement =
        productElement.querySelector("h3") ||
        productElement.querySelector(".product-title");
      const priceElement =
        productElement.querySelector(".price") ||
        productElement.querySelector(".product-price");

      if (nameElement) productName = nameElement.textContent.trim();
      if (priceElement) productPrice = priceElement.textContent.trim();

      // Get current wishlist
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      if (icon.classList.contains("fas")) {
        // Add to wishlist
        const wishlistItem = {
          id: productId,
          name: productName,
          price: productPrice,
        };

        // Check if item already exists before adding
        if (!wishlist.find((item) => item.id === productId)) {
          wishlist.push(wishlistItem);
          localStorage.setItem("wishlist", JSON.stringify(wishlist));
        }

        showNotification("Product added to wishlist");
      } else {
        // Remove from wishlist
        wishlist = wishlist.filter((item) => item.id !== productId);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        showNotification("Product removed from wishlist");
      }

      // Update header badges
      updateHeaderBadges();
    });
  });
}

// Parse price string to number
function parsePrice(priceString) {
  if (typeof priceString === "number") return priceString;

  // Remove currency symbols and commas, then parse as float
  const price = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
  return isNaN(price) ? 0 : price;
}

// Add to cart functionality
document.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("btn-add-cart") ||
    event.target.classList.contains("add-to-cart")
  ) {
    event.preventDefault();

    // Get product info
    const productElement =
      event.target.closest(".product-item") ||
      document.querySelector(".product-detail");

    if (!productElement) {
      showNotification("Could not add product to cart", "error");
      return;
    }

    let productId = productElement.getAttribute("data-product-id");
    if (!productId) {
      // Generate a random ID if none exists
      productId = "product_" + Math.random().toString(36).substr(2, 9);
      productElement.setAttribute("data-product-id", productId);
    }

    let productName = "Selected product";
    let productPrice = "";
    let productImage = "";

    if (productElement) {
      const nameElement =
        productElement.querySelector("h3") ||
        productElement.querySelector(".product-title");
      const priceElement =
        productElement.querySelector(".price") ||
        productElement.querySelector(".product-price");
      const imageElement = productElement.querySelector("img");

      if (nameElement) productName = nameElement.textContent.trim();
      if (priceElement) productPrice = priceElement.textContent.trim();
      if (imageElement) productImage = imageElement.src;
    }

    // Get quantity if on product detail page
    let quantity = 1;
    const qtyInput = document.querySelector(".qty-input");
    if (qtyInput) {
      quantity = parseInt(qtyInput.value) || 1;
    }

    // Parse the price to ensure it's a number
    const parsedPrice = parsePrice(productPrice);

    // Add to cart in localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if item already in cart
    const existingItemIndex = cart.findIndex((item) => item.id === productId);

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.push({
        id: productId,
        name: productName,
        price: parsedPrice,
        displayPrice: productPrice,
        image: productImage,
        quantity: quantity,
      });
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update badge count
    updateHeaderBadges();

    console.log(`Added to cart: ${quantity}x ${productName} (${productPrice})`);
    showNotification(`${productName} added to your cart`);
  }
});

// Show notification
function showNotification(message, type = "success") {
  // Check if notification container exists, if not create it
  let notificationContainer = document.querySelector(".notification-container");

  if (!notificationContainer) {
    notificationContainer = document.createElement("div");
    notificationContainer.className = "notification-container";
    document.body.appendChild(notificationContainer);
  }

  // Create notification
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

  // Add to container
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
