# UTM Parameter Builder - Chrome Extension

A Chrome extension version of the UTM Parameter Builder tool for quick campaign URL generation.

## Features

- **Quick Access**: Generate UTM URLs directly from any webpage
- **Current Page Integration**: Automatically use the current page URL
- **Platform Support**: GA4, Google Ads, Microsoft Ads, and Meta Ads
- **Smart Suggestions**: Categorized dropdown options
- **One-Click Copy**: Copy generated URLs to clipboard
- **Context Menu**: Right-click to access UTM builder
- **Floating Button**: Optional floating button on ad platforms

## Installation

### Development Mode

1. Clone the repository
2. Navigate to the extension folder
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the extension:
   ```bash
   npm run build
   ```
5. Open Chrome and go to `chrome://extensions/`
6. Enable "Developer mode"
7. Click "Load unpacked" and select the `dist` folder

### Production Build

1. Build the extension:
   ```bash
   npm run build
   ```
2. The `dist` folder contains the production-ready extension
3. Zip the `dist` folder for Chrome Web Store submission

## Usage

### Popup Interface
- Click the extension icon in the toolbar
- Select your platform (GA4, Google Ads, Meta Ads)
- Enter your UTM parameters
- Copy or open the generated URL

### Context Menu
- Right-click on any page
- Select "Generate UTM URL"
- The popup will open with the current page URL pre-filled

### Floating Button
- Appears automatically on advertising platforms
- Click to open the UTM builder
- Provides quick access without toolbar interaction

## File Structure

```
extension/
├── manifest.json          # Extension manifest
├── popup.html            # Popup interface
├── popup.js              # Popup entry point
├── popup.css             # Extension-specific styles
├── content.js            # Content script for page interaction
├── background.js         # Background service worker
├── components/           # React components
│   ├── ExtensionApp.js   # Main app component
│   └── ExtensionBuilder.js # UTM builder interface
├── icons/               # Extension icons
├── vite.config.js       # Build configuration
└── package.json         # Dependencies
```

## Key Features

### Compact Design
- Optimized for 420px width popup
- Scrollable interface for longer content
- Responsive design for different screen sizes

### Smart Integration
- Detects advertising platforms automatically
- Pre-fills current page URL
- Context-aware suggestions

### Performance
- Lightweight bundle size
- Fast popup loading
- Efficient memory usage

## Development

### Building
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

### Testing
1. Load the extension in Chrome
2. Test popup functionality
3. Verify content script integration
4. Check background script features

## Chrome Web Store Submission

1. Create high-quality screenshots (1280x800)
2. Write compelling store description
3. Set appropriate permissions
4. Test on multiple Chrome versions
5. Submit for review

## Permissions

- `activeTab`: Access current tab URL
- `storage`: Save user preferences and templates
- `clipboardWrite`: Copy URLs to clipboard

## Browser Compatibility

- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

## Future Enhancements

- Bulk URL generation
- Template management
- Analytics integration
- Team collaboration features
- Custom parameter validation