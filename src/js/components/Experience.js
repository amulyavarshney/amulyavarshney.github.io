import { DOM_IDS } from '../config.js';
import DataService from '../services/DataService.js';
import LanguageService from '../services/LanguageService.js';

/**
 * Experience component
 */
class Experience {
  constructor() {
    this.container = document.getElementById(DOM_IDS.experiencesContainer);
    
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
   * Render experience content
   */
  render() {
    if (!this.container) return;
    
    // Clear existing content
    this.container.innerHTML = '';
    
    // Render experiences
    DataService.experiences.forEach(exp => {
      const expContent = document.createElement('div');
      expContent.classList.add('experiences__content');
      
      // Create experience header
      expContent.innerHTML = `
        <h3 class="experiences__title">${exp.title}</h3>
        <h5 class="experiences__subtitle">${exp.subtitle}</h5>
        <div class="experiences__box">
          ${exp.data.map(detail => `
            <div class="experiences__data">
              <i class='bx bxs-badge-check'></i>
              <div>
                <h3 class="experiences__name">${detail.name}</h3>
                <span class="experiences__level">${detail.level}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      
      this.container.appendChild(expContent);
    });
  }
}

export default Experience; 