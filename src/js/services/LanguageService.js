import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, CONFIG_PATHS, STORAGE_KEYS } from '../config.js';

/**
 * Language Service - Singleton to manage language preferences and translations
 */
class LanguageService {
  constructor() {
    if (LanguageService.instance) {
      return LanguageService.instance;
    }
    
    this.translations = {};
    this.currentLanguage = DEFAULT_LANGUAGE;
    this.observers = [];
    
    // Load the saved language from localStorage or use default
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.language);
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      this.currentLanguage = savedLanguage;
    }
    
    LanguageService.instance = this;
  }
  
  /**
   * Load language translations
   * @returns {Promise} - Promise that resolves when translations are loaded
   */
  async loadTranslations() {
    try {
      for (const lang of SUPPORTED_LANGUAGES) {
        const response = await fetch(`${CONFIG_PATHS.languages}${lang}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${lang} translations`);
        }
        this.translations[lang] = await response.json();
      }
      
      // Apply the current language to the HTML tag
      this.applyLanguageAttributes();
      
      return true;
    } catch (error) {
      console.error('Error loading translations:', error);
      return false;
    }
  }
  
  /**
   * Get the current language code
   * @returns {string} - Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }
  
  /**
   * Set the current language
   * @param {string} langCode - Language code to set
   * @returns {boolean} - Whether the language was successfully set
   */
  setLanguage(langCode) {
    if (!SUPPORTED_LANGUAGES.includes(langCode)) {
      console.error(`Language ${langCode} is not supported`);
      return false;
    }
    
    // Add loading state to body while changing languages
    document.body.classList.add('i18n-loading');
    
    this.currentLanguage = langCode;
    localStorage.setItem(STORAGE_KEYS.language, langCode);
    
    // Update HTML lang attribute
    this.applyLanguageAttributes();
    
    // Notify observers of language change
    this.notifyObservers();
    
    // Remove loading state after a short delay
    setTimeout(() => {
      document.body.classList.remove('i18n-loading');
    }, 300);
    
    return true;
  }
  
  /**
   * Apply language attributes to the HTML element
   */
  applyLanguageAttributes() {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('lang', this.currentLanguage);
    
    // Set RTL if needed (for future languages)
    const rtlLanguages = []; // Add RTL language codes here if needed
    if (rtlLanguages.includes(this.currentLanguage)) {
      htmlElement.setAttribute('dir', 'rtl');
    } else {
      htmlElement.setAttribute('dir', 'ltr');
    }
  }
  
  /**
   * Get a translated string by key
   * @param {string} key - Translation key
   * @param {Object} params - Optional parameters for string interpolation
   * @returns {string} - Translated string
   */
  translate(key, params = {}) {
    const translation = this.translations[this.currentLanguage]?.[key];
    
    if (!translation) {
      console.warn(`Translation not found: ${key}`);
      return key;
    }
    
    // If there are parameters, replace them in the string
    if (Object.keys(params).length > 0) {
      return Object.keys(params).reduce((str, param) => {
        return str.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
      }, translation);
    }
    
    return translation;
  }
  
  /**
   * Add an observer for language changes
   * @param {Function} observer - Function to call when language changes
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
   * Notify all observers of a language change
   */
  notifyObservers() {
    this.observers.forEach(observer => observer(this.currentLanguage));
  }
}

// Export a singleton instance
export default new LanguageService(); 