// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('UTM Parameter Builder extension installed');
  
  // Create context menu
  chrome.contextMenus.create({
    id: 'utm-builder',
    title: 'Generate UTM URL',
    contexts: ['page', 'link']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'utm-builder') {
    chrome.action.openPopup();
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openPopup') {
    chrome.action.openPopup();
  }
});

// Store extension data
chrome.storage.local.get(['utm_templates'], (result) => {
  if (!result.utm_templates) {
    chrome.storage.local.set({
      utm_templates: {
        'Google Ads': {
          source: 'google',
          medium: 'cpc',
          campaign: 'campaign_name'
        },
        'Facebook Ads': {
          source: 'facebook',
          medium: 'paid',
          campaign: 'campaign_name'
        }
      }
    });
  }
});