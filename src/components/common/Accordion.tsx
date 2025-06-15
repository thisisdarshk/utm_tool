import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  icon,
  badge,
  disabled = false,
  onToggle
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(isOpen ? height : 0);
    }
  }, [isOpen, children]);

  const handleToggle = () => {
    if (disabled) return;
    
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggle?.(newIsOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between p-6 text-left transition-all duration-200
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset'
          }
          ${isOpen ? 'border-b border-gray-200 dark:border-gray-700' : ''}
        `}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex items-center gap-3 flex-1">
          {icon && (
            <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {badge && (
            <div className="flex-shrink-0">
              {badge}
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 ml-4">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
          )}
        </div>
      </button>
      
      <div
        ref={contentRef}
        id={`accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: contentHeight }}
        aria-hidden={!isOpen}
      >
        <div className="p-6 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;