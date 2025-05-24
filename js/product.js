// Shilp Banavat - Premium Handicrafts E-commerce
// Product Listing page specific JavaScript

document.addEventListener("DOMContentLoaded", function () {
  initFilterToggle();
  initProductCarousels();
  loadProductsFromData();
});

// Function to initialize product carousels in the recently viewed section
function initProductCarousels() {
  const carousels = document.querySelectorAll(".product-carousel");
  carousels.forEach((carousel) => {
    new SimpleCarousel(carousel, {
      slidesToShow: 4,
      autoplay: false,
    });
  });
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

// View switcher (grid/list)
document.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("view-grid") ||
    event.target.classList.contains("view-list") ||
    event.target.parentElement.classList.contains("view-grid") ||
    event.target.parentElement.classList.contains("view-list")
  ) {
    const viewBtn = event.target.closest(".view-grid, .view-list");
    if (!viewBtn) return;

    const viewOptions = document.querySelector(".view-options");
    if (!viewOptions) return;

    // Remove active class from all buttons
    viewOptions.querySelectorAll("button").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active class to clicked button
    viewBtn.classList.add("active");

    // Toggle view class on product grid
    const productGrid = document.querySelector(".product-grid");
    if (productGrid) {
      if (viewBtn.classList.contains("view-grid")) {
        productGrid.classList.remove("list-view");
        productGrid.classList.add("grid-view");
      } else {
        productGrid.classList.remove("grid-view");
        productGrid.classList.add("list-view");
      }
    }
  }
});

// Price range slider
document.addEventListener("DOMContentLoaded", function () {
  const priceRangeMin = document.querySelector(".range-min");
  const priceRangeMax = document.querySelector(".range-max");
  const priceInputMin = document.querySelector(".price-min");
  const priceInputMax = document.querySelector(".price-max");

  if (!priceRangeMin || !priceRangeMax || !priceInputMin || !priceInputMax)
    return;

  // Update input when range changes
  priceRangeMin.addEventListener("input", function () {
    priceInputMin.value = this.value;
  });

  priceRangeMax.addEventListener("input", function () {
    priceInputMax.value = this.value;
  });

  // Update range when input changes
  priceInputMin.addEventListener("change", function () {
    priceRangeMin.value = this.value;
  });

  priceInputMax.addEventListener("change", function () {
    priceRangeMax.value = this.value;
  });
});

// Simple carousel for recently viewed products
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

    if (this.totalSlides > this.options.slidesToShow) {
      this.init();
    }
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

// Product Page JS

document.addEventListener("DOMContentLoaded", function () {
  // Wishlist functionality
  const wishlistButtons = document.querySelectorAll(".lv-wishlist");

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const icon = this.querySelector("i");

      if (icon.classList.contains("far")) {
        // Add to wishlist
        icon.classList.remove("far");
        icon.classList.add("fas");
        icon.style.color = "#d64141";

        // Show notification
        showNotification("Product added to wishlist");
      } else {
        // Remove from wishlist
        icon.classList.remove("fas");
        icon.classList.add("far");
        icon.style.color = "";

        // Show notification
        showNotification("Product removed from wishlist");
      }
    });
  });

  // Make product item clickable
  const productItems = document.querySelectorAll(".lv-product-item");
  productItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Navigate to product detail page (you can replace with actual product URL)
      window.location.href = "product-detail.html";
    });
  });

  // Prevent product info click from triggering product item click
  const productInfoElements = document.querySelectorAll(".lv-product-info");
  productInfoElements.forEach((info) => {
    info.addEventListener("click", function (e) {
      // Don't stop propagation - let the click bubble to the product item
      // We want the entire card to be clickable
    });
  });

  // Carousel navigation
  const prevButton = document.querySelector(".lv-prev");
  const nextButton = document.querySelector(".lv-next");
  const productItemsContainer = document.querySelector(".lv-product-items");

  if (prevButton && nextButton && productItemsContainer) {
    // Set initial position
    let position = 0;
    const productItem = document.querySelector(".lv-product-item");
    const itemWidth = productItem ? productItem.offsetWidth : 0;
    const totalItems = document.querySelectorAll(".lv-product-item").length;
    const itemsPerView = getItemsPerView();
    const maxPosition = Math.max(0, totalItems - itemsPerView);

    // Only proceed with carousel initialization if we have product items
    if (itemWidth > 0 && totalItems > 0) {
      // Update navigation based on screen size
      window.addEventListener("resize", function () {
        position = 0;
        productItemsContainer.style.transform = `translateX(0)`;
        updateNavigation();
      });

      // Previous button click
      prevButton.addEventListener("click", function () {
        if (position > 0) {
          position--;
          const translateX = -position * itemWidth;
          productItemsContainer.style.transform = `translateX(${translateX}px)`;
          updateNavigation();
        }
      });

      // Next button click
      nextButton.addEventListener("click", function () {
        if (position < maxPosition) {
          position++;
          const translateX = -position * itemWidth;
          productItemsContainer.style.transform = `translateX(${translateX}px)`;
          updateNavigation();
        }
      });

      // Update navigation visibility
      function updateNavigation() {
        prevButton.style.opacity = position === 0 ? "0.5" : "1";
        nextButton.style.opacity = position >= maxPosition ? "0.5" : "1";
      }

      // Initial navigation update
      updateNavigation();
    } else {
      // Hide navigation buttons if we don't have product items
      prevButton.style.display = "none";
      nextButton.style.display = "none";
    }

    // Get items per view based on screen size
    function getItemsPerView() {
      const viewportWidth = window.innerWidth;
      if (viewportWidth >= 1200) return 4;
      if (viewportWidth >= 992) return 3;
      if (viewportWidth >= 768) return 2;
      return 1;
    }
  }

  // Filter button functionality
  const filterButton = document.querySelector(".lv-filter-button");

  if (filterButton) {
    filterButton.addEventListener("click", function () {
      // For now, just show an alert
      alert("Filter functionality will be implemented soon!");

      // Actual implementation would open a filter drawer/modal
      // toggleFilterDrawer();
    });
  }

  // Handle touch devices - show info on touch
  if ("ontouchstart" in window) {
    productItems.forEach((item) => {
      item.addEventListener("touchstart", function (e) {
        // Show info panel on first touch for mobile devices
        const infoPanel = this.querySelector(".lv-product-info");
        const allInfoPanels = document.querySelectorAll(".lv-product-info");
        let wasVisible = infoPanel.style.opacity === "1";

        // Hide all other info panels first with smooth animation
        allInfoPanels.forEach((panel) => {
          if (panel !== infoPanel) {
            panel.style.transform = "translateY(101%)";
            panel.style.opacity = "0";
          }
        });

        if (wasVisible) {
          // If already showing, continue with the click (navigation)
        } else {
          // If not showing, show it and prevent navigation
          e.preventDefault();
          e.stopPropagation();

          // Apply the hover state with smooth animation
          infoPanel.style.transform = "translateY(0)";
          infoPanel.style.opacity = "1";
        }
      });
    });

    // Hide panels when touching outside product items
    document.addEventListener("touchstart", function (e) {
      if (
        !e.target.closest(".lv-product-item") &&
        !e.target.closest(".lv-product-info")
      ) {
        const allInfoPanels = document.querySelectorAll(".lv-product-info");
        allInfoPanels.forEach((panel) => {
          panel.style.transform = "translateY(101%)";
          panel.style.opacity = "0";
        });
      }
    });
  }
});

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "lv-notification";
  notification.textContent = message;

  // Add to document
  document.body.appendChild(notification);

  // Add styles
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  notification.style.color = "white";
  notification.style.padding = "12px 20px";
  notification.style.borderRadius = "4px";
  notification.style.zIndex = "1000";
  notification.style.opacity = "0";
  notification.style.transform = "translateY(20px)";
  notification.style.transition = "all 0.3s ease";

  // Show notification
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";
  }, 10);

  // Hide and remove notification after delay
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(20px)";

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Function to fetch products from data file and render them
async function loadProductsFromData() {
  try {
    // Get category from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");

    // Get the repository name for GitHub Pages
    let repoPath = "";
    if (location.hostname.includes("github.io")) {
      // Extract the repository name from the path (e.g., /ShilpBanavat/pages/product.html)
      const pathParts = location.pathname.split("/");
      if (pathParts.length > 1) {
        repoPath = "/" + pathParts[1]; // e.g., /ShilpBanavat
      }
    }

    // Build the correct URL for products.json
    let productsJsonUrl;
    if (location.hostname.includes("github.io")) {
      // For GitHub Pages: use absolute path from the repository root
      productsJsonUrl = `${location.origin}${repoPath}/js/data/products.json`;
    } else {
      // For local development
      productsJsonUrl = "js/data/products.json";
    }

    console.log("Fetching products from:", productsJsonUrl);

    // Fetch the products data
    const response = await fetch(productsJsonUrl);
    if (!response.ok) {
      throw new Error("Failed to load products data");
    }

    const products = await response.json();

    // Filter products by category if specified
    let filteredProducts = products;
    if (category) {
      filteredProducts = products.filter((product) => {
        if (category === "new" && product.isNew) {
          return true;
        } else if (category === "women" && product.mainCategory === "women") {
          return true;
        } else if (category === "men" && product.mainCategory === "men") {
          return true;
        } else if (category === "home" && product.mainCategory === "home") {
          return true;
        } else if (category === "gifts" && product.tags.includes("gift")) {
          return true;
        }
        return false;
      });
    }

    // Update page title based on category
    updateCategoryTitle(category);

    // Render the products
    renderProducts(filteredProducts, repoPath);
  } catch (error) {
    console.error("Error loading products:", error);
    showNotification("Failed to load products. Please try again later.");
  }
}

// Update the category title based on selected category
function updateCategoryTitle(category) {
  const categoryTitle = document.querySelector(".lv-category-title h1");
  if (!categoryTitle) return;

  if (category) {
    switch (category) {
      case "new":
        categoryTitle.textContent = "New Arrivals";
        break;
      case "women":
        categoryTitle.textContent = "Women's Collection";
        break;
      case "men":
        categoryTitle.textContent = "Men's Collection";
        break;
      case "home":
        categoryTitle.textContent = "Home Decor";
        break;
      case "gifts":
        categoryTitle.textContent = "Gifts Collection";
        break;
      default:
        categoryTitle.textContent = "All Handicrafts";
    }
  } else {
    categoryTitle.textContent = "All Handicrafts";
  }
}

// Render products to the page
function renderProducts(products, repoPath = "") {
  const productContainer = document.querySelector(".lv-product-items");
  if (!productContainer) return;

  // Clear existing products
  productContainer.innerHTML = "";

  if (products.length === 0) {
    const noProductsMsg = document.createElement("div");
    noProductsMsg.className = "no-products-message";
    noProductsMsg.innerHTML = `
      <p>No products found in this category.</p>
      <a href="product.html" class="btn btn-primary">View All Products</a>
    `;
    productContainer.appendChild(noProductsMsg);
    return;
  }

  // Generate HTML for each product
  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.className = "lv-product-item";

    // Calculate discount percentage if on sale
    let discountBadge = "";
    if (product.isOnSale && product.originalPrice > product.price) {
      const discountPercent = Math.round(
        (1 - product.price / product.originalPrice) * 100
      );
      discountBadge = `<div class="lv-product-discount">-${discountPercent}%</div>`;
    }

    // Determine if product has any badges (new, bestseller)
    let badgeHtml = "";
    if (product.isNew) {
      badgeHtml = '<div class="lv-product-tag">NEW</div>';
    } else if (product.isBestseller) {
      badgeHtml = '<div class="lv-product-tag bestseller">BESTSELLER</div>';
    }

    // Format price
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(product.price);

    // Format original price if different
    let originalPriceHtml = "";
    if (product.isOnSale && product.originalPrice > product.price) {
      const formattedOriginalPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(product.originalPrice);
      originalPriceHtml = `<span class="lv-original-price">${formattedOriginalPrice}</span>`;
    }

    // Adjust image paths based on whether we're on GitHub Pages or local
    let imagePath = "";
    if (location.hostname.includes("github.io")) {
      // For GitHub Pages: use absolute path from the repository root
      imagePath = `${location.origin}${repoPath}/`;
    }

    // Full image URLs
    const imagePrimary = product.imagePrimary
      ? imagePath + product.imagePrimary
      : imagePath + "images/placeholder.jpg";
    const imageHover = product.imageHover
      ? imagePath + product.imageHover
      : imagePrimary;

    // Build product HTML
    productItem.innerHTML = `
      <div class="lv-product-image">
        <a href="product-detail.html?id=${product.id}">
          <img src="${imagePrimary}" 
               data-hover="${imageHover}"
               alt="${product.name}">
          ${discountBadge}
        </a>
        <div class="lv-wishlist">
          <button class="wishlist-toggle" data-product-id="${product.id}">
            <i class="far fa-heart"></i>
          </button>
        </div>
        <div class="lv-product-info">
          ${badgeHtml}
          <h3>${product.name}</h3>
          <p class="lv-price">${formattedPrice} ${originalPriceHtml}</p>
        </div>
      </div>
    `;

    productContainer.appendChild(productItem);
  });

  // Initialize hover effect for product images
  initProductImageHover();

  // Initialize wishlist toggle functionality
  initWishlistToggle();
}

// Initialize hover effect for product images
function initProductImageHover() {
  const productImages = document.querySelectorAll(
    ".lv-product-image img[data-hover]"
  );

  productImages.forEach((img) => {
    const originalSrc = img.src;
    const hoverSrc = img.getAttribute("data-hover");

    img.addEventListener("mouseenter", () => {
      img.src = hoverSrc;
    });

    img.addEventListener("mouseleave", () => {
      img.src = originalSrc;
    });
  });
}

// Initialize wishlist toggle functionality
function initWishlistToggle() {
  const wishlistButtons = document.querySelectorAll(".wishlist-toggle");

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const icon = button.querySelector("i");

      // Get product information from the closest product item
      const productItem =
        button.closest(".lv-product-item") || button.closest(".product-item");
      if (!productItem) {
        console.error("Could not find product item container");
        return;
      }

      // Try to get product ID from the button first, then from the product item
      let productId =
        button.getAttribute("data-product-id") ||
        productItem.getAttribute("data-product-id");

      if (!productId) {
        // Generate a random ID if none exists
        productId = `product_${Math.random().toString(36).substr(2, 9)}`;
        productItem.setAttribute("data-product-id", productId);
      }

      // Get product details
      let productName, productPrice, productImage, productCategory;

      // Try to get info from product item
      const nameElement =
        productItem.querySelector("h3") ||
        productItem.querySelector(".lv-product-info h3");
      const priceElement =
        productItem.querySelector(".lv-price") ||
        productItem.querySelector(".price");
      const imageElement = productItem.querySelector("img");
      const categoryElement =
        productItem.querySelector(".product-category") ||
        productItem.closest("[data-category]");

      // Extract the information with fallbacks
      productName = nameElement ? nameElement.textContent.trim() : "Product";
      productPrice = priceElement ? priceElement.textContent.trim() : "$0.00";
      productImage = imageElement
        ? imageElement.src
        : "../images/placeholder-product1.jpg";

      // For category, try multiple approaches
      if (categoryElement) {
        productCategory = categoryElement.textContent.trim();
      } else if (productItem.hasAttribute("data-category")) {
        productCategory = productItem.getAttribute("data-category");
      } else {
        // Get from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get("category");
        if (categoryParam) {
          switch (categoryParam) {
            case "women":
              productCategory = "Women's Collection";
              break;
            case "men":
              productCategory = "Men's Collection";
              break;
            case "home":
              productCategory = "Home Decor";
              break;
            case "gifts":
              productCategory = "Gifts";
              break;
            default:
              productCategory = "Handicrafts";
          }
        } else {
          productCategory = "Handicrafts";
        }
      }

      // Toggle icon class
      const isAdding = icon.classList.contains("far");
      if (isAdding) {
        icon.classList.remove("far");
        icon.classList.add("fas");
        // Use styled notification with product name
        if (typeof window.showNotification === "function") {
          window.showNotification(
            `${productName} added to wishlist`,
            "success"
          );
        } else {
          showNotification(`${productName} added to wishlist`, "success");
        }
      } else {
        icon.classList.remove("fas");
        icon.classList.add("far");
        // Use styled notification with product name
        if (typeof window.showNotification === "function") {
          window.showNotification(
            `${productName} removed from wishlist`,
            "success"
          );
        } else {
          showNotification(`${productName} removed from wishlist`, "success");
        }
      }

      // Add/remove from wishlist in localStorage
      toggleProductInWishlist(
        productId,
        productName,
        productPrice,
        productImage,
        productCategory,
        isAdding
      );
    });
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
}
