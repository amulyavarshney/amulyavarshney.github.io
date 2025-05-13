import { DOM_IDS } from '../config.js';
import DataService from '../services/DataService.js';
import LanguageService from '../services/LanguageService.js';

/**
 * Navigation component
 */
class Navigation {
  constructor() {
    this.navList = document.getElementById(DOM_IDS.navList);
    
    // Handle language change
    LanguageService.addObserver(() => this.render());
  }
  
  /**
   * Initialize the component
   */
  init() {
    this.render();
    this.initScrollSpy();
    return this;
  }
  
  /**
   * Render the navigation items
   */
  render() {
    if (!this.navList) return;
    
    // Clear existing nav items
    this.navList.innerHTML = '';
    
    // Add new nav items
    DataService.navItems.forEach(item => {
      const li = document.createElement('li');
      li.classList.add('nav__item');
      
      li.innerHTML = `
        <a href="${item.href}" class="nav__link">
          <i class='bx ${item.icon}'></i>
        </a>
      `;
      
      this.navList.appendChild(li);
    });
  }
  
  /**
   * Initialize scroll spy functionality
   */
  initScrollSpy() {
    // Add 'scroll' event listener to window
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      
      // Get all sections that have an ID defined
      const sections = document.querySelectorAll('section[id]');
      
      // Loop through sections to get height, top and ID values
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 50;
        const sectionId = section.getAttribute('id');
        
        // If our current scroll position enters the space where the section is
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelector(`.nav__link[href*="${sectionId}"]`)?.parentElement.classList.add('active-link');
        } else {
          document.querySelector(`.nav__link[href*="${sectionId}"]`)?.parentElement.classList.remove('active-link');
        }
      });
    });
  }
}

export default Navigation; 