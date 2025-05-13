import { DOM_IDS } from '../config.js';
import LanguageService from '../services/LanguageService.js';

/**
 * Contact component
 */
class Contact {
  constructor() {
    this.form = document.querySelector('.contact__form');
    this.nameInput = document.getElementById('client_name');
    this.emailInput = document.getElementById('client_email');
    this.subjectInput = document.getElementById('client_subject');
    this.messageInput = document.getElementById('client_message');
    this.submitButton = document.getElementById('send_email');
    
    // Setup form submission
    this.setupFormSubmission();
    
    // Handle language change to update placeholders
    LanguageService.addObserver(() => this.updatePlaceholders());
  }
  
  /**
   * Initialize the component
   */
  init() {
    this.updatePlaceholders();
    return this;
  }
  
  /**
   * Update form placeholders with translated text
   */
  updatePlaceholders() {
    if (!this.nameInput || !this.emailInput || !this.subjectInput || !this.messageInput) return;
    
    // Update form labels and placeholders
    this.nameInput.placeholder = LanguageService.translate('form_name_placeholder') || 'Enter your Name';
    this.emailInput.placeholder = LanguageService.translate('email_hint') || 'Enter your Email Address';
    this.subjectInput.placeholder = LanguageService.translate('subject_hint') || 'Enter the Subject';
    this.messageInput.placeholder = LanguageService.translate('message_hint') || 'Write your Message here';
    
    // Update submit button text
    if (this.submitButton) {
      this.submitButton.innerHTML = `
        ${LanguageService.translate('send_message')} <i class='bx bxl-send'></i>
      `;
    }
    
    // Update form labels
    document.querySelectorAll('.contact__form-tag').forEach(label => {
      const forAttr = label.getAttribute('for');
      if (forAttr === 'client_name') {
        label.textContent = LanguageService.translate('form_name') || 'Name';
      } else if (forAttr === 'client_email') {
        label.textContent = LanguageService.translate('form_email') || 'Email';
      } else if (forAttr === 'client_subject') {
        label.textContent = LanguageService.translate('form_subject') || 'Subject';
      } else if (forAttr === 'client_message') {
        label.textContent = LanguageService.translate('form_message') || 'Message';
      }
    });
  }
  
  /**
   * Setup form submission
   */
  setupFormSubmission() {
    if (!this.form) return;
    
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate form
      if (!this.validateForm()) {
        return;
      }
      
      // Collect form data
      const formData = {
        name: this.nameInput.value,
        email: this.emailInput.value,
        subject: this.subjectInput.value,
        message: this.messageInput.value
      };
      
      // Here you would normally send the form data to a server
      // For demo purposes, we'll just log it
      console.log('Form submitted:', formData);
      
      // Show success message
      this.showMessage(LanguageService.translate('message_sent') || 'Message sent successfully!', 'success');
      
      // Reset form
      this.form.reset();
    });
  }
  
  /**
   * Validate form inputs
   * @returns {boolean} - Whether the form is valid
   */
  validateForm() {
    let isValid = true;
    
    // Check name
    if (!this.nameInput.value.trim()) {
      this.showInputError(this.nameInput, LanguageService.translate('name_required') || 'Name is required');
      isValid = false;
    } else {
      this.clearInputError(this.nameInput);
    }
    
    // Check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.emailInput.value.trim()) {
      this.showInputError(this.emailInput, LanguageService.translate('email_required') || 'Email is required');
      isValid = false;
    } else if (!emailRegex.test(this.emailInput.value)) {
      this.showInputError(this.emailInput, LanguageService.translate('email_invalid') || 'Please enter a valid email');
      isValid = false;
    } else {
      this.clearInputError(this.emailInput);
    }
    
    // Check subject
    if (!this.subjectInput.value.trim()) {
      this.showInputError(this.subjectInput, LanguageService.translate('subject_required') || 'Subject is required');
      isValid = false;
    } else {
      this.clearInputError(this.subjectInput);
    }
    
    // Check message
    if (!this.messageInput.value.trim()) {
      this.showInputError(this.messageInput, LanguageService.translate('message_required') || 'Message is required');
      isValid = false;
    } else {
      this.clearInputError(this.messageInput);
    }
    
    return isValid;
  }
  
  /**
   * Show input error
   * @param {HTMLElement} input - Input element
   * @param {string} message - Error message
   */
  showInputError(input, message) {
    const formDiv = input.parentElement;
    const errorElement = formDiv.querySelector('.contact__form-error') || document.createElement('div');
    
    errorElement.textContent = message;
    errorElement.classList.add('contact__form-error');
    
    if (!formDiv.querySelector('.contact__form-error')) {
      formDiv.appendChild(errorElement);
    }
    
    input.classList.add('contact__form-input-error');
  }
  
  /**
   * Clear input error
   * @param {HTMLElement} input - Input element
   */
  clearInputError(input) {
    const formDiv = input.parentElement;
    const errorElement = formDiv.querySelector('.contact__form-error');
    
    if (errorElement) {
      formDiv.removeChild(errorElement);
    }
    
    input.classList.remove('contact__form-input-error');
  }
  
  /**
   * Show form message
   * @param {string} message - Message text
   * @param {string} type - Message type ('success' or 'error')
   */
  showMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('contact__message', `contact__message-${type}`);
    
    // Add message to the form
    this.form.appendChild(messageElement);
    
    // Remove message after 3 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 3000);
  }
}

export default Contact; 