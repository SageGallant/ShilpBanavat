// Shilp Banavat - Scroll Animations
// This script handles scroll-to-appear animations

document.addEventListener("DOMContentLoaded", function () {
  // Add .animate class to elements we want to animate
  const sections = document.querySelectorAll(
    ".hero-section, .categories-section, .featured-section, .new-arrivals, .trending-section, .services-section"
  );
  sections.forEach((section) => {
    section.classList.add("animate");
  });

  // Add animation classes to product items with staggered delays
  const productItems = document.querySelectorAll(".product-item");
  productItems.forEach((item, index) => {
    item.classList.add("animate");
    item.style.transitionDelay = `${index * 0.08}s`;
  });

  // Add animation classes to category items with staggered delays
  const categoryItems = document.querySelectorAll(".category-item");
  categoryItems.forEach((item, index) => {
    item.classList.add("animate");
    item.style.transitionDelay = `${index * 0.08}s`;
  });

  // Add animation to service items with staggered delays
  const serviceItems = document.querySelectorAll(".service-item");
  serviceItems.forEach((item, index) => {
    item.classList.add("animate");
    item.style.transitionDelay = `${index * 0.08}s`;
  });

  // Function to check if element is in viewport with a more generous threshold
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    // Account for the fixed header height
    const headerHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--header-height"
      ) || "118"
    );
    return (
      rect.top <= windowHeight * 0.85 && // Element enters viewport earlier
      rect.bottom >= headerHeight // Account for fixed header
    );
  }

  // Throttle function to limit scroll event handling
  function throttle(callback, delay) {
    let previousCall = Date.now();
    return function () {
      const currentCall = Date.now();
      if (currentCall - previousCall >= delay) {
        previousCall = currentCall;
        callback.apply(null, arguments);
      }
    };
  }

  // Function to handle scroll animations with improved performance
  function handleScrollAnimations() {
    // Using requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
      const animatedElements = document.querySelectorAll(
        ".animate:not(.visible)"
      );

      animatedElements.forEach((element) => {
        if (isInViewport(element)) {
          element.classList.add("visible");
        }
      });
    });
  }

  // Initial check on page load
  handleScrollAnimations();

  // Check on scroll with throttling for performance
  window.addEventListener("scroll", throttle(handleScrollAnimations, 100));

  // Add smooth scrolling to all internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Get header height dynamically
        const headerHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-height"
          ) || "118"
        );

        // Calculate position accounting for fixed header
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;

        // Smooth scroll with offset for header
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Animate the header on scroll with improved performance
  const header = document.querySelector(".header");
  let lastScrollTop = 0;
  let scrollThreshold = 100;
  let ticking = false;

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (!ticking) {
      window.requestAnimationFrame(function () {
        // Add scrolled class when user has scrolled down
        if (scrollTop > scrollThreshold) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }

        // Only trigger header hiding/showing when scroll difference is significant
        if (Math.abs(scrollTop - lastScrollTop) > 10) {
          if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            // Scrolling down - add compact class
            header.classList.add("header-compact");
          } else {
            // Scrolling up - remove compact class
            header.classList.remove("header-compact");
          }
        }

        lastScrollTop = scrollTop;
        ticking = false;
      });

      ticking = true;
    }
  });
});
