/*
Shilp Banavat - Premium Handicrafts E-commerce
Checkout Page JavaScript
*/

document.addEventListener("DOMContentLoaded", function () {
  // Initialize checkout
  initCheckout();

  // Set up event listeners
  setupAddressOptions();
  setupShippingOptions();
  setupPaymentOptions();
  setupFormValidation();
  setupPromoCode();

  // Setup confirmation modal
  setupConfirmationModal();

  // Setup checkout steps navigation
  setupCheckoutSteps();
});

/**
 * Initialize checkout with cart data
 */
function initCheckout() {
  // Get cart data from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // If cart is empty, redirect to cart page
  if (cart.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  // Populate order summary
  populateOrderSummary(cart);

  // Set initial values
  calculateOrderSummary();
}

/**
 * Populate order summary with cart items
 */
function populateOrderSummary(cart) {
  const summaryProductList = document.querySelector(".summary-product-list");
  summaryProductList.innerHTML = "";

  // Loop through cart items and create summary products
  cart.forEach((item) => {
    // Ensure price is a number
    let price = 0;
    if (typeof item.price === "number") {
      price = item.price;
    } else if (item.price) {
      price = parseFloat(String(item.price).replace(/[^0-9.-]+/g, ""));
    } else if (item.displayPrice) {
      price = parseFloat(String(item.displayPrice).replace(/[^0-9.-]+/g, ""));
    }

    const quantity = item.quantity || 1;
    const imageSrc = item.image || "https://via.placeholder.com/60";

    const productEl = document.createElement("div");
    productEl.className = "summary-product";
    productEl.innerHTML = `
            <div class="summary-product-image">
                <img src="${imageSrc}" alt="${item.name}">
            </div>
            <div class="summary-product-details">
                <h4>${item.name}</h4>
                <div class="summary-product-variant">
                    ${item.color ? `Color: ${item.color}` : ""}
                    ${item.size ? `, Size: ${item.size}` : ""}
                    ${item.quantity ? `, Qty: ${item.quantity}` : ""}
                </div>
                <div class="summary-product-price">$${(
                  price * quantity
                ).toFixed(2)}</div>
            </div>
        `;

    summaryProductList.appendChild(productEl);
  });
}

/**
 * Setup saved addresses and new address form
 */
function setupAddressOptions() {
  const savedAddressOptions = document.querySelectorAll(
    '.address-option input[name="address"]'
  );
  const newAddressForm = document.querySelector(".new-address-form");

  savedAddressOptions.forEach((option) => {
    option.addEventListener("change", function () {
      if (this.value === "new") {
        newAddressForm.style.display = "block";
      } else {
        newAddressForm.style.display = "none";
      }
    });
  });
}

/**
 * Setup shipping options with cost calculation
 */
function setupShippingOptions() {
  const shippingOptions = document.querySelectorAll(
    '.shipping-option input[name="shipping"]'
  );

  shippingOptions.forEach((option) => {
    option.addEventListener("change", function () {
      calculateOrderSummary();
    });
  });
}

/**
 * Setup payment method options and forms
 */
function setupPaymentOptions() {
  const paymentOptions = document.querySelectorAll(
    '.payment-option input[name="payment"]'
  );
  const cardPaymentForm = document.querySelector(".card-payment-form");

  paymentOptions.forEach((option) => {
    option.addEventListener("change", function () {
      if (this.value === "card") {
        cardPaymentForm.style.display = "block";
      } else {
        cardPaymentForm.style.display = "none";
      }
    });
  });
}

/**
 * Setup form validation
 */
function setupFormValidation() {
  const checkoutForm = document.getElementById("checkout-form");

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validate form
      if (validateCheckoutForm()) {
        // Process order
        processOrder();
      }
    });
  }
}

/**
 * Validate checkout form fields
 * @returns {boolean} Form is valid
 */
function validateCheckoutForm() {
  let isValid = true;

  // First validate customer information
  isValid = validateCustomerInformation();

  // Then validate shipping method if customer info is valid
  if (isValid) {
    isValid = validateShippingMethod();
  }

  // Finally validate payment method
  if (isValid) {
    isValid = validatePaymentMethod();
  }

  return isValid;
}

/**
 * Show error message for a field
 */
function showError(field, message) {
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.textContent = message;
  errorMessage.style.color = "var(--error-color)";
  errorMessage.style.fontSize = "1.2rem";
  errorMessage.style.marginTop = "0.5rem";

  field.parentNode.appendChild(errorMessage);
  field.style.borderColor = "var(--error-color)";

  field.addEventListener("input", function () {
    errorMessage.remove();
    field.style.borderColor = "";
  });
}

/**
 * Show error message for a container
 */
function showContainerError(container, message) {
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.textContent = message;
  errorMessage.style.color = "var(--error-color)";
  errorMessage.style.fontSize = "1.4rem";
  errorMessage.style.marginTop = "1rem";

  container.appendChild(errorMessage);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
function isValidPhone(phone) {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
}

/**
 * Validate card number format
 */
function isValidCardNumber(cardNumber) {
  const cardRegex = /^\d{13,19}$/;
  return cardRegex.test(cardNumber.replace(/\D/g, ""));
}

/**
 * Validate expiry date format
 */
function isValidExpiry(expiry) {
  const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

  if (!expiryRegex.test(expiry)) {
    return false;
  }

  const parts = expiry.split("/");
  const month = parseInt(parts[0], 10);
  const year = parseInt("20" + parts[1], 10);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) {
    return false;
  }

  if (year === currentYear && month < currentMonth) {
    return false;
  }

  return true;
}

/**
 * Validate CVV format
 */
function isValidCVV(cvv) {
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv);
}

/**
 * Process order and show confirmation
 */
function processOrder() {
  // In a real application, you would send the order to the server here
  // For this example, we'll just simulate a successful order

  // Generate a random order number
  const orderNumber =
    "SB" +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");

  // Add order number to the confirmation modal
  document.querySelector(".order-number-value").textContent = orderNumber;

  // Show loading state (optional)
  const submitButton = document.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Processing...';

  // Simulate server request
  setTimeout(() => {
    // Clear cart
    localStorage.setItem("cart", JSON.stringify([]));

    // Update cart count
    updateCartCount(0);

    // Update header badges
    if (typeof updateHeaderBadges === "function") {
      updateHeaderBadges();
    } else {
      // If updateHeaderBadges is not defined, try to find it in window
      if (window.updateHeaderBadges) {
        window.updateHeaderBadges();
      }
    }

    // Show confirmation modal
    const confirmationModal = document.getElementById("order-confirmation");
    confirmationModal.classList.add("active");

    // Reset button state
    submitButton.disabled = false;
    submitButton.textContent = originalText;

    // Add order email to confirmation
    const emailField = document.getElementById("email");
    if (emailField && emailField.value) {
      document.getElementById("confirmation-email").textContent =
        emailField.value;
    }
  }, 1500);
}

/**
 * Setup promo code functionality
 */
function setupPromoCode() {
  const promoForm = document.querySelector(".promo-form");
  const promoDisplay = document.querySelector(".promo-code-display");
  const removePromoButton = document.querySelector(".remove-promo");

  if (promoForm) {
    promoForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const promoCode = document.getElementById("promo-code").value.trim();

      if (promoCode) {
        applyPromoCode(promoCode);
      }
    });
  }

  if (removePromoButton) {
    removePromoButton.addEventListener("click", function () {
      removePromoCode();
    });
  }
}

/**
 * Apply promo code
 */
function applyPromoCode(code) {
  // In a real application, this would validate the code with the server
  // For this example, we'll just simulate some valid codes

  const validCodes = {
    WELCOME10: 10,
    SUMMER20: 20,
    FESTIVE30: 30,
  };

  const promoForm = document.querySelector(".promo-form");
  const promoDisplay = document.querySelector(".promo-code-display");

  if (validCodes[code]) {
    // Show success message
    const discount = validCodes[code];

    // Update promo display
    document.querySelector(".promo-name").textContent = code;
    document.querySelector(".promo-discount").textContent = `${discount}% OFF`;

    // Hide form, show display
    promoForm.style.display = "none";
    promoDisplay.style.display = "flex";

    // Store promo in session
    sessionStorage.setItem("promoCode", code);
    sessionStorage.setItem("promoDiscount", discount);

    // Recalculate order summary
    calculateOrderSummary();
  } else {
    // Show error for invalid code
    const promoInput = document.getElementById("promo-code");
    showError(promoInput, "Invalid promo code");
  }
}

/**
 * Remove promo code
 */
function removePromoCode() {
  const promoForm = document.querySelector(".promo-form");
  const promoDisplay = document.querySelector(".promo-code-display");

  // Clear promo code input
  document.getElementById("promo-code").value = "";

  // Show form, hide display
  promoForm.style.display = "block";
  promoDisplay.style.display = "none";

  // Remove promo from session
  sessionStorage.removeItem("promoCode");
  sessionStorage.removeItem("promoDiscount");

  // Recalculate order summary
  calculateOrderSummary();
}

/**
 * Calculate and update order summary
 */
function calculateOrderSummary() {
  // Get cart data
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    // Ensure price is a number
    let price = 0;
    if (typeof item.price === "number") {
      price = item.price;
    } else if (item.price) {
      price = parseFloat(String(item.price).replace(/[^0-9.-]+/g, ""));
    } else if (item.displayPrice) {
      price = parseFloat(String(item.displayPrice).replace(/[^0-9.-]+/g, ""));
    }

    const quantity = item.quantity || 1;
    return total + price * quantity;
  }, 0);

  // Get selected shipping option
  const shippingOptions = document.querySelectorAll('input[name="shipping"]');
  let shippingCost = 0;

  shippingOptions.forEach((option) => {
    if (option.checked) {
      shippingCost = parseFloat(option.dataset.cost || 0);
    }
  });

  // Calculate tax (assuming 18% GST)
  const taxRate = 0.18;
  const tax = subtotal * taxRate;

  // Get promo discount if any
  let discount = 0;
  const promoDiscount = parseInt(sessionStorage.getItem("promoDiscount"), 10);

  if (promoDiscount) {
    discount = subtotal * (promoDiscount / 100);
  }

  // Calculate total
  const total = subtotal + shippingCost + tax - discount;

  // Update summary display
  document.querySelector(
    ".summary-subtotal"
  ).textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector(
    ".summary-shipping"
  ).textContent = `$${shippingCost.toFixed(2)}`;
  document.querySelector(".summary-tax").textContent = `$${tax.toFixed(2)}`;

  // Update discount if applicable
  const discountLine = document.querySelector(".discount-line");
  const discountElement = document.querySelector(".summary-discount");

  if (discountElement) {
    if (discount > 0) {
      discountElement.textContent = `-$${discount.toFixed(2)}`;
      if (discountLine) discountLine.style.display = "flex";
    } else {
      discountElement.textContent = `$0.00`;
      if (discountLine) discountLine.style.display = "none";
    }
  }

  // Update total
  document.querySelector(".total-amount").textContent = `$${total.toFixed(2)}`;
}

/**
 * Setup confirmation modal
 */
function setupConfirmationModal() {
  const modal = document.getElementById("order-confirmation");
  const closeButton = document.querySelector(".close-modal");
  const continueShoppingButton = document.querySelector(".continue-shopping");

  if (closeButton) {
    closeButton.addEventListener("click", function () {
      modal.classList.remove("active");
      // Redirect to home page
      window.location.href = "index.html";
    });
  }

  if (continueShoppingButton) {
    continueShoppingButton.addEventListener("click", function () {
      modal.classList.remove("active");
      // Redirect to home page
      window.location.href = "index.html";
    });
  }
}

/**
 * Update cart count in navigation
 */
function updateCartCount(count) {
  const cartCount = document.querySelector(".cart-count");

  if (cartCount) {
    cartCount.textContent = count;

    if (count > 0) {
      cartCount.style.display = "block";
    } else {
      cartCount.style.display = "none";
    }
  }
}

/**
 * Setup checkout steps navigation
 */
function setupCheckoutSteps() {
  const steps = [
    {
      id: "customer-information",
      title: "Customer Information",
      prevBtn: null,
      nextBtn: "to-shipping-btn",
    },
    {
      id: "shipping-method",
      title: "Shipping Method",
      prevBtn: "back-to-customer-btn",
      nextBtn: "to-payment-btn",
    },
  ];

  // Initially hide all sections except the first one
  document
    .querySelectorAll(".checkout-section-step")
    .forEach((section, index) => {
      if (index === 0) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });

  // Update step indicators
  updateStepIndicators(0);

  // Setup next buttons
  document
    .getElementById("to-shipping-btn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      if (validateCustomerInformation()) {
        goToStep(1);
      }
    });

  document
    .getElementById("to-payment-btn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      if (validateShippingMethod()) {
        // Instead of going to the next step, show the payment modal
        showPaymentModal();
      }
    });

  // Setup back buttons
  document
    .getElementById("back-to-customer-btn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      goToStep(0);
    });

  // Function to navigate to a step
  function goToStep(stepIndex) {
    // Hide all sections
    document.querySelectorAll(".checkout-section-step").forEach((section) => {
      section.classList.remove("active");
    });

    // Show current section
    const currentStep = steps[stepIndex];
    document.getElementById(currentStep.id).classList.add("active");

    // Update step indicators
    updateStepIndicators(stepIndex);

    // Scroll to top of section
    window.scrollTo({
      top: document.querySelector(".checkout-main").offsetTop - 20,
      behavior: "smooth",
    });
  }

  // Function to update step indicators
  function updateStepIndicators(activeStepIndex) {
    const stepIndicators = document.querySelectorAll(".checkout-step");

    stepIndicators.forEach((indicator, index) => {
      if (index < activeStepIndex) {
        // Completed steps
        indicator.classList.remove("active");
        indicator.classList.add("completed");
      } else if (index === activeStepIndex) {
        // Current step
        indicator.classList.add("active");
        indicator.classList.remove("completed");
      } else {
        // Future steps
        indicator.classList.remove("active");
        indicator.classList.remove("completed");
      }
    });
  }
}

/**
 * Validate customer information section
 */
function validateCustomerInformation() {
  let isValid = true;
  const emailField = document.getElementById("email");

  // Reset error messages
  document
    .querySelectorAll("#customer-information .error-message")
    .forEach((el) => el.remove());

  // Validate email
  if (!emailField.value.trim()) {
    isValid = false;
    showError(emailField, "Please enter your email address");
  } else if (!isValidEmail(emailField.value)) {
    isValid = false;
    showError(emailField, "Please enter a valid email address");
  }

  // Validate address selection
  const addressOptions = document.querySelectorAll('input[name="address"]');
  const addressSelected = Array.from(addressOptions).some(
    (option) => option.checked
  );

  if (!addressSelected) {
    isValid = false;
    const addressContainer = document.querySelector(".saved-addresses");
    showContainerError(addressContainer, "Please select an address");
  }

  // If new address is selected, validate address fields
  const newAddressOption = document.querySelector(
    'input[name="address"][value="new"]'
  );
  if (newAddressOption && newAddressOption.checked) {
    const newAddressFields = document.querySelectorAll(
      ".new-address-form [required]"
    );

    newAddressFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        showError(field, "This field is required");
      }
    });
  }

  return isValid;
}

/**
 * Validate shipping method section
 */
function validateShippingMethod() {
  let isValid = true;

  // Reset error messages
  document
    .querySelectorAll("#shipping-method .error-message")
    .forEach((el) => el.remove());

  // Check if shipping option is selected
  const shippingOptions = document.querySelectorAll('input[name="shipping"]');
  const shippingSelected = Array.from(shippingOptions).some(
    (option) => option.checked
  );

  if (!shippingSelected) {
    isValid = false;
    const shippingContainer = document.querySelector(".shipping-options");
    showContainerError(shippingContainer, "Please select a shipping method");
  }

  return isValid;
}

// Add new function to handle the payment modal
function showPaymentModal() {
  const paymentModal = document.getElementById("payment-method-modal");
  paymentModal.classList.add("active");

  // Setup close modal button
  document
    .getElementById("close-payment-modal")
    .addEventListener("click", function () {
      paymentModal.classList.remove("active");
    });

  // Setup place order button
  document
    .getElementById("place-order-btn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      if (validatePaymentMethod()) {
        processOrder();
        paymentModal.classList.remove("active");
      }
    });
}

// Add a new function to validate payment method
function validatePaymentMethod() {
  let isValid = true;

  // Reset error messages
  document
    .querySelectorAll("#payment-method-modal .error-message")
    .forEach((el) => el.remove());

  // Payment method validation
  const paymentOptions = document.querySelectorAll('input[name="payment"]');
  const paymentSelected = Array.from(paymentOptions).some(
    (option) => option.checked
  );

  if (!paymentSelected) {
    isValid = false;
    const paymentContainer = document.querySelector(".payment-options");
    showContainerError(paymentContainer, "Please select a payment method");
  }

  // If card payment is selected, validate card fields
  const cardPaymentOption = document.querySelector(
    'input[name="payment"][value="card"]'
  );

  if (cardPaymentOption && cardPaymentOption.checked) {
    const cardFields = document.querySelectorAll(
      ".card-payment-form [required]"
    );

    cardFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        showError(field, "This field is required");
      }
    });

    // Validate card number format
    const cardNumberField = document.getElementById("card-number");
    if (
      cardNumberField &&
      cardNumberField.value.trim() &&
      !isValidCardNumber(cardNumberField.value)
    ) {
      isValid = false;
      showError(cardNumberField, "Please enter a valid card number");
    }

    // Validate expiry date
    const expiryField = document.getElementById("expiry");
    if (
      expiryField &&
      expiryField.value.trim() &&
      !isValidExpiry(expiryField.value)
    ) {
      isValid = false;
      showError(expiryField, "Please enter a valid expiry date (MM/YY)");
    }

    // Validate CVV
    const cvvField = document.getElementById("cvv");
    if (cvvField && cvvField.value.trim() && !isValidCVV(cvvField.value)) {
      isValid = false;
      showError(cvvField, "Please enter a valid CVV (3-4 digits)");
    }
  }

  return isValid;
}
