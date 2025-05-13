import { DOM_IDS, CSS_CLASSES } from '../config.js';
import ThemeService from '../services/ThemeService.js';

/**
 * Theme Controller component
 */
class ThemeController {
  constructor() {
    this.themeButton = document.getElementById(DOM_IDS.themeButton);
    
    // Add event listener to theme button
    if (this.themeButton) {
      this.themeButton.addEventListener('click', () => this.toggleTheme());
    }
  }
  
  /**
   * Initialize the component
   */
  init() {
    this.updateThemeIcon();
    return this;
  }
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    ThemeService.toggleTheme();
    this.updateThemeIcon();
  }
  
  /**
   * Update the theme button icon based on current theme
   */
  updateThemeIcon() {
    if (!this.themeButton) return;
    
    // Remove existing icon classes
    this.themeButton.classList.remove(CSS_CLASSES.moonIcon, CSS_CLASSES.sunIcon);
    
    // Add the appropriate icon class
    if (ThemeService.isDarkTheme()) {
      this.themeButton.classList.add(CSS_CLASSES.sunIcon);
    } else {
      this.themeButton.classList.add(CSS_CLASSES.moonIcon);
    }
  }
}

export default ThemeController; 