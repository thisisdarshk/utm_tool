import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '../../src/contexts/ThemeContext.tsx';
import { UtmProvider } from '../../src/contexts/UtmContext.tsx';
import ExtensionBuilder from './ExtensionBuilder.js';
import { useToast } from '../../src/hooks/useToast.ts';
import Toast from '../../src/components/common/Toast.tsx';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-2 right-2 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

const ExtensionApp = () => {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Get current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    });
  }, []);

  return (
    <ThemeProvider>
      <UtmProvider>
        <div className="extension-compact extension-scroll bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <ExtensionBuilder currentUrl={currentUrl} />
          <ToastContainer />
        </div>
      </UtmProvider>
    </ThemeProvider>
  );
};

export default ExtensionApp;