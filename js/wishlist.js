// Shilp Banavat - Premium Handicrafts E-commerce
// Wishlist Page JavaScript

document.addEventListener("DOMContentLoaded", function () {
  initWishlist();
  setupShareModal();
  initColorOptions();
});

function initWishlist() {
  // Get wishlist data from localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Clear existing items in wishlist grid
  const wishlistGrid = document.querySelector(".wishlist-grid");
  if (!wishlistGrid) return;

  wishlistGrid.innerHTML = "";

  // Check if wishlist has items
  updateWishlistCount(wishlist.length);

  if (wishlist.length === 0) {
    document.getElementById("empty-wishlist").style.display = "block";
    document.getElementById("wishlist-content").style.display = "none";
  } else {
    document.getElementById("empty-wishlist").style.display = "none";
    document.getElementById("wishlist-content").style.display = "block";

    // Populate wishlist items from localStorage
    wishlist.forEach((item) => {
      const wishlistItem = createWishlistItemElement(item);
      wishlistGrid.appendChild(wishlistItem);
    });

    // Reinitialize event handlers for the new elements
    setupWishlistItemEventHandlers();
  }

  // Initialize the wishlist action buttons
  initWishlistActions();
}

// Create a wishlist item element from data
function createWishlistItemElement(item) {
  const wishlistItem = document.createElement("div");
  wishlistItem.className = "wishlist-item";
  wishlistItem.setAttribute("data-product-id", item.id);

  // Format image URL or use placeholder
  const imageUrl = item.image || "../images/placeholder-product1.jpg";
  const price = item.price || "$0.00";

  wishlistItem.innerHTML = `
    <div class="wishlist-item-header">
      <button class="remove-wishlist-item"><i class="fas fa-times"></i></button>
    </div>
    <div class="wishlist-item-image">
      <img src="${imageUrl}" alt="${item.name}">
    </div>
    <div class="wishlist-item-details">
      <h3>${item.name}</h3>
      <p class="item-category">${item.category || "Handicrafts"}</p>
      <p class="item-price">${price}</p>
      <div class="item-actions">
        <button class="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  `;

  return wishlistItem;
}

// Setup event handlers for wishlist items
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

        // Update count
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
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

      // Add to cart
      addToCart(productId, productName, productPrice, "", productImage);

      // Show notification
      showNotification(`${productName} added to your cart`);
    });
  });

  // Initialize color options
  initColorOptions();
}

// Initialize wishlist action buttons
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

      wishlistItems.forEach((item) => {
        const productId = item.getAttribute("data-product-id");
        const productName = item.querySelector("h3").textContent;
        const productPrice = item.querySelector(".item-price").textContent;
        const productImage = item.querySelector("img").src;

        // Add to cart
        addToCart(productId, productName, productPrice, "", productImage);
      });

      showNotification("All items added to your cart");
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

// Update wishlist count display
function updateWishlistCount(count) {
  const countElement = document.getElementById("wishlist-count");
  if (countElement) {
    countElement.textContent = count === 1 ? "1 Item" : `${count} Items`;
  }
}

// Add item to cart (localStorage implementation)
function addToCart(productId, name, price, variant, image) {
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

// Parse price string to number
function parsePrice(priceString) {
  if (typeof priceString === "number") return priceString;

  // Remove currency symbols and commas, then parse as float
  const price = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
  return isNaN(price) ? 0 : price;
}

// Remove item from wishlist (localStorage implementation)
function removeFromWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Remove item from wishlist
  wishlist = wishlist.filter((item) => item.id !== productId);

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
