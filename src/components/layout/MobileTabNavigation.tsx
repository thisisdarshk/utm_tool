import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { useUtm } from '../../contexts/UtmContext';
import Button from '../common/Button';

const tabs = [
  { 
    id: 'ga4', 
    label: 'GA4', 
    color: 'from-blue-500 to-blue-600',
    shortLabel: 'GA4'
  },
  { 
    id: 'googleAds', 
    label: 'Google Ads', 
    color: 'from-green-500 to-green-600',
    shortLabel: 'Google'
  },
  { 
    id: 'microsoftAds', 
    label: 'Microsoft Ads', 
    color: 'from-purple-500 to-purple-600',
    shortLabel: 'Microsoft'
  },
  { 
    id: 'metaAds', 
    label: 'Meta Ads', 
    color: 'from-pink-500 to-pink-600',
    shortLabel: 'Meta'
  },
  { 
    id: 'tiktok', 
    label: 'TikTok Ads', 
    color: 'from-black to-pink-500',
    shortLabel: 'TikTok'
  },
  { 
    id: 'reddit', 
    label: 'Reddit Ads', 
    color: 'from-orange-500 to-orange-600',
    shortLabel: 'Reddit'
  },
  { 
    id: 'pinterest', 
    label: 'Pinterest Ads', 
    color: 'from-red-500 to-red-600',
    shortLabel: 'Pinterest'
  },
  { 
    id: 'snapchat', 
    label: 'Snapchat Ads', 
    color: 'from-yellow-400 to-yellow-500',
    shortLabel: 'Snapchat'
  }
];

const MobileTabNavigation: React.FC = () => {
  const { state, dispatch } = useUtm();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tabId: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: { tab: tabId } });
    setIsMenuOpen(false);
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -120, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 120, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, []);

  return (
    <nav className="mb-8" role="tablist" aria-label="Campaign builder tabs">
      {/* Desktop View - Responsive Grid */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-4 gap-3">
          {tabs.map((tab) => {
            const isActive = state.activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  group relative overflow-hidden rounded-lg p-4 transition-all duration-300 transform hover:scale-105
                  ${isActive 
                    ? 'bg-white dark:bg-gray-800 shadow-lg border-2 border-blue-200 dark:border-blue-800' 
                    : 'bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-800 shadow-md hover:shadow-lg border border-gray-200/60 dark:border-gray-700/60'
                  }
                `}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                tabIndex={isActive ? 0 : -1}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tab.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative z-10 text-center">
                  <h3 className={`
                    font-semibold text-base mb-1 transition-colors duration-300
                    ${isActive 
                      ? 'text-gray-900 dark:text-gray-100' 
                      : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                    }
                  `}>
                    {tab.label}
                  </h3>
                </div>
                
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tablet View - Horizontal Scroll with Navigation */}
      <div className="hidden md:block lg:hidden">
        <div className="relative">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center">
              {/* Left Scroll Button */}
              {canScrollLeft && (
                <button
                  onClick={scrollLeft}
                  className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              )}

              {/* Scrollable Tab Container */}
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto scrollbar-hide flex-1"
                onScroll={checkScrollButtons}
              >
                {tabs.map((tab) => {
                  const isActive = state.activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`
                        flex-shrink-0 px-4 py-3 min-w-[120px] transition-all duration-200 border-r border-gray-200 dark:border-gray-700 last:border-r-0
                        ${isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-b-2 border-transparent'
                        }
                      `}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`${tab.id}-panel`}
                      tabIndex={isActive ? 0 : -1}
                    >
                      <div className="text-center">
                        <span className="text-sm font-medium">{tab.shortLabel}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Scroll Button */}
              {canScrollRight && (
                <button
                  onClick={scrollRight}
                  className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - Dropdown Menu */}
      <div className="md:hidden">
        <div className="relative">
          {/* Current Tab Display */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${tabs.find(t => t.id === state.activeTab)?.color || 'from-gray-400 to-gray-500'}`}></div>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {tabs.find(t => t.id === state.activeTab)?.label || 'Select Platform'}
              </span>
            </div>
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <>
              {/* Overlay */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-25 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Menu */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                <div className="py-2">
                  {tabs.map((tab) => {
                    const isActive = state.activeTab === tab.id;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 transition-colors
                          ${isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }
                        `}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`${tab.id}-panel`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${tab.color}`}></div>
                        <span className="font-medium">{tab.label}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MobileTabNavigation;