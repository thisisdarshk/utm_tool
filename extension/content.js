// Content script for page interaction
(function() {
  'use strict';

  // Add context menu integration
  let selectedText = '';
  
  document.addEventListener('mouseup', function() {
    selectedText = window.getSelection().toString().trim();
  });

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageInfo') {
      sendResponse({
        url: window.location.href,
        title: document.title,
        selectedText: selectedText
      });
    }
  });

  // Add floating UTM builder button (optional)
  function createFloatingButton() {
    const button = document.createElement('div');
    button.id = 'utm-builder-float';
    button.innerHTML = '🔗';
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 20px;
      transition: all 0.3s ease;
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
    
    button.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });
    
    document.body.appendChild(button);
  }

  // Only show floating button on specific conditions
  if (window.location.hostname.includes('ads.') || 
      window.location.hostname.includes('business.') ||
      document.querySelector('[href*="utm_"]')) {
    createFloatingButton();
  }
})();