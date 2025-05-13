// Import the main application
import App from './src/js/app.js';

// Initialize the application on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
}); 