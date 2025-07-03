import React from 'react';
import { useUtm } from '../../contexts/UtmContext';

const tabs = [
  { 
    id: 'ga4', 
    label: 'GA4 UTM Builder', 
    description: 'Google Analytics 4 tracking', 
    color: 'from-blue-500 to-blue-600',
    shortLabel: 'GA4'
  },
  { 
    id: 'googleAds', 
    label: 'Google Ads', 
    description: 'Google Ads ValueTrack parameters', 
    color: 'from-green-500 to-green-600',
    shortLabel: 'Google Ads'
  },
  { 
    id: 'microsoftAds', 
    label: 'Microsoft Ads', 
    description: 'Microsoft Advertising parameters', 
    color: 'from-purple-500 to-purple-600',
    shortLabel: 'Microsoft'
  },
  { 
    id: 'metaAds', 
    label: 'Meta Ads', 
    description: 'Facebook & Instagram tracking', 
    color: 'from-pink-500 to-pink-600',
    shortLabel: 'Meta'
  },
  { 
    id: 'tiktok', 
    label: 'TikTok Ads', 
    description: 'TikTok advertising parameters', 
    color: 'from-black to-pink-500',
    shortLabel: 'TikTok'
  },
  { 
    id: 'reddit', 
    label: 'Reddit Ads', 
    description: 'Reddit advertising tracking', 
    color: 'from-orange-500 to-orange-600',
    shortLabel: 'Reddit'
  },
  { 
    id: 'pinterest', 
    label: 'Pinterest Ads', 
    description: 'Pinterest advertising parameters', 
    color: 'from-red-500 to-red-600',
    shortLabel: 'Pinterest'
  },
  { 
    id: 'snapchat', 
    label: 'Snapchat Ads', 
    description: 'Snapchat advertising tracking', 
    color: 'from-yellow-400 to-yellow-500',
    shortLabel: 'Snapchat'
  }
];

const TabNavigation: React.FC = () => {
  const { state, dispatch } = useUtm();

  const handleTabChange = (tabId: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: { tab: tabId } });
  };

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabChange(tabId);
    }
  };

  return (
    <nav className="mb-8" role="tablist" aria-label="Campaign builder tabs">
      {/* Desktop View - Grid layout for 8 tabs */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const isActive = state.activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
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
                
                <p className={`
                  text-xs transition-colors duration-300
                  ${isActive 
                    ? 'text-gray-600 dark:text-gray-400' 
                    : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                  }
                `}>
                  {tab.description}
                </p>
              </div>
              
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile View - Scrollable horizontal layout */}
      <div className="md:hidden">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = state.activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, tab.id)}
                  className={`
                    flex-shrink-0 p-3 min-w-[100px] transition-all duration-200 border-r border-gray-200 dark:border-gray-700 last:border-r-0
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${tab.id}-panel`}
                  tabIndex={isActive ? 0 : -1}
                >
                  <div className="text-center">
                    <span className="text-xs font-medium">{tab.shortLabel}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TabNavigation;