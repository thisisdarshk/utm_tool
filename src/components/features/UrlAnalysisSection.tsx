import React, { useState, useCallback } from 'react';
import { Search, AlertTriangle, CheckCircle, Copy } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';
import { predictGA4Channel, analyzeUrl } from '../../utils/validation';
import type { UrlAnalysisResult } from '../../types/utm';

const UrlAnalysisSection: React.FC = () => {
  const [analysisUrl, setAnalysisUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState<UrlAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const { success, error } = useToast();

  const analyzeUrlHandler = useCallback(async () => {
    if (!analysisUrl.trim()) {
      setAnalysisError('Please enter a URL to analyze');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError('');
    
    try {
      const result = analyzeUrl(analysisUrl);
      setAnalysisResult(result);
      success('URL analyzed successfully!');
    } catch (err) {
      setAnalysisError('Invalid URL format. Please enter a complete URL with http:// or https://');
      setAnalysisResult(null);
      error('Failed to analyze URL');
    } finally {
      setIsAnalyzing(false);
    }
  }, [analysisUrl, success, error]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      analyzeUrlHandler();
    }
  }, [analyzeUrlHandler]);

  const copyAnalyzedUrl = useCallback(async () => {
    if (analysisUrl) {
      try {
        await navigator.clipboard.writeText(analysisUrl);
        success('URL copied to clipboard!');
      } catch (err) {
        error('Failed to copy URL');
      }
    }
  }, [analysisUrl, success, error]);

  const getChannelExplanation = (source: string, medium: string, campaign: string, predictedChannel: string): string => {
    if (!source || !medium) {
      return 'Requires utm_source and utm_medium for prediction';
    }
    
    switch (predictedChannel) {
      case 'Direct':
        return 'Users typed your URL directly or used a bookmark (source: "(direct)", medium: "(not set)" or "(none)")';
      
      case 'Cross-network':
        return 'Campaign name contains "cross-network" indicating multi-network ads';
      
      case 'Paid Shopping':
        if (campaign.toLowerCase().includes('shop')) {
          return 'Campaign name contains shopping keywords and uses paid advertising medium';
        }
        return 'Traffic from shopping sites using paid advertising medium (cpc, ppc, paid, retargeting)';
      
      case 'Paid Search':
        return 'Paid ads on search engines - source from search sites with paid medium (cpc, ppc, paid, retargeting)';
      
      case 'Paid Social':
        return 'Paid ads on social media platforms - source from social sites with paid medium';
      
      case 'Paid Video':
        return 'Paid ads on video platforms - source from video sites with paid medium';
      
      case 'Display':
        return 'Display advertising - medium matches display, banner, expandable, interstitial, or cpm';
      
      case 'Paid Other':
        return 'Paid advertising that doesn\'t fit other specific categories - uses paid medium but not from search/social/shopping/video sites';
      
      case 'Organic Shopping':
        return 'Non-paid links from shopping sites or campaigns with shopping keywords';
      
      case 'Organic Social':
        return 'Non-paid links from social media platforms or social medium types';
      
      case 'Organic Video':
        return 'Non-paid links from video platforms or video-related medium';
      
      case 'Organic Search':
        return 'Non-paid search results from search engines - source from search sites with organic medium';
      
      case 'Referral':
        return 'Links from other websites - medium is referral, app, or link';
      
      case 'Email':
        return 'Links from email campaigns - source or medium contains email variations';
      
      case 'Affiliates':
        return 'Links from affiliate marketing partners - medium exactly matches "affiliate"';
      
      case 'Audio':
        return 'Ads on audio platforms like podcasts - medium exactly matches "audio"';
      
      case 'SMS':
        return 'Links from text messages - source or medium exactly matches "sms"';
      
      case 'Mobile Push Notifications':
        return 'Links from mobile app notifications - medium ends with "push" or contains mobile/notification keywords';
      
      default:
        return 'Parameters don\'t match any standard GA4 channel definition - will be classified as "Unassigned"';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="https://example.com/page?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale"
            value={analysisUrl}
            onChange={(e) => setAnalysisUrl(e.target.value)}
            onKeyDown={handleKeyPress}
            error={analysisError}
            helperText="Enter a complete URL with UTM parameters to analyze"
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={analyzeUrlHandler}
            disabled={!analysisUrl.trim() || isAnalyzing}
            loading={isAnalyzing}
            icon={Search}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
          {analysisUrl && (
            <Button
              onClick={copyAnalyzedUrl}
              variant="secondary"
              icon={Copy}
              tooltip="Copy URL"
            />
          )}
        </div>
      </div>

      {analysisResult && (
        <div className="space-y-4">
          {/* Channel Prediction Result */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                GA4 Channel Prediction:
              </span>
              <Badge 
                variant={analysisResult.predictedChannel === 'Unassigned' ? 'warning' : 'success'} 
                size="sm"
              >
                {analysisResult.predictedChannel}
              </Badge>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Explanation:</strong> {getChannelExplanation(
                analysisResult.utmParameters.utm_source || '',
                analysisResult.utmParameters.utm_medium || '',
                analysisResult.utmParameters.utm_campaign || '',
                analysisResult.predictedChannel
              )}
            </p>
          </div>

          {/* UTM Parameters Found */}
          {Object.keys(analysisResult.utmParameters).length > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h5 className="text-sm font-medium text-green-900 dark:text-green-100 mb-3">
                UTM Parameters Found:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(analysisResult.utmParameters).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Badge variant="info" size="sm">{key}</Badge>
                    <code className="text-xs bg-green-100 dark:bg-green-800/30 px-2 py-1 rounded">
                      {value}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Parameters */}
          {Object.keys(analysisResult.otherParameters).length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Other Parameters Found:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(analysisResult.otherParameters).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Badge variant="default" size="sm">{key}</Badge>
                    <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {value}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues and Recommendations */}
          {analysisResult.issues.length > 0 && (
            <div className="space-y-3">
              {analysisResult.issues.length > 0 && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h6 className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">Issues Found:</h6>
                      <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                        {analysisResult.issues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Base URL */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h6 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Base URL:</h6>
            <code className="text-sm text-gray-700 dark:text-gray-300 break-all">
              {analysisResult.baseUrl}
            </code>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlAnalysisSection;