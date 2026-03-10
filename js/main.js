/* ============================================
   BUILD IMARA - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCounterAnimations();
  initAccordion();
  initTestimonialCarousel();
  initSmoothScroll();
  initProjectFilters();
});

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class for shadow effect
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
  const toggle = document.querySelector('.navbar-toggle');
  const menu = document.querySelector('.navbar-menu');
  
  if (!toggle || !menu) return;
  
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close menu when clicking on a link
  const links = menu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  if (!reveals.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  reveals.forEach(reveal => observer.observe(reveal));
}

/* ============================================
   COUNTER ANIMATIONS
   ============================================ */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-counter]');
  
  if (!counters.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });
  
  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-counter'));
  const suffix = element.getAttribute('data-suffix') || '';
  const prefix = element.getAttribute('data-prefix') || '';
  const duration = 2000;
  const steps = 60;
  const stepValue = target / steps;
  let current = 0;
  const stepDuration = duration / steps;
  
  const timer = setInterval(() => {
    current += stepValue;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = prefix + Math.floor(current) + suffix;
  }, stepDuration);
}

/* ============================================
   ACCORDION / FAQ
   ============================================ */
function initAccordion() {
  const accordions = document.querySelectorAll('.accordion');
  
  accordions.forEach(accordion => {
    const items = accordion.querySelectorAll('.accordion-item');
    
    items.forEach(item => {
      const header = item.querySelector('.accordion-header');
      
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items in this accordion
        items.forEach(i => i.classList.remove('active'));
        
        // Open clicked item if it wasn't already open
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  });
}

/* ============================================
   TESTIMONIAL CAROUSEL
   ============================================ */
function initTestimonialCarousel() {
  const carousels = document.querySelectorAll('.carousel');
  
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    const slidesPerView = getSlidesPerView();
    const maxIndex = Math.max(0, slides.length - slidesPerView);
    
    // Create dots
    if (dotsContainer) {
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }
    
    // Navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateCarousel();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(maxIndex, currentIndex + 1);
        updateCarousel();
      });
    }
    
    // Auto-play
    let autoplayTimer = setInterval(autoplay, 5000);
    
    carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carousel.addEventListener('mouseleave', () => {
      autoplayTimer = setInterval(autoplay, 5000);
    });
    
    function autoplay() {
      currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      updateCarousel();
    }
    
    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }
    
    function updateCarousel() {
      const slideWidth = 100 / slidesPerView;
      track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
      
      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
      }
    }
    
    function getSlidesPerView() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    
    // Handle resize
    window.addEventListener('resize', () => {
      currentIndex = 0;
      updateCarousel();
    });
  });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ============================================
   PROJECT FILTERS
   ============================================ */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');
  
  if (!filterBtns.length || !projects.length) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      // Filter projects
      projects.forEach(project => {
        const categories = project.getAttribute('data-category')?.split(' ') || [];
        
        if (filter === 'all' || categories.includes(filter)) {
          project.style.display = 'block';
          setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'scale(1)';
          }, 10);
        } else {
          project.style.opacity = '0';
          project.style.transform = 'scale(0.9)';
          setTimeout(() => {
            project.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ============================================
   WHATSAPP HELPER
   ============================================ */
function openWhatsApp(message = '') {
  const phone = '919999999999'; // Replace with actual phone number
  const encodedMessage = encodeURIComponent(message || "Hi Build Imara, I'm interested in learning more about your home construction services.");
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(url, '_blank');
}

/* ============================================
   FORM VALIDATION
   ============================================ */
function validateForm(form) {
  const inputs = form.querySelectorAll('[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
    
    // Email validation
    if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        input.classList.add('error');
      }
    }
    
    // Phone validation
    if (input.type === 'tel' && input.value) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(input.value.replace(/\D/g, ''))) {
        isValid = false;
        input.classList.add('error');
      }
    }
  });
  
  return isValid;
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
