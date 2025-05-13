/**
 * Main configuration file for the website
 */

// Supported languages
export const SUPPORTED_LANGUAGES = ['en', 'hi'];
export const DEFAULT_LANGUAGE = 'en';

// Supported themes
export const SUPPORTED_THEMES = ['light', 'dark'];
export const DEFAULT_THEME = 'light';

// Configuration paths
export const CONFIG_PATHS = {
  languages: './assets/json/',
  themes: './assets/css/themes/',
  images: './assets/img/',
  pdf: './assets/pdf/',
};

// Local storage keys
export const STORAGE_KEYS = {
  language: 'selected-language',
  theme: 'selected-theme',
};

// DOM element IDs
export const DOM_IDS = {
  navList: 'nav-list',
  themeButton: 'theme-button',
  languageButton: 'language-button',
  skillsContainer: 'skills-container',
  experiencesContainer: 'experiences-container',
  qualificationEducation: 'education',
  qualificationWork: 'work',
  workContainer: 'work-container',
  contactForm: 'contact-form',
  scrollUp: 'scroll-up',
  canvas: 'canvas',
};

// CSS Classes
export const CSS_CLASSES = {
  darkTheme: 'dark-theme',
  lightTheme: 'light-theme',
  moonIcon: 'bxs-moon',
  sunIcon: 'bxs-sun',
}; 