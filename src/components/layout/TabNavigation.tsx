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
      {/* Single Row Layout - Responsive */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Desktop: Horizontal scrolling grid */}
        <div className="hidden md:block">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = state.activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, tab.id)}
                  className={`
                    group relative overflow-hidden flex-shrink-0 p-4 min-w-[140px] transition-all duration-300
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-600 dark:border-blue-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b-2 border-transparent'
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
                      font-semibold text-sm mb-1 transition-colors duration-300
                      ${isActive 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                      }
                    `}>
                      {tab.shortLabel}
                    </h3>
                    
                    <p className={`
                      text-xs transition-colors duration-300 leading-tight
                      ${isActive 
                        ? 'text-blue-500 dark:text-blue-300' 
                        : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                      }
                    `}>
                      {tab.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile: Horizontal scrolling */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = state.activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, tab.id)}
                  className={`
                    flex-shrink-0 p-3 min-w-[90px] transition-all duration-200 border-r border-gray-200 dark:border-gray-700 last:border-r-0
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
                    <span className="text-xs font-medium block">{tab.shortLabel}</span>
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