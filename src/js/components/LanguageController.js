import { DOM_IDS, SUPPORTED_LANGUAGES } from '../config.js';
import LanguageService from '../services/LanguageService.js';

/**
 * Language Controller component
 */
class LanguageController {
  constructor() {
    this.languageButton = document.getElementById(DOM_IDS.languageButton);
    this.currentLangIndex = SUPPORTED_LANGUAGES.indexOf(LanguageService.getCurrentLanguage());
    
    // Add event listener to language button
    if (this.languageButton) {
      this.languageButton.addEventListener('click', () => this.cycleLanguage());
    }
  }
  
  /**
   * Initialize the component
   */
  init() {
    this.updateLanguageDisplay();
    return this;
  }
  
  /**
   * Cycle through available languages
   */
  cycleLanguage() {
    this.currentLangIndex = (this.currentLangIndex + 1) % SUPPORTED_LANGUAGES.length;
    const newLang = SUPPORTED_LANGUAGES[this.currentLangIndex];
    
    LanguageService.setLanguage(newLang);
    this.updateLanguageDisplay();
  }
  
  /**
   * Update the language button display based on current language
   */
  updateLanguageDisplay() {
    if (!this.languageButton) return;
    
    const currentLang = LanguageService.getCurrentLanguage().toUpperCase();
    this.languageButton.textContent = currentLang;
    
    // Optional: Add flag or other visual indicator
    // this.languageButton.innerHTML = `<span class="flag-icon flag-icon-${currentLang}"></span>`;
  }
}

export default LanguageController; 