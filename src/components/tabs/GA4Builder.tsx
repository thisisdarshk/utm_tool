import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Search, X, Save, Download, Upload, Play, RefreshCw, Plus, Trash2, Zap, Globe, Settings, Target, Filter } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Accordion from '../common/Accordion';
import Badge from '../common/Badge';
import Card from '../common/Card';
import ParameterValidator from '../features/ParameterValidator';
import UrlPreview from '../features/UrlPreview';
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
  
  // Individual optional parameter toggles
  const [includeUtmTerm, setIncludeUtmTerm] = useState(false);
  const [includeUtmContent, setIncludeUtmContent] = useState(false);
  
  // Advanced GA4 parameters
  const [selectedParams, setSelectedParams] = useState<Record<string, boolean>>({});
  const [customParams, setCustomParams] = useState<Array<{key: string, value: string}>>([]);
  
  // UI state
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [spaceEncoding, setSpaceEncoding] = useState<'percent' | 'plus' | 'underscore'>('percent');
  
  // Template management
  const [savedTemplates, setSavedTemplates] = useState<Record<string, any>>({});
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loadedTemplateName, setLoadedTemplateName] = useState('');
  
  const { success, error } = useToast();

  // Source options with categories
  const sourceOptions = useMemo(() => {
    const options = [];
    
    // Add sources from categories
    Object.entries(SOURCE_CATEGORIES).forEach(([category, sources]) => {
      const categoryName = category.replace('SOURCE_CATEGORY_', '').toLowerCase();
      sources.forEach(source => {
        options.push({
          value: source,
          label: source,
          category: categoryName,
          description: `${categoryName} platform`
        });
      });
    });
    
    // Add common custom sources
    const customSources = [
      { value: 'email', label: 'email', category: 'email', description: 'Email campaigns' },
      { value: 'newsletter', label: 'newsletter', category: 'email', description: 'Newsletter campaigns' },
      { value: 'direct', label: 'direct', category: 'direct', description: 'Direct traffic' },
      { value: 'affiliate', label: 'affiliate', category: 'affiliate', description: 'Affiliate marketing' }
    ];
    
    options.push(...customSources);
    
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

  // Advanced GA4 parameters
  const ga4Params = useMemo(() => [
    {
      id: 'utm_id',
      value: '',
      label: 'Campaign ID',
      category: 'campaign',
      description: 'A unique identifier for your campaign',
      availability: 'All campaigns',
      example: 'campaign_123'
    },
    {
      id: 'utm_source_platform',
      value: '',
      label: 'Source Platform',
      category: 'campaign',
      description: 'Platform where marketing activity is managed',
      availability: 'All campaigns',
      example: 'Google Ads'
    },
    {
      id: 'utm_creative_format',
      value: '',
      label: 'Creative Format',
      category: 'creative',
      description: 'Type of creative (display, video, search, etc.)',
      availability: 'All campaigns',
      example: 'display_banner_300x250'
    },
    {
      id: 'utm_marketing_tactic',
      value: '',
      label: 'Marketing Tactic',
      category: 'targeting',
      description: 'Targeting criteria (remarketing, prospecting, etc.)',
      availability: 'All campaigns',
      example: 'remarketing_dynamic'
    }
  ], []);

  // Filter parameters based on search and category
  const filteredParams = useMemo(() => {
    return ga4Params.filter(param => {
      const matchesSearch = param.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || param.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [ga4Params, searchTerm, selectedCategory]);

  // Handle individual optional parameter toggles
  const handleUtmTermToggle = useCallback((enabled: boolean) => {
    setIncludeUtmTerm(enabled);
    if (!enabled) setUtmTerm('');
  }, []);

  const handleUtmContentToggle = useCallback((enabled: boolean) => {
    setIncludeUtmContent(enabled);
    if (!enabled) setUtmContent('');
  }, []);

  // Generate URL
  const generateUrl = useCallback(() => {
    if (!baseUrl.trim()) {
      setGeneratedUrl('');
      return;
    }

    try {
      const url = new URL(baseUrl);
      const params = new URLSearchParams(url.search);
      
      // Add UTM parameters
      if (utmSource) params.set('utm_source', utmSource);
      if (utmMedium) params.set('utm_medium', utmMedium);
      if (utmCampaign) params.set('utm_campaign', utmCampaign);
      if (includeUtmTerm && utmTerm) params.set('utm_term', utmTerm);
      if (includeUtmContent && utmContent) params.set('utm_content', utmContent);
      
      // Add selected advanced parameters
      Object.entries(selectedParams).forEach(([paramId, isSelected]) => {
        if (isSelected) {
          const param = ga4Params.find(p => p.id === paramId);
          if (param && param.value) {
            params.set(paramId, param.value);
          }
        }
      });
      
      // Add custom parameters
      customParams.forEach(param => {
        if (param.key && param.value) {
          params.set(param.key, param.value);
        }
      });
      
      // Handle space encoding
      let paramString = params.toString();
      if (spaceEncoding === 'plus') {
        paramString = paramString.replace(/%20/g, '+');
      } else if (spaceEncoding === 'underscore') {
        paramString = paramString.replace(/%20/g, '_');
      }
      
      url.search = paramString;
      setGeneratedUrl(url.toString());
    } catch (err) {
      // Fallback for invalid URLs
      const params = [];
      if (utmSource) params.push(`utm_source=${encodeURIComponent(utmSource)}`);
      if (utmMedium) params.push(`utm_medium=${encodeURIComponent(utmMedium)}`);
      if (utmCampaign) params.push(`utm_campaign=${encodeURIComponent(utmCampaign)}`);
      if (includeUtmTerm && utmTerm) params.push(`utm_term=${encodeURIComponent(utmTerm)}`);
      if (includeUtmContent && utmContent) params.push(`utm_content=${encodeURIComponent(utmContent)}`);
      
      const separator = baseUrl.includes('?') ? '&' : '?';
      setGeneratedUrl(params.length > 0 ? `${baseUrl}${separator}${params.join('&')}` : baseUrl);
    }
  }, [baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, includeUtmTerm, includeUtmContent, selectedParams, customParams, ga4Params, spaceEncoding]);

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

  // Template management
  const saveTemplate = useCallback(() => {
    if (!templateName.trim()) {
      error('Please enter a template name');
      return;
    }
    
    const template = {
      baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
      includeUtmTerm, includeUtmContent, selectedParams, customParams,
      spaceEncoding, timestamp: Date.now()
    };
    
    const newTemplates = { ...savedTemplates, [templateName]: template };
    setSavedTemplates(newTemplates);
    localStorage.setItem('ga4_templates', JSON.stringify(newTemplates));
    
    success(`Template "${templateName}" saved successfully!`);
    setTemplateName('');
  }, [templateName, baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, includeUtmTerm, includeUtmContent, selectedParams, customParams, spaceEncoding, savedTemplates, success, error]);

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
    setIncludeUtmTerm(template.includeUtmTerm ?? false);
    setIncludeUtmContent(template.includeUtmContent ?? false);
    setSelectedParams(template.selectedParams || {});
    setCustomParams(template.customParams || []);
    setSpaceEncoding(template.spaceEncoding || 'percent');
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
    setIncludeUtmTerm(false);
    setIncludeUtmContent(false);
    setSelectedParams({});
    setCustomParams([]);
    setSpaceEncoding('percent');
    setLoadedTemplateName('');
    success('Form reset successfully!');
  }, [success]);

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

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Parameters' },
    { value: 'campaign', label: 'Campaign Level' },
    { value: 'creative', label: 'Creative Level' },
    { value: 'targeting', label: 'Targeting' }
  ];

  return (
    <div className="space-y-8">
      {/* Video Tutorial Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
              <Play className="w-4 h-4" />
              GA4 UTM Builder Tutorial
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-xs">
              Learn how to create GA4-compliant UTM parameters with channel prediction
            </p>
          </div>
          <Button
            onClick={() => setShowVideoModal(true)}
            icon={Play}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            Tutorial
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
                    GA4 UTM Builder Tutorial Placeholder
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Replace with your GA4 tutorial video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Base URL & UTM Parameters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Base URL & UTM Parameters
          </h3>
          <Badge variant="info" size="sm">Required</Badge>
        </div>
        <div className="space-y-6">
          {/* Base URL */}
          <Input
            label="Website URL"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://example.com/page"
            required
            helperText="The destination URL for your campaign"
          />

          {/* Required UTM Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campaign Source (utm_source) *
              </label>
              <Dropdown
                options={sourceOptions}
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
                Where the traffic comes from
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campaign Medium (utm_medium) *
              </label>
              <Dropdown
                options={mediumOptions}
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
                How the traffic gets to you
              </p>
            </div>

            <Input
              label="Campaign Name (utm_campaign) *"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              placeholder="summer_sale_2025"
              required
              helperText="What campaign it's for"
            />
          </div>

          {/* Optional UTM Parameters */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Optional UTM Parameters
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="running+shoes"
                  disabled={!includeUtmTerm}
                  helperText="Keywords for paid search"
                  className={!includeUtmTerm ? 'opacity-50' : ''}
                />
              </div>

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
                  placeholder="logolink"
                  disabled={!includeUtmContent}
                  helperText="Differentiate similar content"
                  className={!includeUtmContent ? 'opacity-50' : ''}
                />
              </div>
            </div>
          </div>

          {/* Space Encoding Options */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Space Encoding
            </h4>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="spaceEncoding"
                  value="percent"
                  checked={spaceEncoding === 'percent'}
                  onChange={(e) => setSpaceEncoding(e.target.value as 'percent')}
                  className="mr-2"
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
                  className="mr-2"
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
                  className="mr-2"
                />
                Underscore (_)
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Choose how spaces in parameter values should be encoded in the generated URL
            </p>
          </div>
        </div>
      </div>

      {/* Generated URL Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Generated UTM URL
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={copyToClipboard}
              disabled={!generatedUrl}
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
            {generatedUrl || 'Enter parameters to generate URL...'}
          </code>
        </div>

        {/* Channel Prediction */}
        {predictedChannel && utmSource && utmMedium && (
          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Predicted GA4 Channel: <span className="font-bold">{predictedChannel}</span>
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Based on your source and medium combination
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* URL Preview Component */}
      {generatedUrl && (
        <UrlPreview
          url={generatedUrl}
          baseUrl={baseUrl}
          parameters={{
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
            ...(includeUtmTerm && utmTerm && { utm_term: utmTerm }),
            ...(includeUtmContent && utmContent && { utm_content: utmContent })
          }}
        />
      )}

      {/* Parameter Validator */}
      {(utmSource || utmMedium || utmCampaign) && (
        <ParameterValidator
          source={utmSource}
          medium={utmMedium}
          campaign={utmCampaign}
          predictedChannel={predictedChannel}
          baseUrl={baseUrl}
        />
      )}

      {/* Advanced GA4 Parameters */}
      <Accordion 
        title="Advanced GA4 Parameters" 
        icon={<Settings className="w-5 h-5" />}
        defaultOpen={false}
      >
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search parameters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredParams.map(param => (
            <div key={param.id} className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <input
                type="checkbox"
                id={param.id}
                checked={selectedParams[param.id] || false}
                onChange={(e) => {
                  setSelectedParams(prev => ({
                    ...prev,
                    [param.id]: e.target.checked
                  }));
                }}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1 min-w-0">
                <label htmlFor={param.id} className="block text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer mb-1">
                  {param.label}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {param.description}
                </p>
                {selectedParams[param.id] && (
                  <Input
                    placeholder={param.example}
                    value={param.value}
                    onChange={(e) => {
                      const updatedParams = ga4Params.map(p => 
                        p.id === param.id ? { ...p, value: e.target.value } : p
                      );
                      // Update the param value in the array
                    }}
                    size="sm"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </Accordion>

      {/* Custom Parameters */}
      <Accordion 
        title="Custom Parameters" 
        icon={<Plus className="w-5 h-5" />}
        defaultOpen={false}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add custom tracking parameters for advanced analytics
          </p>
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
      </Accordion>

      {/* Template Management */}
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