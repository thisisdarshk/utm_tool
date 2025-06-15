import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  variant?: 'default' | 'primary' | 'secondary';
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  text,
  variant = 'default',
  overlay = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variantClasses = {
    default: 'border-gray-200 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400',
    primary: 'border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400',
    secondary: 'border-gray-300 border-t-gray-600 dark:border-gray-500 dark:border-t-gray-300'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <div className={`animate-spin rounded-full border-3 ${variantClasses[variant]}`}></div>
        <div className="absolute inset-0 animate-ping rounded-full border border-blue-600/20 dark:border-blue-400/20"></div>
      </div>
      {text && (
        <p className={`mt-3 ${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;