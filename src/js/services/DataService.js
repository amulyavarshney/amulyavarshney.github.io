import LanguageService from './LanguageService.js';

/**
 * Data Service - Singleton to manage content data
 */
class DataService {
  constructor() {
    if (DataService.instance) {
      return DataService.instance;
    }
    
    // Setup language observer to update data on language change
    LanguageService.addObserver(() => this.updateData());
    
    DataService.instance = this;
  }
  
  /**
   * Initialize data service
   * @returns {Promise} - Promise that resolves when data is loaded
   */
  async init() {
    // Ensure language translations are loaded
    const translationsLoaded = await LanguageService.loadTranslations();
    if (!translationsLoaded) {
      throw new Error('Failed to load translations');
    }
    
    // Update data based on current language
    await this.updateData();
    
    return this;
  }
  
  /**
   * Update all data based on current language
   */
  async updateData() {
    this.navItems = this.getNavItems();
    this.skills = this.getSkills();
    this.qualifications = this.getQualifications();
    this.experiences = this.getExperiences();
    this.works = this.getWorks();
  }
  
  /**
   * Get navigation items
   * @returns {Array} - Navigation items
   */
  getNavItems() {
    const t = (key) => LanguageService.translate(key);
    
    return [
      { href: "#home", icon: "bxs-home", label: t('home') },
      { href: "#skills", icon: "bxs-book-open", label: t('skills') },
      { href: "#qualifications", icon: "bxs-school", label: t('qualification') },
      { href: "#experiences", icon: "bxs-briefcase-alt", label: t('experience') },
      { href: "#works", icon: "bx-task", label: t('projects') },
      { href: "#contact", icon: "bxs-message-square-detail", label: t('contact') },
    ];
  }
  
  /**
   * Get skills data
   * @returns {Array} - Skills data
   */
  getSkills() {
    return LanguageService.translate('skills_content') || [];
  }
  
  /**
   * Get qualification data
   * @returns {Object} - Qualification data
   */
  getQualifications() {
    const data = LanguageService.translate('qualification_tabs') || [];
    const result = {};
    
    data.forEach(tab => {
      if (tab.name === 'Education') {
        result.education = tab.data;
      } else if (tab.name === 'Work') {
        result.work = tab.data;
      }
    });
    
    return result;
  }
  
  /**
   * Get experiences data
   * @returns {Array} - Experiences data
   */
  getExperiences() {
    return LanguageService.translate('experience_content') || [];
  }
  
  /**
   * Get works/projects data
   * @returns {Array} - Works data
   */
  getWorks() {
    return LanguageService.translate('works') || [];
  }
  
  /**
   * Get contact info
   * @returns {Object} - Contact info
   */
  getContactInfo() {
    return LanguageService.translate('contact_info') || {};
  }
}

// Export a singleton instance
export default new DataService(); 