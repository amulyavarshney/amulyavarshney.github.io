import LanguageService from '../services/LanguageService.js';

/**
 * Translator utility for applying translations to DOM elements
 */
class Translator {
  constructor() {
    // Detect i18n elements on page load
    this.translationElements = Array.from(document.querySelectorAll('[data-i18n]'));
    
    // Setup observer for language changes
    LanguageService.addObserver(() => this.translateAll());
  }
  
  /**
   * Initialize the translator
   */
  init() {
    this.translateAll();
    return this;
  }
  
  /**
   * Translate all elements with data-i18n attributes
   */
  translateAll() {
    this.translationElements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      this.translateElement(element, key);
    });
  }
  
  /**
   * Translate a specific element
   * @param {HTMLElement} element - Element to translate
   * @param {string} key - Translation key
   */
  translateElement(element, key) {
    const translation = LanguageService.translate(key);
    if (!translation) return;
    
    // Handle different element types
    if (element.tagName === 'INPUT') {
      // For input elements, set placeholder or value
      if (element.type === 'submit' || element.type === 'button') {
        element.value = translation;
      } else {
        element.placeholder = translation;
      }
    } else if (element.tagName === 'TEXTAREA') {
      // Set placeholder for textareas
      element.placeholder = translation;
    } else {
      // For other elements, set text content
      element.textContent = translation;
    }
  }
  
  /**
   * Add new element to translation collection (for dynamically added elements)
   * @param {HTMLElement} element - Element to add
   */
  addElement(element) {
    if (element.hasAttribute('data-i18n') && !this.translationElements.includes(element)) {
      this.translationElements.push(element);
      this.translateElement(element, element.getAttribute('data-i18n'));
    }
  }
  
  /**
   * Refresh the collection of translatable elements (e.g., after DOM changes)
   */
  refresh() {
    this.translationElements = Array.from(document.querySelectorAll('[data-i18n]'));
    this.translateAll();
  }
}

export default Translator; 