// Shilp Banavat - Premium Handicrafts E-commerce
// Product Detail page specific JavaScript

document.addEventListener("DOMContentLoaded", function () {
  initProductGallery();
  initProductTabs();
  initQuantitySelector();
  initVariantSelector();
  initProductCarousels();
  initReviewForm();
  setupVerticalGallery();
  initAccordion();
  initColorSelector();
  setupAddToCart();
  setupReadMore();
  setupWishlistHeart();
});

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

// Initialize product carousels (complementary items, similar products, etc.)
function initProductCarousels() {
  const carousels = document.querySelectorAll(".product-carousel");
  carousels.forEach((carousel) => {
    new SimpleCarousel(carousel, {
      slidesToShow: 4,
      autoplay: false,
    });
  });
}

// Review form handling
function initReviewForm() {
  const reviewForm = document.querySelector(".review-form");
  const ratingStars = document.querySelectorAll(".rating-select i");

  if (!reviewForm || !ratingStars.length) return;

  // Set up star rating
  ratingStars.forEach((star, index) => {
    star.addEventListener("mouseover", function () {
      // Reset all stars
      ratingStars.forEach((s) => (s.className = "far fa-star"));

      // Fill stars up to current
      for (let i = 0; i <= index; i++) {
        ratingStars[i].className = "fas fa-star";
      }
    });

    star.addEventListener("click", function () {
      // Set rating value
      const ratingInput = document.createElement("input");
      ratingInput.type = "hidden";
      ratingInput.name = "rating";
      ratingInput.value = index + 1;

      // Remove any existing rating input
      const existingRating = reviewForm.querySelector('input[name="rating"]');
      if (existingRating) {
        existingRating.remove();
      }

      // Add the new rating input
      reviewForm.appendChild(ratingInput);
    });
  });

  // Reset stars when mouse leaves rating select area
  document
    .querySelector(".rating-select")
    .addEventListener("mouseleave", function () {
      const ratingInput = reviewForm.querySelector('input[name="rating"]');
      const ratingValue = ratingInput ? parseInt(ratingInput.value) : 0;

      // Reset all stars
      ratingStars.forEach((s, i) => {
        s.className = i < ratingValue ? "fas fa-star" : "far fa-star";
      });
    });

  // Handle form submission
  reviewForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const ratingInput = reviewForm.querySelector('input[name="rating"]');
    const titleInput = reviewForm.querySelector("#review-title");
    const contentInput = reviewForm.querySelector("#review-content");

    // Simple validation
    if (!ratingInput || !titleInput.value || !contentInput.value) {
      alert("Please fill out all fields and provide a rating.");
      return;
    }

    // Here you would typically send the form data to your server
    console.log({
      rating: ratingInput.value,
      title: titleInput.value,
      content: contentInput.value,
    });

    // Show success message
    showNotification(
      "Thanks for your review! It will be published after moderation."
    );

    // Reset form
    reviewForm.reset();
    ratingStars.forEach((s) => (s.className = "far fa-star"));
    if (ratingInput) ratingInput.remove();
  });
}

// Simple carousel functionality for product sections
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

// Load more reviews functionality
document.addEventListener("click", function (event) {
  if (event.target.closest(".load-more-reviews button")) {
    // This would typically load more reviews from the server
    // For demo purposes, we'll just show a notification
    showNotification("Loading more reviews...");

    // Hide the load more button after clicking
    const loadMoreBtn = event.target.closest(".load-more-reviews button");
    loadMoreBtn.style.display = "none";
  }
});

function setupVerticalGallery() {
  const galleryItems = document.querySelectorAll(".gallery-item img");

  // Simple lightbox effect on click
  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Could implement lightbox here
      console.log("Image clicked:", this.src);
    });
  });
}

function initAccordion() {
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  const accordionItems = document.querySelectorAll(".accordion-item");

  if (!accordionHeaders.length) return;

  // Function to toggle accordion state
  function toggleAccordion(accordionItem) {
    const header = accordionItem.querySelector(".accordion-header");
    const icon = header.querySelector(".accordion-icon");
    const isActive = accordionItem.classList.contains("active");
    const isNavigation = icon.classList.contains("chevron-icon");

    if (isNavigation) {
      // For accordions with chevron icons, navigate to a detail page
      console.log("Navigate to:", header.querySelector("h3").textContent);
      // Here you would typically redirect: window.location.href = "detail-page.html"
      return;
    }

    // Close all accordion items that have content
    accordionItems.forEach((item) => {
      if (item.querySelector(".accordion-content")) {
        item.classList.remove("active");
      }
    });

    // Toggle current item if it wasn't already active
    if (!isActive) {
      accordionItem.classList.add("active");

      // Scroll the window to show the accordion content if it's out of view
      const content = accordionItem.querySelector(".accordion-content");
      if (content) {
        setTimeout(() => {
          // Check if the bottom of the accordion is outside the viewport
          const rect = content.getBoundingClientRect();
          const isVisible =
            rect.top >= 0 &&
            rect.bottom <=
              (window.innerHeight || document.documentElement.clientHeight);

          if (!isVisible) {
            // Scroll the window to show the content
            window.scrollTo({
              top: window.scrollY + rect.top - 120, // Add offset to account for header
              behavior: "smooth",
            });
          }
        }, 300); // Slightly longer delay to account for animation
      }
    }
  }

  // Add click event listeners to accordion headers
  accordionHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const accordionItem = this.parentElement;
      toggleAccordion(accordionItem);
    });
  });

  // Make the accordion content itself clickable to collapse it
  accordionItems.forEach((item) => {
    const content = item.querySelector(".accordion-content");
    if (content) {
      content.addEventListener("click", function (e) {
        // Only collapse if we're clicking directly on the content area, not on links or other interactive elements
        if (e.target === this || e.target.tagName === "P") {
          toggleAccordion(item);
        }
      });
    }
  });
}

function initColorSelector() {
  const colorOptions = document.querySelectorAll(".color-option");

  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selected class from all options
      colorOptions.forEach((opt) => opt.classList.remove("selected"));

      // Add selected class to clicked option
      this.classList.add("selected");

      // You could also update the main product image or price here
      const colorName = this.querySelector(".color-name").textContent;
      console.log("Selected color:", colorName);
    });
  });
}

function setupAddToCart() {
  const addToCartBtn = document.querySelector(".add-to-cart");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      // Add to cart logic
      console.log("Adding to cart:", {
        product: document.querySelector(".product-title").textContent,
        price: document.querySelector(".product-price").textContent,
      });

      // Show confirmation
      alert("Item added to your cart!");
    });
  }
}

function setupReadMore() {
  const readMoreBtn = document.querySelector(".read-more");
  const description = document.querySelector(".product-description");

  if (readMoreBtn && description) {
    // Set initial state
    description.classList.remove("expanded");
    readMoreBtn.textContent = "Read more";

    // Function to toggle description state
    function toggleDescription(event) {
      event.preventDefault();

      // Toggle expanded state
      if (description.classList.contains("expanded")) {
        // Collapse
        description.classList.remove("expanded");
        readMoreBtn.textContent = "Read more";

        // Scroll back up to the description top if needed
        window.scrollTo({
          top: description.offsetTop - 120,
          behavior: "smooth",
        });
      } else {
        // Expand
        description.classList.add("expanded");
        readMoreBtn.textContent = "Read less";
      }
    }

    // Add click event listener to both the button and the description
    readMoreBtn.addEventListener("click", toggleDescription);

    // Make the description itself clickable
    description.addEventListener("click", toggleDescription);
  }
}

function setupWishlistHeart() {
  const heartBtn = document.querySelector(".product-heart");

  if (heartBtn) {
    heartBtn.addEventListener("click", function () {
      const heartIcon = this.querySelector("i");

      if (heartIcon.classList.contains("far")) {
        // Add to wishlist
        heartIcon.classList.remove("far");
        heartIcon.classList.add("fas");
        console.log("Added to wishlist");
      } else {
        // Remove from wishlist
        heartIcon.classList.remove("fas");
        heartIcon.classList.add("far");
        console.log("Removed from wishlist");
      }
    });
  }
}
