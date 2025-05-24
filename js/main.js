// Shilp Banavat - Premium Handicrafts E-commerce
// Main JavaScript file that loads all other scripts

// Import common.js dynamically
document.addEventListener("DOMContentLoaded", function () {
  // First load common.js
  const commonScript = document.createElement("script");
  commonScript.src = "js/common.js";
  commonScript.onload = function () {
    // Then determine which page-specific script to load
    let pageScript;
    const path = window.location.pathname;

    if (path.includes("product-detail.html")) {
      pageScript = "js/product-detail.js";
    } else if (path.includes("product.html")) {
      pageScript = "js/product.js";
    } else {
      // Default to index.js for homepage
      pageScript = "js/index.js";
    }

    // Load the page-specific script
    const script = document.createElement("script");
    script.src = pageScript;
    document.head.appendChild(script);
  };

  document.head.appendChild(commonScript);
});

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  initHeader();
  initProductGallery();
  initProductTabs();
  initQuantitySelector();
  initVariantSelector();
  initFilterToggle();
  initWishlistButtons();
});

// Header scroll effect
function initHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
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
}

// Product gallery functionality
function initProductGallery() {
  const mainImage = document.getElementById("main-image");
  const thumbnails = document.querySelectorAll(".thumbnail");

  if (!mainImage || thumbnails.length === 0) return;

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      // Update active class
      thumbnails.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Update main image
      const imgSrc = this.querySelector("img").getAttribute("src");
      mainImage.setAttribute("src", imgSrc);
    });
  });
}

// Product tabs functionality
function initProductTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  if (tabButtons.length === 0 || tabPanels.length === 0) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons and panels
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Show corresponding panel
      const tabId = this.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });
}

// Quantity selector functionality
function initQuantitySelector() {
  const decrementBtns = document.querySelectorAll(".decrement");
  const incrementBtns = document.querySelectorAll(".increment");
  const qtyInputs = document.querySelectorAll(".qty-input");

  if (qtyInputs.length === 0) return;

  decrementBtns.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      let currentValue = parseInt(qtyInputs[index].value);
      if (currentValue > 1) {
        qtyInputs[index].value = currentValue - 1;
      }
    });
  });

  incrementBtns.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      let currentValue = parseInt(qtyInputs[index].value);
      qtyInputs[index].value = currentValue + 1;
    });
  });

  qtyInputs.forEach((input) => {
    input.addEventListener("change", function () {
      if (this.value < 1 || isNaN(this.value)) {
        this.value = 1;
      }
    });
  });
}

// Product variant selector
function initVariantSelector() {
  const variantColors = document.querySelectorAll(".variant-color");
  const variantSizes = document.querySelectorAll(".variant-size");

  if (variantColors.length > 0) {
    variantColors.forEach((color) => {
      color.addEventListener("click", function () {
        variantColors.forEach((c) => c.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  if (variantSizes.length > 0) {
    variantSizes.forEach((size) => {
      size.addEventListener("click", function () {
        variantSizes.forEach((s) => s.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }
}

// Filter toggle for mobile
function initFilterToggle() {
  const filtersSidebar = document.querySelector(".filters-sidebar");
  if (!filtersSidebar) return;

  // Create filter toggle button for mobile
  const filterToggle = document.createElement("button");
  filterToggle.className = "filter-toggle-btn";
  filterToggle.innerHTML = 'Filters <i class="fas fa-filter"></i>';

  // Add to product controls
  const productControls = document.querySelector(".product-controls");
  if (productControls) {
    productControls.prepend(filterToggle);
  }

  // Toggle filters on mobile
  filterToggle.addEventListener("click", function () {
    filtersSidebar.classList.toggle("active");
    if (filtersSidebar.classList.contains("active")) {
      document.body.style.overflow = "hidden";
      filterToggle.innerHTML = 'Close <i class="fas fa-times"></i>';
    } else {
      document.body.style.overflow = "";
      filterToggle.innerHTML = 'Filters <i class="fas fa-filter"></i>';
    }
  });

  // Close filters when clicking outside
  document.addEventListener("click", function (event) {
    if (
      window.innerWidth < 768 &&
      !filtersSidebar.contains(event.target) &&
      !filterToggle.contains(event.target) &&
      filtersSidebar.classList.contains("active")
    ) {
      filtersSidebar.classList.remove("active");
      document.body.style.overflow = "";
      filterToggle.innerHTML = 'Filters <i class="fas fa-filter"></i>';
    }
  });

  // Filter apply button
  const applyBtn = filtersSidebar.querySelector(".filter-apply");
  if (applyBtn) {
    applyBtn.addEventListener("click", function () {
      if (window.innerWidth < 768) {
        filtersSidebar.classList.remove("active");
        document.body.style.overflow = "";
        filterToggle.innerHTML = 'Filters <i class="fas fa-filter"></i>';
      }
      // Add filter application logic here
      console.log("Filters applied");
    });
  }

  // Filter reset button
  const resetBtn = filtersSidebar.querySelector(".filter-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      const checkboxes = filtersSidebar.querySelectorAll(
        'input[type="checkbox"]'
      );
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });

      const rangeInputs = filtersSidebar.querySelectorAll(
        'input[type="range"]'
      );
      if (rangeInputs.length > 0) {
        rangeInputs[0].value = rangeInputs[0].min;
        rangeInputs[1].value = rangeInputs[1].max;
      }

      const priceInputs = filtersSidebar.querySelectorAll(
        ".price-inputs input"
      );
      if (priceInputs.length > 0) {
        priceInputs[0].value = 0;
        priceInputs[1].value = 50000;
      }

      console.log("Filters reset");
    });
  }
}

// Wishlist functionality
function initWishlistButtons() {
  const wishlistBtns = document.querySelectorAll(
    ".wishlist-btn, .add-to-wishlist"
  );

  wishlistBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const icon = this.querySelector("i");
      icon.classList.toggle("fas");
      icon.classList.toggle("far");

      if (icon.classList.contains("fas")) {
        showNotification("Product added to wishlist");
      } else {
        showNotification("Product removed from wishlist");
      }
    });
  });
}

// Add to cart functionality
document.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("btn-add-cart") ||
    event.target.classList.contains("add-to-cart")
  ) {
    event.preventDefault();

    // Get product info (in a real app, you'd get this from the page data)
    const productElement =
      event.target.closest(".product-item") ||
      document.querySelector(".product-detail");
    let productName = "Selected product";
    let productPrice = "";

    if (productElement) {
      const nameElement =
        productElement.querySelector("h3") ||
        productElement.querySelector(".product-title");
      const priceElement =
        productElement.querySelector(".price") ||
        productElement.querySelector(".product-price");

      if (nameElement) productName = nameElement.textContent;
      if (priceElement) productPrice = priceElement.textContent;
    }

    // Get quantity if on product detail page
    let quantity = 1;
    const qtyInput = document.querySelector(".qty-input");
    if (qtyInput) {
      quantity = parseInt(qtyInput.value);
    }

    console.log(`Added to cart: ${quantity}x ${productName} (${productPrice})`);
    showNotification(`${productName} added to your cart`);
  }
});

// Show notification
function showNotification(message) {
  // Check if notification container exists, if not create it
  let notificationContainer = document.querySelector(".notification-container");

  if (!notificationContainer) {
    notificationContainer = document.createElement("div");
    notificationContainer.className = "notification-container";
    document.body.appendChild(notificationContainer);
  }

  // Create notification
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
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

// Simple carousel for product sliders (in a real implementation, you might use a library like Swiper)
class SimpleCarousel {
  constructor(element, options = {}) {
    this.carousel = element;
    this.items = Array.from(this.carousel.children);
    this.options = {
      slidesToShow: options.slidesToShow || 4,
      slidesToScroll: options.slidesToScroll || 1,
      infinite: options.infinite || true,
      autoplay: options.autoplay || false,
      autoplaySpeed: options.autoplaySpeed || 3000,
      responsive: options.responsive || [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    };

    this.currentSlide = 0;
    this.totalSlides = this.items.length;

    this.init();
  }

  init() {
    // Create carousel wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "carousel-wrapper";
    this.carousel.parentNode.insertBefore(wrapper, this.carousel);
    wrapper.appendChild(this.carousel);

    // Create controls
    const controls = document.createElement("div");
    controls.className = "carousel-controls";
    controls.innerHTML = `
            <button class="carousel-prev"><i class="fas fa-chevron-left"></i></button>
            <button class="carousel-next"><i class="fas fa-chevron-right"></i></button>
        `;
    wrapper.appendChild(controls);

    // Add event listeners
    controls
      .querySelector(".carousel-prev")
      .addEventListener("click", () => this.prev());
    controls
      .querySelector(".carousel-next")
      .addEventListener("click", () => this.next());

    // Set initial state
    this.update();

    // Start autoplay if enabled
    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  update() {
    // Responsive settings
    let slidesToShow = this.options.slidesToShow;
    for (const breakpoint of this.options.responsive) {
      if (window.innerWidth <= breakpoint.breakpoint) {
        slidesToShow = breakpoint.settings.slidesToShow;
        break;
      }
    }

    // Hide all items
    this.items.forEach((item) => (item.style.display = "none"));

    // Show visible items
    for (let i = 0; i < slidesToShow; i++) {
      const index = (this.currentSlide + i) % this.totalSlides;
      this.items[index].style.display = "block";
    }
  }

  next() {
    this.currentSlide =
      (this.currentSlide + this.options.slidesToScroll) % this.totalSlides;
    this.update();
  }

  prev() {
    this.currentSlide =
      (this.currentSlide - this.options.slidesToScroll + this.totalSlides) %
      this.totalSlides;
    this.update();
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(
      () => this.next(),
      this.options.autoplaySpeed
    );

    // Pause on hover
    this.carousel.addEventListener("mouseenter", () =>
      clearInterval(this.autoplayInterval)
    );
    this.carousel.addEventListener("mouseleave", () => this.startAutoplay());
  }
}

// Initialize carousels when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll(".product-carousel");
  carousels.forEach((carousel) => {
    new SimpleCarousel(carousel, {
      slidesToShow: 4,
      autoplay: true,
    });
  });
});
