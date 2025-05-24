// Shilp Banavat - Image Setup
// This script provides valid image URLs for the website

// Get the base path for GitHub Pages
function getBasePath() {
  return location.hostname.includes("github.io")
    ? `${location.origin}/ShilpBanavat/`
    : "";
}

// Hero Images
const heroImages = [
  "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80",
];

// Category Images
const categoryImages = {
  pottery:
    "https://images.unsplash.com/photo-1605883705077-8d3d3cebe78c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
  textiles:
    "https://images.unsplash.com/photo-1584811644165-33dbd382eda4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
  jewelry:
    "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
  woodwork:
    "https://images.unsplash.com/photo-1597729066931-0716f6a4e701?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
};

// Featured Banner
const featuredBanner =
  "https://images.unsplash.com/photo-1594061677657-9a7f40c4d982?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80";

// Product Images
const productImages = [
  "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80", // Ceramic vase
  "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80", // Cushion cover
  "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80", // Brass lamp
  "https://images.unsplash.com/photo-1536678049747-a07e976f588a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80", // Silk scarf
  "https://images.unsplash.com/photo-1552690647-5246d8172843?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80", // Basket
  "https://images.unsplash.com/photo-1598894000396-bc30e0996899?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80", // Leather journal
  "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80", // Silver earrings
  "https://images.unsplash.com/photo-1629197521865-3cfa16e3e161?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80", // Clay sculpture
];

// Service Images
const serviceImages = [
  "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80", // Gift wrapping
  "https://images.unsplash.com/photo-1603197788269-c76ab372e602?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80", // Custom orders
  "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80", // Artisan connect
];

// Artisan Image
const artisanImage =
  "https://images.unsplash.com/photo-1532635241-17e820acc59f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80";

// Function to check if an image exists
function imageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// Function to replace placeholder images when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Get base path for GitHub Pages
  const basePath = getBasePath();
  console.log("Using base path for images:", basePath);

  // Replace hero image
  const heroImageElements = document.querySelectorAll(".hero-image img");
  heroImageElements.forEach(async (img) => {
    img.src = heroImages[0]; // Using the first hero image
    img.onerror = () => {
      img.src = heroImages[1]; // Fallback if first image fails
    };
  });

  // Replace category images
  const categoryImageElements = document.querySelectorAll(".category-item img");
  if (categoryImageElements.length >= 4) {
    categoryImageElements[0].src = categoryImages.pottery;
    categoryImageElements[1].src = categoryImages.textiles;
    categoryImageElements[2].src = categoryImages.jewelry;
    categoryImageElements[3].src = categoryImages.woodwork;

    // Add error handlers
    categoryImageElements.forEach((img) => {
      img.onerror = function () {
        this.src = heroImages[0]; // Fallback to hero image if category image fails
      };
    });
  }

  // Replace featured banner
  const featureBannerElements = document.querySelectorAll(
    ".feature-banner img"
  );
  featureBannerElements.forEach((img) => {
    img.src = featuredBanner;
    img.onerror = () => {
      img.src = heroImages[2]; // Fallback if featured banner fails
    };
  });

  // Replace all product images
  const productImageElements = document.querySelectorAll(".product-image img");
  productImageElements.forEach((img, index) => {
    img.src = productImages[index % productImages.length];
    img.onerror = function () {
      this.src = productImages[0]; // Fallback to first product image
    };
  });

  // Replace service images
  const serviceImageElements = document.querySelectorAll(".service-item img");
  serviceImageElements.forEach((img, index) => {
    if (index < serviceImages.length) {
      img.src = serviceImages[index];
      img.onerror = function () {
        this.src = heroImages[0]; // Fallback to hero image
      };
    }
  });

  // Replace artisan image
  const artisanImageElement = document.querySelector(".artisan-image img");
  if (artisanImageElement) {
    artisanImageElement.src = artisanImage;
    artisanImageElement.onerror = function () {
      this.src = heroImages[0]; // Fallback to hero image
    };
  }

  // Replace main product image in product detail page
  const mainProductImage = document.getElementById("main-image");
  if (mainProductImage) {
    mainProductImage.src = productImages[0];
    mainProductImage.onerror = function () {
      this.src = productImages[1]; // Fallback to second product image
    };
  }

  // Replace product thumbnails
  const thumbnailElements = document.querySelectorAll(".thumbnail img");
  thumbnailElements.forEach((img, index) => {
    img.src = productImages[index % productImages.length];
    img.onerror = function () {
      this.src = productImages[0]; // Fallback to first product image
    };
  });

  console.log("All images have been replaced with valid online sources.");

  // Setup placeholder images for products and other sections
  const placeholderImages = {
    "placeholder-hero.jpg":
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
    "placeholder-category1.jpg":
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "placeholder-category2.jpg":
      "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80",
    "placeholder-category3.jpg":
      "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
    "placeholder-category4.jpg":
      "https://images.unsplash.com/photo-1492105232359-ca132c09762c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
    "placeholder-feature.jpg":
      "https://images.unsplash.com/photo-1459183885421-5cc683b8dbba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
    "placeholder-product1.jpg":
      "https://images.unsplash.com/photo-1601924357840-3e50ad4c1f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    "placeholder-product2.jpg":
      "https://images.unsplash.com/photo-1607344645866-009c320c5ab0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1970&q=80",
    "placeholder-product3.jpg":
      "https://images.unsplash.com/photo-1544158123-18c14d513ddb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "placeholder-product4.jpg":
      "https://images.unsplash.com/photo-1551732998-9573f695fdbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    "placeholder-trending1.jpg":
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "placeholder-trending2.jpg":
      "https://images.unsplash.com/photo-1603695362705-91d50a3a0ba2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    "placeholder-trending3.jpg":
      "https://images.unsplash.com/photo-1606293459661-61223c0d273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    "placeholder-trending4.jpg":
      "https://images.unsplash.com/photo-1605883705077-8d3d848f8d1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    "placeholder-service1.jpg":
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    "placeholder-service2.jpg":
      "https://images.unsplash.com/photo-1529220502050-f15e570c634e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    "placeholder-service3.jpg":
      "https://images.unsplash.com/photo-1611027370759-38c4789cd6e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  };

  // Replace all placeholder image sources
  document.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    if (src) {
      // Check if the src contains a placeholder image filename
      const filename = src.split("/").pop();

      // If it's a relative path starting with '/' on GitHub Pages, add the base path
      if (location.hostname.includes("github.io") && src.startsWith("/")) {
        img.setAttribute("src", basePath.slice(0, -1) + src);
        console.log("Fixed absolute path:", img.getAttribute("src"));
      }
      // Replace placeholder images with actual images
      else if (placeholderImages[filename]) {
        img.setAttribute("src", placeholderImages[filename]);
        console.log("Replaced placeholder:", filename);
      }
      // If on GitHub Pages and path is relative without leading slash, add base path
      else if (
        location.hostname.includes("github.io") &&
        !src.startsWith("http") &&
        !src.startsWith("data:") &&
        !src.startsWith("https://")
      ) {
        const newSrc = basePath + src;
        img.setAttribute("src", newSrc);
        console.log("Added base path to relative image:", newSrc);
      }

      // Add loading attribute for better performance
      img.setAttribute("loading", "lazy");

      // Set up a fallback in case the image fails to load
      img.onerror = function () {
        this.onerror = null;
        this.src =
          "https://via.placeholder.com/800x600?text=Image+Not+Available";
        console.log("Image failed to load, using fallback:", this.src);
      };
    }
  });
});
