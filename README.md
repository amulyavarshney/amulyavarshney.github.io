# Personal Portfolio Website

This is a personal portfolio website for Amulya Varshney, showcasing skills, experience, and projects.

## Features

- **Responsive Design**: Works well on all device sizes
- **Multiple Languages**: Support for English and Hindi (extensible to more languages)
- **Theme Switching**: Light and dark theme support
- **Dynamic Content**: All content loads from JSON configuration files
- **SOLID Architecture**: Well-structured codebase following SOLID principles

## Code Structure

The codebase follows a modular, component-based architecture:

- `src/js/services/` - Service classes (Singleton pattern)
  - `LanguageService.js` - Manages translations and language switching
  - `ThemeService.js` - Manages theme switching
  - `DataService.js` - Manages content data

- `src/js/components/` - UI components
  - `Navigation.js` - Navigation menu
  - `Skills.js` - Skills section
  - `Experience.js` - Experience section
  - And more...

- `src/js/utils/` - Utility classes
  - `ScrollManager.js` - Handles scroll animations
  - `Translator.js` - Simplifies DOM translation

- `assets/json/` - Language configuration files
  - `en.json` - English translations
  - `hi.json` - Hindi translations

## Design Principles Applied

1. **Single Responsibility Principle**: Each class has a single responsibility
2. **Open-Closed Principle**: Components are open for extension but closed for modification
3. **Dependency Inversion**: High-level modules don't depend on low-level modules
4. **DRY (Don't Repeat Yourself)**: Common functionality is abstracted into reusable modules
5. **Separation of Concerns**: UI, data, and business logic are separated

## Adding New Languages

To add a new language:

1. Create a new JSON file in `assets/json/` (e.g., `fr.json`)
2. Add the language code to `SUPPORTED_LANGUAGES` in `src/js/config.js`
3. Translate all the keys from `en.json` to your new language

## Modifying Content

All content is stored in the JSON language files. To update content:

1. Edit the corresponding JSON files in `assets/json/`
2. If adding new sections, ensure you add the corresponding translation keys
3. Rebuild/refresh the site

## Installation

No build step required! Just clone and serve:

```bash
# Clone the repository
git clone https://github.com/amulyavarshney/amulyavarshney.github.io.git

# Navigate to the project
cd amulyavarshney.github.io

# Serve with any static file server
# For example, with Python:
python -m http.server
```

Visit `http://localhost:8000` in your browser.

## License

See LICENSE file for details. 