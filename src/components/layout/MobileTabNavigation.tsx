import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { useUtm } from '../../contexts/UtmContext';
import Button from '../common/Button';

// Platform logo components using SVG
const GoogleLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MicrosoftLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
    <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
    <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
    <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
  </svg>
);

const MetaLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
);

const TikTokLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.419-1.95-1.419-3.338h-3.555v13.917c0 2.273-1.846 4.119-4.119 4.119s-4.119-1.846-4.119-4.119 1.846-4.119 4.119-4.119c.228 0 .452.019.67.055V7.297c-.218-.03-.44-.045-.67-.045C4.119 7.252 0 11.371 0 16.398S4.119 25.544 9.146 25.544s9.146-4.119 9.146-9.146V9.321a9.712 9.712 0 0 0 5.708 1.837V7.603a6.226 6.226 0 0 1-4.679-2.041z" fill="#000000"/>
    <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.419-1.95-1.419-3.338h-3.555v13.917c0 2.273-1.846 4.119-4.119 4.119s-4.119-1.846-4.119-4.119 1.846-4.119 4.119-4.119c.228 0 .452.019.67.055V7.297c-.218-.03-.44-.045-.67-.045C4.119 7.252 0 11.371 0 16.398S4.119 25.544 9.146 25.544s9.146-4.119 9.146-9.146V9.321a9.712 9.712 0 0 0 5.708 1.837V7.603a6.226 6.226 0 0 1-4.679-2.041z" fill="#FF0050"/>
  </svg>
);

const RedditLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#FF4500"/>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 14.29c-.12.394-.335.718-.622.96-.431.36-.895.572-1.384.635-.12.016-.191.031-.287.047h-.003c-.19.016-.381.016-.572 0-.12-.016-.191-.031-.287-.047-.489-.063-.953-.275-1.384-.635-.287-.242-.502-.566-.622-.96-.035-.116-.054-.235-.054-.353 0-.688.558-1.265 1.265-1.265s1.265.558 1.265 1.265c0 .118-.019.237-.054.353z" fill="white"/>
  </svg>
);

const PinterestLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" fill="#E60023"/>
  </svg>
);

const SnapchatLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" fill="#FFFC00"/>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#000"/>
  </svg>
);

const GA4Logo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const tabs = [
  { 
    id: 'ga4', 
    label: 'GA4', 
    color: 'from-blue-500 to-blue-600',
    shortLabel: 'GA4',
    logo: GA4Logo
  },
  { 
    id: 'googleAds', 
    label: 'Google Ads', 
    color: 'from-green-500 to-green-600',
    shortLabel: 'Google',
    logo: GoogleLogo
  },
  { 
    id: 'microsoftAds', 
    label: 'Microsoft Ads', 
    color: 'from-purple-500 to-purple-600',
    shortLabel: 'Microsoft',
    logo: MicrosoftLogo
  },
  { 
    id: 'metaAds', 
    label: 'Meta Ads', 
    color: 'from-pink-500 to-pink-600',
    shortLabel: 'Meta',
    logo: MetaLogo
  },
  { 
    id: 'tiktok', 
    label: 'TikTok Ads', 
    color: 'from-black to-pink-500',
    shortLabel: 'TikTok',
    logo: TikTokLogo
  },
  { 
    id: 'reddit', 
    label: 'Reddit Ads', 
    color: 'from-orange-500 to-orange-600',
    shortLabel: 'Reddit',
    logo: RedditLogo
  },
  { 
    id: 'pinterest', 
    label: 'Pinterest Ads', 
    color: 'from-red-500 to-red-600',
    shortLabel: 'Pinterest',
    logo: PinterestLogo
  },
  { 
    id: 'snapchat', 
    label: 'Snapchat Ads', 
    color: 'from-yellow-400 to-yellow-500',
    shortLabel: 'Snapchat',
    logo: SnapchatLogo
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

  const currentTab = tabs.find(t => t.id === state.activeTab);

  return (
    <nav className="mb-8" role="tablist" aria-label="Campaign builder tabs">
      {/* Desktop View - Responsive Grid */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-4 gap-3">
          {tabs.map((tab) => {
            const isActive = state.activeTab === tab.id;
            const LogoComponent = tab.logo;
            
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
                  <div className="flex justify-center mb-2">
                    <LogoComponent size={24} />
                  </div>
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
                  const LogoComponent = tab.logo;
                  
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
                        <div className="flex justify-center mb-1">
                          <LogoComponent size={18} />
                        </div>
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
              {currentTab && (
                <>
                  <currentTab.logo size={20} />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {currentTab.label}
                  </span>
                </>
              )}
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
                    const LogoComponent = tab.logo;
                    
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
                        <LogoComponent size={20} />
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