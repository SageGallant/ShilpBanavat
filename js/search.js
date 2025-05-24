/**
 * Shilp Banavat - Search Functionality
 * This file handles all search-related functionality including:
 * - Search overlay in header
 * - Autocomplete suggestions
 * - Fuzzy search matching
 * - Search history
 */

// Initialize search functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initSearch();
});

/**
 * Initialize all search-related functionalities
 */
function initSearch() {
  setupSearchToggle();
  setupSearchForm();
  setupSearchHistory();
}

/**
 * Setup search toggle button in header
 */
function setupSearchToggle() {
  const searchToggle = document.getElementById("search-toggle");

  if (!searchToggle) return;

  // Create search overlay if it doesn't exist
  if (!document.querySelector(".search-overlay")) {
    createSearchOverlay();
  }

  const searchOverlay = document.querySelector(".search-overlay");
  const closeButton = document.querySelector(".search-close");

  // Toggle search overlay visibility
  searchToggle.addEventListener("click", function (e) {
    e.preventDefault();

    searchOverlay.classList.toggle("active");

    if (searchOverlay.classList.contains("active")) {
      // Focus on search input when overlay opens (with a slight delay to ensure the overlay is visible)
      setTimeout(() => {
        const searchInput = document.getElementById("search-input");
        if (searchInput) searchInput.focus();
      }, 10);

      // Disable body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Enable body scroll
      document.body.style.overflow = "";
    }
  });

  // Direct event listener for close button
  if (closeButton) {
    closeButton.addEventListener("click", function (e) {
      e.preventDefault();
      searchOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Close search overlay when clicking on overlay background
  searchOverlay.addEventListener("click", function (e) {
    if (e.target === this) {
      searchOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Close on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
      searchOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

/**
 * Create search overlay HTML structure
 */
function createSearchOverlay() {
  const searchOverlay = document.createElement("div");
  searchOverlay.className = "search-overlay";

  // Determine the correct path for form action based on current page
  const isSubpage = window.location.pathname.includes("/pages/");
  const searchResultsPath = isSubpage
    ? "search-results.html"
    : "pages/search-results.html";

  searchOverlay.innerHTML = `
        <div class="search-container">
            <button class="search-close" aria-label="Close search">&times;</button>
            <div class="search-brand">SHILP BANAVAT</div>
            <form class="search-form" action="${searchResultsPath}" method="GET">
                <div class="search-input-group">
                    <input type="text" id="search-input" name="q" placeholder="Search for products" autocomplete="off">
                    <button type="button" class="search-button">Clear</button>
                </div>
            </form>
            
            <div class="search-trending-searches">
                <div class="trending-searches-title">TRENDING SEARCHES</div>
                <div class="trending-searches-items">
                    <a href="#" class="trending-search-item" data-search="bags">bags</a>
                    <a href="#" class="trending-search-item" data-search="wallet">wallet</a>
                    <a href="#" class="trending-search-item" data-search="jewelry">jewelry</a>
                    <a href="#" class="trending-search-item" data-search="scarves">scarves</a>
                    <a href="#" class="trending-search-item" data-search="home decor">home decor</a>
                </div>
            </div>
            
            <div class="search-suggestions"></div>
            
            <div class="search-results-container">
                <div class="search-results-stats"></div>
                <div class="search-filters-container" style="display: none;">
                    <button class="search-filters-button">Filters <i class="fas fa-sliders-h"></i></button>
                </div>
                <div class="search-results-grid"></div>
            </div>
            
            <div class="search-default-content">
                <div class="search-category-section">
                    <h2 class="search-category-title">New Products</h2>
                    <div class="search-category-grid new-products-grid"></div>
                </div>
                
                <div class="search-category-section">
                    <h2 class="search-category-title">Trending Now</h2>
                    <div class="search-category-grid trending-products-grid"></div>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(searchOverlay);

  // Add the necessary styles
  if (!document.getElementById("search-styles")) {
    const style = document.createElement("style");
    style.id = "search-styles";
    style.textContent = `
            .search-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #fff;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                align-items: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s ease, visibility 0.2s ease;
                overflow-y: auto;
            }
            
            .search-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .search-container {
                width: 100%;
                max-width: 1200px;
                padding: 0 2rem;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-bottom: 4rem;
            }
            
            .search-brand {
                font-size: 1.75rem;
                letter-spacing: 1.5px;
                font-weight: 500;
                margin: 2rem 0;
                color: #000;
            }
            
            .search-close {
                position: absolute;
                top: 1.7rem;
                right: 2rem;
                background: none;
                border: none;
                font-size: 2.5rem;
                cursor: pointer;
                color: #000;
                opacity: 0.7;
                padding: 5px;
                line-height: 1;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity 0.2s ease, transform 0.2s ease;
            }
            
            .search-close:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            
            .search-form {
                width: 100%;
                max-width: 720px;
                margin-bottom: 2rem;
            }
            
            .search-input-group {
                display: flex;
                align-items: center;
                border: 1px solid #e0e0e0;
                border-radius: 50px;
                padding: 0 25px;
                background: #fff;
                position: relative;
            }
            
            .search-input-group input {
                flex: 1;
                border: none;
                padding: 18px 15px;
                font-size: 1.1rem;
                background: transparent;
                font-weight: 400;
                color: #000;
                font-family: inherit;
            }
            
            .search-input-group input::placeholder {
                color: #999;
                font-size: 1.05rem;
            }
            
            .search-input-group input:focus {
                outline: none;
            }
            
            .search-button {
                background: none;
                border: none;
                padding: 10px;
                font-size: 0.9rem;
                color: #999;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-weight: 400;
            }
            
            .search-button:hover {
                color: #000;
            }
            
            /* Trending searches styles */
            .search-trending-searches {
                width: 100%;
                max-width: 720px;
                margin-bottom: 1.5rem;
            }
            
            .trending-searches-title {
                font-size: 0.8rem;
                color: #777;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 1rem;
                text-align: center;
            }
            
            .trending-searches-items {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 1.5rem;
            }
            
            .trending-search-item {
                color: #333;
                text-decoration: none;
                font-size: 0.95rem;
                transition: color 0.2s ease;
            }
            
            .trending-search-item:hover {
                color: #000;
                text-decoration: underline;
            }
            
            .search-suggestions {
                width: 100%;
                max-width: 720px;
                margin-bottom: 2rem;
            }
            
            .search-suggestion {
                display: flex;
                align-items: center;
                padding: 0.9rem 1.2rem;
                cursor: pointer;
            }
            
            .search-suggestion:hover {
                background-color: #f8f8f8;
            }
            
            .search-suggestion i {
                color: #666;
                margin-right: 1.2rem;
                font-size: 1rem;
            }
            
            .search-suggestion span {
                color: #333;
                font-size: 1.05rem;
            }
            
            .search-suggestion .highlight {
                font-weight: 500;
            }
            
            .search-results-container {
                width: 100%;
                max-width: 1200px;
                position: relative;
                display: none;
            }
            
            .search-results-stats {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                font-size: 1rem;
                color: #666;
                padding-left: 0.5rem;
            }
            
            .search-results-grid {
                flex: 1;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
                gap: 2.5rem;
                width: 100%;
                margin-bottom: 2rem;
            }
            
            /* Default content styles */
            .search-default-content {
                width: 100%;
                max-width: 1200px;
            }
            
            .search-category-section {
                margin-bottom: 3rem;
                width: 100%;
            }
            
            .search-category-title {
                font-size: 1.2rem;
                font-weight: 400;
                margin-bottom: 1.5rem;
                color: #000;
                padding-left: 0.5rem;
            }
            
            .search-category-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 2rem;
                width: 100%;
                background-color: #f9f9f9;
                padding: 2rem;
            }
            
            .search-product-item {
                display: flex;
                flex-direction: column;
                position: relative;
                cursor: pointer;
            }
            
            .search-product-img {
                width: 100%;
                aspect-ratio: 1;
                object-fit: cover;
                margin-bottom: 1rem;
                background-color: #fff;
            }
            
            .search-product-info {
                display: flex;
                flex-direction: column;
            }
            
            .search-product-name {
                font-size: 0.9rem;
                margin-bottom: 0.3rem;
                color: #000;
                font-weight: 400;
            }
            
            .search-product-price {
                font-size: 0.85rem;
                color: #333;
            }
            
            .search-product-tag {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: #f5f5f5;
                padding: 0.3rem 0.7rem;
                font-size: 0.75rem;
                color: #333;
                text-transform: uppercase;
            }
            
            .search-wishlist-btn {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                padding: 0.5rem;
                font-size: 1.2rem;
                z-index: 2;
            }
            
            .search-wishlist-btn:hover {
                color: #000;
            }
            
            .search-result-item {
                display: flex;
                flex-direction: column;
                position: relative;
                cursor: pointer;
            }
            
            .search-result-img {
                width: 100%;
                aspect-ratio: 1;
                object-fit: contain;
                margin-bottom: 1.2rem;
                background-color: #f9f9f9;
            }
            
            .search-result-info {
                display: flex;
                flex-direction: column;
            }
            
            .search-result-name {
                font-size: 1rem;
                margin-bottom: 0.3rem;
                color: #000;
                font-weight: 400;
            }
            
            .search-result-price {
                font-size: 0.95rem;
                color: #333;
            }
            
            .search-result-tag {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: #f5f5f5;
                padding: 0.3rem 0.7rem;
                font-size: 0.75rem;
                color: #333;
                text-transform: uppercase;
            }
            
            .search-filters-container {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 1.5rem;
                width: 100%;
            }
            
            .search-filters-button {
                border: 1px solid #e0e0e0;
                background: #fff;
                padding: 0.7rem 1.5rem;
                border-radius: 30px;
                cursor: pointer;
                font-size: 0.95rem;
                display: flex;
                align-items: center;
                color: #333;
            }
            
            .search-filters-button i {
                margin-left: 0.5rem;
                font-size: 0.9rem;
            }
            
            .search-filters-button:hover {
                background: #f8f8f8;
            }
            
            @media (max-width: 992px) {
                .search-results-grid,
                .search-category-grid {
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 1.5rem;
                }
                
                .search-category-grid {
                    padding: 1.5rem;
                }
            }
            
            @media (max-width: 768px) {
                .search-container {
                    padding: 0 1.5rem 3rem;
                }
                
                .search-brand {
                    font-size: 1.5rem;
                    margin: 1.5rem 0;
                }
                
                .search-close {
                    top: 1.2rem;
                    right: 1.5rem;
                    font-size: 2rem;
                }
                
                .trending-searches-items {
                    gap: 1rem;
                }
                
                .search-results-grid,
                .search-category-grid {
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 1.2rem;
                }
                
                .search-input-group input {
                    padding: 15px 12px;
                    font-size: 1rem;
                }
                
                .search-category-grid {
                    padding: 1rem;
                }
            }
        `;
    document.head.appendChild(style);
  }

  // Initialize the clear button
  const clearBtn = searchOverlay.querySelector(".search-button");
  const searchInput = searchOverlay.querySelector("#search-input");

  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", function () {
      searchInput.value = "";
      searchInput.focus();
      const suggestionsContainer = document.querySelector(
        ".search-suggestions"
      );
      const resultsGrid = document.querySelector(".search-results-grid");
      const statsContainer = document.querySelector(".search-results-stats");
      const filtersContainer = document.querySelector(
        ".search-filters-container"
      );
      const resultsContainer = document.querySelector(
        ".search-results-container"
      );
      const defaultContent = document.querySelector(".search-default-content");

      if (suggestionsContainer) suggestionsContainer.innerHTML = "";
      if (resultsGrid) resultsGrid.innerHTML = "";
      if (statsContainer) statsContainer.innerHTML = "";
      if (filtersContainer) filtersContainer.style.display = "none";

      // Show default content and hide search results
      if (resultsContainer) resultsContainer.style.display = "none";
      if (defaultContent) defaultContent.style.display = "block";
    });
  }

  // Setup trending search items
  document.querySelectorAll(".trending-search-item").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const searchTerm = this.dataset.search;
      if (searchInput) {
        searchInput.value = searchTerm;
        searchInput.dispatchEvent(new Event("input"));
      }
    });
  });

  // Initialize the default product sections
  loadDefaultProducts();
}

/**
 * Load default product sections with featured and new products
 */
async function loadDefaultProducts() {
  try {
    const products = await fetchProducts();

    if (!products?.length) return;

    // Get new products (assuming products have a 'new' property or sort by date)
    const newProducts = products
      .filter((product) => product.new || Math.random() > 0.5) // For demo, random selection
      .slice(0, 6);

    // Get trending products (for demo, just using different products)
    const trendingProducts = products
      .filter(
        (product) => !newProducts.includes(product) || Math.random() > 0.7
      )
      .slice(0, 6);

    // Render new products
    const newProductsGrid = document.querySelector(".new-products-grid");
    if (newProductsGrid) {
      newProductsGrid.innerHTML = renderProductGrid(newProducts, true);
    }

    // Render trending products
    const trendingProductsGrid = document.querySelector(
      ".trending-products-grid"
    );
    if (trendingProductsGrid) {
      trendingProductsGrid.innerHTML = renderProductGrid(trendingProducts);
    }

    // Add event listeners to products
    document.querySelectorAll(".search-product-item").forEach((item) => {
      item.addEventListener("click", function (e) {
        if (e.target.closest(".search-wishlist-btn")) return;

        const productId = this.dataset.id;
        const isSubpage = window.location.pathname.includes("/pages/");
        const productDetailPath = isSubpage
          ? `product-detail.html?id=${productId}`
          : `pages/product-detail.html?id=${productId}`;

        window.location.href = productDetailPath;
      });
    });

    // Initialize wishlist buttons
    document
      .querySelectorAll(".search-product-item .search-wishlist-btn")
      .forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          const icon = this.querySelector("i");
          if (icon.classList.contains("far")) {
            icon.classList.remove("far");
            icon.classList.add("fas");
          } else {
            icon.classList.remove("fas");
            icon.classList.add("far");
          }
        });
      });
  } catch (error) {
    console.error("Error loading default products:", error);
  }
}

/**
 * Render a product grid with given products
 * @param {Array} products - Array of product objects
 * @param {boolean} isNew - Whether to mark products as new
 * @returns {string} HTML string of product grid
 */
function renderProductGrid(products, isNew = false) {
  if (!products?.length) return "";

  return products
    .map((product) => {
      // Fix image path if needed
      let imagePath = product.image;
      const isSubpage = window.location.pathname.includes("/pages/");
      if (isSubpage && imagePath.startsWith("../")) {
        imagePath = imagePath.replace("../", "");
      } else if (!isSubpage && !imagePath.startsWith("../")) {
        imagePath = "../" + imagePath;
      }

      // Create product HTML
      return `
      <div class="search-product-item" data-id="${product.id}">
        <img src="${imagePath}" alt="${
        product.name
      }" class="search-product-img">
        <button class="search-wishlist-btn"><!-- "far fa-heart" icon removed --></button>
        ${
          isNew || product.new
            ? '<span class="search-product-tag">NEW</span>'
            : ""
        }
        <div class="search-product-info">
          <div class="search-product-name">${product.name}</div>
          <div class="search-product-price">$${product.price.toFixed(2)}</div>
        </div>
      </div>
    `;
    })
    .join("");
}

/**
 * Setup search form and autocomplete functionality
 */
function setupSearchForm() {
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.getElementById("search-input");
  const suggestionsContainer = document.querySelector(".search-suggestions");
  const resultsGrid = document.querySelector(".search-results-grid");
  const statsContainer = document.querySelector(".search-results-stats");
  const resultsContainer = document.querySelector(".search-results-container");
  const defaultContent = document.querySelector(".search-default-content");

  if (!searchForm || !searchInput) return;

  // Handle form submission
  searchForm.addEventListener("submit", function (e) {
    const query = searchInput.value.trim();

    if (query === "") {
      e.preventDefault();
      return;
    }
  });

  // Handle input for live search
  let debounceTimeout;
  searchInput.addEventListener("input", function () {
    const query = this.value.trim();

    // Clear previous timeout
    clearTimeout(debounceTimeout);

    if (query.length < 1) {
      if (suggestionsContainer) suggestionsContainer.innerHTML = "";
      if (resultsGrid) resultsGrid.innerHTML = "";
      if (statsContainer) statsContainer.innerHTML = "";

      // Show default content when search is cleared
      if (resultsContainer) resultsContainer.style.display = "none";
      if (defaultContent) defaultContent.style.display = "block";
      return;
    }

    // Hide default content and show search results when typing
    if (resultsContainer) resultsContainer.style.display = "block";
    if (defaultContent) defaultContent.style.display = "none";

    // Debounce to prevent excessive API calls
    debounceTimeout = setTimeout(function () {
      updateSearchSuggestions(query);
      updateSearchResults(query);
    }, 300);
  });
}

/**
 * Update search suggestions based on query
 * @param {string} query - The search query
 */
async function updateSearchSuggestions(query) {
  const suggestionsContainer = document.querySelector(".search-suggestions");
  if (!suggestionsContainer) return;

  try {
    // Get common search terms that match query
    const suggestions = [
      { text: query + " bags", type: "category" },
      { text: query + " nano", type: "variation" },
    ];

    // Create suggestions HTML
    const suggestionsHTML = suggestions
      .map((suggestion) => {
        return `
          <div class="search-suggestion" data-value="${suggestion.text}">
            <i class="fas fa-search"></i>
            <span>${highlightMatch(suggestion.text, query)}</span>
          </div>
        `;
      })
      .join("");

    suggestionsContainer.innerHTML = suggestionsHTML;

    // Add event listeners to suggestions
    document.querySelectorAll(".search-suggestion").forEach((suggestion) => {
      suggestion.addEventListener("click", function () {
        const value = this.dataset.value;
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
          searchInput.value = value;
          searchInput.dispatchEvent(new Event("input"));
        }
      });
    });
  } catch (error) {
    console.error("Error generating search suggestions:", error);
  }
}

/**
 * Update search results based on query
 * @param {string} query - The search query
 */
async function updateSearchResults(query) {
  const resultsGrid = document.querySelector(".search-results-grid");
  const statsContainer = document.querySelector(".search-results-stats");
  const filtersContainer = document.querySelector(".search-filters-container");

  if (!resultsGrid || !statsContainer) return;

  try {
    // Fetch products data
    const products = await fetchProducts();

    // Perform search
    const results = performFuzzySearch(products, query, { limit: 12 });

    // Update stats and show filters if there are results
    if (results.length > 0) {
      statsContainer.innerHTML = `<span>${results.length} Search Results</span>`;
      if (filtersContainer) {
        filtersContainer.style.display = "flex";
      }
    } else {
      statsContainer.innerHTML = "";
      if (filtersContainer) {
        filtersContainer.style.display = "none";
      }
    }

    if (results.length === 0) {
      resultsGrid.innerHTML = `<div class="no-results">No products found matching "${query}"</div>`;
      return;
    }

    // Create results HTML
    const resultsHTML = results
      .map((product) => {
        // Fix image path if needed
        let imagePath = product.image;
        const isSubpage = window.location.pathname.includes("/pages/");
        if (isSubpage && imagePath.startsWith("../")) {
          imagePath = imagePath.replace("../", "");
        } else if (!isSubpage && !imagePath.startsWith("../")) {
          imagePath = "../" + imagePath;
        }

        // Create product HTML
        return `
          <div class="search-result-item" data-id="${product.id}">
            <img src="${imagePath}" alt="${
          product.name
        }" class="search-result-img">
            <button class="search-wishlist-btn"><!-- "far fa-heart" icon removed --></button>
            ${product.new ? '<span class="search-result-tag">NEW</span>' : ""}
            <div class="search-result-info">
              <div class="search-result-name">${product.name}</div>
              <div class="search-result-price">$${product.price.toFixed(
                2
              )}</div>
            </div>
          </div>
        `;
      })
      .join("");

    resultsGrid.innerHTML = resultsHTML;

    // Add event listeners to results
    document.querySelectorAll(".search-result-item").forEach((item) => {
      item.addEventListener("click", function (e) {
        // Don't trigger if clicking on wishlist button
        if (e.target.closest(".search-wishlist-btn")) return;

        const isSubpage = window.location.pathname.includes("/pages/");
        const productDetailPath = isSubpage
          ? `product-detail.html?id=${this.dataset.id}`
          : `pages/product-detail.html?id=${this.dataset.id}`;

        window.location.href = productDetailPath;
      });
    });

    // Initialize wishlist buttons
    document.querySelectorAll(".search-wishlist-btn").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const icon = this.querySelector("i");
        if (icon.classList.contains("far")) {
          icon.classList.remove("far");
          icon.classList.add("fas");
        } else {
          icon.classList.remove("fas");
          icon.classList.add("far");
        }
      });
    });
  } catch (error) {
    console.error("Error updating search results:", error);
    resultsGrid.innerHTML = `<div class="no-results">Error loading search results</div>`;
    if (filtersContainer) {
      filtersContainer.style.display = "none";
    }
  }
}

/**
 * Setup search history functionality
 */
function setupSearchHistory() {
  displaySearchHistory();

  // Add click event listeners for history items
  document.addEventListener("click", function (e) {
    // Handle clicking on a history item
    if (e.target.closest(".search-history-item")) {
      const searchTerm = e.target
        .closest(".search-history-item")
        .querySelector("span").textContent;
      if (document.getElementById("search-input")) {
        document.getElementById("search-input").value = searchTerm;
      }

      // Determine the correct path based on current page
      const isSubpage = window.location.pathname.includes("/pages/");
      const searchResultsPath = isSubpage
        ? `search-results.html?q=${encodeURIComponent(searchTerm)}`
        : `pages/search-results.html?q=${encodeURIComponent(searchTerm)}`;

      window.location.href = searchResultsPath;
    }

    // Handle removing a history item
    if (e.target.closest(".search-history-remove")) {
      e.preventDefault();
      e.stopPropagation();
      const item = e.target.closest(".search-history-item");
      const searchTerm = item.querySelector("span").textContent;
      removeSearchFromHistory(searchTerm);
      item.remove();
    }
  });
}

/**
 * Display search history in the UI
 */
function displaySearchHistory() {
  const historyList = document.querySelector(".search-history-list");
  if (!historyList) return;

  const searchHistory = getSearchHistory();

  if (searchHistory.length === 0) {
    document.querySelector(".search-history").style.display = "none";
    return;
  }

  document.querySelector(".search-history").style.display = "block";

  // Create history items HTML
  const historyHTML = searchHistory
    .map(
      (term) => `
        <li class="search-history-item">
            <span>${term}</span>
            <button class="search-history-remove"><i class="fas fa-times"></i></button>
        </li>
    `
    )
    .join("");

  historyList.innerHTML = historyHTML;
}

/**
 * Get search history from localStorage
 * @returns {Array} Array of search terms
 */
function getSearchHistory() {
  return JSON.parse(localStorage.getItem("searchHistory") || "[]");
}

/**
 * Save search term to history
 * @param {string} term - The search term to save
 */
function saveSearchToHistory(term) {
  if (!term) return;

  let searchHistory = getSearchHistory();

  // Remove the term if it already exists (to avoid duplicates)
  searchHistory = searchHistory.filter((item) => item !== term);

  // Add the new term at the beginning
  searchHistory.unshift(term);

  // Keep only the last 5 searches
  searchHistory = searchHistory.slice(0, 5);

  // Save to localStorage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  // Update display
  displaySearchHistory();
}

/**
 * Remove search term from history
 * @param {string} term - The search term to remove
 */
function removeSearchFromHistory(term) {
  let searchHistory = getSearchHistory();
  searchHistory = searchHistory.filter((item) => item !== term);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

/**
 * Fetch products data from JSON file
 * @returns {Promise<Array>} Promise that resolves to products array
 */
async function fetchProducts() {
  try {
    // Determine the correct path to products.json based on current page
    const isSubpage = window.location.pathname.includes("/pages/");
    const productsPath = isSubpage
      ? "../js/data/products.json"
      : "js/data/products.json";

    const response = await fetch(productsPath);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return empty array on error
  }
}

/**
 * Perform fuzzy search on products
 * @param {Array} products - Array of product objects
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Array} Array of matching products
 */
function performFuzzySearch(products, query, options = {}) {
  const { limit = 10, threshold = 0.3 } = options;

  if (!query || !products?.length) return [];

  query = query.toLowerCase();

  // Get score for each product
  const scoredProducts = products.map((product) => {
    // Search in multiple fields with different weights
    const nameScore = fuzzyMatch(product.name.toLowerCase(), query) * 2; // Name is most important
    const descScore = fuzzyMatch(product.description.toLowerCase(), query);
    const categoryScore =
      fuzzyMatch(product.category.toLowerCase(), query) * 1.5;

    // Search in tags
    let tagScore = 0;
    if (product.tags && product.tags.length) {
      const tagMatches = product.tags.map((tag) =>
        fuzzyMatch(tag.toLowerCase(), query)
      );
      tagScore = Math.max(...tagMatches) * 1.2;
    }

    // Get best score
    const score = Math.max(nameScore, descScore, categoryScore, tagScore);

    return {
      ...product,
      score,
    };
  });

  // Filter by threshold and sort by score
  return scoredProducts
    .filter((product) => product.score > threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Fuzzy matching algorithm
 * @param {string} str - String to search in
 * @param {string} query - Query to search for
 * @returns {number} Match score between 0 and 1
 */
function fuzzyMatch(str, query) {
  if (str.includes(query)) {
    return 1; // Exact substring match
  }

  let score = 0;
  let queryIndex = 0;

  // Check for characters appearing in order
  for (let i = 0; i < str.length; i++) {
    if (queryIndex < query.length && str[i] === query[queryIndex]) {
      score += 1;
      queryIndex++;
    }
  }

  return queryIndex === query.length ? score / (str.length + query.length) : 0;
}

/**
 * Highlight matched text in string
 * @param {string} text - Text to highlight matches in
 * @param {string} query - Query to highlight
 * @returns {string} HTML with highlighted matches
 */
function highlightMatch(text, query) {
  if (!query) return text;

  // Case insensitive search
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return text.replace(regex, '<span class="highlight">$1</span>');
}

// Make functions available globally
window.performFuzzySearch = performFuzzySearch;
window.highlightMatch = highlightMatch;
