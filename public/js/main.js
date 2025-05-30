/**
 * Apex Premium Headphones - Enhanced JavaScript File
 * A sophisticated animation and interactivity layer for the premium Apex experience
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Apex Premium Experience initialized');
  
  // Initialize all core functionalities
  initializeHeader();
  initializeAnimations();
  initializeProductInteractions();
  setupMobileMenu();
  setupNewsletterForm();
  setupProductGallery();
  initializeParallaxEffects();
  initializeScrollAnimations();
  setupAddToCartEffects();
  enhanceFilterUI();
  setupQuantityControls();
  initLightbox();
});

/**
 * Header & Navigation Enhancements
 * Handles premium header effects, scroll behaviors and navigation highlighting
 */
function initializeHeader() {
  const header = document.querySelector('header');
  const logo = document.querySelector('.logo');
  
  // Highlight current page in navigation
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-item a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.parentElement.classList.add('active');
    }
  });
  
  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Logo hover animation
  if (logo) {
    logo.addEventListener('mouseenter', () => {
      const span = logo.querySelector('span');
      if (span) {
        span.style.transition = 'transform 0.3s, color 0.3s';
        span.style.transform = 'translateY(-3px) rotate(5deg)';
      }
    });
    
    logo.addEventListener('mouseleave', () => {
      const span = logo.querySelector('span');
      if (span) {
        span.style.transform = 'translateY(0) rotate(0deg)';
      }
    });
  }
}

/**
 * Product Gallery Interaction
 * Creates a smooth, premium image gallery experience
 */
function setupProductGallery() {
  const mainImage = document.querySelector('.main-image img');
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        // Get image source
        const imgSrc = this.querySelector('img').getAttribute('src');
        
        // Apply smooth fade transition
        mainImage.style.opacity = '0';
        
        setTimeout(() => {
          mainImage.setAttribute('src', imgSrc);
          mainImage.style.opacity = '1';
        }, 300);
        
        // Update active thumbnail
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
}

/**
 * Initialize Core Animations
 * Sets up the primary animations for the premium experience
 */
function initializeAnimations() {
  // Create background shapes for hero section if they don't exist
  const hero = document.querySelector('.hero');
  if (hero && !hero.querySelector('.hero-background-shapes')) {
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'hero-background-shapes';
    
    // Create animated shapes
    for (let i = 1; i <= 3; i++) {
      const shape = document.createElement('div');
      shape.className = `shape shape-${i}`;
      shapesContainer.appendChild(shape);
    }
    
    hero.appendChild(shapesContainer);
  }
  
  // Set up smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/**
 * Interactive Product Elements
 * Enhances product card interactions for a premium feel
 */
function initializeProductInteractions() {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    // Add hover effect
    card.addEventListener('mouseenter', () => {
      const img = card.querySelector('.product-image img');
      const button = card.querySelector('.add-to-cart');
      
      if (img) {
        img.style.transform = 'scale(1.1)';
      }
      
      if (button) {
        button.style.backgroundColor = 'var(--accent-gold)';
        button.style.color = 'var(--primary-dark)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const img = card.querySelector('.product-image img');
      const button = card.querySelector('.add-to-cart');
      
      if (img) {
        img.style.transform = '';
      }
      
      if (button) {
        button.style.backgroundColor = '';
        button.style.color = '';
      }
    });
    
    // Add subtle lift effect on hover
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * Parallax Effects
 * Creates premium depth effects on scroll
 */
function initializeParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.5;
        element.style.transform = `translateY(${scrollPosition * speed}px)`;
      });
    });
  }
  
  // Add parallax to hero image if it exists
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    heroImage.classList.add('parallax');
    heroImage.setAttribute('data-speed', '-0.2');
  }
}

/**
 * Scroll-based Animations
 * Triggers premium animations as elements enter the viewport
 */
function initializeScrollAnimations() {
  // Elements to animate on scroll
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
  
  if (animatedElements.length > 0) {
    // Create observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe each element
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Add animation classes to sections if they don't have them already
  document.querySelectorAll('.section').forEach((section, index) => {
    if (!section.classList.contains('fade-in') && 
        !section.classList.contains('fade-in-up') && 
        !section.classList.contains('fade-in-left') && 
        !section.classList.contains('fade-in-right')) {
      if (index % 2 === 0) {
        section.classList.add('fade-in-up');
      } else {
        section.classList.add('fade-in');
      }
    }
  });
  
  // Add animation classes to product cards
  document.querySelectorAll('.product-card').forEach((card, index) => {
    if (!card.classList.contains('fade-in') && 
        !card.classList.contains('fade-in-up')) {
      card.classList.add('fade-in-up');
      card.style.animationDelay = `${index * 0.1}s`;
    }
  });
}

/**
 * Add to Cart Effects
 * Creates premium animations for the add to cart interaction
 */
function setupAddToCartEffects() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartIcon = document.querySelector('.cart-icon');
  const cartCount = document.querySelector('.cart-count');
  
  if (addToCartButtons.length > 0) {
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const productId = this.getAttribute('data-product-id');
        
        // Prevent multiple clicks
        if (this.classList.contains('adding')) return;
        
        // Add animation class
        this.classList.add('adding');
        
        // Create flying product element for animation
        if (cartIcon) {
          const productCard = this.closest('.product-card');
          const productImage = productCard ? productCard.querySelector('.product-image img') : null;
          
          if (productImage) {
            const flyingImage = document.createElement('div');
            flyingImage.className = 'flying-product';
            
            // Create a copy of the product image
            const imgCopy = document.createElement('img');
            imgCopy.src = productImage.src;
            flyingImage.appendChild(imgCopy);
            
            // Position the flying image at the product's position
            const productRect = productImage.getBoundingClientRect();
            const cartRect = cartIcon.getBoundingClientRect();
            
            document.body.appendChild(flyingImage);
            
            flyingImage.style.position = 'fixed';
            flyingImage.style.zIndex = '1000';
            flyingImage.style.left = `${productRect.left}px`;
            flyingImage.style.top = `${productRect.top}px`;
            flyingImage.style.width = `${productRect.width}px`;
            flyingImage.style.height = `${productRect.height}px`;
            
            // Animate the flying image to the cart
            setTimeout(() => {
              flyingImage.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
              flyingImage.style.left = `${cartRect.left}px`;
              flyingImage.style.top = `${cartRect.top}px`;
              flyingImage.style.width = '20px';
              flyingImage.style.height = '20px';
              flyingImage.style.opacity = '0.5';
              flyingImage.style.transform = 'scale(0.3)';
              
              // Increment cart count
              if (cartCount) {
                setTimeout(() => {
                  cartIcon.classList.add('bounce');
                  
                  let count = parseInt(cartCount.textContent || '0');
                  cartCount.textContent = count + 1;
                  
                  // Remove flying image after animation
                  setTimeout(() => {
                    document.body.removeChild(flyingImage);
                    cartIcon.classList.remove('bounce');
                  }, 300);
                }, 800);
              }
            }, 100);
          }
        }
        
        // Update button text
        const originalText = this.textContent;
        this.textContent = 'Added to Cart';
        
        // Use SweetAlert for notification if available
        if (window.Swal) {
          Swal.fire({
            title: 'Added to Cart!',
            text: 'Item successfully added to your cart',
            icon: 'success',
            timer: 2000,
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false
          });
        }
        
        // Reset button after animation
        setTimeout(() => {
          this.textContent = originalText;
          this.classList.remove('adding');
        }, 2000);
      });
    });
  }
}

/**
 * Enhanced Filter UI
 * Creates premium filter interactions for product listing
 */
function enhanceFilterUI() {
  // Price range slider enhancement
  const priceSlider = document.querySelector('.price-slider');
  const minPriceInput = document.querySelector('input[name="minPrice"]');
  const maxPriceInput = document.querySelector('input[name="maxPrice"]');
  
  if (priceSlider && maxPriceInput) {
    // Create tooltip for price slider
    const tooltip = document.createElement('div');
    tooltip.className = 'price-tooltip';
    priceSlider.parentElement.appendChild(tooltip);
    
    priceSlider.addEventListener('input', function() {
      // Update max price input
      maxPriceInput.value = this.value;
      
      // Update tooltip
      const percent = ((this.value - this.min) / (this.max - this.min)) * 100;
      tooltip.style.left = `${percent}%`;
      tooltip.textContent = `₹${this.value}`;
      tooltip.style.display = 'block';
    });
    
    priceSlider.addEventListener('blur', function() {
      tooltip.style.display = 'none';
    });
  }
  
  // Category filter animation
  const categoryFilters = document.querySelectorAll('.category-filter label');
  
  categoryFilters.forEach(label => {
    label.addEventListener('click', function() {
      this.classList.add('clicked');
      
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 300);
    });
  });
  
  // Filter button enhancements
  const filterButtons = document.querySelectorAll('.filter-button');
  
  filterButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
}

/**
 * Quantity Controls
 * Enhances the quantity controls with premium interactions
 */
function setupQuantityControls() {
  const quantityInput = document.querySelector('.quantity-input');
  const decreaseBtn = document.querySelector('.decrease-quantity');
  const increaseBtn = document.querySelector('.increase-quantity');
  
  if (quantityInput && decreaseBtn && increaseBtn) {
    // Get max stock from data attribute or default to 10
    const maxStock = parseInt(quantityInput.getAttribute('data-max-stock') || '10');
    
    // Add visual feedback on click
    [decreaseBtn, increaseBtn].forEach(btn => {
      btn.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(() => {
          this.classList.remove('clicked');
        }, 150);
      });
    });
    
    decreaseBtn.addEventListener('click', function() {
      let value = parseInt(quantityInput.value);
      if (value > 1) {
        quantityInput.value = value - 1;
        // Trigger a change event
        quantityInput.dispatchEvent(new Event('change'));
      }
    });
    
    increaseBtn.addEventListener('click', function() {
      let value = parseInt(quantityInput.value);
      if (value < maxStock) {
        quantityInput.value = value + 1;
        // Trigger a change event
        quantityInput.dispatchEvent(new Event('change'));
      }
    });
    
    // Add number validation and constraints
    quantityInput.addEventListener('change', function() {
      let value = parseInt(this.value);
      
      if (isNaN(value) || value < 1) {
        this.value = 1;
        animateQuantityError(this);
      } else if (value > maxStock) {
        this.value = maxStock;
        animateQuantityError(this);
      }
    });
  }
}

/**
 * Helper function to animate quantity input errors
 */
function animateQuantityError(inputElement) {
  inputElement.classList.add('error');
  inputElement.style.animation = 'shake 0.5s';
  
  setTimeout(() => {
    inputElement.classList.remove('error');
    inputElement.style.animation = '';
  }, 500);
}

/**
 * Lightbox for Product Images
 * Creates a premium lightbox experience for product images
 */
function initLightbox() {
  const mainImage = document.querySelector('.main-image img');
  
  if (mainImage) {
    // Create lightbox elements if they don't exist
    if (!document.querySelector('.lightbox')) {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <span class="lightbox-close">&times;</span>
          <img class="lightbox-img">
          <div class="lightbox-caption"></div>
        </div>
      `;
      document.body.appendChild(lightbox);
      
      // Close lightbox when clicking on backdrop or close button
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
          closeLightbox();
        }
      });
      
      // Close lightbox with Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          closeLightbox();
        }
      });
    }
    
    // Open lightbox on main image click
    mainImage.style.cursor = 'zoom-in';
    mainImage.addEventListener('click', function() {
      openLightbox(this.src, this.alt);
    });
  }
}

/**
 * Helper function to open the lightbox
 */
function openLightbox(src, alt) {
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    if (lightboxCaption) {
      lightboxCaption.textContent = alt || 'Apex Premium Headphones';
    }
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
}

/**
 * Helper function to close the lightbox
 */
function closeLightbox() {
  const lightbox = document.querySelector('.lightbox');
  
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
}

/**
 * Mobile Menu Setup
 * Creates an interactive mobile navigation experience
 */
function setupMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  // If no mobile menu elements exist, create them
  if (!menuToggle) {
    const headerContainer = document.querySelector('.header-container');
    if (headerContainer) {
      // Create menu toggle button
      const toggle = document.createElement('div');
      toggle.className = 'menu-toggle';
      for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        toggle.appendChild(span);
      }
      headerContainer.appendChild(toggle);
      
      // Set up event listener
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        if (navMenu) {
          navMenu.classList.toggle('active');
          if (navMenu.classList.contains('active')) {
            navMenu.style.display = 'flex';
          } else {
            setTimeout(() => {
              navMenu.style.display = 'none';
            }, 300);
          }
        }
      });
    }
  } else {
    // If menu toggle already exists, just set up the event listener
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      if (navMenu) {
        navMenu.classList.toggle('active');
        if (navMenu.classList.contains('active')) {
          navMenu.style.display = 'flex';
        } else {
          setTimeout(() => {
            navMenu.style.display = 'none';
          }, 300);
        }
      }
    });
  }
}

/**
 * Product Gallery Interaction
 * Creates a smooth, premium image gallery experience
 */
function setupProductGallery() {
  const mainImage = document.querySelector('.main-image img');
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        // Get image source
        const imgSrc = this.querySelector('img').getAttribute('src');
        
        // Apply smooth fade transition
        mainImage.style.opacity = '0';
        
        setTimeout(() => {
          mainImage.setAttribute('src', imgSrc);
          mainImage.style.opacity = '1';
        }, 300);
        
        // Update active thumbnail
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
}

/**
 * Initialize Core Animations
 * Sets up the primary animations for the premium experience
 */
function initializeAnimations() {
  // Create background shapes for hero section if they don't exist
  const hero = document.querySelector('.hero');
  if (hero && !hero.querySelector('.hero-background-shapes')) {
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'hero-background-shapes';
    
    // Create animated shapes
    for (let i = 1; i <= 3; i++) {
      const shape = document.createElement('div');
      shape.className = `shape shape-${i}`;
      shapesContainer.appendChild(shape);
    }
    
    hero.appendChild(shapesContainer);
  }
  
  // Set up smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/**
 * Interactive Product Elements
 * Enhances product card interactions for a premium feel
 */
function initializeProductInteractions() {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    // Add hover effect
    card.addEventListener('mouseenter', () => {
      const img = card.querySelector('.product-image img');
      const button = card.querySelector('.add-to-cart');
      
      if (img) {
        img.style.transform = 'scale(1.1)';
      }
      
      if (button) {
        button.style.backgroundColor = 'var(--accent-gold)';
        button.style.color = 'var(--primary-dark)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const img = card.querySelector('.product-image img');
      const button = card.querySelector('.add-to-cart');
      
      if (img) {
        img.style.transform = '';
      }
      
      if (button) {
        button.style.backgroundColor = '';
        button.style.color = '';
      }
    });
    
    // Add subtle lift effect on hover
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * Parallax Effects
 * Creates premium depth effects on scroll
 */
function initializeParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.5;
        element.style.transform = `translateY(${scrollPosition * speed}px)`;
      });
    });
  }
  
  // Add parallax to hero image if it exists
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    heroImage.classList.add('parallax');
    heroImage.setAttribute('data-speed', '-0.2');
  }
}

/**
 * Scroll-based Animations
 * Triggers premium animations as elements enter the viewport
 */
function initializeScrollAnimations() {
  // Elements to animate on scroll
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
  
  if (animatedElements.length > 0) {
    // Create observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe each element
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Add animation classes to sections if they don't have them already
  document.querySelectorAll('.section').forEach((section, index) => {
    if (!section.classList.contains('fade-in') && 
        !section.classList.contains('fade-in-up') && 
        !section.classList.contains('fade-in-left') && 
        !section.classList.contains('fade-in-right')) {
      if (index % 2 === 0) {
        section.classList.add('fade-in-up');
      } else {
        section.classList.add('fade-in');
      }
    }
  });
  
  // Add animation classes to product cards
  document.querySelectorAll('.product-card').forEach((card, index) => {
    if (!card.classList.contains('fade-in') && 
        !card.classList.contains('fade-in-up')) {
      card.classList.add('fade-in-up');
      card.style.animationDelay = `${index * 0.1}s`;
    }
  });
}

/**
 * Add to Cart Effects
 * Creates premium animations for the add to cart interaction
 */
function setupAddToCartEffects() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartIcon = document.querySelector('.cart-icon');
  const cartCount = document.querySelector('.cart-count');
  
  if (addToCartButtons.length > 0) {
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const productId = this.getAttribute('data-product-id');
        
        // Prevent multiple clicks
        if (this.classList.contains('adding')) return;
        
        // Add animation class
        this.classList.add('adding');
        
        // Create flying product element for animation
        if (cartIcon) {
          const productCard = this.closest('.product-card');
          const productImage = productCard ? productCard.querySelector('.product-image img') : null;
          
          if (productImage) {
            const flyingImage = document.createElement('div');
            flyingImage.className = 'flying-product';
            
            // Create a copy of the product image
            const imgCopy = document.createElement('img');
            imgCopy.src = productImage.src;
            flyingImage.appendChild(imgCopy);
            
            // Position the flying image at the product's position
            const productRect = productImage.getBoundingClientRect();
            const cartRect = cartIcon.getBoundingClientRect();
            
            document.body.appendChild(flyingImage);
            
            flyingImage.style.position = 'fixed';
            flyingImage.style.zIndex = '1000';
            flyingImage.style.left = `${productRect.left}px`;
            flyingImage.style.top = `${productRect.top}px`;
            flyingImage.style.width = `${productRect.width}px`;
            flyingImage.style.height = `${productRect.height}px`;
            
            // Animate the flying image to the cart
            setTimeout(() => {
              flyingImage.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
              flyingImage.style.left = `${cartRect.left}px`;
              flyingImage.style.top = `${cartRect.top}px`;
              flyingImage.style.width = '20px';
              flyingImage.style.height = '20px';
              flyingImage.style.opacity = '0.5';
              flyingImage.style.transform = 'scale(0.3)';
              
              // Increment cart count
              if (cartCount) {
                setTimeout(() => {
                  cartIcon.classList.add('bounce');
                  
                  let count = parseInt(cartCount.textContent || '0');
                  cartCount.textContent = count + 1;
                  
                  // Remove flying image after animation
                  setTimeout(() => {
                    document.body.removeChild(flyingImage);
                    cartIcon.classList.remove('bounce');
                  }, 300);
                }, 800);
              }
            }, 100);
          }
        }
        
        // Update button text
        const originalText = this.textContent;
        this.textContent = 'Added to Cart';
        
        // Use SweetAlert for notification if available
        if (window.Swal) {
          Swal.fire({
            title: 'Added to Cart!',
            text: 'Item successfully added to your cart',
            icon: 'success',
            timer: 2000,
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false
          });
        }
        
        // Reset button after animation
        setTimeout(() => {
          this.textContent = originalText;
          this.classList.remove('adding');
        }, 2000);
      });
    });
  }
}

/**
 * Enhanced Filter UI
 * Creates premium filter interactions for product listing
 */
function enhanceFilterUI() {
  // Price range slider enhancement
  const priceSlider = document.querySelector('.price-slider');
  const minPriceInput = document.querySelector('input[name="minPrice"]');
  const maxPriceInput = document.querySelector('input[name="maxPrice"]');
  
  if (priceSlider && maxPriceInput) {
    // Create tooltip for price slider
    const tooltip = document.createElement('div');
    tooltip.className = 'price-tooltip';
    priceSlider.parentElement.appendChild(tooltip);
    
    priceSlider.addEventListener('input', function() {
      // Update max price input
      maxPriceInput.value = this.value;
      
      // Update tooltip
      const percent = ((this.value - this.min) / (this.max - this.min)) * 100;
      tooltip.style.left = `${percent}%`;
      tooltip.textContent = `₹${this.value}`;
      tooltip.style.display = 'block';
    });
    
    priceSlider.addEventListener('blur', function() {
      tooltip.style.display = 'none';
    });
  }
  
  // Category filter animation
  const categoryFilters = document.querySelectorAll('.category-filter label');
  
  categoryFilters.forEach(label => {
    label.addEventListener('click', function() {
      this.classList.add('clicked');
      
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 300);
    });
  });
  
  // Filter button enhancements
  const filterButtons = document.querySelectorAll('.filter-button');
  
  filterButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
}

/**
 * Quantity Controls
 * Enhances the quantity controls with premium interactions
 */
function setupQuantityControls() {
  const quantityInput = document.querySelector('.quantity-input');
  const decreaseBtn = document.querySelector('.decrease-quantity');
  const increaseBtn = document.querySelector('.increase-quantity');
  
  if (quantityInput && decreaseBtn && increaseBtn) {
    // Get max stock from data attribute or default to 10
    const maxStock = parseInt(quantityInput.getAttribute('data-max-stock') || '10');
    
    // Add visual feedback on click
    [decreaseBtn, increaseBtn].forEach(btn => {
      btn.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(() => {
          this.classList.remove('clicked');
        }, 150);
      });
    });
    
    decreaseBtn.addEventListener('click', function() {
      let value = parseInt(quantityInput.value);
      if (value > 1) {
        quantityInput.value = value - 1;
        // Trigger a change event
        quantityInput.dispatchEvent(new Event('change'));
      }
    });
    
    increaseBtn.addEventListener('click', function() {
      let value = parseInt(quantityInput.value);
      if (value < maxStock) {
        quantityInput.value = value + 1;
        // Trigger a change event
        quantityInput.dispatchEvent(new Event('change'));
      }
    });
    
    // Add number validation and constraints
    quantityInput.addEventListener('change', function() {
      let value = parseInt(this.value);
      
      if (isNaN(value) || value < 1) {
        this.value = 1;
        animateQuantityError(this);
      } else if (value > maxStock) {
        this.value = maxStock;
        animateQuantityError(this);
      }
    });
  }
}

/**
 * Helper function to animate quantity input errors
 */
function animateQuantityError(inputElement) {
  inputElement.classList.add('error');
  inputElement.style.animation = 'shake 0.5s';
  
  setTimeout(() => {
    inputElement.classList.remove('error');
    inputElement.style.animation = '';
  }, 500);
}

/**
 * Lightbox for Product Images
 * Creates a premium lightbox experience for product images
 */
function initLightbox() {
  const mainImage = document.querySelector('.main-image img');
  
  if (mainImage) {
    // Create lightbox elements if they don't exist
    if (!document.querySelector('.lightbox')) {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <span class="lightbox-close">&times;</span>
          <img class="lightbox-img">
          <div class="lightbox-caption"></div>
        </div>
      `;
      document.body.appendChild(lightbox);
      
      // Close lightbox when clicking on backdrop or close button
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
          closeLightbox();
        }
      });
      
      // Close lightbox with Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          closeLightbox();
        }
      });
    }
    
    // Open lightbox on main image click
    mainImage.style.cursor = 'zoom-in';
    mainImage.addEventListener('click', function() {
      openLightbox(this.src, this.alt);
    });
  }
}

/**
 * Helper function to open the lightbox
 */
function openLightbox(src, alt) {
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    if (lightboxCaption) {
      lightboxCaption.textContent = alt || 'Apex Premium Headphones';
    }
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
}

/**
 * Helper function to close the lightbox
 */
function closeLightbox() {
  const lightbox = document.querySelector('.lightbox');
  
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
}

/**
 * Newsletter Form Enhancement
 * Creates a premium animation for the newsletter form submission
 */
function setupNewsletterForm() {
  const newsletterForm = document.querySelector('.footer-newsletter form');
  
  if (newsletterForm) {
    const emailInput = newsletterForm.querySelector('input');
    const submitButton = newsletterForm.querySelector('button');
    
    // Add focus effects
    if (emailInput) {
      emailInput.addEventListener('focus', () => {
        newsletterForm.classList.add('focused');
      });
      
      emailInput.addEventListener('blur', () => {
        newsletterForm.classList.remove('focused');
      });
    }
    
    // Handle form submission with animation
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (emailInput && emailInput.value) {
        // Disable form during animation
        emailInput.disabled = true;
        if (submitButton) submitButton.disabled = true;
        
        // Apply success animation to the form
        newsletterForm.classList.add('success');
        
        // Create and animate success checkmark
        const checkmark = document.createElement('div');
        checkmark.className = 'success-checkmark';
        checkmark.innerHTML = '<svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="25" fill="none"/><path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>';
        
        newsletterForm.appendChild(checkmark);
        
        // Show success message with SweetAlert if available
        if (window.Swal) {
          Swal.fire({
            title: 'Subscribed!',
            text: 'Thank you for subscribing to our newsletter!',
            icon: 'success',
            timer: 3000,
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false
          });
        }
        
        // Reset form after animation
        setTimeout(() => {
          emailInput.value = '';
          emailInput.disabled = false;
          if (submitButton) submitButton.disabled = false;
          newsletterForm.classList.remove('success');
          
          if (checkmark) {
            checkmark.classList.add('fade-out');
            setTimeout(() => {
              newsletterForm.removeChild(checkmark);
            }, 300);
          }
        }, 3000);
      }
    });
  }
}

/**
 * Product Gallery Interaction
 * Creates a smooth, premium image gallery experience
 */
function setupProductGallery() {
  const mainImage = document.querySelector('.main-image img');
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        // Get image source
        const imgSrc = this.querySelector('img').getAttribute('src');
        
        // Apply smooth fade transition
        mainImage.style.opacity = '0';
        
        setTimeout(() => {
          mainImage.setAttribute('src', imgSrc);
          mainImage.style.opacity = '1';
        }, 300);
        
        // Update active thumbnail
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
}

/**
 * Initialize Core Animations
 * Sets up the primary animations for the premium experience
 */
function initializeAnimations() {
  // Create background shapes for hero section if they don't exist
  const hero = document.querySelector('.hero');
  if (hero && !hero.querySelector('.hero-background-shapes')) {
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'hero-background-shapes';
    
    // Create animated shapes
    for (let i = 1; i <= 3; i++) {
      const shape = document.createElement('div');
      shape.className = `shape shape-${i}`;
      shapesContainer.appendChild(shape);
    }
    
    hero.appendChild(shapesContainer);
  }
  
  // Set up smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/**
 * Interactive Product Elements
 * Enhances product card interactions for a premium feel
 */
function initializeProductInteractions() {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    // Add hover effect
    card.addEventListener('mouseenter', () => {
      const img = card.querySelector('.product-image img');
      const button = card.querySelector('.add-to-cart');
      
      if (img) {
        img.style.transform = 'scale(1.1)';
      }
      
      if (button) {
        button.style.backgroundColor = 'var(--accent-gold)';
        button.style.color = 'var(--primary-dark)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const img = card.querySelector('.product-image img');
      const button = card.querySelector('.add-to-cart');
      
      if (img) {
        img.style.transform = '';
      }
      
      if (button) {
        button.style.backgroundColor = '';
        button.style.color = '';
      }
    });
    
    // Add subtle lift effect on hover
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * Parallax Effects
 * Creates premium depth effects on scroll
 */
function initializeParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.5;
        element.style.transform = `translateY(${scrollPosition * speed}px)`;
      });
    });
  }
  
  // Add parallax to hero image if it exists
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    heroImage.classList.add('parallax');
    heroImage.setAttribute('data-speed', '-0.2');
  }
}

/**
 * Scroll-based Animations
 * Triggers premium animations as elements enter the viewport
 */
function initializeScrollAnimations() {
  // Elements to animate on scroll
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
  
  if (animatedElements.length > 0) {
    // Create observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe each element
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Add animation classes to sections if they don't have them already
  document.querySelectorAll('.section').forEach((section, index) => {
    if (!section.classList.contains('fade-in') && 
        !section.classList.contains('fade-in-up') && 
        !section.classList.contains('fade-in-left') && 
        !section.classList.contains('fade-in-right')) {
      if (index % 2 === 0) {
        section.classList.add('fade-in-up');
      } else {
        section.classList.add('fade-in');
      }
    }
  });
  
  // Add animation classes to product cards
  document.querySelectorAll('.product-card').forEach((card, index) => {
    if (!card.classList.contains('fade-in') && 
        !card.classList.contains('fade-in-up')) {
      card.classList.add('fade-in-up');
      card.style.animationDelay = `${index * 0.1}s`;
    }
  });
}

/**
 * Add to Cart Effects
 * Creates premium animations for the add to cart interaction
 */
function setupAddToCartEffects() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartIcon = document.querySelector('.cart-icon');
  const cartCount = document.querySelector('.cart-count');
  
  if (addToCartButtons.length > 0) {
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const productId = this.getAttribute('data-product-id');
        
        // Prevent multiple clicks
        if (this.classList.contains('adding')) return;
        
        // Add animation class
        this.classList.add('adding');
        
        // Create flying product element for animation
        if (cartIcon) {
          const productCard = this.closest('.product-card');
          const productImage = productCard ? productCard.querySelector('.product-image img') : null;
          
          if (productImage) {
            const flyingImage = document.createElement('div');
            flyingImage.className = 'flying-product';
            
            // Create a copy of the product image
            const imgCopy = document.createElement('img');
            imgCopy.src = productImage.src;
            flyingImage.appendChild(imgCopy);
            
            // Position the flying image at the product's position
            const productRect = productImage.getBoundingClientRect();
            const cartRect = cartIcon.getBoundingClientRect();
            
            document.body.appendChild(flyingImage);
            
            flyingImage.style.position = 'fixed';
            flyingImage.style.zIndex = '1000';
            flyingImage.style.left = `${productRect.left}px`;
            flyingImage.style.top = `${productRect.top}px`;
            flyingImage.style.width = `${productRect.width}px`;
            flyingImage.style.height = `${productRect.height}px`;
            
            // Animate the flying image to the cart
            setTimeout(() => {
              flyingImage.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
              flyingImage.style.left = `${cartRect.left}px`;
              flyingImage.style.top = `${cartRect.top}px`;
              flyingImage.style.width = '20px';
              flyingImage.style.height = '20px';
              flyingImage.style.opacity = '0.5';
              flyingImage.style.transform = 'scale(0.3)';
              
              // Increment cart count
              if (cartCount) {
                setTimeout(() => {
                  cartIcon.classList.add('bounce');
                  
                  let count = parseInt(cartCount.textContent || '0');
                  cartCount.textContent = count + 1;
                  
                  // Remove flying image after animation
                  setTimeout(() => {
                    document.body.removeChild(flyingImage);
                    cartIcon.classList.remove('bounce');
                  }, 300);
                }, 800);
              }
            }, 100);
          }
        }
        
        // Update button text
        const originalText = this.textContent;
        this.textContent = 'Added to Cart';
        
        // Use SweetAlert for notification if available
        if (window.Swal) {
          Swal.fire({
            title: 'Added to Cart!',
            text: 'Item successfully added to your cart',
            icon: 'success',
            timer: 2000,
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false
          });
        }
        
        // Reset button after animation
        setTimeout(() => {
          this.textContent = originalText;
          this.classList.remove('adding');
        }, 2000);
      });
    });
  }
}

/**
 * Enhanced Filter UI
 * Creates premium filter interactions for product listing
 */
function enhanceFilterUI() {
  // Price range slider enhancement
  const priceSlider = document.querySelector('.price-slider');
  const minPriceInput = document.querySelector('input[name="minPrice"]');
  const maxPriceInput = document.querySelector('input[name="maxPrice"]');
  
  if (priceSlider && maxPriceInput) {
    // Create tooltip for price slider
    const tooltip = document.createElement('div');
    tooltip.className = 'price-tooltip';
    priceSlider.parentElement.appendChild(tooltip);
    
    priceSlider.addEventListener('input', function() {
      // Update max price input
      maxPriceInput.value = this.value;
      
      // Update tooltip
      const percent = ((this.value - this.min) / (this.max - this.min)) * 100;
      tooltip.style.left = `${percent}%`;
      tooltip.textContent = `₹${this.value}`;
      tooltip.style.display = 'block';
    });
    
    priceSlider.addEventListener('blur', function() {
      tooltip.style.display = 'none';
    });
  }
  
  // Category filter animation
  const categoryFilters = document.querySelectorAll('.category-filter label');
  
  categoryFilters.forEach(label => {
    label.addEventListener('click', function() {
      this.classList.add('clicked');
      
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 300);
    });
  });
  
  // Filter button enhancements
  const filterButtons = document.querySelectorAll('.filter-button');
  
  filterButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
}

/**
 * Quantity Controls
 * Enhances the quantity controls with premium interactions
 */
function setupQuantityControls() {
  const quantityInput = document.querySelector('.quantity-input');
  const decreaseBtn = document.querySelector('.decrease-quantity');
  const increaseBtn = document.querySelector('.increase-quantity');
  
  if (quantityInput && decreaseBtn && increaseBtn) {
    // Get max stock from data attribute or default to 10
    const maxStock = parseInt(quantityInput.getAttribute('data-max-stock') || '10');
    
    // Add visual feedback on click
    [decreaseBtn, increaseBtn].forEach(btn => {
      btn.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(() => {
          this.classList.remove('clicked');
        }, 150);
      });
    });
    
    decreaseBtn.addEventListener('click', function() {
      let value = parseInt(quantityInput.value);
      if (value > 1) {
        quantityInput.value = value - 1;
        // Trigger a change event
        quantityInput.dispatchEvent(new Event('change'));
      }
    });
    
    increaseBtn.addEventListener('click', function() {
      let value = parseInt(quantityInput.value);
      if (value < maxStock) {
        quantityInput.value = value + 1;
        // Trigger a change event
        quantityInput.dispatchEvent(new Event('change'));
      }
    });
    
    // Add number validation and constraints
    quantityInput.addEventListener('change', function() {
      let value = parseInt(this.value);
      
      if (isNaN(value) || value < 1) {
        this.value = 1;
        animateQuantityError(this);
      } else if (value > maxStock) {
        this.value = maxStock;
        animateQuantityError(this);
      }
    });
  }
}

/**
 * Helper function to animate quantity input errors
 */
function animateQuantityError(inputElement) {
  inputElement.classList.add('error');
  inputElement.style.animation = 'shake 0.5s';
  
  setTimeout(() => {
    inputElement.classList.remove('error');
    inputElement.style.animation = '';
  }, 500);
}

/**
 * Lightbox for Product Images
 * Creates a premium lightbox experience for product images
 */
function initLightbox() {
  const mainImage = document.querySelector('.main-image img');
  
  if (mainImage) {
    // Create lightbox elements if they don't exist
    if (!document.querySelector('.lightbox')) {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <span class="lightbox-close">&times;</span>
          <img class="lightbox-img">
          <div class="lightbox-caption"></div>
        </div>
      `;
      document.body.appendChild(lightbox);
      
      // Close lightbox when clicking on backdrop or close button
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
          closeLightbox();
        }
      });
      
      // Close lightbox with Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          closeLightbox();
        }
      });
    }
    
    // Open lightbox on main image click
    mainImage.style.cursor = 'zoom-in';
    mainImage.addEventListener('click', function() {
      openLightbox(this.src, this.alt);
    });
  }
}

/**
 * Helper function to open the lightbox
 */
function openLightbox(src, alt) {
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    if (lightboxCaption) {
      lightboxCaption.textContent = alt || 'Apex Premium Headphones';
    }
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
}

/**
 * Helper function to close the lightbox
 */
function closeLightbox() {
  const lightbox = document.querySelector('.lightbox');
  
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
}
