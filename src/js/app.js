import LanguageService from './services/LanguageService.js';
import ThemeService from './services/ThemeService.js';
import DataService from './services/DataService.js';

import Navigation from './components/Navigation.js';
import ThemeController from './components/ThemeController.js';
import LanguageController from './components/LanguageController.js';
import Skills from './components/Skills.js';
import Qualification from './components/Qualification.js';
import Experience from './components/Experience.js';
import Works from './components/Works.js';
import Contact from './components/Contact.js';

import ScrollManager from './utils/ScrollManager.js';
import Translator from './utils/Translator.js';

/**
 * Main Application Class
 */
class App {
  constructor() {
    // Initialize services in the correct order
    this.services = {
      language: LanguageService,
      theme: ThemeService,
      data: DataService
    };
    
    // Initialize components
    this.components = {
      navigation: new Navigation(),
      themeController: new ThemeController(),
      languageController: new LanguageController(),
      skills: new Skills(),
      qualification: new Qualification(),
      experience: new Experience(),
      works: new Works(),
      contact: new Contact()
    };
    
    // Initialize utilities
    this.utils = {
      scrollManager: new ScrollManager(),
      translator: new Translator()
    };
  }
  
  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('Initializing application...');
      
      // Initialize services
      await this.initializeServices();
      
      // Initialize utilities (translator first to handle static content)
      this.utils.translator.init();
      
      // Initialize components
      this.initializeComponents();
      
      // Initialize other utilities
      this.utils.scrollManager.init();
      
      console.log('Application initialized successfully!');
    } catch (error) {
      console.error('Error initializing application:', error);
    }
  }
  
  /**
   * Initialize services
   */
  async initializeServices() {
    // Initialize theme service
    this.services.theme.init();
    
    // Initialize data service (which loads translations)
    await this.services.data.init();
  }
  
  /**
   * Initialize components
   */
  initializeComponents() {
    // Initialize all components
    Object.values(this.components).forEach(component => {
      component.init();
    });
  }
}

// Initialize the application on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

// Export app for potential external use
export default App; 