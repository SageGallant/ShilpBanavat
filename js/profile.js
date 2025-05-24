/*
Shilp Banavat - Premium Handicrafts E-commerce
Profile Page JavaScript
*/

document.addEventListener("DOMContentLoaded", function () {
  // Initialize profile
  initProfile();

  // Setup navigation
  setupProfileNavigation();

  // Setup forms
  setupLoginForm();
  setupRegisterForm();
  setupAccountForm();

  // Setup password related functionality
  setupPasswordVisibility();
  setupPasswordStrength();

  // Setup address functionality
  setupAddressActions();

  // Setup logout
  setupLogout();
});

/**
 * Initialize profile page
 */
function initProfile() {
  // Check if user is logged in
  const isLoggedIn = checkLogin();

  // Update UI based on login status
  updateUIForLoginStatus(isLoggedIn);

  // Load user data if logged in
  if (isLoggedIn) {
    loadUserData();
    loadWishlistItems();
    loadOrderHistory();
    loadAddresses();
    loadNotifications();
  }

  // Update cart and wishlist count
  updateCartCount();
  updateWishlistCount();
}

/**
 * Check if user is logged in
 * @returns {boolean} Login status
 */
function checkLogin() {
  const userData = JSON.parse(localStorage.getItem("user"));
  return !!userData;
}

/**
 * Update UI elements based on login status
 */
function updateUIForLoginStatus(isLoggedIn) {
  const loggedInContent = document.getElementById("logged-in");
  const notLoggedInContent = document.getElementById("not-logged-in");

  if (isLoggedIn) {
    loggedInContent.style.display = "block";
    notLoggedInContent.style.display = "none";
  } else {
    loggedInContent.style.display = "none";
    notLoggedInContent.style.display = "block";
  }
}

/**
 * Load user data and populate profile
 */
function loadUserData() {
  const userData = JSON.parse(localStorage.getItem("user"));

  if (userData) {
    // Update profile sidebar
    document.getElementById("user-display-name").textContent =
      userData.displayName || `${userData.firstName} ${userData.lastName}`;
    document.getElementById("user-email").textContent = userData.email;

    // If user has a custom avatar, load it
    if (userData.avatar) {
      document.getElementById("user-avatar").src = userData.avatar;
    }

    // Update account form
    document.getElementById("user-first-name").value = userData.firstName || "";
    document.getElementById("user-last-name").value = userData.lastName || "";
    document.getElementById("user-display-name-input").value =
      userData.displayName || "";
    document.getElementById("user-email-input").value = userData.email || "";
    document.getElementById("user-phone").value = userData.phone || "";

    // Update preferences
    document.getElementById("newsletter").checked =
      userData.preferences?.newsletter || false;
    document.getElementById("promotional-emails").checked =
      userData.preferences?.promotionalEmails || false;
    document.getElementById("order-updates").checked =
      userData.preferences?.orderUpdates || false;
  }
}

/**
 * Set up profile navigation
 */
function setupProfileNavigation() {
  const navLinks = document.querySelectorAll(".profile-nav a[data-section]");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Get target section
      const targetSection = this.getAttribute("data-section");

      // Update active nav link
      navLinks.forEach((navLink) => navLink.classList.remove("active"));
      this.classList.add("active");

      // Show target section
      const sections = document.querySelectorAll(".profile-section-content");
      sections.forEach((section) => section.classList.remove("active"));
      document.getElementById(targetSection).classList.add("active");
    });
  });
}

/**
 * Set up login form
 */
function setupLoginForm() {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      const rememberMe = document.getElementById("remember-me").checked;

      // Simple validation
      if (!email || !password) {
        showToast("Error", "Please fill all required fields", "error");
        return;
      }

      // For demo purposes, we'll just simulate a login
      // In a real app, you would send these credentials to a server
      simulateLogin(email, password, rememberMe);
    });
  }
}

/**
 * Simulate login process
 */
function simulateLogin(email, password, rememberMe) {
  // For demo, we'll accept any email/password with basic validation
  if (isValidEmail(email) && password.length >= 6) {
    // Create a user object (in a real app, this would come from a server)
    const user = {
      email: email,
      firstName: "John",
      lastName: "Doe",
      displayName: "John Doe",
      phone: "+91 9876543210",
      preferences: {
        newsletter: true,
        promotionalEmails: true,
        orderUpdates: true,
      },
    };

    // Store user data in localStorage (or sessionStorage if not "remember me")
    localStorage.setItem("user", JSON.stringify(user));

    // Update UI
    updateUIForLoginStatus(true);
    loadUserData();

    // Show success message
    showToast("Success", "You have successfully logged in", "success");
  } else {
    showToast("Login Failed", "Invalid email or password", "error");
  }
}

/**
 * Set up register form
 */
function setupRegisterForm() {
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("register-name").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;
      const agreeTerms = document.getElementById("agree-terms").checked;

      // Simple validation
      if (!name || !email || !password) {
        showToast("Error", "Please fill all required fields", "error");
        return;
      }

      if (!agreeTerms) {
        showToast("Error", "You must agree to the Terms & Conditions", "error");
        return;
      }

      // For demo purposes, we'll just simulate registration
      // In a real app, you would send this data to a server
      simulateRegistration(name, email, password);
    });
  }
}

/**
 * Simulate registration process
 */
function simulateRegistration(name, email, password) {
  // For demo, we'll accept any valid input
  if (isValidEmail(email) && password.length >= 6) {
    // Split name into first and last name
    const nameParts = name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    // Create a user object (in a real app, this would be stored in a database)
    const user = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      displayName: name,
      preferences: {
        newsletter: true,
        promotionalEmails: true,
        orderUpdates: true,
      },
    };

    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(user));

    // Update UI
    updateUIForLoginStatus(true);
    loadUserData();

    // Show success message
    showToast(
      "Success",
      "Your account has been created successfully",
      "success"
    );
  } else {
    showToast(
      "Registration Failed",
      "Please check your information and try again",
      "error"
    );
  }
}

/**
 * Set up account settings form
 */
function setupAccountForm() {
  const accountForm = document.getElementById("account-form");

  if (accountForm) {
    accountForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const firstName = document.getElementById("user-first-name").value;
      const lastName = document.getElementById("user-last-name").value;
      const displayName = document.getElementById(
        "user-display-name-input"
      ).value;
      const phone = document.getElementById("user-phone").value;

      // Get password fields (if filled)
      const currentPassword = document.getElementById("current-password").value;
      const newPassword = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      // Get preference checkboxes
      const newsletter = document.getElementById("newsletter").checked;
      const promotionalEmails =
        document.getElementById("promotional-emails").checked;
      const orderUpdates = document.getElementById("order-updates").checked;

      // Simple validation
      if (!firstName || !lastName) {
        showToast("Error", "Please fill all required fields", "error");
        return;
      }

      // If trying to change password, validate
      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
          showToast(
            "Error",
            "Please fill all password fields to change your password",
            "error"
          );
          return;
        }

        if (newPassword !== confirmPassword) {
          showToast("Error", "New passwords do not match", "error");
          return;
        }

        if (newPassword.length < 6) {
          showToast(
            "Error",
            "New password must be at least 6 characters",
            "error"
          );
          return;
        }

        // In a real app, you would verify the current password against stored value
      }

      // Update user data
      updateUserProfile(firstName, lastName, displayName, phone, newPassword, {
        newsletter,
        promotionalEmails,
        orderUpdates,
      });
    });

    // Setup discard changes button
    const discardChangesBtn = document.getElementById("discard-changes");
    if (discardChangesBtn) {
      discardChangesBtn.addEventListener("click", function () {
        loadUserData(); // Reload original data
        showToast("Info", "Changes discarded", "warning");
      });
    }
  }
}

/**
 * Update user profile
 */
function updateUserProfile(
  firstName,
  lastName,
  displayName,
  phone,
  newPassword,
  preferences
) {
  // Get current user data
  const userData = JSON.parse(localStorage.getItem("user"));

  if (userData) {
    // Update fields
    userData.firstName = firstName;
    userData.lastName = lastName;
    userData.displayName = displayName || `${firstName} ${lastName}`;
    userData.phone = phone;
    userData.preferences = preferences;

    // Update password if provided
    if (newPassword) {
      // In a real app, you would hash this password
      userData.passwordChanged = true;
    }

    // Save updated data
    localStorage.setItem("user", JSON.stringify(userData));

    // Update sidebar and other UI elements
    document.getElementById("user-display-name").textContent =
      userData.displayName;

    // Show success message
    showToast(
      "Success",
      "Your profile has been updated successfully",
      "success"
    );
  }
}

/**
 * Setup password visibility toggle
 */
function setupPasswordVisibility() {
  const toggleButtons = document.querySelectorAll(".toggle-password");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.previousElementSibling;

      // Toggle input type
      if (input.type === "password") {
        input.type = "text";
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
      } else {
        input.type = "password";
        this.innerHTML = '<i class="fas fa-eye"></i>';
      }
    });
  });
}

/**
 * Setup password strength meter
 */
function setupPasswordStrength() {
  const passwordInput = document.getElementById("new-password");

  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      const password = this.value;
      const strength = calculatePasswordStrength(password);
      updatePasswordStrengthIndicator(strength);
    });
  }
}

/**
 * Calculate password strength (0-3)
 * @returns {number} Strength level
 */
function calculatePasswordStrength(password) {
  if (!password) return 0;

  let strength = 0;

  // Length check
  if (password.length >= 8) strength += 1;

  // Character variety check
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password);

  if (
    (hasUppercase && hasLowercase) ||
    (hasUppercase && hasDigits) ||
    (hasLowercase && hasDigits)
  )
    strength += 1;
  if (hasSpecialChars) strength += 1;

  return strength;
}

/**
 * Update password strength indicator
 */
function updatePasswordStrengthIndicator(strength) {
  const segments = document.querySelectorAll(".strength-segment");
  const strengthText = document.querySelector(".strength-text span");

  // Reset classes
  segments.forEach((segment) => {
    segment.className = "strength-segment";
  });

  // Update based on strength
  if (strength >= 1) {
    segments[0].classList.add("weak");
  }

  if (strength >= 2) {
    segments[0].classList.add("medium");
    segments[1].classList.add("medium");
  }

  if (strength >= 3) {
    segments[0].classList.add("strong");
    segments[1].classList.add("strong");
    segments[2].classList.add("strong");
  }

  if (strength >= 4) {
    segments[0].classList.add("strong");
    segments[1].classList.add("strong");
    segments[2].classList.add("strong");
    segments[3].classList.add("strong");
  }

  // Update text
  if (strength === 0) strengthText.textContent = "Weak";
  else if (strength === 1) strengthText.textContent = "Weak";
  else if (strength === 2) strengthText.textContent = "Medium";
  else if (strength === 3) strengthText.textContent = "Strong";
  else strengthText.textContent = "Very Strong";
}

/**
 * Set up address-related actions
 */
function setupAddressActions() {
  // Add address button
  const addAddressBtn = document.getElementById("add-address-btn");
  if (addAddressBtn) {
    addAddressBtn.addEventListener("click", function () {
      openAddressModal();
    });
  }

  // Close modal button
  const closeModalBtn = document.getElementById("close-address-modal");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
      closeAddressModal();
    });
  }

  // Cancel button in modal
  const cancelAddressBtn = document.getElementById("cancel-address");
  if (cancelAddressBtn) {
    cancelAddressBtn.addEventListener("click", function () {
      closeAddressModal();
    });
  }

  // Address form submission
  const addressForm = document.getElementById("address-form");
  if (addressForm) {
    addressForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveAddress();
    });
  }
}

/**
 * Open address modal for adding new address
 */
function openAddressModal(addressData = null) {
  const modal = document.getElementById("address-modal");
  const modalTitle = document.getElementById("address-modal-title");

  // Clear form
  document.getElementById("address-form").reset();

  // Set mode (add or edit)
  if (addressData) {
    modalTitle.textContent = "Edit Address";
    document.getElementById("address-id").value = addressData.id;
    document.getElementById("address-name").value = addressData.name;
    document.getElementById("address-first-name").value = addressData.firstName;
    document.getElementById("address-last-name").value = addressData.lastName;
    document.getElementById("address-line1").value = addressData.line1;
    document.getElementById("address-line2").value = addressData.line2 || "";
    document.getElementById("address-city").value = addressData.city;
    document.getElementById("address-state").value = addressData.state;
    document.getElementById("address-zip").value = addressData.zip;
    document.getElementById("address-country").value = addressData.country;
    document.getElementById("address-phone").value = addressData.phone;
    document.getElementById("default-address").checked = addressData.isDefault;
  } else {
    modalTitle.textContent = "Add New Address";
    document.getElementById("address-id").value = "";

    // Pre-fill user data if available
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      document.getElementById("address-first-name").value =
        userData.firstName || "";
      document.getElementById("address-last-name").value =
        userData.lastName || "";
      document.getElementById("address-phone").value = userData.phone || "";
    }
  }

  // Show modal
  modal.classList.add("active");
}

/**
 * Close address modal
 */
function closeAddressModal() {
  const modal = document.getElementById("address-modal");
  modal.classList.remove("active");
}

/**
 * Save address from form
 */
function saveAddress() {
  // Get form values
  const addressId = document.getElementById("address-id").value;
  const name = document.getElementById("address-name").value;
  const firstName = document.getElementById("address-first-name").value;
  const lastName = document.getElementById("address-last-name").value;
  const line1 = document.getElementById("address-line1").value;
  const line2 = document.getElementById("address-line2").value;
  const city = document.getElementById("address-city").value;
  const state = document.getElementById("address-state").value;
  const zip = document.getElementById("address-zip").value;
  const country = document.getElementById("address-country").value;
  const phone = document.getElementById("address-phone").value;
  const isDefault = document.getElementById("default-address").checked;

  // Simple validation
  if (
    !name ||
    !firstName ||
    !lastName ||
    !line1 ||
    !city ||
    !state ||
    !zip ||
    !country ||
    !phone
  ) {
    showToast("Error", "Please fill all required fields", "error");
    return;
  }

  // Create address object
  const address = {
    id: addressId || Date.now().toString(), // Generate ID if new
    name,
    firstName,
    lastName,
    line1,
    line2,
    city,
    state,
    zip,
    country,
    phone,
    isDefault,
  };

  // Get existing addresses
  let addresses = JSON.parse(localStorage.getItem("addresses")) || [];

  // If setting as default, unset other defaults
  if (isDefault) {
    addresses = addresses.map((addr) => ({
      ...addr,
      isDefault: false,
    }));
  }

  // Check if editing or adding
  if (addressId) {
    // Update existing address
    addresses = addresses.map((addr) =>
      addr.id === addressId ? address : addr
    );
  } else {
    // Add new address
    addresses.push(address);
  }

  // Save to localStorage
  localStorage.setItem("addresses", JSON.stringify(addresses));

  // Close modal
  closeAddressModal();

  // Reload addresses
  loadAddresses();

  // Show success message
  showToast(
    "Success",
    `Address ${addressId ? "updated" : "added"} successfully`,
    "success"
  );
}

/**
 * Load saved addresses
 */
function loadAddresses() {
  const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
  const addressesList = document.getElementById("addresses-list");
  const noAddresses = document.getElementById("no-addresses");

  if (addresses.length > 0) {
    addressesList.style.display = "grid";
    noAddresses.style.display = "none";

    // Clear current list
    addressesList.innerHTML = "";

    // Add addresses
    addresses.forEach((address) => {
      const addressCard = document.createElement("div");
      addressCard.className = `address-card${
        address.isDefault ? " default" : ""
      }`;

      let addressHtml = `
                <h3 class="address-name">${address.name}</h3>
                ${
                  address.isDefault
                    ? '<span class="default-badge">Default</span>'
                    : ""
                }
                <div class="address-details">
                    <p>${address.firstName} ${address.lastName}</p>
                    <p>${address.line1}</p>
                    ${address.line2 ? `<p>${address.line2}</p>` : ""}
                    <p>${address.city}, ${address.state} ${address.zip}</p>
                    <p>${address.country}</p>
                    <p>Phone: ${address.phone}</p>
                </div>
                <div class="address-actions">
                    <button class="edit-address" data-id="${
                      address.id
                    }">Edit</button>
                    <button class="delete-address" data-id="${
                      address.id
                    }">Delete</button>
                    ${
                      !address.isDefault
                        ? `<button class="set-default-address" data-id="${address.id}">Set as Default</button>`
                        : ""
                    }
                </div>
            `;

      addressCard.innerHTML = addressHtml;
      addressesList.appendChild(addressCard);
    });

    // Add event listeners to address actions
    setupAddressActionButtons();
  } else {
    addressesList.style.display = "none";
    noAddresses.style.display = "block";
  }
}

/**
 * Set up event listeners for address action buttons
 */
function setupAddressActionButtons() {
  // Edit buttons
  const editButtons = document.querySelectorAll(".edit-address");
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const addressId = this.getAttribute("data-id");
      const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
      const address = addresses.find((addr) => addr.id === addressId);

      if (address) {
        openAddressModal(address);
      }
    });
  });

  // Delete buttons
  const deleteButtons = document.querySelectorAll(".delete-address");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const addressId = this.getAttribute("data-id");
      deleteAddress(addressId);
    });
  });

  // Set as default buttons
  const defaultButtons = document.querySelectorAll(".set-default-address");
  defaultButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const addressId = this.getAttribute("data-id");
      setDefaultAddress(addressId);
    });
  });
}

/**
 * Delete an address
 */
function deleteAddress(addressId) {
  // Ask for confirmation
  if (!confirm("Are you sure you want to delete this address?")) {
    return;
  }

  // Get addresses
  let addresses = JSON.parse(localStorage.getItem("addresses")) || [];

  // Filter out the address to delete
  addresses = addresses.filter((addr) => addr.id !== addressId);

  // Save to localStorage
  localStorage.setItem("addresses", JSON.stringify(addresses));

  // Reload addresses
  loadAddresses();

  // Show success message
  showToast("Success", "Address deleted successfully", "success");
}

/**
 * Set an address as default
 */
function setDefaultAddress(addressId) {
  // Get addresses
  let addresses = JSON.parse(localStorage.getItem("addresses")) || [];

  // Update default status
  addresses = addresses.map((addr) => ({
    ...addr,
    isDefault: addr.id === addressId,
  }));

  // Save to localStorage
  localStorage.setItem("addresses", JSON.stringify(addresses));

  // Reload addresses
  loadAddresses();

  // Show success message
  showToast("Success", "Default address updated", "success");
}

/**
 * Load wishlist items
 */
function loadWishlistItems() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistItems = document.getElementById("wishlist-items");
  const noWishlist = document.getElementById("no-wishlist");

  if (wishlist.length > 0) {
    wishlistItems.style.display = "grid";
    noWishlist.style.display = "none";

    // Clear current list
    wishlistItems.innerHTML = "";

    // Add items
    wishlist.forEach((item) => {
      const wishlistItem = document.createElement("div");
      wishlistItem.className = "wishlist-item";

      wishlistItem.innerHTML = `
                <div class="wishlist-item-image">
                    <img src="${item.image}" alt="${item.name}">
                    <button class="wishlist-remove" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="wishlist-item-details">
                    <h3 class="wishlist-item-name">${item.name}</h3>
                    <div class="wishlist-item-price">$${item.price.toFixed(
                      2
                    )}</div>
                    <div class="wishlist-item-actions">
                        <button class="btn btn-primary add-to-cart" data-id="${
                          item.id
                        }">Add to Cart</button>
                    </div>
                </div>
            `;

      wishlistItems.appendChild(wishlistItem);
    });

    // Add event listeners
    setupWishlistActionButtons();
  } else {
    wishlistItems.style.display = "none";
    noWishlist.style.display = "block";
  }
}

/**
 * Set up wishlist action buttons
 */
function setupWishlistActionButtons() {
  // Remove from wishlist buttons
  const removeButtons = document.querySelectorAll(".wishlist-remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const itemId = this.getAttribute("data-id");
      removeFromWishlist(itemId);
    });
  });

  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll(
    ".wishlist-item-actions .add-to-cart"
  );
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const itemId = this.getAttribute("data-id");
      addToCartFromWishlist(itemId);
    });
  });
}

/**
 * Remove item from wishlist
 */
function removeFromWishlist(itemId) {
  // Get wishlist
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Filter out the item to remove
  wishlist = wishlist.filter((item) => item.id !== itemId);

  // Save to localStorage
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  // Reload wishlist
  loadWishlistItems();

  // Update wishlist count
  updateWishlistCount();

  // Show success message
  showToast("Success", "Item removed from wishlist", "success");
}

/**
 * Add item to cart from wishlist
 */
function addToCartFromWishlist(itemId) {
  // Get wishlist and cart
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Find item in wishlist
  const item = wishlist.find((item) => item.id === itemId);

  if (item) {
    // Check if already in cart
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === itemId
    );

    if (existingItemIndex >= 0) {
      // Increment quantity
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add to cart with quantity of 1
      cart.push({
        ...item,
        quantity: 1,
      });
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count
    updateCartCount();

    // Show success message
    showToast("Success", "Item added to cart", "success");
  }
}

/**
 * Load order history
 */
function loadOrderHistory() {
  // In a real app, this would fetch order history from server
  // For demo, we'll use mock data
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const ordersList = document.getElementById("orders-list");
  const noOrders = document.getElementById("no-orders");

  if (orders.length > 0) {
    ordersList.style.display = "block";
    noOrders.style.display = "none";

    // Clear current list
    ordersList.innerHTML = "";

    // Add orders
    orders.forEach((order) => {
      const orderItem = document.createElement("div");
      orderItem.className = "order-item";

      let orderHtml = `
                <div class="order-header">
                    <div class="order-info">
                        <p class="order-number">Order #${order.id}</p>
                        <p class="order-date">Placed on: ${new Date(
                          order.date
                        ).toLocaleDateString()}</p>
                    </div>
                    <div class="order-status">
                        <span class="status ${order.status.toLowerCase()}">${
        order.status
      }</span>
                    </div>
                </div>
                <div class="order-products">
            `;

      // Add products
      order.products.forEach((product) => {
        orderHtml += `
                    <div class="order-product">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-details">
                            <h4>${product.name}</h4>
                            <p class="product-price">$${product.price.toFixed(
                              2
                            )}</p>
                            <p class="product-variant">
                                ${
                                  product.color ? `Color: ${product.color}` : ""
                                }
                                ${product.size ? `, Size: ${product.size}` : ""}
                            </p>
                            <p class="product-quantity">Qty: ${
                              product.quantity
                            }</p>
                            <div class="product-actions">
                                <a href="#">Buy Again</a>
                                ${
                                  order.status === "Delivered"
                                    ? '<a href="#">Write Review</a>'
                                    : ""
                                }
                                ${
                                  order.status === "Shipped"
                                    ? '<a href="#">Track Package</a>'
                                    : ""
                                }
                            </div>
                        </div>
                    </div>
                `;
      });

      orderHtml += `
                </div>
                <div class="order-footer">
                    <p class="order-total">Total: $${order.total.toFixed(2)}</p>
                    <a href="#" class="btn btn-secondary">View Details</a>
                </div>
            `;

      orderItem.innerHTML = orderHtml;
      ordersList.appendChild(orderItem);
    });
  } else {
    ordersList.style.display = "none";
    noOrders.style.display = "block";
  }
}

/**
 * Load notifications
 */
function loadNotifications() {
  // In a real app, this would fetch notifications from server
  // For demo, we'll use mock data
  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  const notificationsList = document.getElementById("notifications-list");
  const noNotifications = document.getElementById("no-notifications");

  if (notifications.length > 0) {
    notificationsList.style.display = "block";
    noNotifications.style.display = "none";

    // Clear current list
    notificationsList.innerHTML = "";

    // Add notifications
    notifications.forEach((notification) => {
      const notificationItem = document.createElement("div");
      notificationItem.className = "notification-item";

      notificationItem.innerHTML = `
                <div class="notification-icon ${notification.type}">
                    <i class="${getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <h3 class="notification-title">${notification.title}</h3>
                    <p class="notification-message">${notification.message}</p>
                    <p class="notification-date">${new Date(
                      notification.date
                    ).toLocaleString()}</p>
                    ${
                      notification.actionLink
                        ? `
                        <div class="notification-action">
                            <a href="${notification.actionLink}">${notification.actionText}</a>
                        </div>
                    `
                        : ""
                    }
                </div>
            `;

      notificationsList.appendChild(notificationItem);
    });
  } else {
    notificationsList.style.display = "none";
    noNotifications.style.display = "block";
  }

  // Setup notification toggle switches
  setupNotificationToggles();
}

/**
 * Get icon class for notification type
 */
function getNotificationIcon(type) {
  switch (type) {
    case "order":
      return "fas fa-box";
    case "promo":
      return "fas fa-tag";
    case "system":
      return "fas fa-cog";
    default:
      return "fas fa-bell";
  }
}

/**
 * Setup notification toggle switches
 */
function setupNotificationToggles() {
  const toggles = document.querySelectorAll(
    '.notification-option input[type="checkbox"]'
  );

  toggles.forEach((toggle) => {
    toggle.addEventListener("change", function () {
      // In a real app, you would save this preference to user settings
      const type = this.id.replace("-notifications", "");
      const enabled = this.checked;

      showToast(
        "Notification Setting",
        `${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${
          enabled ? "enabled" : "disabled"
        }`,
        "success"
      );
    });
  });
}

/**
 * Setup logout functionality
 */
function setupLogout() {
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove user data
      localStorage.removeItem("user");

      // Update UI
      updateUIForLoginStatus(false);

      // Show success message
      showToast(
        "Logged Out",
        "You have been successfully logged out",
        "success"
      );
    });
  }
}

/**
 * Update cart count in navigation
 */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.querySelector(".cart-count");

  if (cartCount) {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;

    if (count > 0) {
      cartCount.style.display = "block";
    } else {
      cartCount.style.display = "none";
    }
  }
}

/**
 * Update wishlist count in navigation
 */
function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistCount = document.querySelector(".wishlist-count");

  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length;

    if (wishlist.length > 0) {
      wishlistCount.style.display = "block";
    } else {
      wishlistCount.style.display = "none";
    }
  }
}

/**
 * Show a toast notification
 */
function showToast(title, message, type = "success") {
  const toastContainer = document.querySelector(".toast-container");

  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let icon = "fas fa-check-circle";
  if (type === "error") icon = "fas fa-exclamation-circle";
  if (type === "warning") icon = "fas fa-exclamation-triangle";
  if (type === "info") icon = "fas fa-info-circle";

  toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icon}"></i>
        </div>
        <div class="toast-content">
            <h3 class="toast-title">${title}</h3>
            <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;

  // Add to container
  toastContainer.appendChild(toast);

  // Setup close button
  const closeButton = toast.querySelector(".toast-close");
  closeButton.addEventListener("click", function () {
    toast.remove();
  });

  // Auto close after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
