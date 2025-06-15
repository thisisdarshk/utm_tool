import React, { useEffect, useState } from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';
import type { ToastMessage } from '../../types/utm';

interface ToastProps extends ToastMessage {
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 100);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onClose]);

  const icons = {
    success: Check,
    error: X,
    warning: AlertTriangle,
    info: Info
  };

  const colors = {
    success: 'bg-green-500 text-white border-green-600',
    error: 'bg-red-500 text-white border-red-600',
    warning: 'bg-yellow-500 text-white border-yellow-600',
    info: 'bg-blue-500 text-white border-blue-600'
  };

  const progressColors = {
    success: 'bg-green-300',
    error: 'bg-red-300',
    warning: 'bg-yellow-300',
    info: 'bg-blue-300'
  };

  const Icon = icons[type];

  return (
    <div className={`
      fixed top-4 right-4 z-50 min-w-80 max-w-md rounded-lg shadow-lg border-2 overflow-hidden
      transform transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      ${colors[type]}
    `}>
      <div className="flex items-center gap-3 px-4 py-3">
        <Icon size={20} className="flex-shrink-0" />
        <span className="font-medium flex-1">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 hover:bg-white/20 rounded p-1 transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="h-1 bg-black/20">
        <div 
          className={`h-full transition-all duration-100 ease-linear ${progressColors[type]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Toast;