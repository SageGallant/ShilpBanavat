// Shilp Banavat - Premium Handicrafts E-commerce
// Cart Page JavaScript

document.addEventListener("DOMContentLoaded", function () {
  initCart();
  initQuantitySelectors();
  initRemoveItems();
  initMoveToWishlist();
  initCouponCode();
  initMobileCart();
});

// Initialize cart based on localStorage data
function initCart() {
  // Check if cart has items in localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    // Show empty cart state
    document.getElementById("empty-cart").style.display = "block";
    document.getElementById("cart-content").style.display = "none";

    // Hide mobile cart button
    const viewCartBtn = document.getElementById("view-cart-btn");
    if (viewCartBtn) {
      viewCartBtn.style.display = "none";
    }
  } else {
    // Show cart content
    document.getElementById("empty-cart").style.display = "none";
    document.getElementById("cart-content").style.display = "block";

    // Update cart count on mobile button
    updateCartCount(cart.length);

    // Dynamically populate cart items from localStorage
    populateCartItems(cart);
  }

  // Set data-label attributes for mobile view
  setMobileDataLabels();

  // Calculate and update order summary
  updateOrderSummary();
}

// Populate cart items from localStorage
function populateCartItems(cart) {
  const cartItemsContainer = document.querySelector(".cart-items");

  // Keep the header but remove existing items
  const cartHeader = cartItemsContainer.querySelector(".cart-header");
  cartItemsContainer.innerHTML = "";
  cartItemsContainer.appendChild(cartHeader);

  // Add each cart item
  cart.forEach((item) => {
    // Parse price
    const price =
      typeof item.price === "number"
        ? item.price
        : parseFloat(
            String(item.price || item.displayPrice || "0").replace(
              /[^0-9.-]+/g,
              ""
            )
          );

    const formattedPrice = formatCurrency(price);
    const quantity = item.quantity || 1;
    const total = price * quantity;
    const formattedTotal = formatCurrency(total);

    // Create cart item element
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.setAttribute("data-product-id", item.id);

    cartItem.innerHTML = `
      <div class="cart-item-product">
        <div class="cart-item-image">
          <img src="${item.image || "https://via.placeholder.com/80"}" alt="${
      item.name
    }">
        </div>
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p class="item-category">${item.category || "Handicrafts"}</p>
          <p class="item-variant">${item.color ? `Color: ${item.color}` : ""} ${
      item.size ? `| Size: ${item.size}` : ""
    }</p>
          <div class="item-actions">
            <button class="move-to-wishlist">Save for Later</button>
            <button class="remove-item">Remove</button>
          </div>
        </div>
      </div>
      <div class="cart-item-price">${formattedPrice}</div>
      <div class="cart-item-quantity">
        <div class="quantity-selector">
          <button class="decrement">-</button>
          <input type="number" class="qty-input" value="${quantity}" min="1" max="10">
          <button class="increment">+</button>
        </div>
      </div>
      <div class="cart-item-total">${formattedTotal}</div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  // Reinitialize event handlers for the new elements
  initQuantitySelectors();
  initRemoveItems();
  initMoveToWishlist();
}

// Initialize quantity selectors
function initQuantitySelectors() {
  const incrementBtns = document.querySelectorAll(".increment");
  const decrementBtns = document.querySelectorAll(".decrement");
  const qtyInputs = document.querySelectorAll(".qty-input");

  // Handle increment button clicks
  incrementBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const input = this.parentNode.querySelector(".qty-input");
      const currentValue = parseInt(input.value);
      const maxValue = parseInt(input.getAttribute("max")) || 10;

      if (currentValue < maxValue) {
        input.value = currentValue + 1;
        updateItemTotal(this.closest(".cart-item"));
        updateOrderSummary();
        updateCartInStorage(this.closest(".cart-item"));
      }
    });
  });

  // Handle decrement button clicks
  decrementBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const input = this.parentNode.querySelector(".qty-input");
      const currentValue = parseInt(input.value);

      if (currentValue > 1) {
        input.value = currentValue - 1;
        updateItemTotal(this.closest(".cart-item"));
        updateOrderSummary();
        updateCartInStorage(this.closest(".cart-item"));
      }
    });
  });

  // Handle manual input changes
  qtyInputs.forEach((input) => {
    input.addEventListener("change", function () {
      let value = parseInt(this.value);
      const minValue = parseInt(this.getAttribute("min")) || 1;
      const maxValue = parseInt(this.getAttribute("max")) || 10;

      // Validate input
      if (isNaN(value) || value < minValue) {
        value = minValue;
      } else if (value > maxValue) {
        value = maxValue;
      }

      this.value = value;
      updateItemTotal(this.closest(".cart-item"));
      updateOrderSummary();
      updateCartInStorage(this.closest(".cart-item"));
    });
  });
}

// Initialize remove item functionality
function initRemoveItems() {
  const removeButtons = document.querySelectorAll(".remove-item");

  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const cartItem = this.closest(".cart-item");
      const productId = cartItem.getAttribute("data-product-id");

      // Animate removal
      cartItem.style.opacity = "0";
      cartItem.style.height = cartItem.offsetHeight + "px";
      setTimeout(() => {
        cartItem.style.height = "0";
        cartItem.style.padding = "0";
        cartItem.style.margin = "0";
        cartItem.style.overflow = "hidden";

        setTimeout(() => {
          cartItem.remove();

          // Update cart in localStorage
          removeFromCart(productId);

          // Update order summary
          updateOrderSummary();

          // If cart is empty, show empty state
          const remainingItems = document.querySelectorAll(".cart-item").length;
          if (remainingItems === 0) {
            document.getElementById("empty-cart").style.display = "block";
            document.getElementById("cart-content").style.display = "none";
          }

          showNotification("Item removed from cart");
        }, 300);
      }, 300);
    });
  });
}

// Initialize move to wishlist functionality
function initMoveToWishlist() {
  const moveToWishlistButtons = document.querySelectorAll(".move-to-wishlist");

  moveToWishlistButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const cartItem = this.closest(".cart-item");
      const productId = cartItem.getAttribute("data-product-id");
      const productName = cartItem.querySelector("h3").textContent;
      const productPrice =
        cartItem.querySelector(".cart-item-price").textContent;

      // Add to wishlist
      addToWishlist(productId, productName, productPrice);

      // Remove from cart (reuse existing function)
      cartItem.querySelector(".remove-item").click();

      showNotification("Item moved to wishlist");
    });
  });
}

// Initialize coupon code functionality
function initCouponCode() {
  const applyButton = document.getElementById("apply-coupon");

  if (applyButton) {
    applyButton.addEventListener("click", function () {
      const couponInput = document.getElementById("coupon-code");
      const couponCode = couponInput.value.trim();

      if (couponCode === "") {
        showNotification("Please enter a promo code", "error");
        return;
      }

      // In a real application, this would validate the coupon with a server
      // For demo purposes, we'll accept any code and apply a 10% discount

      // Get current subtotal
      const subtotalText = document.getElementById("subtotal").textContent;
      const subtotal = parseFloat(subtotalText.replace(/[^0-9.-]+/g, ""));

      // Calculate discount (10%)
      const discount = subtotal * 0.1;

      // Update order summary
      updateOrderSummary(discount, couponCode);

      // Show success message
      showNotification("Promo code applied successfully");

      // Disable input and button
      couponInput.disabled = true;
      applyButton.disabled = true;
      applyButton.textContent = "Applied";
    });
  }
}

// Initialize mobile cart functionality
function initMobileCart() {
  const viewCartBtn = document.getElementById("view-cart-btn");
  const cartSidebar = document.getElementById("cart-sidebar");
  const closeSidebarBtn = document.getElementById("close-cart-sidebar");

  if (viewCartBtn && cartSidebar) {
    // Show cart sidebar when mobile button is clicked
    viewCartBtn.addEventListener("click", function () {
      cartSidebar.classList.add("active");

      // Add overlay
      const overlay = document.createElement("div");
      overlay.className = "cart-sidebar-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.right = "0";
      overlay.style.bottom = "0";
      overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
      overlay.style.zIndex = "999";
      document.body.appendChild(overlay);

      // Prevent body scrolling
      document.body.style.overflow = "hidden";

      // Clone cart items for sidebar
      populateMobileCart();

      // Handle overlay click
      overlay.addEventListener("click", function () {
        closeSidebar();
      });
    });

    // Close cart sidebar when close button is clicked
    if (closeSidebarBtn) {
      closeSidebarBtn.addEventListener("click", closeSidebar);
    }
  }

  function closeSidebar() {
    cartSidebar.classList.remove("active");

    // Remove overlay
    const overlay = document.querySelector(".cart-sidebar-overlay");
    if (overlay) {
      overlay.remove();
    }

    // Restore body scrolling
    document.body.style.overflow = "";
  }

  function populateMobileCart() {
    const sidebarItemsContainer = document.querySelector(".cart-sidebar-items");
    const cartItems = document.querySelectorAll(".cart-item");

    // Clear previous items
    if (sidebarItemsContainer) {
      sidebarItemsContainer.innerHTML = "";

      // Clone each cart item for sidebar
      cartItems.forEach((item) => {
        const productId = item.getAttribute("data-product-id");
        const productName = item.querySelector("h3").textContent;
        const productImage = item.querySelector(".cart-item-image img").src;
        const productPrice = item.querySelector(".cart-item-price").textContent;
        const productQuantity = item.querySelector(".qty-input").value;

        // Create simplified item for sidebar
        const sidebarItem = document.createElement("div");
        sidebarItem.className = "cart-sidebar-item";
        sidebarItem.setAttribute("data-product-id", productId);
        sidebarItem.innerHTML = `
                    <div class="cart-sidebar-item-image">
                        <img src="${productImage}" alt="${productName}">
                    </div>
                    <div class="cart-sidebar-item-details">
                        <h3>${productName}</h3>
                        <div class="cart-sidebar-item-price">
                            <span>${productPrice}</span>
                            <span class="cart-sidebar-item-quantity">Qty: ${productQuantity}</span>
                        </div>
                    </div>
                `;

        sidebarItemsContainer.appendChild(sidebarItem);
      });
    }

    // Update sidebar summary
    updateSidebarSummary();
  }

  function updateSidebarSummary() {
    // Copy values from main summary to sidebar summary
    const subtotalElement = document.getElementById("subtotal");
    const shippingElement = document.getElementById("shipping");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("cart-total");

    if (subtotalElement) {
      document.querySelector(".sidebar-subtotal").textContent =
        subtotalElement.textContent;
    }

    if (shippingElement) {
      document.querySelector(".sidebar-shipping").textContent =
        shippingElement.textContent;
    }

    if (taxElement) {
      document.querySelector(".sidebar-tax").textContent =
        taxElement.textContent;
    }

    if (totalElement) {
      document.querySelector(".sidebar-total").textContent =
        totalElement.textContent;
    }
  }
}

// Update cart count display for mobile button
function updateCartCount(count) {
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = count;
  }
}

// Set data-label attributes for mobile view
function setMobileDataLabels() {
  const priceElements = document.querySelectorAll(".cart-item-price");
  const quantityElements = document.querySelectorAll(".cart-item-quantity");
  const totalElements = document.querySelectorAll(".cart-item-total");

  priceElements.forEach((el) => el.setAttribute("data-label", "Price:"));
  quantityElements.forEach((el) => el.setAttribute("data-label", "Quantity:"));
  totalElements.forEach((el) => el.setAttribute("data-label", "Total:"));
}

// Update item total based on quantity
function updateItemTotal(cartItem) {
  if (!cartItem) return;

  const priceElement = cartItem.querySelector(".cart-item-price");
  const quantityElement = cartItem.querySelector(".qty-input");
  const totalElement = cartItem.querySelector(".cart-item-total");

  if (priceElement && quantityElement && totalElement) {
    // Get price (remove currency symbol and commas)
    const price = parseFloat(
      priceElement.textContent.replace(/[^0-9.-]+/g, "")
    );
    const quantity = parseInt(quantityElement.value) || 1;

    // Calculate total
    const total = price * quantity;

    // Format with currency symbol and commas
    totalElement.textContent = formatCurrency(total);
  }
}

// Update order summary
function updateOrderSummary(discount = 0, couponCode = "") {
  // Calculate subtotal
  let subtotal = 0;
  const cartItems = document.querySelectorAll(".cart-item");

  cartItems.forEach((item) => {
    const totalElement = item.querySelector(".cart-item-total");
    if (totalElement) {
      const itemTotal = parseFloat(
        totalElement.textContent.replace(/[^0-9.-]+/g, "")
      );
      subtotal += itemTotal;
    }
  });

  // Calculate shipping (free for demo)
  const shipping = 0;

  // Calculate tax (10% for demo)
  const tax = (subtotal - discount) * 0.1;

  // Calculate total
  const total = subtotal - discount + shipping + tax;

  // Update summary elements
  document.getElementById("subtotal").textContent = formatCurrency(subtotal);
  document.getElementById("shipping").textContent = formatCurrency(shipping);
  document.getElementById("tax").textContent = formatCurrency(tax);
  document.getElementById("cart-total").textContent = formatCurrency(total);

  // Add discount line if applicable
  if (discount > 0) {
    // Check if discount line already exists
    let discountLine = document.querySelector(".discount-line");

    if (!discountLine) {
      // Create discount line
      const summaryDetails = document.querySelector(".summary-details");
      discountLine = document.createElement("div");
      discountLine.className = "summary-line discount-line";
      discountLine.innerHTML = `
                <span>Discount (${couponCode})</span>
                <span id="discount">-${formatCurrency(discount)}</span>
            `;

      // Insert before tax
      const taxLine = document.querySelector(".summary-line:nth-child(3)");
      summaryDetails.insertBefore(discountLine, taxLine);
    } else {
      // Update existing discount line
      const discountElement = document.getElementById("discount");
      discountElement.textContent = `-${formatCurrency(discount)}`;
    }
  }
}

// Update cart item in localStorage
function updateCartInStorage(cartItem) {
  if (!cartItem) return;

  const productId = cartItem.getAttribute("data-product-id");
  const quantity = parseInt(cartItem.querySelector(".qty-input").value);

  // Get cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Find item in cart
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex > -1) {
    // Update quantity
    cart[itemIndex].quantity = quantity;

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count on mobile button
    updateCartCount(cart.length);

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
}

// Remove item from cart in localStorage
function removeFromCart(productId) {
  // Get cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Remove item from cart
  cart = cart.filter((item) => item.id !== productId);

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update cart count on mobile button
  updateCartCount(cart.length);

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

// Add item to wishlist (localStorage implementation)
function addToWishlist(productId, name, price) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Check if item already exists in wishlist
  const existingItem = wishlist.find((item) => item.id === productId);

  if (!existingItem) {
    // Create wishlist item
    const wishlistItem = {
      id: productId,
      name: name,
      price: price,
    };

    // Add to wishlist
    wishlist.push(wishlistItem);

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
}

// Format currency
function formatCurrency(amount) {
  return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}
