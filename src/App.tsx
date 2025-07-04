import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { UtmProvider } from './contexts/UtmContext';
import Header from './components/layout/Header';
import TabNavigation from './components/layout/TabNavigation';
import MainContent from './components/layout/MainContent';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import Toast from './components/common/Toast';
import { useToast } from './hooks/useToast';
import SEOSchema from './components/common/SEOSchema';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SEOSchema />
        <UtmProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 text-gray-900 dark:text-gray-100 transition-all duration-300">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
              <Header />
              <TabNavigation />
              <MainContent />
              <Footer />
            </div>
            <ToastContainer />
          </div>
        </UtmProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;