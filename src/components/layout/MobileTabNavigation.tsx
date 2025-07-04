import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { useUtm } from '../../contexts/UtmContext';
import Button from '../common/Button';

// Platform logo components
const GoogleLogo = ({ size = 20 }: { size?: number }) => (
  <img src="/google-ads.svg/google-ads.svg" alt="Google Ads" width={size} height={size} className="object-contain" />
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
  <img src="/tiktok-logo-2-3.svg" alt="TikTok" width={size} height={size} className="object-contain" />
);

const RedditLogo = ({ size = 20 }: { size?: number }) => (
  <img src="/reddit-4.svg" alt="Reddit" width={size} height={size} className="object-contain" />
);

const PinterestLogo = ({ size = 20 }: { size?: number }) => (
  <img src="/pinterest-2-1.svg" alt="Pinterest" width={size} height={size} className="object-contain" />
);

const SnapchatLogo = ({ size = 20 }: { size?: number }) => (
  <img src="/snapchat-1.svg" alt="Snapchat" width={size} height={size} className="object-contain" />
);

const GA4Logo = ({ size = 20 }: { size?: number }) => (
  <img src="/google-analytics-4.svg" alt="GA4" width={size} height={size} className="object-contain" />
);

const KlaviyoLogo = ({ size = 50 }: { size?: number }) => (
  <img src="/klaviyo-logo.svg" alt="Klaviyo" width={size} height={size} className="object-contain" />
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
  },
  { 
    id: 'klaviyo', 
    label: 'Klaviyo Email', 
    color: 'from-purple-500 to-indigo-600',
    shortLabel: 'Klaviyo',
    logo: KlaviyoLogo
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center justify-between gap-2">
          {tabs.map((tab) => {
            const isActive = state.activeTab === tab.id;
            const LogoComponent = tab.logo;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex-1 flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent hover:text-gray-900 dark:hover:text-gray-100'
                  }
                `}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                tabIndex={isActive ? 0 : -1}
              >
                <LogoComponent size={20} />
                <span className="text-xs font-medium text-center leading-tight">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
          </div>
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