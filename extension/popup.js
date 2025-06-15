// Extension popup entry point
import React from 'react';
import { createRoot } from 'react-dom/client';
import ExtensionApp from './components/ExtensionApp.js';

// Initialize the extension popup
const container = document.getElementById('root');
const root = createRoot(container);

root.render(React.createElement(ExtensionApp));