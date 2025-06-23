import React from 'react';
import { Settings, Download, Upload, Save, Clock, Play } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import Button from '../common/Button';
import { useUtm } from '../../contexts/UtmContext';
import { useToast } from '../../hooks/useToast';

const Header: React.FC = () => {
  const { exportData, importData } = useUtm();
  const { success, error } = useToast();

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `utm-builder-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      success('Configuration exported successfully!');
    } catch (err) {
      error('Failed to export configuration');
      console.error('Export error:', err);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            const importSuccess = importData(data);
            if (importSuccess) {
              success('Configuration imported successfully!');
            } else {
              error('Failed to import configuration - invalid format');
            }
          } catch (err) {
            error('Failed to import configuration');
            console.error('Import error:', err);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

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
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
            UTM Parameter Builder
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
            Professional marketing campaign tracking tool
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;