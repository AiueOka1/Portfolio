document.addEventListener('DOMContentLoaded', () => {
  // ===============================
  // SIDEBAR TOGGLE
  // ===============================
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const flashlight = document.getElementById('flashlight');

  const toggleSidebar = () => {
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Randomize easter egg letter positions when sidebar opens
    if (sidebar.classList.contains('active')) {
      randomizeLetterPositions();
      resetEasterEgg();
    }
  };
  
  // Function to randomize letter positions
  const randomizeLetterPositions = () => {
    const easterLetters = document.querySelectorAll('.easter-letter');
    const usedPositions = [];
    
    easterLetters.forEach(letter => {
      let top, left;
      let attempts = 0;
      
      // Try to find a position that doesn't overlap with others
      do {
        top = 10 + Math.random() * 75; // 10% to 85% from top
        left = 10 + Math.random() * 75; // 10% to 85% from left
        attempts++;
      } while (
        attempts < 20 && 
        usedPositions.some(pos => 
          Math.abs(pos.top - top) < 15 && Math.abs(pos.left - left) < 15
        )
      );
      
      usedPositions.push({ top, left });
      letter.style.top = `${top}%`;
      letter.style.left = `${left}%`;
    });
  };
  
  // Function to reset easter egg state
  const resetEasterEgg = () => {
    const easterLetters = document.querySelectorAll('.easter-letter');
    easterLetters.forEach(letter => {
      letter.classList.remove('discovered', 'revealed');
    });
    
    const secretContainer = document.getElementById('secret-input-container');
    if (secretContainer) {
      secretContainer.classList.remove('visible', 'revealed', 'success');
    }
    
    const secretInput = document.getElementById('secret-code');
    if (secretInput) {
      secretInput.value = '';
    }
  };

  hamburger.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', toggleSidebar);

  // Flashlight effect - track cursor on sidebar
  sidebar.addEventListener('mousemove', (e) => {
    const rect = sidebar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    flashlight.style.setProperty('--mouse-x', `${x}px`);
    flashlight.style.setProperty('--mouse-y', `${y}px`);
    
    // Update easter egg letters - only show when flashlight is directly on them
    const easterLetters = document.querySelectorAll('.easter-letter');
    easterLetters.forEach(letter => {
      // Get letter position relative to sidebar
      const letterRect = letter.getBoundingClientRect();
      const letterCenterX = letterRect.left - rect.left + letterRect.width / 2;
      const letterCenterY = letterRect.top - rect.top + letterRect.height / 2;
      
      // Calculate distance from mouse to letter center
      const distance = Math.sqrt(Math.pow(x - letterCenterX, 2) + Math.pow(y - letterCenterY, 2));
      
      // Only reveal if within 80px radius (tight flashlight beam)
      if (distance < 80) {
        letter.classList.add('revealed');
        letter.classList.add('discovered'); // Mark as found
      } else {
        letter.classList.remove('revealed'); // Hide when flashlight moves away
      }
    });
    
    // Check if all letters have been discovered - show secret input
    const secretContainer = document.getElementById('secret-input-container');
    const allDiscovered = document.querySelectorAll('.easter-letter.discovered').length === 5;
    
    if (allDiscovered && secretContainer) {
      secretContainer.classList.add('visible');
      
      // Check if flashlight is near the input box (at bottom center)
      const inputRect = secretContainer.getBoundingClientRect();
      const inputCenterX = inputRect.left - rect.left + inputRect.width / 2;
      const inputCenterY = inputRect.top - rect.top + inputRect.height / 2;
      const inputDistance = Math.sqrt(Math.pow(x - inputCenterX, 2) + Math.pow(y - inputCenterY, 2));
      
      if (inputDistance < 100) {
        secretContainer.classList.add('revealed');
      } else {
        secretContainer.classList.remove('revealed');
      }
    }
  });

  // Easter Egg Secret Code Handler
  const secretCodeInput = document.getElementById('secret-code');
  
  const checkSecretCode = () => {
    const code = secretCodeInput.value.toLowerCase();
    if (code === 'spics') {
      const container = document.getElementById('secret-input-container');
      container.classList.add('success');
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = 'https://www.instagram.com/spixchu/'; // Change this to your secret link!
      }, 800);
    }
  };
  
  if (secretCodeInput) {
    // Check on Enter key press
    secretCodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        checkSecretCode();
      }
    });
  }

  // Close sidebar when clicking a link
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  });

  // ===============================
  // IMAGE SLIDER
  // ===============================
  const bigSlider = document.querySelector('.big-photo .slider');
  const smallSlider = document.querySelector('.frame-inner .slider');
  const pageNumber = document.querySelector('.page-number .current');
  const progressFill = document.querySelector('.progress-fill');
  const slideBtn = document.getElementById('slide-btn');

  const images = ['assets/1.png', 'assets/2.png', 'assets/3.png'];
  let index = 0;
  let slideInterval;

  const bigImgs = bigSlider.querySelectorAll('img');
  const smallImgs = smallSlider.querySelectorAll('img');

  // Typewriter function
  const typeWriter = (element, text, speed) => {
    element.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    type();
  };

  // Preload
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Initial images
  bigImgs[0].src = images[0];
  bigImgs[1].src = images[1];

  smallImgs[0].src = images[1];
  smallImgs[1].src = images[2];

  const slide = () => {
    const next = (index + 1) % images.length;

    bigImgs[1].src = images[next];
    smallImgs[1].src = images[(next + 1) % images.length];

    bigSlider.style.transition = 'transform 1s ease-in-out';
    smallSlider.style.transition = 'transform 1s ease-in-out';

    bigSlider.style.transform = 'translateX(-50%)';
    smallSlider.style.transform = 'translateX(-50%)';

    setTimeout(() => {
      bigSlider.style.transition = 'none';
      smallSlider.style.transition = 'none';

      bigImgs[0].src = images[next];
      smallImgs[0].src = images[(next + 1) % images.length];

      bigSlider.style.transform = 'translateX(0)';
      smallSlider.style.transform = 'translateX(0)';

      index = next;

      // Update page number
      if (pageNumber) {
        pageNumber.textContent = String(index + 1).padStart(2, '0');
      }

      // Reset progress bar animation
      if (progressFill) {
        progressFill.style.animation = 'none';
        progressFill.offsetHeight;
        progressFill.style.animation = 'progress 2s linear infinite';
      }
    }, 1000);
  };

  // Slide to previous image (slides right)
  const slidePrev = () => {
    const prev = (index - 1 + images.length) % images.length;

    // Set up images: put previous image on the left
    bigSlider.style.transition = 'none';
    smallSlider.style.transition = 'none';
    
    bigSlider.style.transform = 'translateX(-50%)';
    smallSlider.style.transform = 'translateX(-50%)';
    
    bigImgs[0].src = images[prev];
    bigImgs[1].src = images[index];
    smallImgs[0].src = images[index];
    smallImgs[1].src = images[(index + 1) % images.length];

    // Force reflow
    bigSlider.offsetHeight;
    smallSlider.offsetHeight;

    // Animate sliding right (to position 0)
    bigSlider.style.transition = 'transform 1s ease-in-out';
    smallSlider.style.transition = 'transform 1s ease-in-out';
    bigSlider.style.transform = 'translateX(0)';
    smallSlider.style.transform = 'translateX(0)';

    setTimeout(() => {
      index = prev;

      // Update page number
      if (pageNumber) {
        pageNumber.textContent = String(index + 1).padStart(2, '0');
      }

      // Reset progress bar animation
      if (progressFill) {
        progressFill.style.animation = 'none';
        progressFill.offsetHeight;
        progressFill.style.animation = 'progress 2s linear infinite';
      }
    }, 1000);
  };

  // Start auto-slide
  const startAutoSlide = () => {
    slideInterval = setInterval(slide, 2000);
  };

  // Reset auto-slide timer
  const resetAutoSlide = () => {
    clearInterval(slideInterval);
    startAutoSlide();
  };

  startAutoSlide();

  // Manual slide button click - slides right (to previous image)
  if (slideBtn) {
    slideBtn.addEventListener('click', () => {
      slidePrev();
      resetAutoSlide();
    });
  }

  // Typewriter animation for hero description
  const heroDescription = document.querySelector('.hero-description p');
  if (heroDescription) {
    const originalText = heroDescription.textContent;
    heroDescription.textContent = '';
    setTimeout(() => {
      typeWriter(heroDescription, originalText, 30);
    }, 500);
  }

  // ===============================
  // SCROLL REVEAL FOR SECTIONS
  // ===============================
  const revealSections = () => {
    document.querySelectorAll('section').forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom > 100 && rect.top < window.innerHeight - 100) {
        section.classList.add('revealed');
      } else {
        section.classList.remove('revealed');
      }
    });
  };
  window.addEventListener('scroll', revealSections);
  revealSections();

  // ===============================
  // PROJECTS SLIDESHOW
  // ===============================
  const slides = document.querySelectorAll('.project-card.slide');
  const prevButton = document.querySelector('.slideshow-prev');
  const nextButton = document.querySelector('.slideshow-next');
  const closeButton = document.querySelector('.slideshow-close');
  const indicators = document.querySelectorAll('.indicator');
  const slideshowContainer = document.querySelector('.projects-slideshow-container');
  const slideshow = document.querySelector('.projects-slideshow');
  const projectsSection = document.getElementById('projects');
  
  if (slides.length > 0) {
    let currentSlide = 0;
    let isExpanded = false;
    
    function showSlide(idx) {
      // Remove all state classes
      slides.forEach(s => {
        s.classList.remove('active', 'prev', 'next');
      });
      indicators.forEach(ind => ind.classList.remove('active'));
      
      // Handle wrap-around
      if (idx < 0) {
        currentSlide = slides.length - 1;
      } else if (idx >= slides.length) {
        currentSlide = 0;
      } else {
        currentSlide = idx;
      }
      
      // Calculate prev and next indices
      const prevIdx = (currentSlide - 1 + slides.length) % slides.length;
      const nextIdx = (currentSlide + 1) % slides.length;
      
      // Apply classes
      if (slides[prevIdx]) slides[prevIdx].classList.add('prev');
      if (slides[currentSlide]) slides[currentSlide].classList.add('active');
      if (slides[nextIdx]) slides[nextIdx].classList.add('next');
      if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
    }
    
    // Expand slideshow function
    function expandSlideshow() {
      if (!isExpanded) {
        isExpanded = true;
        slideshowContainer.classList.add('expanded');
        slideshow.classList.add('expanded');
        
        // Disable scrolling
        document.body.style.overflow = 'hidden';
        
        // Scroll to projects section smoothly
        projectsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    // Collapse slideshow function
    function collapseSlideshow() {
      if (isExpanded) {
        isExpanded = false;
        slideshowContainer.classList.remove('expanded');
        slideshow.classList.remove('expanded');
        
        // Re-enable scrolling
        document.body.style.overflow = '';
      }
    }
    
    // Click on active card to expand
    slides.forEach(slide => {
      slide.addEventListener('click', (e) => {
        // Don't expand if clicking on links
        if (e.target.closest('.project-link')) return;
        expandSlideshow();
      });
    });
    
    // Close button
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        collapseSlideshow();
      });
    }
    
    // Navigation buttons - also expand on first click
    if (nextButton) {
      nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isExpanded) {
          expandSlideshow();
        }
        showSlide(currentSlide + 1);
      });
    }
    
    if (prevButton) {
      prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isExpanded) {
          expandSlideshow();
        }
        showSlide(currentSlide - 1);
      });
    }
    
    indicators.forEach((indicator, idx) => {
      indicator.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isExpanded) {
          expandSlideshow();
        }
        showSlide(idx);
      });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const projectsSection = document.getElementById('projects');
      if (!projectsSection) return;
      const rect = projectsSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible && isExpanded) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          showSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          showSlide(currentSlide + 1);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          collapseSlideshow();
        }
      }
    });
    
    showSlide(0);
  }

  // ===============================
  // CONTACT FORM MAILTO
  // ===============================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      const subject = encodeURIComponent('Contact Form Submission');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
      window.location.href = `mailto:somarious2@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
