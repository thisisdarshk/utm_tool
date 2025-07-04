import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Search, X, Save, Download, Upload, Play, RefreshCw, Plus, Trash2, Zap, Globe, Settings, Target, Filter } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Accordion from '../common/Accordion';
import Badge from '../common/Badge';
import Card from '../common/Card';
import { useToast } from '../../hooks/useToast';
import { predictGA4Channel } from '../../utils/validation';
import { SOURCE_CATEGORIES, getSourceCategory } from '../../data/sourceCategories';
import { ga4Channels } from '../../data/ga4Config';

const GA4Builder: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');
  const [utmId, setUtmId] = useState('');
  const [utmSourcePlatform, setUtmSourcePlatform] = useState('');
  const [utmCreativeFormat, setUtmCreativeFormat] = useState('');
  const [utmMarketingTactic, setUtmMarketingTactic] = useState('');
  
  // Selected GA4 channel for filtering
  const [selectedChannel, setSelectedChannel] = useState('');
  
  // Space encoding
  const [spaceEncoding, setSpaceEncoding] = useState<'percent' | 'plus' | 'underscore'>('percent');
  
  // Custom parameters
  const [customParams, setCustomParams] = useState<Array<{key: string, value: string}>>([]);
  
  // Generated URL and validation
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  
  // Template management
  const [savedTemplates, setSavedTemplates] = useState<Record<string, any>>({});
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loadedTemplateName, setLoadedTemplateName] = useState('');
  
  const { success, error } = useToast();

  // Source options with ONLY Search, Social, Shopping, Video categories
  const sourceOptions = useMemo(() => {
    const options = [];
    
    // Only include these 4 categories as per GA4 channel grouping rules
    const allowedCategories = [
      'SOURCE_CATEGORY_SEARCH',
      'SOURCE_CATEGORY_SOCIAL', 
      'SOURCE_CATEGORY_SHOPPING',
      'SOURCE_CATEGORY_VIDEO'
    ];
    
    allowedCategories.forEach(category => {
      const categoryName = category.replace('SOURCE_CATEGORY_', '').toLowerCase();
      const sources = SOURCE_CATEGORIES[category as keyof typeof SOURCE_CATEGORIES];
      
      sources.forEach(source => {
        options.push({
          value: source,
          label: source,
          category: categoryName,
          description: `${categoryName} platform`
        });
      });
    });
    
    return options.sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  // Medium options
  const mediumOptions = useMemo(() => [
    // Paid mediums
    { value: 'cpc', label: 'cpc', category: 'Paid', description: 'Cost per click' },
    { value: 'ppc', label: 'ppc', category: 'Paid', description: 'Pay per click' },
    { value: 'paid', label: 'paid', category: 'Paid', description: 'General paid traffic' },
    { value: 'retargeting', label: 'retargeting', category: 'Paid', description: 'Retargeting campaigns' },
    
    // Display mediums
    { value: 'display', label: 'display', category: 'Display', description: 'Display advertising' },
    { value: 'banner', label: 'banner', category: 'Display', description: 'Banner ads' },
    { value: 'expandable', label: 'expandable', category: 'Display', description: 'Expandable ads' },
    { value: 'interstitial', label: 'interstitial', category: 'Display', description: 'Interstitial ads' },
    { value: 'cpm', label: 'cpm', category: 'Display', description: 'Cost per mille' },
    
    // Organic mediums
    { value: 'organic', label: 'organic', category: 'Organic', description: 'Organic search' },
    { value: 'referral', label: 'referral', category: 'Organic', description: 'Referral traffic' },
    { value: 'social', label: 'social', category: 'Social', description: 'Social media' },
    { value: 'social-network', label: 'social-network', category: 'Social', description: 'Social network' },
    { value: 'social-media', label: 'social-media', category: 'Social', description: 'Social media' },
    
    // Other mediums
    { value: 'email', label: 'email', category: 'Email', description: 'Email marketing' },
    { value: 'affiliate', label: 'affiliate', category: 'Affiliate', description: 'Affiliate marketing' },
    { value: 'video', label: 'video', category: 'Video', description: 'Video advertising' },
    { value: 'audio', label: 'audio', category: 'Audio', description: 'Audio advertising' },
    { value: 'sms', label: 'sms', category: 'SMS', description: 'SMS marketing' },
    { value: 'push', label: 'push', category: 'Push', description: 'Push notifications' }
  ], []);

  // Filter source and medium options based on selected channel
  const filteredSourceOptions = useMemo(() => {
    if (!selectedChannel) return sourceOptions;
    
    const channel = ga4Channels.find(ch => ch.name === selectedChannel);
    if (!channel || channel.recommendedSources.length === 0) return sourceOptions;
    
    return sourceOptions.filter(option => 
      channel.recommendedSources.includes(option.value)
    );
  }, [sourceOptions, selectedChannel]);

  const filteredMediumOptions = useMemo(() => {
    if (!selectedChannel) return mediumOptions;
    
    const channel = ga4Channels.find(ch => ch.name === selectedChannel);
    if (!channel || channel.recommendedMediums.length === 0) return mediumOptions;
    
    return mediumOptions.filter(option => 
      channel.recommendedMediums.includes(option.value)
    );
  }, [mediumOptions, selectedChannel]);

  // Validate URL format
  const validateUrl = useCallback((url: string) => {
    if (!url.trim()) {
      setUrlError('Website URL is required');
      return false;
    }
    
    try {
      new URL(url);
      setUrlError('');
      return true;
    } catch {
      setUrlError('Invalid URL format. Please include http:// or https://');
      return false;
    }
  }, []);

  // Handle URL blur validation
  const handleUrlBlur = useCallback(() => {
    validateUrl(baseUrl);
  }, [baseUrl, validateUrl]);

  // Apply space encoding
  const applySpaceEncoding = useCallback((value: string) => {
    switch (spaceEncoding) {
      case 'plus':
        return value.replace(/ /g, '+');
      case 'underscore':
        return value.replace(/ /g, '_');
      case 'percent':
      default:
        return encodeURIComponent(value).replace(/%20/g, '%20');
    }
  }, [spaceEncoding]);

  // Generate URL
  const generateUrl = useCallback(() => {
    if (!baseUrl.trim()) {
      setGeneratedUrl('');
      return;
    }

    const isValidUrl = validateUrl(baseUrl);
    if (!isValidUrl) {
      setGeneratedUrl('');
      return;
    }

    try {
      const url = new URL(baseUrl);
      const params = new URLSearchParams(url.search);
      
      // Add UTM parameters with space encoding
      if (utmSource) params.set('utm_source', applySpaceEncoding(utmSource));
      if (utmMedium) params.set('utm_medium', applySpaceEncoding(utmMedium));
      if (utmCampaign) params.set('utm_campaign', applySpaceEncoding(utmCampaign));
      if (utmTerm) params.set('utm_term', applySpaceEncoding(utmTerm));
      if (utmContent) params.set('utm_content', applySpaceEncoding(utmContent));
      if (utmId) params.set('utm_id', applySpaceEncoding(utmId));
      if (utmSourcePlatform) params.set('utm_source_platform', applySpaceEncoding(utmSourcePlatform));
      if (utmCreativeFormat) params.set('utm_creative_format', applySpaceEncoding(utmCreativeFormat));
      if (utmMarketingTactic) params.set('utm_marketing_tactic', applySpaceEncoding(utmMarketingTactic));
      
      // Add custom parameters
      customParams.forEach(param => {
        if (param.key && param.value) {
          params.set(param.key, applySpaceEncoding(param.value));
        }
      });
      
      url.search = params.toString();
      setGeneratedUrl(url.toString());
    } catch (err) {
      setGeneratedUrl('');
    }
  }, [baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, utmId, utmSourcePlatform, utmCreativeFormat, utmMarketingTactic, customParams, applySpaceEncoding, validateUrl]);

  // Auto-generate when parameters change
  React.useEffect(() => {
    generateUrl();
  }, [generateUrl]);

  // Get predicted channel
  const predictedChannel = useMemo(() => {
    if (utmSource && utmMedium) {
      return predictGA4Channel(utmSource, utmMedium, utmCampaign);
    }
    return 'Unassigned';
  }, [utmSource, utmMedium, utmCampaign]);

  // Get channel prediction rationale
  const channelRationale = useMemo(() => {
    if (!utmSource || !utmMedium) {
      return 'Requires utm_source and utm_medium for prediction';
    }
    
    const channel = ga4Channels.find(ch => ch.name === predictedChannel);
    if (channel) {
      return `Matches condition: ${channel.condition}`;
    }
    
    return 'Does not match any GA4 channel definition';
  }, [utmSource, utmMedium, predictedChannel]);

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

  // Template management
  const saveTemplate = useCallback(() => {
    if (!templateName.trim()) {
      error('Please enter a template name');
      return;
    }
    
    const template = {
      baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
      utmId, utmSourcePlatform, utmCreativeFormat, utmMarketingTactic,
      selectedChannel, spaceEncoding, customParams,
      timestamp: Date.now()
    };
    
    const newTemplates = { ...savedTemplates, [templateName]: template };
    setSavedTemplates(newTemplates);
    localStorage.setItem('ga4_templates', JSON.stringify(newTemplates));
    
    success(`Template "${templateName}" saved successfully!`);
    setTemplateName('');
  }, [templateName, baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, utmId, utmSourcePlatform, utmCreativeFormat, utmMarketingTactic, selectedChannel, spaceEncoding, customParams, savedTemplates, success, error]);

  const loadTemplate = useCallback(() => {
    if (!selectedTemplate || !savedTemplates[selectedTemplate]) {
      error('Please select a template to load');
      return;
    }
    
    const template = savedTemplates[selectedTemplate];
    setBaseUrl(template.baseUrl || '');
    setUtmSource(template.utmSource || '');
    setUtmMedium(template.utmMedium || '');
    setUtmCampaign(template.utmCampaign || '');
    setUtmTerm(template.utmTerm || '');
    setUtmContent(template.utmContent || '');
    setUtmId(template.utmId || '');
    setUtmSourcePlatform(template.utmSourcePlatform || '');
    setUtmCreativeFormat(template.utmCreativeFormat || '');
    setUtmMarketingTactic(template.utmMarketingTactic || '');
    setSelectedChannel(template.selectedChannel || '');
    setSpaceEncoding(template.spaceEncoding || 'percent');
    setCustomParams(template.customParams || []);
    setLoadedTemplateName(selectedTemplate);
    
    success(`Template "${selectedTemplate}" loaded successfully!`);
  }, [selectedTemplate, savedTemplates, success, error]);

  const deleteTemplate = useCallback(() => {
    if (!selectedTemplate || !savedTemplates[selectedTemplate]) {
      error('Please select a template to delete');
      return;
    }
    
    const templateToDelete = selectedTemplate;
    const newTemplates = { ...savedTemplates };
    delete newTemplates[templateToDelete];
    
    setSavedTemplates(newTemplates);
    localStorage.setItem('ga4_templates', JSON.stringify(newTemplates));
    
    setSelectedTemplate('');
    if (loadedTemplateName === templateToDelete) {
      setLoadedTemplateName('');
    }
    
    success(`Template "${templateToDelete}" deleted successfully!`);
  }, [selectedTemplate, savedTemplates, loadedTemplateName, success, error]);

  const resetFields = useCallback(() => {
    setBaseUrl('');
    setUtmSource('');
    setUtmMedium('');
    setUtmCampaign('');
    setUtmTerm('');
    setUtmContent('');
    setUtmId('');
    setUtmSourcePlatform('');
    setUtmCreativeFormat('');
    setUtmMarketingTactic('');
    setSelectedChannel('');
    setSpaceEncoding('percent');
    setCustomParams([]);
    setLoadedTemplateName('');
    success('Form reset successfully!');
  }, [success]);

  // Load saved templates on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('ga4_templates');
    if (saved) {
      try {
        setSavedTemplates(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved templates:', error);
      }
    }
  }, []);

  // Get selected channel details
  const selectedChannelData = useMemo(() => {
    return ga4Channels.find(ch => ch.name === selectedChannel);
  }, [selectedChannel]);

  return (
    <div className="space-y-8">
      {/* 1. GA4 Channel Definitions (Always Visible) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src="/google-analytics-4.svg/google-analytics-4.svg" 
            alt="GA4" 
            className="w-6 h-6"
            onError={(e) => {
              // Fallback if logo fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs';
              fallback.textContent = 'GA4';
              target.parentNode?.insertBefore(fallback, target);
            }}
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            GA4 Channel Definitions
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select GA4 Channel (Optional)
            </label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500/20 focus:outline-none focus:ring-4"
            >
              <option value="">All channels (no filtering)</option>
              {ga4Channels.map(channel => (
                <option key={channel.name} value={channel.name}>
                  {channel.name} - {channel.description.substring(0, 80)}...
                </option>
              ))}
            </select>
          </div>
          
          {selectedChannelData && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                {selectedChannelData.name}
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                <strong>Description:</strong> {selectedChannelData.description}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>GA4 Grouping Condition:</strong> {selectedChannelData.condition}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Base URL & UTM Parameters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Base URL & UTM Parameters
        </h3>
        
        <div className="space-y-6">
          {/* Website URL */}
          <Input
            label="Website URL"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            onBlur={handleUrlBlur}
            placeholder="https://example.com/page"
            required
            error={urlError}
            helperText="The destination URL for your campaign"
          />

          {/* Space Encoding */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Space Encoding
            </label>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="spaceEncoding"
                  value="percent"
                  checked={spaceEncoding === 'percent'}
                  onChange={(e) => setSpaceEncoding(e.target.value as 'percent')}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                Percent (%20)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="spaceEncoding"
                  value="plus"
                  checked={spaceEncoding === 'plus'}
                  onChange={(e) => setSpaceEncoding(e.target.value as 'plus')}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                Plus (+)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="spaceEncoding"
                  value="underscore"
                  checked={spaceEncoding === 'underscore'}
                  onChange={(e) => setSpaceEncoding(e.target.value as 'underscore')}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                Underscore (_)
              </label>
            </div>
          </div>

          {/* Required UTM Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campaign Source (utm_source) *
              </label>
              <Dropdown
                options={filteredSourceOptions}
                value={utmSource}
                onChange={setUtmSource}
                placeholder="e.g., google, facebook"
                searchable
                clearable
                allowCustom
                groupByCategory
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Where the traffic comes from {selectedChannel ? `(filtered for ${selectedChannel})` : ''}
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
                placeholder="e.g., cpc, email, social"
                searchable
                clearable
                allowCustom
                groupByCategory
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                How the traffic gets to you {selectedChannel ? `(filtered for ${selectedChannel})` : ''}
              </p>
            </div>

            <Input
              label="Campaign Name (utm_campaign) *"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              placeholder="e.g., summer_sale_2025"
              required
              helperText="What campaign it's for"
            />
          </div>
        </div>
      </div>

      {/* 3. Additional UTM Parameters (Accordion) */}
      <Accordion 
        title="Optional UTM Parameters" 
        defaultOpen={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Campaign Term (utm_term)"
            value={utmTerm}
            onChange={(e) => setUtmTerm(e.target.value)}
            placeholder="running+shoes"
            helperText="Keywords for paid search campaigns"
          />
          
          <Input
            label="Campaign Content (utm_content)"
            value={utmContent}
            onChange={(e) => setUtmContent(e.target.value)}
            placeholder="logolink"
            helperText="Used to differentiate similar content or links within the same ad"
          />
          
          <Input
            label="Campaign ID (utm_id)"
            value={utmId}
            onChange={(e) => setUtmId(e.target.value)}
            placeholder="campaign_123"
            helperText="A unique identifier for your campaign"
          />
          
          <Input
            label="Source Platform (utm_source_platform)"
            value={utmSourcePlatform}
            onChange={(e) => setUtmSourcePlatform(e.target.value)}
            placeholder="Google Ads"
            helperText="Platform where marketing activity is managed"
          />
          
          <Input
            label="Creative Format (utm_creative_format)"
            value={utmCreativeFormat}
            onChange={(e) => setUtmCreativeFormat(e.target.value)}
            placeholder="display_banner_300x250"
            helperText="Type of creative (display, video, search, etc.)"
          />
          
          <Input
            label="Marketing Tactic (utm_marketing_tactic)"
            value={utmMarketingTactic}
            onChange={(e) => setUtmMarketingTactic(e.target.value)}
            placeholder="remarketing_dynamic"
            helperText="Targeting criteria (remarketing, prospecting, etc.)"
          />
        </div>

        {/* Custom Parameters - MOVED UNDER ACCORDION */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
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
                      placeholder="e.g., custom_param"
                      value={param.key}
                      onChange={(e) => updateCustomParam(index, 'key', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      label="Parameter Value"
                      placeholder="e.g., custom_value"
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

      {/* 4. Generated UTM URL */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Generated UTM URL
          </h2>
          <Button
            onClick={copyToClipboard}
            disabled={!generatedUrl || !!urlError}
            icon={copiedUrl ? Check : Copy}
            variant={copiedUrl ? 'success' : 'primary'}
            size="lg"
          >
            {copiedUrl ? 'Copied!' : 'Copy URL'}
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700 shadow-inner">
          <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
            {generatedUrl || 'Enter parameters to generate URL...'}
          </code>
        </div>
      </div>

      {/* 6. GA4 Channel Predictor */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          GA4 Default Channel Prediction
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Predicted Channel:
              </span>
              <Badge 
                variant={predictedChannel === 'Unassigned' ? 'warning' : 'success'} 
                size="sm"
              >
                {predictedChannel}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Rationale:</strong> {channelRationale}
            </p>
          </div>
          
          {predictedChannel === 'Unassigned' && utmSource && utmMedium && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Your current source and medium combination doesn't match any GA4 channel definition. 
                Consider reviewing the channel conditions above or adjusting your parameters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 7. Template Management (Accordion) */}
      <Accordion 
        title="Template Management" 
        icon={<Save className="w-5 h-5" />}
        defaultOpen={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Save Template</h3>
            <Input
              placeholder="Template name (e.g., 'My Campaign Template')"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              helperText="Give your template a descriptive name"
            />
            <Button onClick={saveTemplate} icon={Save} disabled={!templateName.trim()}>
              Save Template
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Manage Templates</h3>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            >
              <option value="">Select template...</option>
              {Object.keys(savedTemplates).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button onClick={loadTemplate} disabled={!selectedTemplate} size="sm">
                Load
              </Button>
              <Button 
                onClick={deleteTemplate} 
                disabled={!selectedTemplate} 
                variant="danger" 
                icon={Trash2} 
                size="sm"
              >
                Delete
              </Button>
              <Button onClick={resetFields} variant="secondary" icon={RefreshCw} size="sm">
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Loaded Template Preview */}
        {loadedTemplateName && generatedUrl && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                📋 Loaded Template: "{loadedTemplateName}"
              </h4>
              <Button
                onClick={copyToClipboard}
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
              ✅ Template loaded successfully! This shows the current generated URL.
            </p>
          </div>
        )}
      </Accordion>
    </div>
  );
};

export default GA4Builder;