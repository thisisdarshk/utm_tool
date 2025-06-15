import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, Copy, ExternalLink, Code, Globe } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';

interface UrlPreviewProps {
  url: string;
  baseUrl: string;
  parameters: Record<string, string>;
  showAnalytics?: boolean;
}

const UrlPreview: React.FC<UrlPreviewProps> = ({ 
  url, 
  baseUrl, 
  parameters,
  showAnalytics = true 
}) => {
  const [showParameters, setShowParameters] = useState(true);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const { success, error } = useToast();

  const urlAnalysis = useMemo(() => {
    if (!url) return null;

    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      const analysis = {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        pathname: urlObj.pathname,
        parameters: Array.from(params.entries()),
        totalLength: url.length,
        parameterCount: params.size,
        hasUtmParams: Array.from(params.keys()).some(key => key.startsWith('utm_')),
        utmParams: Array.from(params.entries()).filter(([key]) => key.startsWith('utm_')),
        otherParams: Array.from(params.entries()).filter(([key]) => !key.startsWith('utm_'))
      };

      return analysis;
    } catch {
      return null;
    }
  }, [url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      success('URL copied to clipboard!');
    } catch (err) {
      error('Failed to copy URL');
      console.error('Failed to copy URL:', err);
    }
  };

  const handleTest = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getParameterBadgeVariant = (key: string) => {
    if (key.startsWith('utm_')) return 'info';
    if (['gclid', 'fbclid', 'msclkid'].includes(key)) return 'warning';
    return 'default';
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          URL Preview
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode(viewMode === 'formatted' ? 'raw' : 'formatted')}
            variant="ghost"
            size="sm"
            icon={Code}
            tooltip={`Switch to ${viewMode === 'formatted' ? 'raw' : 'formatted'} view`}
          />
          <Button
            onClick={() => setShowParameters(!showParameters)}
            variant="ghost"
            size="sm"
            icon={showParameters ? EyeOff : Eye}
            tooltip={showParameters ? 'Hide parameters' : 'Show parameters'}
          />
          <Button
            onClick={handleCopy}
            disabled={!url}
            variant="secondary"
            size="sm"
            icon={Copy}
            tooltip="Copy URL"
          />
          <Button
            onClick={handleTest}
            disabled={!url}
            variant="primary"
            size="sm"
            icon={ExternalLink}
            tooltip="Test URL in new tab"
          />
        </div>
      </div>

      {url ? (
        <div className="space-y-4">
          {/* URL Analysis Stats */}
          {showAnalytics && urlAnalysis && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {urlAnalysis.totalLength}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Total Length
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {urlAnalysis.parameterCount}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Parameters
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {urlAnalysis.utmParams.length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  UTM Params
                </div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${urlAnalysis.totalLength > 2000 ? 'text-red-500' : 'text-green-500'}`}>
                  {urlAnalysis.totalLength <= 2000 ? '✓' : '⚠'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Length OK
                </div>
              </div>
            </div>
          )}

          {/* URL Display */}
          {viewMode === 'formatted' && showParameters && urlAnalysis ? (
            <div className="space-y-3">
              {/* Base URL */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Base URL:
                </p>
                <code className="text-sm text-blue-700 dark:text-blue-300 break-all">
                  {urlAnalysis.protocol}//{urlAnalysis.hostname}{urlAnalysis.pathname}
                </code>
              </div>
              
              {/* UTM Parameters */}
              {urlAnalysis.utmParams.length > 0 && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                    UTM Parameters:
                  </p>
                  <div className="space-y-2">
                    {urlAnalysis.utmParams.map(([key, value], index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Badge variant="info" size="sm">{key}</Badge>
                        <code className="text-green-600 dark:text-green-400 break-all flex-1">
                          {value}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Parameters */}
              {urlAnalysis.otherParams.length > 0 && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Other Parameters:
                  </p>
                  <div className="space-y-2">
                    {urlAnalysis.otherParams.map(([key, value], index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Badge variant={getParameterBadgeVariant(key)} size="sm">{key}</Badge>
                        <code className="text-gray-600 dark:text-gray-400 break-all flex-1">
                          {value}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Raw URL Display */
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <code className="text-sm text-gray-800 dark:text-gray-200 break-all leading-relaxed font-mono">
                {url}
              </code>
            </div>
          )}

          {/* Warnings */}
          {urlAnalysis && urlAnalysis.totalLength > 2000 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    URL Length Warning
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    This URL is {urlAnalysis.totalLength} characters long. URLs over 2000 characters may be truncated by some browsers or systems.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Enter parameters to generate URL preview</p>
        </div>
      )}
    </Card>
  );
};

export default UrlPreview;