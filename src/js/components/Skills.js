import { DOM_IDS } from '../config.js';
import DataService from '../services/DataService.js';
import LanguageService from '../services/LanguageService.js';

/**
 * Skills component
 */
class Skills {
  constructor() {
    this.container = document.getElementById(DOM_IDS.skillsContainer);
    
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
   * Render skills content
   */
  render() {
    if (!this.container) return;
    
    // Clear existing content
    this.container.innerHTML = '';
    
    // Render skills categories
    DataService.skills.forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.classList.add('skills-container-content', 'skills-close');
      
      // Create header
      const header = document.createElement('div');
      header.classList.add('skills-container-header');
      header.innerHTML = `
        <i class="${category.logo} skills-icon"></i>
        <div>
          <h1 class="skills-title">${category.title}</h1>
          <span class="skills-subtitle">${category.subtitle}</span>
        </div>
        <i class="bx bxs-chevron-down skills-arrow"></i>
      `;
      
      // Add click event to toggle skills list
      header.addEventListener('click', () => {
        categoryDiv.classList.toggle('skills-close');
        categoryDiv.classList.toggle('skills-open');
        
        const list = categoryDiv.querySelector('.skills-list');
        if (list.style.height) {
          list.style.height = '';
        } else {
          list.style.height = `${list.scrollHeight}px`;
        }
      });
      
      // Create skills list
      const skillsList = document.createElement('div');
      skillsList.classList.add('skills-list', 'grid');
      
      // Add individual skills
      category.data.forEach(skill => {
        const skillData = document.createElement('div');
        skillData.classList.add('skills-data');
        skillData.innerHTML = `
          <div class="skills-titles">
            <h3 class="skills-name">${skill.name}</h3>
            <span class="skills-number">${skill.number}</span>
          </div>
          <div class="skills-bar">
            <span class="skills-percentage" style="width: ${skill.number};"></span>
          </div>
        `;
        skillsList.appendChild(skillData);
      });
      
      // Assemble the category
      categoryDiv.appendChild(header);
      categoryDiv.appendChild(skillsList);
      this.container.appendChild(categoryDiv);
    });
  }
}

export default Skills; 