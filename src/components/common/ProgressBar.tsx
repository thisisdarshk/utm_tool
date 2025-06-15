import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  animated?: boolean;
  striped?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '', 
  showPercentage = false,
  color = 'blue',
  size = 'md',
  label,
  animated = false,
  striped = false
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const backgroundColorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30',
    green: 'bg-green-100 dark:bg-green-900/30',
    purple: 'bg-purple-100 dark:bg-purple-900/30',
    red: 'bg-red-100 dark:bg-red-900/30',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30'
  };

  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              {Math.round(normalizedProgress)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`
        w-full ${backgroundColorClasses[color]} rounded-full ${sizeClasses[size]} overflow-hidden
        ${animated ? 'transition-all duration-300 ease-out' : ''}
      `}>
        <div 
          className={`
            ${sizeClasses[size]} ${colorClasses[color]} rounded-full
            ${animated ? 'transition-all duration-500 ease-out' : ''}
            ${striped ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_20px] animate-pulse' : ''}
          `}
          style={{ width: `${normalizedProgress}%` }}
          role="progressbar"
          aria-valuenow={normalizedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || `Progress: ${Math.round(normalizedProgress)}%`}
        />
      </div>
      
      {/* Screen reader only text */}
      <span className="sr-only">
        {label ? `${label}: ` : ''}
        {Math.round(normalizedProgress)}% complete
      </span>
    </div>
  );
};

export default ProgressBar;