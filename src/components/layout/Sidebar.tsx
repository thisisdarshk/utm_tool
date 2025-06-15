import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Bookmark, History, Settings, HelpCircle } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const [activeSection, setActiveSection] = useState('bookmarks');

  const sections = [
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-80 lg:w-96
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Quick Access
            </h2>
            <Button
              onClick={onToggle}
              variant="ghost"
              size="sm"
              icon={ChevronLeft}
            />
          </div>

          {/* Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium
                    transition-colors duration-200
                    ${activeSection === section.id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{section.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeSection === 'bookmarks' && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Saved Configurations
                </h3>
                <Card className="p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No saved configurations yet. Save your current setup to access it quickly later.
                  </p>
                </Card>
              </div>
            )}

            {activeSection === 'history' && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recent URLs
                </h3>
                <Card className="p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your recently generated URLs will appear here.
                  </p>
                </Card>
              </div>
            )}

            {activeSection === 'settings' && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferences
                </h3>
                <Card className="p-3">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Auto-save configurations</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Show advanced options by default</span>
                    </label>
                  </div>
                </Card>
              </div>
            )}

            {activeSection === 'help' && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quick Help
                </h3>
                <Card className="p-3">
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>UTM Source:</strong> Where the traffic comes from</p>
                    <p><strong>UTM Medium:</strong> How the traffic gets to you</p>
                    <p><strong>UTM Campaign:</strong> What campaign it's for</p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toggle button when closed */}
      {!isOpen && (
        <Button
          onClick={onToggle}
          variant="primary"
          size="sm"
          icon={ChevronRight}
          className="fixed top-4 left-4 z-40 shadow-lg"
          tooltip="Open quick access panel"
        />
      )}
    </>
  );
};

export default Sidebar;