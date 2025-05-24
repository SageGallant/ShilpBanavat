// Shilp Banavat - Premium Handicrafts E-commerce
// Wishlist Page JavaScript

document.addEventListener("DOMContentLoaded", function () {
  initWishlist();
  setupShareModal();
  initColorOptions();
});

/**
 * Initialize wishlist page content
 */
function initWishlist() {
  // Get wishlist data from localStorage
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Clear existing items in wishlist grid
  const wishlistGrid = document.querySelector(".wishlist-grid");
  if (!wishlistGrid) return;

  wishlistGrid.innerHTML = "";

  // Normalize wishlist data - convert any string IDs to objects if needed
  wishlist = normalizeWishlistData(wishlist);

  // Save normalized data back to localStorage
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  // Update wishlist count
  updateWishlistCount(wishlist.length);

  // Show/hide appropriate content based on whether wishlist has items
  if (wishlist.length === 0) {
    document.getElementById("empty-wishlist").style.display = "block";
    document.getElementById("wishlist-content").style.display = "none";
  } else {
    document.getElementById("empty-wishlist").style.display = "none";
    document.getElementById("wishlist-content").style.display = "block";

    // Populate wishlist items
    wishlist.forEach((item) => {
      const wishlistItem = createWishlistItemElement(item);
      wishlistGrid.appendChild(wishlistItem);
    });

    // Setup event handlers for the newly created elements
    setupWishlistItemEventHandlers();
  }

  // Initialize wishlist action buttons
  initWishlistActions();
}

/**
 * Normalize wishlist data to ensure consistent structure
 * Converts any string IDs to objects and ensures all objects have required properties
 */
function normalizeWishlistData(wishlist) {
  return wishlist.filter((item) => {
    // If item is a string (just an ID), filter it out as we can't display it properly
    if (typeof item === "string") {
      console.warn(`Removing legacy wishlist item format (string ID): ${item}`);
      return false;
    }

    // Ensure item is an object with required properties
    if (typeof item === "object" && item !== null) {
      // Check if item has all required properties
      if (item.id && item.name) {
        // Add default values for missing properties
        if (!item.price) item.price = "$0.00";
        if (!item.image) item.image = "../images/placeholder-product1.jpg";
        if (!item.category) item.category = "Handicrafts";
        return true;
      }
    }

    // Filter out invalid items
    console.warn("Removing invalid wishlist item:", item);
    return false;
  });
}

/**
 * Create a DOM element for a wishlist item
 */
function createWishlistItemElement(item) {
  const wishlistItem = document.createElement("div");
  wishlistItem.className = "wishlist-item";
  wishlistItem.setAttribute("data-product-id", item.id);

  // Ensure item has all required properties with fallbacks
  const name = item.name || "Product";
  const category = item.category || "Handicrafts";
  const price = item.price || "$0.00";
  const imageUrl = item.image || "../images/placeholder-product1.jpg";

  wishlistItem.innerHTML = `
    <div class="wishlist-item-header">
      <button class="remove-wishlist-item"><i class="fas fa-times"></i></button>
    </div>
    <div class="wishlist-item-image">
      <img src="${imageUrl}" alt="${name}" onerror="this.src='../images/placeholder-product1.jpg';">
    </div>
    <div class="wishlist-item-details">
      <h3>${name}</h3>
      <p class="item-category">${category}</p>
      <p class="item-price">${price}</p>
      <div class="item-actions">
        <button class="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  `;

  return wishlistItem;
}

/**
 * Setup event handlers for wishlist items
 */
function setupWishlistItemEventHandlers() {
  // Handle remove item from wishlist
  const removeButtons = document.querySelectorAll(".remove-wishlist-item");
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const wishlistItem = this.closest(".wishlist-item");
      const productId = wishlistItem.getAttribute("data-product-id");

      // Animate removal
      wishlistItem.style.opacity = "0";
      wishlistItem.style.transform = "scale(0.9)";

      setTimeout(() => {
        wishlistItem.remove();

        // Update wishlist in localStorage
        removeFromWishlist(productId);

        // Get updated wishlist
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

        // Update count
        updateWishlistCount(wishlist.length);

        // Show empty state if no items left
        if (wishlist.length === 0) {
          document.getElementById("empty-wishlist").style.display = "block";
          document.getElementById("wishlist-content").style.display = "none";
        }

        showNotification("Item removed from wishlist");
      }, 300);
    });
  });

  // Handle add to cart
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const wishlistItem = this.closest(".wishlist-item");
      const productId = wishlistItem.getAttribute("data-product-id");
      const productName = wishlistItem.querySelector("h3").textContent;
      const productPrice =
        wishlistItem.querySelector(".item-price").textContent;
      const productImage = wishlistItem.querySelector("img").src;
      const productCategory =
        wishlistItem.querySelector(".item-category").textContent;

      // Add to cart
      addToCart(
        productId,
        productName,
        productPrice,
        "",
        productImage,
        productCategory
      );

      // Remove from wishlist
      setTimeout(() => {
        // Animate removal
        wishlistItem.style.opacity = "0";
        wishlistItem.style.transform = "scale(0.9)";

        setTimeout(() => {
          wishlistItem.remove();

          // Update wishlist in localStorage
          removeFromWishlist(productId);

          // Get updated wishlist
          const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

          // Update count
          updateWishlistCount(wishlist.length);

          // Show empty state if no items left
          if (wishlist.length === 0) {
            document.getElementById("empty-wishlist").style.display = "block";
            document.getElementById("wishlist-content").style.display = "none";
          }
        }, 300);
      }, 500);

      // Show notification
      showNotification(`${productName} moved to cart`, "success");
    });
  });

  // Initialize color options
  initColorOptions();
}

/**
 * Initialize wishlist action buttons
 */
function initWishlistActions() {
  // Handle add all to cart
  const addAllToCartBtn = document.getElementById("add-all-to-cart");
  if (addAllToCartBtn) {
    addAllToCartBtn.addEventListener("click", function () {
      const wishlistItems = document.querySelectorAll(".wishlist-item");

      if (wishlistItems.length === 0) {
        showNotification("Your wishlist is empty", "error");
        return;
      }

      // First add all items to cart
      wishlistItems.forEach((item) => {
        const productId = item.getAttribute("data-product-id");
        const productName = item.querySelector("h3").textContent;
        const productPrice = item.querySelector(".item-price").textContent;
        const productImage = item.querySelector("img").src;
        const productCategory =
          item.querySelector(".item-category").textContent;

        // Add to cart
        addToCart(
          productId,
          productName,
          productPrice,
          "",
          productImage,
          productCategory
        );
      });

      // Then clear the wishlist
      setTimeout(() => {
        // Clear localStorage wishlist
        localStorage.removeItem("wishlist");

        // Animate removal of all items
        wishlistItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = "0";
            item.style.transform = "scale(0.9)";

            setTimeout(() => {
              item.remove();
            }, 300);
          }, index * 50); // Stagger the animations
        });

        // Show empty state after last item is removed
        setTimeout(() => {
          document.getElementById("empty-wishlist").style.display = "block";
          document.getElementById("wishlist-content").style.display = "none";

          // Update header badges
          if (typeof updateHeaderBadges === "function") {
            updateHeaderBadges();
          } else if (window.updateHeaderBadges) {
            window.updateHeaderBadges();
          }

          // Update wishlist count
          updateWishlistCount(0);
        }, wishlistItems.length * 50 + 300);
      }, 500);

      showNotification("All items moved to cart", "success");
    });
  }

  // Handle clear wishlist
  const clearWishlistBtn = document.getElementById("clear-wishlist");
  if (clearWishlistBtn) {
    clearWishlistBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to clear your entire wishlist?")) {
        // Clear localStorage
        localStorage.removeItem("wishlist");

        // Remove all items from DOM
        const wishlistItems = document.querySelectorAll(".wishlist-item");
        wishlistItems.forEach((item) => {
          item.remove();
        });

        // Show empty state
        document.getElementById("empty-wishlist").style.display = "block";
        document.getElementById("wishlist-content").style.display = "none";

        // Update header badges
        if (typeof updateHeaderBadges === "function") {
          updateHeaderBadges();
        } else {
          // If updateHeaderBadges is not defined, try to find it in window
          if (window.updateHeaderBadges) {
            window.updateHeaderBadges();
          }
        }

        // Update wishlist count
        updateWishlistCount(0);

        showNotification("Your wishlist has been cleared");
      }
    });
  }
}

/**
 * Setup share modal functionality
 */
function setupShareModal() {
  const shareWishlistBtn = document.querySelector(".share-wishlist");
  const shareModal = document.getElementById("share-modal");
  const closeModalBtn = document.querySelector(".close-modal");
  const copyLinkBtn = document.getElementById("copy-link-btn");

  if (shareWishlistBtn && shareModal) {
    // Open modal
    shareWishlistBtn.addEventListener("click", function (e) {
      e.preventDefault();
      shareModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    // Close modal
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", function () {
        shareModal.classList.remove("active");
        document.body.style.overflow = "";
      });
    }

    // Close when clicking outside modal content
    shareModal.addEventListener("click", function (e) {
      if (e.target === shareModal) {
        shareModal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Copy link functionality
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener("click", function () {
        const linkInput = document.getElementById("wishlist-link");

        if (linkInput) {
          linkInput.select();
          document.execCommand("copy");

          // Change button text temporarily
          const originalText = this.textContent;
          this.textContent = "Copied!";

          setTimeout(() => {
            this.textContent = originalText;
          }, 2000);
        }
      });
    }

    // Handle share options
    const shareOptions = document.querySelectorAll(".share-option");
    shareOptions.forEach((option) => {
      option.addEventListener("click", function (e) {
        e.preventDefault();

        const platform = this.getAttribute("data-platform");
        const wishlistUrl = document.getElementById("wishlist-link").value;
        let shareUrl;

        switch (platform) {
          case "whatsapp":
            shareUrl = `https://api.whatsapp.com/send?text=Check out my wishlist on Shilp Banavat: ${wishlistUrl}`;
            break;
          case "facebook":
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              wishlistUrl
            )}`;
            break;
          case "twitter":
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
              wishlistUrl
            )}&text=Check out my wishlist on Shilp Banavat`;
            break;
          case "email":
            shareUrl = `mailto:?subject=My Shilp Banavat Wishlist&body=Check out my wishlist on Shilp Banavat: ${wishlistUrl}`;
            break;
        }

        // Open share dialog
        if (shareUrl) {
          window.open(shareUrl, "_blank");
        }
      });
    });
  }
}

/**
 * Initialize color options for products with color variants
 */
function initColorOptions() {
  const colorOptions = document.querySelectorAll(".color-option");

  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove active class from siblings
      const siblings = this.parentNode.querySelectorAll(".color-option");
      siblings.forEach((sib) => sib.classList.remove("active"));

      // Add active class to selected
      this.classList.add("active");
    });
  });

  // Set first color as active by default
  const colorOptionGroups = document.querySelectorAll(".color-options");
  colorOptionGroups.forEach((group) => {
    const firstColor = group.querySelector(".color-option");
    if (firstColor) {
      firstColor.classList.add("active");
    }
  });
}

/**
 * Update wishlist count display
 */
function updateWishlistCount(count) {
  const countElement = document.getElementById("wishlist-count");
  if (countElement) {
    countElement.textContent = count === 1 ? "1 Item" : `${count} Items`;
  }
}

/**
 * Add item to cart (localStorage implementation)
 */
function addToCart(
  productId,
  name,
  price,
  variant = "",
  image = "",
  category = "Handicrafts"
) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Parse price to ensure it's a number
  const parsedPrice = parsePrice(price);

  // Create cart item
  const cartItem = {
    id: productId,
    name: name,
    price: parsedPrice,
    displayPrice: price,
    variant: variant,
    image: image,
    category: category,
    quantity: 1,
  };

  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(
    (item) => item.id === productId && item.variant === variant
  );

  if (existingItemIndex > -1) {
    // Item exists, increase quantity
    cart[existingItemIndex].quantity++;
  } else {
    // New item, add to cart
    cart.push(cartItem);
  }

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update header badges
  if (typeof updateHeaderBadges === "function") {
    updateHeaderBadges();
  } else {
    // If updateHeaderBadges is not defined, try to find it in window
    if (window.updateHeaderBadges) {
      window.updateHeaderBadges();
    }
  }
}

/**
 * Parse price string to number
 */
function parsePrice(priceString) {
  if (typeof priceString === "number") return priceString;

  // Remove currency symbols and commas, then parse as float
  const price = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
  return isNaN(price) ? 0 : price;
}

/**
 * Remove item from wishlist (localStorage implementation)
 */
function removeFromWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Remove item from wishlist
  wishlist = wishlist.filter((item) => {
    if (typeof item === "string") {
      return item !== productId;
    } else {
      return item.id !== productId;
    }
  });

  // Save to localStorage
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  // Update header badges
  if (typeof updateHeaderBadges === "function") {
    updateHeaderBadges();
  } else {
    // If updateHeaderBadges is not defined, try to find it in window
    if (window.updateHeaderBadges) {
      window.updateHeaderBadges();
    }
  }
}

/**
 * Show notification to the user
 */
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
