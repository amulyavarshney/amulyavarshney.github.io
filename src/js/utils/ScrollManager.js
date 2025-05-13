import { DOM_IDS } from '../config.js';

/**
 * Scroll Manager utility
 */
class ScrollManager {
  constructor() {
    this.scrollReveal = null;
    this.scrollUp = document.getElementById(DOM_IDS.scrollUp);
    
    // Setup scroll to top button
    this.setupScrollUpButton();
  }
  
  /**
   * Initialize the scroll manager
   */
  init() {
    // Initialize ScrollReveal if available
    if (window.ScrollReveal) {
      this.initScrollReveal();
    }
    
    return this;
  }
  
  /**
   * Initialize ScrollReveal animations
   */
  initScrollReveal() {
    // Create ScrollReveal instance
    this.scrollReveal = ScrollReveal({
      origin: 'top',
      distance: '60px',
      duration: 2500,
      delay: 400,
      // reset: true // Animation repeats
    });
    
    // Configure animations for different sections
    this.scrollReveal.reveal('.home__data');
    this.scrollReveal.reveal('.home-img', { delay: 500 });
    this.scrollReveal.reveal('.home__social', { delay: 600 });
    this.scrollReveal.reveal('.about__img', { delay: 500 });
    this.scrollReveal.reveal('.about__subtitle', { delay: 400 });
    this.scrollReveal.reveal('.about__description', { delay: 500 });
    this.scrollReveal.reveal('.skills-container-content', { interval: 100 });
    this.scrollReveal.reveal('.experiences__content', { interval: 100 });
    this.scrollReveal.reveal('.work__filters', { delay: 100 });
    this.scrollReveal.reveal('.work__card', { interval: 100 });
    this.scrollReveal.reveal('.contact__card', { interval: 100 });
  }
  
  /**
   * Setup scroll to top button
   */
  setupScrollUpButton() {
    if (!this.scrollUp) return;
    
    // Show scroll up button when scrolled down
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 560) {
        this.scrollUp.classList.add('show-scroll');
      } else {
        this.scrollUp.classList.remove('show-scroll');
      }
    });
    
    // Add click event to scroll to top
    this.scrollUp.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

export default ScrollManager; 