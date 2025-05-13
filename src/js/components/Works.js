import { DOM_IDS } from '../config.js';
import DataService from '../services/DataService.js';
import LanguageService from '../services/LanguageService.js';

/**
 * Works component
 */
class Works {
  constructor() {
    this.container = document.getElementById(DOM_IDS.workContainer);
    this.filterButtons = document.querySelectorAll('.work__item');
    this.currentFilter = 'all';
    
    // Setup filter buttons
    this.setupFilterButtons();
    
    // Handle language change
    LanguageService.addObserver(() => this.render());
  }
  
  /**
   * Initialize the component
   */
  init() {
    this.render();
    return this;
  }
  
  /**
   * Setup filter buttons
   */
  setupFilterButtons() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        this.filterButtons.forEach(btn => {
          btn.classList.remove('active-work');
        });
        
        // Add active class to clicked button
        button.classList.add('active-work');
        
        // Set current filter and re-render
        this.currentFilter = button.getAttribute('data-filter');
        this.render();
      });
    });
  }
  
  /**
   * Render works/projects
   */
  render() {
    if (!this.container) return;
    
    // Clear existing content
    this.container.innerHTML = '';
    
    // Filter works based on current filter
    const works = DataService.works || [];
    const filteredWorks = this.currentFilter === 'all' 
      ? works 
      : works.filter(work => work.category === this.currentFilter.substring(1));
    
    // Render filtered works
    filteredWorks.forEach(work => {
      const workCard = document.createElement('div');
      workCard.classList.add('work__card', 'mix', work.category);
      
      // Use data-theme-image attribute for theme-aware images
      workCard.innerHTML = `
        <img 
          src="${work.imgSrc}" 
          alt="${work.title}" 
          class="work__img"
          data-theme-image="${work.imgSrc.replace(/-[dl]\.png$/, '')}"
        >
        <h3 class="work__title">${work.title}</h3>
        <a href="${work.link}" target="_blank" class="work__button">
          ${LanguageService.translate('visit')} <i class="bx bx-right-arrow-alt work__icon"></i>
        </a>
      `;
      
      this.container.appendChild(workCard);
    });
  }
}

export default Works; 