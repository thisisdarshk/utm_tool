import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Copy, Check, Search, X, Save, Download, Upload, Play, RefreshCw, Zap, Filter, Settings, Target, Globe, Info, AlertTriangle, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Accordion from '../common/Accordion';
import Badge from '../common/Badge';
import Card from '../common/Card';
import ParameterValidator from '../features/ParameterValidator';
import UrlPreview from '../features/UrlPreview';
import QuickActions from '../features/QuickActions';
import { useToast } from '../../hooks/useToast';
import { predictGA4Channel } from '../../utils/validation';
import { SOURCE_CATEGORIES, getSourceCategory } from '../../data/sourceCategories';
import { ga4Channels } from '../../data/ga4Config';

const GA4Builder: React.FC = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');
  
  // Individual optional parameter toggles
  const [includeUtmTerm, setIncludeUtmTerm] = useState(false);
  const [includeUtmContent, setIncludeUtmContent] = useState(false);
  
  // Space encoding option - NEW STATE
  const [spaceEncoding, setSpaceEncoding] = useState<'percent' | 'plus' | 'underscore'>('percent');
  
  const [selectedChannel, setSelectedChannel] = useState('');
  const [channelFilterActive, setChannelFilterActive] = useState(false);
  const [customParams, setCustomParams] = useState<Array<{key: string, value: string}>>([]);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedConfigurations, setSavedConfigurations] = useState<Record<string, any>>({});
  const [configurationName, setConfigurationName] = useState('');
  const [selectedConfiguration, setSelectedConfiguration] = useState('');
  const [loadedConfigurationName, setLoadedConfigurationName] = useState('');
  const { success, error } = useToast();

  // Enhanced source options with comprehensive GA4 categories
  const sourceOptions = useMemo(() => {
    const options = [];
    
    // Add sources from each category
    Object.entries(SOURCE_CATEGORIES).forEach(([categoryKey, sources]) => {
      const categoryName = categoryKey.replace('SOURCE_CATEGORY_', '').toLowerCase();
      const displayName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
      
      sources.forEach(source => {
        options.push({
          value: source,
          label: source,
          category: displayName,
          description: `${displayName} platform - GA4 recognized source`
        });
      });
    });

    // Add common custom sources
    const customSources = [
      { value: 'newsletter', label: 'newsletter', category: 'Email', description: 'Email newsletter traffic' },
      { value: 'direct', label: 'direct', category: 'Direct', description: 'Direct traffic source' },
      { value: 'referral', label: 'referral', category: 'Referral', description: 'Referral traffic source' },
      { value: 'affiliate', label: 'affiliate', category: 'Affiliate', description: 'Affiliate marketing traffic' },
      { value: 'qr_code', label: 'qr_code', category: 'Offline', description: 'QR code campaigns' },
      { value: 'print', label: 'print', category: 'Offline', description: 'Print advertising' },
      { value: 'radio', label: 'radio', category: 'Offline', description: 'Radio advertising' },
      { value: 'tv', label: 'tv', category: 'Offline', description: 'Television advertising' }
    ];

    return [...options, ...customSources].sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  // Enhanced medium options with GA4-specific mediums
  const mediumOptions = useMemo(() => [
    // Paid mediums
    { value: 'cpc', label: 'cpc', category: 'Paid', description: 'Cost per click - paid search/social' },
    { value: 'ppc', label: 'ppc', category: 'Paid', description: 'Pay per click advertising' },
    { value: 'paid', label: 'paid', category: 'Paid', description: 'General paid advertising' },
    { value: 'retargeting', label: 'retargeting', category: 'Paid', description: 'Retargeting campaigns' },
    
    // Display mediums
    { value: 'display', label: 'display', category: 'Display', description: 'Display advertising' },
    { value: 'banner', label: 'banner', category: 'Display', description: 'Banner advertisements' },
    { value: 'expandable', label: 'expandable', category: 'Display', description: 'Expandable banner ads' },
    { value: 'interstitial', label: 'interstitial', category: 'Display', description: 'Interstitial advertisements' },
    { value: 'cpm', label: 'cpm', category: 'Display', description: 'Cost per mille (impression-based)' },
    
    // Organic mediums
    { value: 'organic', label: 'organic', category: 'Organic', description: 'Organic search traffic' },
    { value: 'referral', label: 'referral', category: 'Organic', description: 'Referral traffic' },
    { value: 'social', label: 'social', category: 'Social', description: 'Organic social media' },
    { value: 'social-network', label: 'social-network', category: 'Social', description: 'Social network traffic' },
    { value: 'social-media', label: 'social-media', category: 'Social', description: 'Social media platforms' },
    
    // Email mediums
    { value: 'email', label: 'email', category: 'Email', description: 'Email marketing' },
    { value: 'e-mail', label: 'e-mail', category: 'Email', description: 'Email campaigns (alternative)' },
    { value: 'newsletter', label: 'newsletter', category: 'Email', description: 'Newsletter campaigns' },
    
    // Other mediums
    { value: 'affiliate', label: 'affiliate', category: 'Affiliate', description: 'Affiliate marketing' },
    { value: 'audio', label: 'audio', category: 'Audio', description: 'Audio advertising (podcasts)' },
    { value: 'video', label: 'video', category: 'Video', description: 'Video advertising' },
    { value: 'sms', label: 'sms', category: 'SMS', description: 'SMS marketing' },
    { value: 'push', label: 'push', category: 'Push', description: 'Push notifications' },
    { value: 'qr', label: 'qr', category: 'Offline', description: 'QR code campaigns' }
  ], []);

  // Get filtered mediums based on selected channel
  const filteredMediumOptions = useMemo(() => {
    if (!channelFilterActive || !selectedChannel) {
      return mediumOptions;
    }

    const channel = ga4Channels.find(ch => ch.name === selectedChannel);
    if (!channel || channel.recommendedMediums.length === 0) {
      return mediumOptions;
    }

    return mediumOptions.filter(option => 
      channel.recommendedMediums.some(recommended => 
        recommended.toLowerCase() === option.value.toLowerCase()
      )
    );
  }, [mediumOptions, channelFilterActive, selectedChannel]);

  // Get filtered sources based on selected channel
  const filteredSourceOptions = useMemo(() => {
    if (!channelFilterActive || !selectedChannel) {
      return sourceOptions;
    }

    const channel = ga4Channels.find(ch => ch.name === selectedChannel);
    if (!channel || channel.recommendedSources.length === 0) {
      return sourceOptions;
    }

    return sourceOptions.filter(option => 
      channel.recommendedSources.some(recommended => 
        recommended.toLowerCase() === option.value.toLowerCase()
      )
    );
  }, [sourceOptions, channelFilterActive, selectedChannel]);

  // Handle individual optional parameter toggles with default value restoration
  const handleUtmTermToggle = useCallback((enabled: boolean) => {
    setIncludeUtmTerm(enabled);
    
    // If enabling and field is empty, restore a default
    if (enabled && !utmTerm.trim()) {
      setUtmTerm('keyword');
    }
  }, [utmTerm]);

  const handleUtmContentToggle = useCallback((enabled: boolean) => {
    setIncludeUtmContent(enabled);
    
    // If enabling and field is empty, restore a default
    if (enabled && !utmContent.trim()) {
      setUtmContent('content');
    }
  }, [utmContent]);

  // NEW: Function to encode spaces based on selected encoding
  const encodeSpaces = useCallback((value: string): string => {
    switch (spaceEncoding) {
      case 'percent':
        return value.replace(/ /g, '%20');
      case 'plus':
        return value.replace(/ /g, '+');
      case 'underscore':
        return value.replace(/ /g, '_');
      default:
        return value;
    }
  }, [spaceEncoding]);

  // Generate URL with space encoding
  const generateUrl = useCallback(() => {
    if (!websiteUrl) {
      setGeneratedUrl('');
      return;
    }

    try {
      const url = new URL(websiteUrl);
      const params = new URLSearchParams();

      // Add UTM parameters with space encoding
      if (utmSource) params.append('utm_source', encodeSpaces(utmSource));
      if (utmMedium) params.append('utm_medium', encodeSpaces(utmMedium));
      if (utmCampaign) params.append('utm_campaign', encodeSpaces(utmCampaign));
      
      // Add optional UTM parameters only if individually enabled
      if (includeUtmTerm && utmTerm) params.append('utm_term', encodeSpaces(utmTerm));
      if (includeUtmContent && utmContent) params.append('utm_content', encodeSpaces(utmContent));

      // Add custom parameters with space encoding
      customParams.forEach(param => {
        if (param.key && param.value) {
          params.append(encodeSpaces(param.key), encodeSpaces(param.value));
        }
      });

      const finalUrl = params.toString() ? `${url.origin}${url.pathname}?${params.toString()}` : websiteUrl;
      setGeneratedUrl(finalUrl);
    } catch (error) {
      setGeneratedUrl('Invalid URL format');
    }
  }, [websiteUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, includeUtmTerm, includeUtmContent, customParams, encodeSpaces]);

  // Auto-generate when parameters change
  useEffect(() => {
    generateUrl();
  }, [generateUrl]);

  // Predict GA4 channel
  const predictedChannel = useMemo(() => {
    if (!utmSource || !utmMedium) return 'Unassigned';
    return predictGA4Channel(utmSource, utmMedium, utmCampaign);
  }, [utmSource, utmMedium, utmCampaign]);

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
      success('URL copied to clipboard!');
    } catch (err) {
      error('Failed to copy URL');
      console.error('Failed to copy:', err);
    }
  };

  // Copy current generated URL (for loaded configuration preview)
  const copyCurrentConfiguration = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      success('Current configuration URL copied to clipboard!');
    } catch (err) {
      error('Failed to copy configuration URL');
    }
  };

  // Custom parameter management
  const addCustomParam = () => {
    setCustomParams(prev => [...prev, { key: '', value: '' }]);
  };

  const updateCustomParam = (index: number, field: 'key' | 'value', value: string) => {
    setCustomParams(prev => prev.map((param, i) => 
      i === index ? { ...param, [field]: value } : param
    ));
  };

  const removeCustomParam = (index: number) => {
    setCustomParams(prev => prev.filter((_, i) => i !== index));
  };

  // Configuration management with toast notifications
  const saveConfiguration = useCallback(() => {
    if (!configurationName.trim()) {
      error('Please enter a configuration name');
      return;
    }
    
    const configuration = {
      websiteUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
      includeUtmTerm, includeUtmContent, // Save individual toggles
      spaceEncoding, // Save space encoding preference
      selectedChannel, channelFilterActive,
      customParams, timestamp: Date.now()
    };
    
    const newConfigurations = { ...savedConfigurations, [configurationName]: configuration };
    setSavedConfigurations(newConfigurations);
    localStorage.setItem('ga4_configurations', JSON.stringify(newConfigurations));
    
    success(`Configuration "${configurationName}" saved successfully!`);
    setConfigurationName('');
  }, [configurationName, websiteUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, includeUtmTerm, includeUtmContent, spaceEncoding, selectedChannel, channelFilterActive, customParams, savedConfigurations, success, error]);

  const loadConfiguration = useCallback(() => {
    if (!selectedConfiguration || !savedConfigurations[selectedConfiguration]) {
      error('Please select a configuration to load');
      return;
    }
    
    const configuration = savedConfigurations[selectedConfiguration];
    setWebsiteUrl(configuration.websiteUrl);
    setUtmSource(configuration.utmSource);
    setUtmMedium(configuration.utmMedium);
    setUtmCampaign(configuration.utmCampaign);
    setUtmTerm(configuration.utmTerm);
    setUtmContent(configuration.utmContent);
    
    // Load individual toggles (with fallback for old configurations)
    setIncludeUtmTerm(configuration.includeUtmTerm ?? false);
    setIncludeUtmContent(configuration.includeUtmContent ?? false);
    
    // Load space encoding preference (with fallback)
    setSpaceEncoding(configuration.spaceEncoding ?? 'percent');
    
    setSelectedChannel(configuration.selectedChannel || '');
    setChannelFilterActive(configuration.channelFilterActive ?? false);
    setCustomParams(configuration.customParams || []);
    
    // Set loaded configuration name for preview
    setLoadedConfigurationName(selectedConfiguration);
    
    success(`Configuration "${selectedConfiguration}" loaded successfully!`);
  }, [selectedConfiguration, savedConfigurations, success, error]);

  // Delete configuration functionality
  const deleteConfiguration = useCallback(() => {
    if (!selectedConfiguration || !savedConfigurations[selectedConfiguration]) {
      error('Please select a configuration to delete');
      return;
    }
    
    const configurationToDelete = selectedConfiguration;
    const newConfigurations = { ...savedConfigurations };
    delete newConfigurations[configurationToDelete];
    
    setSavedConfigurations(newConfigurations);
    localStorage.setItem('ga4_configurations', JSON.stringify(newConfigurations));
    
    // Clear selection and loaded configuration if it was the deleted one
    setSelectedConfiguration('');
    if (loadedConfigurationName === configurationToDelete) {
      setLoadedConfigurationName('');
    }
    
    success(`Configuration "${configurationToDelete}" deleted successfully!`);
  }, [selectedConfiguration, savedConfigurations, loadedConfigurationName, success, error]);

  // Reset all fields
  const resetFields = useCallback(() => {
    setWebsiteUrl('');
    setUtmSource('');
    setUtmMedium('');
    setUtmCampaign('');
    setUtmTerm('');
    setUtmContent('');
    setIncludeUtmTerm(false);
    setIncludeUtmContent(false);
    setSpaceEncoding('percent'); // Reset space encoding
    setSelectedChannel('');
    setChannelFilterActive(false);
    setCustomParams([]);
    setLoadedConfigurationName('');
    success('Form reset successfully!');
  }, [success]);

  // Load saved configurations on mount
  useEffect(() => {
    const saved = localStorage.getItem('ga4_configurations');
    if (saved) {
      try {
        setSavedConfigurations(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved configurations:', error);
      }
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Video Tutorial Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Play className="w-5 h-5" />
              GA4 UTM Builder Tutorial
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              Learn how to build GA4-compliant UTM parameters with channel prediction
            </p>
          </div>
          <Button
            onClick={() => setShowVideoModal(true)}
            icon={Play}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            Watch Tutorial
          </Button>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">GA4 UTM Builder Tutorial</h3>
              <Button onClick={() => setShowVideoModal(false)} variant="ghost" icon={X} size="sm" />
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    GA4 UTM Tutorial Placeholder
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Replace with your GA4 UTM tutorial video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Base URL & UTM Parameters */}
      <Accordion 
        title="Base URL & UTM Parameters" 
        icon={<Globe className="w-5 h-5" />}
        badge={<Badge variant="info" size="sm">Required</Badge>}
        defaultOpen={true}
      >
        {/* Website URL */}
        <div className="mb-6">
          <Input
            label="Website URL"
            placeholder="https://www.yourwebsite.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            required
            tooltip="Your full landing page URL"
          />
        </div>

        {/* Space Encoding Option - ENHANCED */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Space Encoding
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="spaceEncoding"
                value="percent"
                checked={spaceEncoding === 'percent'}
                onChange={(e) => setSpaceEncoding(e.target.value as 'percent')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">
                <strong>%20</strong> (Percent encoding)
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="spaceEncoding"
                value="plus"
                checked={spaceEncoding === 'plus'}
                onChange={(e) => setSpaceEncoding(e.target.value as 'plus')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">
                <strong>+</strong> (Plus encoding)
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="spaceEncoding"
                value="underscore"
                checked={spaceEncoding === 'underscore'}
                onChange={(e) => setSpaceEncoding(e.target.value as 'underscore')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">
                <strong>_</strong> (Underscore replacement)
              </span>
            </label>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Choose how spaces in parameter values should be encoded in the final URL
          </p>
        </div>

        {/* Channel Filter */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={channelFilterActive}
                onChange={(e) => setChannelFilterActive(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Filter by GA4 Channel
              </span>
            </label>
            {channelFilterActive && (
              <Badge variant="info" size="sm">
                <Filter className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
          
          {channelFilterActive && (
            <div>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full p-2 border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-700 text-sm"
              >
                <option value="">Select a GA4 channel...</option>
                {ga4Channels.map(channel => (
                  <option key={channel.name} value={channel.name}>
                    {channel.name}
                  </option>
                ))}
              </select>
              {selectedChannel && (
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                  {ga4Channels.find(ch => ch.name === selectedChannel)?.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* REQUIRED UTM PARAMETERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Campaign Source (utm_source) *
            </label>
            <Dropdown
              options={filteredSourceOptions}
              value={utmSource}
              onChange={setUtmSource}
              placeholder="e.g., google, facebook, newsletter"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Where the traffic comes from
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Campaign Medium (utm_medium) *
            </label>
            <Dropdown
              options={filteredMediumOptions}
              value={utmMedium}
              onChange={setUtmMedium}
              placeholder="e.g., cpc, organic, email, social"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              How the traffic gets to you
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Campaign Name (utm_campaign) *
            </label>
            <Input
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              placeholder="e.g., summer_sale_2024"
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              What campaign it's for
            </p>
          </div>
        </div>

        {/* STREAMLINED: OPTIONAL UTM PARAMETERS - INLINE DESIGN */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Optional UTM Parameters
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* UTM Term - INLINE CHECKBOX DESIGN */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="include-utm-term"
                  checked={includeUtmTerm}
                  onChange={(e) => handleUtmTermToggle(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="include-utm-term" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Campaign Term (utm_term)
                </label>
              </div>
              <Input
                value={utmTerm}
                onChange={(e) => setUtmTerm(e.target.value)}
                placeholder="e.g., running+shoes, brand+keywords"
                disabled={!includeUtmTerm}
                helperText="Keywords for paid search campaigns"
                className={!includeUtmTerm ? 'opacity-50' : ''}
              />
            </div>

            {/* UTM Content - INLINE CHECKBOX DESIGN */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="include-utm-content"
                  checked={includeUtmContent}
                  onChange={(e) => handleUtmContentToggle(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="include-utm-content" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Campaign Content (utm_content)
                </label>
              </div>
              <Input
                value={utmContent}
                onChange={(e) => setUtmContent(e.target.value)}
                placeholder="e.g., logolink, textlink, banner_300x250"
                disabled={!includeUtmContent}
                helperText="Differentiate similar content or links"
                className={!includeUtmContent ? 'opacity-50' : ''}
              />
            </div>
          </div>
        </div>
      </Accordion>

      {/* Generated URL - MOVED HERE ABOVE THE FOLD */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Generated GA4 URL
          </h2>
          <div className="flex items-center gap-3">
            {predictedChannel && (
              <Badge 
                variant={predictedChannel === 'Unassigned' ? 'warning' : 'success'} 
                size="sm"
              >
                {predictedChannel}
              </Badge>
            )}
            <Button
              onClick={copyToClipboard}
              disabled={!generatedUrl || generatedUrl === 'Invalid URL format'}
              icon={copiedUrl ? Check : Copy}
              variant={copiedUrl ? 'success' : 'primary'}
              size="lg"
            >
              {copiedUrl ? 'Copied!' : 'Copy URL'}
            </Button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700 shadow-inner">
          <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
            {generatedUrl || 'Enter website URL and parameters to generate URL...'}
          </code>
        </div>
        
        {predictedChannel && predictedChannel !== 'Unassigned' && (
          <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  GA4 Channel Prediction: {predictedChannel}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {ga4Channels.find(ch => ch.name === predictedChannel)?.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Options */}
      <Accordion 
        title="Advanced Options" 
        icon={<Settings className="w-5 h-5" />}
        defaultOpen={false}
      >
        {/* Custom Parameters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
              Custom Parameters
            </h4>
            <Button onClick={addCustomParam} icon={Plus} size="sm">
              Add Parameter
            </Button>
          </div>
          
          {customParams.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No custom parameters added. Click "Add Parameter" to add custom tracking parameters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {customParams.map((param, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Input
                      label="Parameter Key"
                      placeholder="e.g., utm_id, custom_param"
                      value={param.key}
                      onChange={(e) => updateCustomParam(index, 'key', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      label="Parameter Value"
                      placeholder="e.g., campaign_123, variant_a"
                      value={param.value}
                      onChange={(e) => updateCustomParam(index, 'value', e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => removeCustomParam(index)}
                    variant="danger"
                    icon={Trash2}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Accordion>

      {/* URL Analysis & Validation */}
      {generatedUrl && generatedUrl !== 'Invalid URL format' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ParameterValidator
            source={utmSource}
            medium={utmMedium}
            campaign={utmCampaign}
            predictedChannel={predictedChannel}
            baseUrl={websiteUrl}
            additionalParams={customParams.reduce((acc, param) => {
              if (param.key && param.value) {
                acc[param.key] = param.value;
              }
              return acc;
            }, {} as Record<string, string>)}
          />
          
          <UrlPreview
            url={generatedUrl}
            baseUrl={websiteUrl}
            parameters={{
              utm_source: utmSource,
              utm_medium: utmMedium,
              utm_campaign: utmCampaign,
              ...(includeUtmTerm && utmTerm && { utm_term: utmTerm }),
              ...(includeUtmContent && utmContent && { utm_content: utmContent }),
              ...customParams.reduce((acc, param) => {
                if (param.key && param.value) {
                  acc[param.key] = param.value;
                }
                return acc;
              }, {} as Record<string, string>)
            }}
          />
        </div>
      )}

      {/* Configuration Management */}
      <Accordion 
        title="Configuration Management" 
        icon={<Save className="w-5 h-5" />}
        defaultOpen={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Save Configuration</h3>
            <Input
              placeholder="Configuration name (e.g., 'Summer Campaign 2024')"
              value={configurationName}
              onChange={(e) => setConfigurationName(e.target.value)}
              helperText="Give your configuration a descriptive name"
            />
            <Button onClick={saveConfiguration} icon={Save} disabled={!configurationName.trim()}>
              Save Configuration
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Manage Configurations</h3>
            <select
              value={selectedConfiguration}
              onChange={(e) => setSelectedConfiguration(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            >
              <option value="">Select configuration...</option>
              {Object.keys(savedConfigurations).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button onClick={loadConfiguration} disabled={!selectedConfiguration} size="sm">
                Load
              </Button>
              <Button 
                onClick={deleteConfiguration} 
                disabled={!selectedConfiguration} 
                variant="danger" 
                icon={Trash2} 
                size="sm"
                tooltip="Delete selected configuration"
              >
                Delete
              </Button>
              <Button onClick={resetFields} variant="secondary" icon={RefreshCw} size="sm">
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* LOADED CONFIGURATION PREVIEW */}
        {loadedConfigurationName && generatedUrl && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                📋 Loaded Configuration: "{loadedConfigurationName}"
              </h4>
              <Button
                onClick={copyCurrentConfiguration}
                variant="secondary"
                size="sm"
                icon={Copy}
                className="text-blue-600 hover:text-blue-700"
              >
                Copy URL
              </Button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
              <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                {generatedUrl}
              </code>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              ✅ Configuration loaded successfully! This shows the current generated URL based on the loaded parameters.
            </p>
          </div>
        )}
      </Accordion>

      {/* Quick Actions Floating Panel */}
      <QuickActions
        generatedUrl={generatedUrl}
        onReset={resetFields}
        onSave={saveConfiguration}
        onExport={() => {
          const data = {
            websiteUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
            includeUtmTerm, includeUtmContent, spaceEncoding,
            selectedChannel, channelFilterActive, customParams
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `ga4-utm-config-${new Date().toISOString().split('T')[0]}.json`;
          link.click();
          URL.revokeObjectURL(url);
          success('Configuration exported successfully!');
        }}
      />

      {/* Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          GA4 Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <a href="https://support.google.com/analytics/answer/10917952" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>📖</span> GA4 UTM Parameters Guide
            </a>
            <a href="https://support.google.com/analytics/answer/9756891" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>🔗</span> GA4 Channel Definitions
            </a>
          </div>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <button onClick={() => setShowVideoModal(true)} className="flex items-center gap-2 hover:underline text-left">
              <Play size={16} /> Watch Tutorial Video
            </button>
            <a href="https://support.google.com/analytics/answer/9267735" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>⚙️</span> GA4 Setup Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GA4Builder;