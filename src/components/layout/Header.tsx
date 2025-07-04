import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 py-8 border-b border-gray-200/60 dark:border-gray-700/60">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img 
            src="/Buxton Elevar logo.png" 
            alt="Elevar" 
            className="h-10 w-auto"
            onError={(e) => {
              // Fallback to text if logo fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg';
              fallback.textContent = 'E';
              target.parentNode?.insertBefore(fallback, target);
            }}
          />
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight" id="main-heading">
            UTM Parameter Builder
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium" id="main-subtitle">
            Professional marketing campaign tracking tool
          </p>
        </div>
      </div>
      <div className="mt-4 md:mt-0">
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
          Create UTM parameters for your marketing campaigns
        </p>
      </div>
    </header>
  );
};

export default Header;