import { SUPPORTED_THEMES, DEFAULT_THEME, STORAGE_KEYS, CSS_CLASSES } from '../config.js';

/**
 * Theme Service - Singleton to manage theme preferences
 */
class ThemeService {
  constructor() {
    if (ThemeService.instance) {
      return ThemeService.instance;
    }
    
    this.currentTheme = DEFAULT_THEME;
    this.observers = [];
    
    // Load the saved theme from localStorage or use default
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (savedTheme && SUPPORTED_THEMES.includes(savedTheme)) {
      this.currentTheme = savedTheme;
    }
    
    ThemeService.instance = this;
  }
  
  /**
   * Initialize theme service
   */
  init() {
    // Apply the current theme to the document
    this.applyTheme();
    return this;
  }
  
  /**
   * Get the current theme
   * @returns {string} - Current theme name
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  /**
   * Check if the current theme is dark
   * @returns {boolean} - Whether current theme is dark
   */
  isDarkTheme() {
    return this.currentTheme === 'dark';
  }
  
  /**
   * Toggle between light and dark themes
   * @returns {string} - New theme name
   */
  toggleTheme() {
    const newTheme = this.isDarkTheme() ? 'light' : 'dark';
    return this.setTheme(newTheme);
  }
  
  /**
   * Set the theme
   * @param {string} themeName - Theme name to set
   * @returns {string} - The set theme name
   */
  setTheme(themeName) {
    if (!SUPPORTED_THEMES.includes(themeName)) {
      console.error(`Theme ${themeName} is not supported`);
      return this.currentTheme;
    }
    
    this.currentTheme = themeName;
    localStorage.setItem(STORAGE_KEYS.theme, themeName);
    
    // Apply the theme
    this.applyTheme();
    
    // Notify observers of theme change
    this.notifyObservers();
    
    return this.currentTheme;
  }
  
  /**
   * Apply the current theme to the document
   */
  applyTheme() {
    const body = document.body;
    
    // Remove all theme classes
    SUPPORTED_THEMES.forEach(theme => {
      body.classList.remove(CSS_CLASSES[`${theme}Theme`]);
    });
    
    // Add the current theme class
    body.classList.add(CSS_CLASSES[`${this.currentTheme}Theme`]);
    
    // Update theme-specific assets (images, etc.)
    this.updateThemeAssets();
  }
  
  /**
   * Update theme-specific assets
   */
  updateThemeAssets() {
    // Find all elements with theme-aware images
    document.querySelectorAll('[data-theme-image]').forEach(el => {
      const baseSrc = el.getAttribute('data-theme-image');
      const suffix = this.isDarkTheme() ? '-d' : '-l';
      el.src = `${baseSrc}${suffix}.png`;
    });
  }
  
  /**
   * Add an observer for theme changes
   * @param {Function} observer - Function to call when theme changes
   */
  addObserver(observer) {
    if (typeof observer === 'function' && !this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }
  
  /**
   * Remove an observer
   * @param {Function} observer - Observer to remove
   */
  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  /**
   * Notify all observers of a theme change
   */
  notifyObservers() {
    this.observers.forEach(observer => observer(this.currentTheme));
  }
}

// Export a singleton instance
export default new ThemeService(); 