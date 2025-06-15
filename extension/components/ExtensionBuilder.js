import React, { useState, useCallback } from 'react';
import { Copy, Check, Settings, Globe, Target, Zap, ExternalLink } from 'lucide-react';
import Button from '../../src/components/common/Button.tsx';
import Input from '../../src/components/common/Input.tsx';
import Dropdown from '../../src/components/common/Dropdown.tsx';
import { useToast } from '../../src/hooks/useToast.ts';

const ExtensionBuilder = ({ currentUrl }) => {
  const [activeTab, setActiveTab] = useState('ga4');
  const [websiteUrl, setWebsiteUrl] = useState(currentUrl || '');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const { success, error } = useToast();

  // Simplified options for extension
  const sourceOptions = [
    { value: 'google', label: 'google', category: 'Search' },
    { value: 'facebook', label: 'facebook', category: 'Social' },
    { value: 'instagram', label: 'instagram', category: 'Social' },
    { value: 'twitter', label: 'twitter', category: 'Social' },
    { value: 'linkedin', label: 'linkedin', category: 'Social' },
    { value: 'youtube', label: 'youtube', category: 'Video' },
    { value: 'email', label: 'email', category: 'Email' },
    { value: 'newsletter', label: 'newsletter', category: 'Email' }
  ];

  const mediumOptions = [
    { value: 'cpc', label: 'cpc', category: 'Paid' },
    { value: 'paid', label: 'paid', category: 'Paid' },
    { value: 'social', label: 'social', category: 'Social' },
    { value: 'email', label: 'email', category: 'Email' },
    { value: 'organic', label: 'organic', category: 'Organic' },
    { value: 'referral', label: 'referral', category: 'Referral' },
    { value: 'display', label: 'display', category: 'Display' },
    { value: 'video', label: 'video', category: 'Video' }
  ];

  const tabs = [
    { id: 'ga4', label: 'GA4', color: 'blue' },
    { id: 'googleAds', label: 'Google Ads', color: 'green' },
    { id: 'metaAds', label: 'Meta Ads', color: 'blue' }
  ];

  // Generate URL
  const generateUrl = useCallback(() => {
    if (!websiteUrl || !utmSource || !utmMedium || !utmCampaign) {
      setGeneratedUrl('');
      return;
    }

    try {
      const url = new URL(websiteUrl);
      const params = new URLSearchParams();

      params.append('utm_source', utmSource);
      params.append('utm_medium', utmMedium);
      params.append('utm_campaign', utmCampaign);

      const finalUrl = `${url.origin}${url.pathname}?${params.toString()}`;
      setGeneratedUrl(finalUrl);
    } catch (err) {
      setGeneratedUrl('Invalid URL format');
    }
  }, [websiteUrl, utmSource, utmMedium, utmCampaign]);

  React.useEffect(() => {
    generateUrl();
  }, [generateUrl]);

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
      success('URL copied to clipboard!');
    } catch (err) {
      error('Failed to copy URL');
    }
  };

  // Open in new tab
  const openInNewTab = () => {
    if (generatedUrl && generatedUrl !== 'Invalid URL format') {
      chrome.tabs.create({ url: generatedUrl });
    }
  };

  // Use current page URL
  const useCurrentUrl = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setWebsiteUrl(tabs[0].url);
      }
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          UTM Builder
        </h1>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Quick campaign URL generation
        </p>
      </div>

      {/* Platform Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Website URL */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Website URL
          </label>
          <Button
            onClick={useCurrentUrl}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            Use Current Page
          </Button>
        </div>
        <Input
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://example.com"
          className="text-sm"
        />
      </div>

      {/* UTM Parameters */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Target className="w-4 h-4" />
          UTM Parameters
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source *
            </label>
            <Dropdown
              options={sourceOptions}
              value={utmSource}
              onChange={setUtmSource}
              placeholder="e.g., google, facebook"
              searchable
              allowCustom
              groupByCategory
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Medium *
            </label>
            <Dropdown
              options={mediumOptions}
              value={utmMedium}
              onChange={setUtmMedium}
              placeholder="e.g., cpc, social"
              searchable
              allowCustom
              groupByCategory
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Campaign *
            </label>
            <Input
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              placeholder="e.g., summer_sale_2024"
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Generated URL */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Generated URL
        </h3>
        
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 border">
          <code className="text-xs break-all text-gray-800 dark:text-gray-200">
            {generatedUrl || 'Enter parameters to generate URL...'}
          </code>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={copyToClipboard}
            disabled={!generatedUrl || generatedUrl === 'Invalid URL format'}
            icon={copiedUrl ? Check : Copy}
            variant={copiedUrl ? 'success' : 'primary'}
            size="sm"
            className="flex-1 text-xs"
          >
            {copiedUrl ? 'Copied!' : 'Copy'}
          </Button>
          
          <Button
            onClick={openInNewTab}
            disabled={!generatedUrl || generatedUrl === 'Invalid URL format'}
            icon={ExternalLink}
            variant="secondary"
            size="sm"
            className="text-xs"
          >
            Open
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Powered by Elevar UTM Builder
        </p>
      </div>
    </div>
  );
};

export default ExtensionBuilder;