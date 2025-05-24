/**
 * Shilp Banavat - Search Results Page Functionality
 * This file handles the display of search results and advanced filtering options
 */

document.addEventListener("DOMContentLoaded", function () {
  initSearchResults();
});

/**
 * Initialize search results functionality
 */
async function initSearchResults() {
  // Get search query from URL
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("q");

  if (!searchQuery) {
    showNoResultsMessage("No search query provided.");
    return;
  }

  // Set the search query in the header search input
  if (document.getElementById("search-results-query")) {
    document.getElementById("search-results-query").textContent = searchQuery;
  }

  // Load filter options
  initializeFilters();

  try {
    // Fetch products data
    const products = await fetchProducts();

    // Get filter parameters from URL
    const category = searchParams.get("category");
    const priceMin = searchParams.get("price_min");
    const priceMax = searchParams.get("price_max");
    const tags = searchParams.getAll("tag");

    // Apply search and filters
    const searchResults = getSearchResults(products, searchQuery, {
      category,
      priceMin: priceMin ? parseFloat(priceMin) : null,
      priceMax: priceMax ? parseFloat(priceMax) : null,
      tags,
    });

    if (searchResults.length === 0) {
      showNoResultsMessage(`No products found matching "${searchQuery}"`);
      return;
    }

    // Display results count
    updateResultsCount(searchResults.length);

    // Add sort functionality
    initSortOptions(searchResults);

    // Display results
    displaySearchResults(searchResults, searchQuery);

    // Initialize applied filters display
    displayAppliedFilters({
      query: searchQuery,
      category,
      priceMin,
      priceMax,
      tags,
    });
  } catch (error) {
    console.error("Error loading search results:", error);
    showNoResultsMessage(
      "Error loading search results. Please try again later."
    );
  }
}

/**
 * Fetch products data from JSON file
 * @returns {Promise<Array>} Promise that resolves to products array
 */
async function fetchProducts() {
  try {
    const response = await fetch("../js/data/products.json");
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
 * Apply search and filters to get results
 * @param {Array} products - Products array
 * @param {string} query - Search query
 * @param {Object} filters - Filter options
 * @returns {Array} Filtered search results
 */
function getSearchResults(products, query, filters = {}) {
  // First perform the search
  let results = performFuzzySearch(products, query);

  // Then apply filters
  if (filters.category) {
    results = results.filter(
      (product) =>
        product.category.toLowerCase() === filters.category.toLowerCase()
    );
  }

  if (filters.priceMin !== null) {
    results = results.filter((product) => product.price >= filters.priceMin);
  }

  if (filters.priceMax !== null) {
    results = results.filter((product) => product.price <= filters.priceMax);
  }

  if (filters.tags && filters.tags.length > 0) {
    results = results.filter((product) =>
      filters.tags.some((tag) =>
        product.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
      )
    );
  }

  return results;
}

/**
 * Display search results in the UI
 * @param {Array} results - Search results array
 * @param {string} query - Search query for highlighting
 */
function displaySearchResults(results, query) {
  const resultsContainer = document.querySelector(".search-results-grid");
  if (!resultsContainer) return;

  const resultsHTML = results
    .map((product) => {
      const highlightedName = highlightMatch(product.name, query);
      const highlightedDesc = highlightMatch(product.description, query);

      // Fix image path if needed
      let imagePath = product.image;
      if (imagePath.startsWith("../")) {
        imagePath = imagePath.replace("../", "");
      }

      // Create tags HTML with refined styling
      const tagsHTML = product.tags
        .map((tag) => `<span class="tag">${tag}</span>`)
        .join("");

      return `
      <div class="search-result-item" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${imagePath}" alt="${product.name}">
          <button class="wishlist-btn"><!-- "far fa-heart" icon removed --></button>
        </div>
        <div class="product-info">
          <div class="product-category">
            <span class="category-tag">${product.category}</span>
          </div>
          <h3><a href="product-detail.html?id=${
            product.id
          }">${highlightedName}</a></h3>
          <p class="price">$${product.price.toFixed(2)}</p>
          <p class="description">${highlightedDesc}</p>
          <div class="product-tags">
            ${tagsHTML}
          </div>
          <a href="product-detail.html?id=${
            product.id
          }" class="btn-view-product">View Details</a>
        </div>
      </div>
    `;
    })
    .join("");

  resultsContainer.innerHTML = resultsHTML;

  // Add premium styling for search results
  if (!document.getElementById("search-results-styles")) {
    const style = document.createElement("style");
    style.id = "search-results-styles";
    style.textContent = `
      .search-result-item {
        display: flex;
        gap: 2rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        padding-bottom: 2.5rem;
        margin-bottom: 2.5rem;
        position: relative;
        transition: transform 0.3s ease;
      }
      
      .search-result-item:hover {
        transform: translateY(-3px);
      }
      
      .search-result-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      
      .search-result-item .product-image {
        width: 220px;
        height: 220px;
        position: relative;
        overflow: hidden;
        border-radius: 6px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
      }
      
      .search-result-item .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }
      
      .search-result-item:hover .product-image img {
        transform: scale(1.05);
      }
      
      .search-result-item .wishlist-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, background-color 0.2s ease;
        opacity: 0.9;
      }
      
      .search-result-item .wishlist-btn:hover {
        transform: scale(1.1);
        background-color: #fff;
        opacity: 1;
      }
      
      .search-result-item .product-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-top: 0.5rem;
      }
      
      .search-result-item h3 {
        margin-top: 0.5rem;
        margin-bottom: 0.75rem;
        font-size: 1.4rem;
        font-weight: 400;
        line-height: 1.3;
      }
      
      .search-result-item h3 a {
        color: #222;
        text-decoration: none;
        transition: color 0.2s ease;
      }
      
      .search-result-item h3 a:hover {
        color: #555;
      }
      
      .search-result-item .price {
        font-weight: 500;
        margin-bottom: 1rem;
        font-size: 1.1rem;
        color: #333;
      }
      
      .search-result-item .description {
        color: #777;
        margin-bottom: 1.5rem;
        font-size: 0.95rem;
        line-height: 1.6;
        font-weight: 300;
        max-width: 90%;
      }
      
      .search-result-item .product-category {
        margin-bottom: 0.25rem;
      }
      
      .category-tag {
        display: inline-block;
        background-color: rgba(0, 0, 0, 0.03);
        padding: 0.3rem 0.8rem;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #666;
        border-radius: 3px;
        font-weight: 500;
      }
      
      .product-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
      }
      
      .tag {
        background-color: rgba(0, 0, 0, 0.02);
        padding: 0.25rem 0.6rem;
        font-size: 0.75rem;
        border-radius: 3px;
        color: #777;
        transition: background-color 0.2s ease, color 0.2s ease;
      }
      
      .tag:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: #555;
      }
      
      .btn-view-product {
        align-self: flex-start;
        padding: 0.8rem 1.7rem;
        background-color: #000;
        color: #fff;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 1.5px;
        margin-top: auto;
        border-radius: 3px;
        transition: background-color 0.3s ease, transform 0.2s ease;
        border: 1px solid #000;
      }
      
      .btn-view-product:hover {
        background-color: #222;
        transform: translateY(-2px);
      }
      
      .highlight {
        background-color: rgba(255, 239, 165, 0.4);
        font-weight: normal;
        padding: 0 2px;
        border-radius: 2px;
      }
      
      /* Responsive styles */
      @media (max-width: 992px) {
        .search-result-item {
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .search-result-item .product-image {
          width: 100%;
          height: 280px;
        }
        
        .search-result-item .description {
          max-width: 100%;
        }
      }
      
      @media (max-width: 576px) {
        .search-result-item .product-image {
          height: 220px;
        }
        
        .search-result-item h3 {
          font-size: 1.2rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Also style the search filters and controls to match
  if (!document.getElementById("search-filters-styles")) {
    const filtersStyle = document.createElement("style");
    filtersStyle.id = "search-filters-styles";
    filtersStyle.textContent = `
      .search-header {
        margin-bottom: 2.5rem;
      }
      
      .search-title {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        font-weight: 300;
        letter-spacing: 1px;
      }
      
      .results-count {
        color: #777;
        font-size: 1rem;
        font-weight: 300;
      }
      
      .search-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding: 1rem 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }
      
      .sort-container {
        display: flex;
        align-items: center;
      }
      
      .sort-container label {
        margin-right: 0.75rem;
        color: #666;
        font-weight: 300;
      }
      
      .sort-select {
        padding: 0.5rem 1rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        background-color: #fff;
        font-size: 0.9rem;
        color: #333;
        cursor: pointer;
      }
      
      .filter-toggle {
        padding: 0.8rem 1.5rem;
        background-color: #000;
        color: #fff;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        font-size: 0.9rem;
        letter-spacing: 0.5px;
        transition: background-color 0.3s ease;
      }
      
      .filter-toggle:hover {
        background-color: #222;
      }
      
      .filters-container {
        padding: 1.5rem;
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      }
      
      .filters-container h2 {
        font-size: 1.2rem;
        margin-bottom: 1.5rem;
        font-weight: 400;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }
      
      .filter-heading {
        font-weight: 400;
        color: #444;
        letter-spacing: 0.5px;
      }
      
      .filter-checkbox {
        margin-right: 0.75rem;
        position: relative;
        top: 1px;
      }
      
      .filter-button {
        margin-top: 1.5rem;
        padding: 0.8rem 0;
        letter-spacing: 1px;
        border-radius: 4px;
        transition: background-color 0.3s ease;
        font-weight: 400;
      }
      
      .filter-button:hover {
        background-color: #222;
      }
      
      .applied-filters {
        margin-bottom: 2rem;
      }
      
      .applied-filter {
        background-color: rgba(0, 0, 0, 0.03);
        border-radius: 4px;
        padding: 0.5rem 1rem;
        transition: background-color 0.2s ease;
      }
      
      .applied-filter:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      .clear-all-filters {
        background: none;
        border: 1px solid rgba(0, 0, 0, 0.1);
        padding: 0.6rem 1rem;
        border-radius: 4px;
        transition: background-color 0.2s ease, border-color 0.2s ease;
        font-size: 0.85rem;
      }
      
      .clear-all-filters:hover {
        background-color: rgba(0, 0, 0, 0.02);
        border-color: rgba(0, 0, 0, 0.2);
      }
      
      .no-results {
        text-align: center;
        padding: 4rem 2rem;
        background-color: rgba(0, 0, 0, 0.01);
        border-radius: 8px;
      }
      
      .no-results i {
        font-size: 3.5rem;
        margin-bottom: 1.5rem;
        color: rgba(0, 0, 0, 0.1);
      }
      
      .no-results h2 {
        margin-bottom: 1rem;
        font-weight: 300;
        font-size: 1.8rem;
        color: #333;
      }
      
      .no-results p {
        color: #777;
        margin-bottom: 2rem;
        font-weight: 300;
      }
      
      .no-results .btn-primary {
        display: inline-block;
        margin-top: 0.5rem;
        padding: 0.9rem 2rem;
        background-color: #000;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
        font-size: 0.9rem;
        letter-spacing: 1px;
        transition: background-color 0.3s ease, transform 0.2s ease;
      }
      
      .no-results .btn-primary:hover {
        background-color: #222;
        transform: translateY(-2px);
      }
    `;
    document.head.appendChild(filtersStyle);
  }

  // Initialize wishlist buttons for the newly added products
  initWishlistButtons();
}

/**
 * Show no results message
 * @param {string} message - Message to display
 */
function showNoResultsMessage(message) {
  const resultsContainer = document.querySelector(".search-results-container");
  if (!resultsContainer) return;

  resultsContainer.innerHTML = `
        <div class="no-results">
            <i class="fas fa-search"></i>
            <h2>${message}</h2>
            <p>Try different keywords or browse our categories.</p>
            <a href="../index.html" class="btn-primary">Back to Home</a>
        </div>
    `;
}

/**
 * Update results count in the UI
 * @param {number} count - Number of results
 */
function updateResultsCount(count) {
  const countElement = document.querySelector(".results-count");
  if (countElement) {
    countElement.textContent = `${count} results found`;
  }
}

/**
 * Initialize sort options functionality
 * @param {Array} results - Search results array
 */
function initSortOptions(results) {
  const sortSelect = document.getElementById("sort-by");
  if (!sortSelect) return;

  sortSelect.addEventListener("change", function () {
    const sortOption = this.value;
    const sortedResults = [...results]; // Create a copy

    switch (sortOption) {
      case "price-low":
        sortedResults.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sortedResults.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sortedResults.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedResults.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sort by relevance (score)
        sortedResults.sort((a, b) => b.score - a.score);
    }

    // Get the current query from URL to highlight terms
    const query = new URLSearchParams(window.location.search).get("q") || "";

    // Re-display with new order
    displaySearchResults(sortedResults, query);
  });
}

/**
 * Initialize filter options
 */
function initializeFilters() {
  setupFilterForm();
  setupPriceRangeSlider();
  setupFilterAccordion();
  setupMobileFilterToggle();
}

/**
 * Setup filter form submission
 */
function setupFilterForm() {
  const filterForm = document.getElementById("filter-form");
  if (!filterForm) return;

  filterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get current search query
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get("q") || "";

    // Build new URL with filters
    const newUrl = buildFilterUrl(query, this);

    // Navigate to filtered results
    window.location.href = newUrl;
  });
}

/**
 * Build URL with filters from form
 * @param {string} query - Search query
 * @param {HTMLFormElement} form - Filter form
 * @returns {string} URL with filters
 */
function buildFilterUrl(query, form) {
  const formData = new FormData(form);
  const params = new URLSearchParams();

  // Add search query
  params.append("q", query);

  // Add category if selected
  const category = formData.get("category");
  if (category && category !== "all") {
    params.append("category", category);
  }

  // Add price range if set
  const priceMin = formData.get("price_min");
  const priceMax = formData.get("price_max");

  if (priceMin) params.append("price_min", priceMin);
  if (priceMax) params.append("price_max", priceMax);

  // Add selected tags
  const tags = formData.getAll("tag");
  tags.forEach((tag) => {
    if (tag) params.append("tag", tag);
  });

  return `search-results.html?${params.toString()}`;
}

/**
 * Setup price range slider
 */
function setupPriceRangeSlider() {
  const priceSlider = document.getElementById("price-range");
  const minPriceInput = document.getElementById("price_min");
  const maxPriceInput = document.getElementById("price_max");
  const priceDisplay = document.getElementById("price-display");

  if (!priceSlider || !minPriceInput || !maxPriceInput) return;

  // Set initial values from URL if available
  const searchParams = new URLSearchParams(window.location.search);
  const minPrice = searchParams.get("price_min") || 0;
  const maxPrice = searchParams.get("price_max") || 500;

  minPriceInput.value = minPrice;
  maxPriceInput.value = maxPrice;

  if (priceDisplay) {
    priceDisplay.textContent = `$${minPrice} - $${maxPrice}`;
  }

  // Update inputs when slider changes
  // Note: In a real implementation, you would use a library like noUiSlider
  // for a dual-handle range slider. This is a simplified version.
  priceSlider.addEventListener("input", function () {
    const value = this.value;
    maxPriceInput.value = value;

    if (priceDisplay) {
      priceDisplay.textContent = `$${minPrice} - $${value}`;
    }
  });

  // Update display when inputs change manually
  [minPriceInput, maxPriceInput].forEach((input) => {
    input.addEventListener("change", function () {
      if (priceDisplay) {
        priceDisplay.textContent = `$${minPriceInput.value} - $${maxPriceInput.value}`;
      }
    });
  });
}

/**
 * Setup filter accordion for mobile
 */
function setupFilterAccordion() {
  const filterHeadings = document.querySelectorAll(".filter-heading");

  filterHeadings.forEach((heading) => {
    heading.addEventListener("click", function () {
      const content = this.nextElementSibling;

      // Toggle active class
      this.classList.toggle("active");

      // Toggle visibility
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

/**
 * Setup mobile filter toggle
 */
function setupMobileFilterToggle() {
  const filterToggle = document.querySelector(".filter-toggle");
  const filtersContainer = document.querySelector(".filters-container");

  if (!filterToggle || !filtersContainer) return;

  filterToggle.addEventListener("click", function () {
    filtersContainer.classList.toggle("active");

    if (filtersContainer.classList.contains("active")) {
      document.body.style.overflow = "hidden";
      this.innerHTML = 'Close Filters <i class="fas fa-times"></i>';
    } else {
      document.body.style.overflow = "";
      this.innerHTML = 'Filter Results <i class="fas fa-filter"></i>';
    }
  });
}

/**
 * Display applied filters in the UI
 * @param {Object} filters - Applied filters
 */
function displayAppliedFilters(filters) {
  const appliedFiltersContainer = document.querySelector(".applied-filters");
  if (!appliedFiltersContainer) return;

  const appliedFilters = [];

  // Add search query
  if (filters.query) {
    appliedFilters.push({
      type: "query",
      label: `Search: "${filters.query}"`,
      value: filters.query,
    });
  }

  // Add category
  if (filters.category) {
    appliedFilters.push({
      type: "category",
      label: `Category: ${filters.category}`,
      value: filters.category,
    });
  }

  // Add price range
  if (filters.priceMin || filters.priceMax) {
    const priceLabel = `Price: ${
      filters.priceMin ? "$" + filters.priceMin : "$0"
    } - ${filters.priceMax ? "$" + filters.priceMax : "Any"}`;
    appliedFilters.push({
      type: "price",
      label: priceLabel,
      value: "price",
    });
  }

  // Add tags
  if (filters.tags && filters.tags.length) {
    filters.tags.forEach((tag) => {
      appliedFilters.push({
        type: "tag",
        label: `Tag: ${tag}`,
        value: tag,
      });
    });
  }

  // Generate HTML
  if (appliedFilters.length > 0) {
    const filtersHTML = appliedFilters
      .map(
        (filter) => `
            <div class="applied-filter" data-type="${filter.type}" data-value="${filter.value}">
                <span>${filter.label}</span>
                <button class="remove-filter"><i class="fas fa-times"></i></button>
            </div>
        `
      )
      .join("");

    appliedFiltersContainer.innerHTML = `
            <div class="applied-filters-list">
                ${filtersHTML}
            </div>
            <button class="clear-all-filters">Clear All</button>
        `;

    appliedFiltersContainer.style.display = "block";

    // Add event listeners
    setupAppliedFiltersListeners();
  } else {
    appliedFiltersContainer.style.display = "none";
  }
}

/**
 * Setup listeners for removing applied filters
 */
function setupAppliedFiltersListeners() {
  const removeButtons = document.querySelectorAll(".remove-filter");
  const clearAllButton = document.querySelector(".clear-all-filters");

  // Handle individual filter removal
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.closest(".applied-filter");
      const type = filter.dataset.type;
      const value = filter.dataset.value;

      // Get current URL params
      const searchParams = new URLSearchParams(window.location.search);

      // Remove the filter
      if (type === "query") {
        // If removing the query, go back to home
        window.location.href = "../index.html";
        return;
      } else if (type === "category") {
        searchParams.delete("category");
      } else if (type === "price") {
        searchParams.delete("price_min");
        searchParams.delete("price_max");
      } else if (type === "tag") {
        // Remove specific tag
        const tags = searchParams.getAll("tag");
        searchParams.delete("tag");
        tags.forEach((tag) => {
          if (tag !== value) {
            searchParams.append("tag", tag);
          }
        });
      }

      // Navigate to new URL
      window.location.href = `search-results.html?${searchParams.toString()}`;
    });
  });

  // Handle clear all
  if (clearAllButton) {
    clearAllButton.addEventListener("click", function () {
      const searchParams = new URLSearchParams(window.location.search);
      const query = searchParams.get("q");

      // Keep only the search query
      window.location.href = `search-results.html?q=${encodeURIComponent(
        query
      )}`;
    });
  }
}
