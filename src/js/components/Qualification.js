import { DOM_IDS } from '../config.js';
import DataService from '../services/DataService.js';
import LanguageService from '../services/LanguageService.js';

/**
 * Qualification component
 */
class Qualification {
  constructor() {
    this.educationContainer = document.getElementById(DOM_IDS.qualificationEducation);
    this.workContainer = document.getElementById(DOM_IDS.qualificationWork);
    this.tabs = document.querySelectorAll('.qualification-tabs-button');
    this.tabContents = document.querySelectorAll('.qualification-content');
    
    // Setup tab click listeners
    this.setupTabListeners();
    
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
   * Setup tab click listeners
   */
  setupTabListeners() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target);
        
        // Remove active class from all tab contents
        this.tabContents.forEach(tabContent => {
          tabContent.classList.remove('qualification-active');
        });
        
        // Add active class to the selected tab content
        target.classList.add('qualification-active');
        
        // Remove active class from all tabs
        this.tabs.forEach(tab => {
          tab.classList.remove('qualification-active');
        });
        
        // Add active class to the clicked tab
        tab.classList.add('qualification-active');
      });
    });
  }
  
  /**
   * Render qualification content
   */
  render() {
    this.renderEducation();
    this.renderWork();
  }
  
  /**
   * Render education qualifications
   */
  renderEducation() {
    if (!this.educationContainer) return;
    
    // Clear existing content
    this.educationContainer.innerHTML = '';
    
    // Get education data
    const educationData = DataService.qualifications.education || [];
    
    // Render education items
    educationData.forEach((item, index) => {
      const div = document.createElement('div');
      div.classList.add('qualification-data');
      
      div.innerHTML = `
        ${index % 2 === 0 ? `
          <div class="qualification-data-alt">
            <h3 class="qualification-title">${item.title}</h3>
            <span class="qualification-subtitle">${item.subtitle}</span>
            <div class="qualification-calendar">
              <i class="bx bxs-calendar"></i>
              ${item.calender}
            </div>
          </div>
        ` : `
          <div></div>
        `}
        <div>
          <span class="qualification-rounder"></span>
          ${index !== educationData.length - 1 ? `<span class="qualification-line"></span>` : ''}
        </div>
        ${index % 2 !== 0 ? `
          <div class="qualification-data-alt">
            <h3 class="qualification-title">${item.title}</h3>
            <span class="qualification-subtitle">${item.subtitle}</span>
            <div class="qualification-calendar">
              <i class="bx bxs-calendar"></i>
              ${item.calender}
            </div>
          </div>
        ` : `
          <div></div>
        `}
      `;
      
      this.educationContainer.appendChild(div);
    });
  }
  
  /**
   * Render work experience
   */
  renderWork() {
    if (!this.workContainer) return;
    
    // Clear existing content
    this.workContainer.innerHTML = '';
    
    // Get work data
    const workData = DataService.qualifications.work || [];
    
    // Render work items
    workData.forEach((item, index) => {
      const div = document.createElement('div');
      div.classList.add('qualification-data');
      
      div.innerHTML = `
        ${index % 2 === 0 ? `
          <div class="qualification-data-alt">
            <h3 class="qualification-title">${item.title}</h3>
            <span class="qualification-subtitle">${item.subtitle}</span>
            <div class="qualification-calendar">
              <i class="bx bxs-calendar"></i>
              ${item.calender}
            </div>
          </div>
        ` : `
          <div></div>
        `}
        <div>
          <span class="qualification-rounder"></span>
          ${index !== workData.length - 1 ? `<span class="qualification-line"></span>` : ''}
        </div>
        ${index % 2 !== 0 ? `
          <div class="qualification-data-alt">
            <h3 class="qualification-title">${item.title}</h3>
            <span class="qualification-subtitle">${item.subtitle}</span>
            <div class="qualification-calendar">
              <i class="bx bxs-calendar"></i>
              ${item.calender}
            </div>
          </div>
        ` : `
          <div></div>
        `}
      `;
      
      this.workContainer.appendChild(div);
    });
  }
}

export default Qualification; 