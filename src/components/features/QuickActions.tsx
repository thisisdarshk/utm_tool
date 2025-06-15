import React, { useState } from 'react';
import { Copy, Download, Share2, Bookmark, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import Button from '../common/Button';
import { useToast } from '../../hooks/useToast';

interface QuickActionsProps {
  generatedUrl: string;
  onReset: () => void;
  onSave: () => void;
  onExport: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  generatedUrl,
  onReset,
  onSave,
  onExport
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { success, error } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      success('URL copied to clipboard!');
    } catch (err) {
      error('Failed to copy URL');
    }
  };

  const handleShare = async () => {
    if (navigator.share && generatedUrl) {
      try {
        await navigator.share({
          title: 'UTM Campaign URL',
          url: generatedUrl
        });
        success('URL shared successfully!');
      } catch (err) {
        // User cancelled sharing or share failed
        if (err instanceof Error && err.name !== 'AbortError') {
          handleCopy(); // Fallback to copy
        }
      }
    } else {
      handleCopy(); // Fallback for browsers without Web Share API
    }
  };

  const actions = [
    {
      id: 'copy',
      label: 'Copy',
      icon: Copy,
      onClick: handleCopy,
      disabled: !generatedUrl,
      variant: 'primary' as const,
      tooltip: 'Copy URL to clipboard'
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      onClick: handleShare,
      disabled: !generatedUrl,
      variant: 'secondary' as const,
      tooltip: 'Share URL'
    },
    {
      id: 'save',
      label: 'Save',
      icon: Bookmark,
      onClick: onSave,
      disabled: false,
      variant: 'secondary' as const,
      tooltip: 'Save configuration'
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download,
      onClick: onExport,
      disabled: false,
      variant: 'secondary' as const,
      tooltip: 'Export configuration'
    }
  ];

  const resetAction = {
    id: 'reset',
    label: 'Reset',
    icon: RefreshCw,
    onClick: onReset,
    disabled: false,
    variant: 'ghost' as const,
    tooltip: 'Reset all fields'
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-40">
        <div className="flex flex-col gap-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3">
          {actions.map((action) => (
            <Button
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              icon={action.icon}
              size="sm"
              variant={action.variant}
              tooltip={action.tooltip}
              className="w-full justify-start"
            >
              {action.label}
            </Button>
          ))}
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
            <Button
              onClick={resetAction.onClick}
              icon={resetAction.icon}
              size="sm"
              variant={resetAction.variant}
              tooltip={resetAction.tooltip}
              className="w-full justify-start text-gray-500 hover:text-red-600"
            >
              {resetAction.label}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <div className="flex flex-col items-end gap-2">
          {/* Expanded Actions */}
          {isExpanded && (
            <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2">
              {actions.slice(1).map((action) => (
                <Button
                  key={action.id}
                  onClick={() => {
                    action.onClick();
                    setIsExpanded(false);
                  }}
                  disabled={action.disabled}
                  icon={action.icon}
                  size="sm"
                  variant={action.variant}
                  tooltip={action.tooltip}
                  className="w-full justify-start min-w-24"
                >
                  {action.label}
                </Button>
              ))}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                <Button
                  onClick={() => {
                    resetAction.onClick();
                    setIsExpanded(false);
                  }}
                  icon={resetAction.icon}
                  size="sm"
                  variant={resetAction.variant}
                  tooltip={resetAction.tooltip}
                  className="w-full justify-start text-gray-500 hover:text-red-600"
                >
                  {resetAction.label}
                </Button>
              </div>
            </div>
          )}

          {/* Main Actions */}
          <div className="flex gap-2">
            {/* Primary Copy Button */}
            <Button
              onClick={handleCopy}
              disabled={!generatedUrl}
              icon={Copy}
              size="md"
              variant="primary"
              tooltip="Copy URL"
              className="shadow-lg"
            />
            
            {/* Expand/Collapse Button */}
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              icon={isExpanded ? ChevronDown : ChevronUp}
              size="md"
              variant="secondary"
              tooltip={isExpanded ? 'Hide actions' : 'Show more actions'}
              className="shadow-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickActions;