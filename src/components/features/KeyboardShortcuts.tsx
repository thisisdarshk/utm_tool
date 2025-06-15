import React, { useEffect, useCallback } from 'react';
import { useToast } from '../../hooks/useToast';

interface KeyboardShortcutsProps {
  onCopy: () => void;
  onSave: () => void;
  onReset: () => void;
  onExport: () => void;
  onToggleTheme?: () => void;
  onShowHelp?: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onCopy,
  onSave,
  onReset,
  onExport,
  onToggleTheme,
  onShowHelp
}) => {
  const { info } = useToast();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only trigger if not in an input field
    if (
      e.target instanceof HTMLInputElement || 
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement ||
      (e.target as HTMLElement)?.contentEditable === 'true'
    ) {
      return;
    }

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    if (isCtrlOrCmd) {
      switch (e.key.toLowerCase()) {
        case 'c':
          e.preventDefault();
          onCopy();
          info('URL copied to clipboard');
          break;
        case 's':
          e.preventDefault();
          onSave();
          info('Configuration saved');
          break;
        case 'r':
          e.preventDefault();
          onReset();
          info('Form reset');
          break;
        case 'e':
          e.preventDefault();
          onExport();
          info('Configuration exported');
          break;
        case 'd':
          if (onToggleTheme) {
            e.preventDefault();
            onToggleTheme();
            info('Theme toggled');
          }
          break;
      }
    } else {
      switch (e.key) {
        case '?':
          if (onShowHelp) {
            e.preventDefault();
            onShowHelp();
          }
          break;
        case 'Escape':
          // Close any open modals or dropdowns
          const activeElement = document.activeElement as HTMLElement;
          if (activeElement && activeElement.blur) {
            activeElement.blur();
          }
          break;
      }
    }
  }, [onCopy, onSave, onReset, onExport, onToggleTheme, onShowHelp, info]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Show keyboard shortcuts help
  const showShortcutsHelp = useCallback(() => {
    const shortcuts = [
      'Ctrl+C: Copy URL',
      'Ctrl+S: Save configuration',
      'Ctrl+R: Reset form',
      'Ctrl+E: Export configuration',
      onToggleTheme && 'Ctrl+D: Toggle theme',
      onShowHelp && '?: Show help',
      'Esc: Close modals/dropdowns'
    ].filter(Boolean).join(' • ');
    
    info(`Keyboard shortcuts: ${shortcuts}`);
  }, [info, onToggleTheme, onShowHelp]);

  // Expose help function for external use
  React.useImperativeHandle(React.createRef(), () => ({
    showHelp: showShortcutsHelp
  }));

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts;