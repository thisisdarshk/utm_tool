import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Search, X, Save, Download, Upload, Play, RefreshCw, Plus, Trash2, Zap, Globe, Settings, Target } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Accordion from '../common/Accordion';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';

const RedditBuilder: React.FC = () => {
  // Reddit-Recommended UTM Mapping
  const [utmSource, setUtmSource] = useState('reddit');
  const [utmMedium, setUtmMedium] = useState('{{ADVERTISER_ID}}');
  const [utmCampaign, setUtmCampaign] = useState('{{CAMPAIGN_ID}}-{{ADGROUP_NAME}}');
  const [utmContent, setUtmContent] = useState('{{AD_ID}}-{{AD_NAME}}');
  
  // Individual optional parameter toggles
  const [includeUtmContent, setIncludeUtmContent] = useState(true);
  
  // Reddit-specific parameters (optional additional tracking)
  const [selectedParams, setSelectedParams] = useState<Record<string, boolean>>({});
  
  const [customParams, setCustomParams] = useState<Array<{key: string, value: string}>>([]);
  const [generatedString, setGeneratedString] = useState('');
  const [copiedString, setCopiedString] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedTemplates, setSavedTemplates] = useState<Record<string, any>>({});
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loadedTemplateName, setLoadedTemplateName] = useState('');
  const { success, error } = useToast();

  // Reddit-specific source options (following Reddit recommendations)
  const sourceOptions = useMemo(() => [
    { 
      value: 'reddit', 
      label: 'reddit', 
      category: 'Reddit Recommended',
      description: 'Reddit platform traffic - Official Reddit recommendation'
    }
  ], []);

  // Reddit-specific medium options (following Reddit recommendations)
  const mediumOptions = useMemo(() => [
    { 
      value: '{{ADVERTISER_ID}}', 
      label: '{{ADVERTISER_ID}}', 
      category: 'Reddit Recommended',
      description: 'Represents the advertiser (ad account) - Official Reddit recommendation'
    },
    { 
      value: 'paid_social', 
      label: 'paid_social', 
      category: 'Alternative Mediums',
      description: 'Paid social media traffic - Alternative option'
    },
    { 
      value: 'paid', 
      label: 'paid', 
      category: 'Alternative Mediums',
      description: 'General paid traffic - Alternative option'
    },
    { 
      value: 'cpc', 
      label: 'cpc', 
      category: 'Alternative Mediums',
      description: 'Cost per click campaigns - Alternative option'
    }
  ], []);

  // Reddit-specific campaign options (following Reddit recommendations)
  const campaignOptions = useMemo(() => [
    { 
      value: '{{CAMPAIGN_ID}}-{{ADGROUP_NAME}}', 
      label: '{{CAMPAIGN_ID}}-{{ADGROUP_NAME}}', 
      category: 'Reddit Recommended',
      description: 'Combines campaign ID with ad group name - Official Reddit recommendation'
    },
    { 
      value: '{{CAMPAIGN_ID}}', 
      label: '{{CAMPAIGN_ID}}', 
      category: 'Alternative Options',
      description: 'Campaign ID only - Alternative option'
    },
    { 
      value: '{{ADGROUP_NAME}}', 
      label: '{{ADGROUP_NAME}}', 
      category: 'Alternative Options',
      description: 'Ad group name only - Alternative option'
    }
  ], []);
    
  // Reddit-specific content options (following Reddit recommendations)
  const contentOptions = useMemo(() => [
    { 
      value: '{{AD_ID}}-{{AD_NAME}}', 
      label: '{{AD_ID}}-{{AD_NAME}}', 
      category: 'Reddit Recommended',
      description: 'Combines ad ID with ad name to track creatives - Official Reddit recommendation'
    },
    { 
      value: '{{AD_ID}}', 
      label: '{{AD_ID}}', 
      category: 'Alternative Options',
      description: 'Ad ID only - Alternative option'
    },
    { 
      value: '{{AD_NAME}}', 
      label: '{{AD_NAME}}', 
      category: 'Alternative Options',
      description: 'Ad name only - Alternative option'
    }
  ], []);

  // Reddit optional additional tracking parameters (as mentioned in your context)
  const redditParams = useMemo(() => [
    // Optional Additional Tracking Parameters for deeper analysis
    { 
      id: 'creative_id', 
      value: '{{CREATIVE_ID}}', 
      label: 'Creative ID', 
      category: 'optional', 
      description: 'Creative ID for deeper analysis in BigQuery or custom dashboards',
      availability: 'All Reddit campaigns',
      example: 't3_1234567890',
      note: 'Not officially mapped to UTMs by Reddit'
    },
    { 
      id: 'post_id', 
      value: '{{POST_ID}}', 
      label: 'Post ID', 
      category: 'optional', 
      description: 'Post ID for deeper analysis in BigQuery or custom dashboards',
      availability: 'All Reddit campaigns',
      example: 't3_0987654321',
      note: 'Not officially mapped to UTMs by Reddit'
    },
    { 
      id: 'adgroup_id', 
      value: '{{ADGROUP_ID}}', 
      label: 'Ad Group ID', 
      category: 'optional', 
      description: 'Ad group ID for deeper analysis in BigQuery or custom dashboards',
      availability: 'All Reddit campaigns',
      example: 't5_1122334455',
      note: 'Not officially mapped to UTMs by Reddit'
    },
    { 
      id: 'campaign_name', 
      value: '{{CAMPAIGN_NAME}}', 
      label: 'Campaign Name', 
      category: 'optional', 
      description: 'Campaign name for deeper analysis in BigQuery or custom dashboards',
      availability: 'All Reddit campaigns',
      example: 'Holiday_Promotion_2025',
      note: 'Not officially mapped to UTMs by Reddit'
    },
    { 
      id: 'ad_name', 
      value: '{{AD_NAME}}', 
      label: 'Ad Name', 
      category: 'optional', 
      description: 'Ad name for deeper analysis in BigQuery or custom dashboards',
      availability: 'All Reddit campaigns',
      example: 'Promoted_Post_Tech_News',
      note: 'Not officially mapped to UTMs by Reddit'
    }
  ], []);

  // Filter parameters based on search and category
  const filteredParams = useMemo(() => {
    return redditParams.filter(param => {
      const matchesSearch = param.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.availability.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || param.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [redditParams, searchTerm, selectedCategory]);

  // Handle individual optional parameter toggles with default value restoration
  const handleUtmContentToggle = useCallback((enabled: boolean) => {
    setIncludeUtmContent(enabled);
    
    // If enabling and field is empty, restore default
    if (enabled && !utmContent.trim()) {
      setUtmContent('{{AD_ID}}-{{AD_NAME}}');
    }
  }, [utmContent]);

  // Generate parameter string (no URL needed)
  const generateParameterString = useCallback(() => {
    const params = [];
    
    // Add UTM parameters - REQUIRED FIELDS ALWAYS INCLUDED
    if (utmSource) params.push(`utm_source=${utmSource}`);
    if (utmMedium) params.push(`utm_medium=${utmMedium}`);
    if (utmCampaign) params.push(`utm_campaign=${utmCampaign}`);
    
    // Add optional UTM parameters only if individually enabled
    if (includeUtmContent && utmContent) params.push(`utm_content=${utmContent}`);

    // Add selected Reddit parameters
    Object.entries(selectedParams).forEach(([paramId, isSelected]) => {
      if (isSelected) {
        const param = redditParams.find(p => p.id === paramId);
        if (param) {
          params.push(`${paramId}=${param.value}`);
        }
      }
    });

    // Add custom parameters
    customParams.forEach(param => {
      if (param.key && param.value) {
        params.push(`${param.key}=${param.value}`);
      }
    });

    const finalString = params.join('&');
    setGeneratedString(finalString);
  }, [utmSource, utmMedium, utmCampaign, utmContent, includeUtmContent, selectedParams, customParams, redditParams]);

  // Auto-generate when parameters change
  React.useEffect(() => {
    generateParameterString();
  }, [generateParameterString]);

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedString);
      setCopiedString(true);
      setTimeout(() => setCopiedString(false), 2000);
      success('Parameter string copied to clipboard!');
    } catch (err) {
      error('Failed to copy parameter string');
      console.error('Failed to copy:', err);
    }
  };

  // Copy current generated string (for loaded template preview)
  const copyCurrentTemplate = async () => {
    try {
      await navigator.clipboard.writeText(generatedString);
      success('Current parameter string copied to clipboard!');
    } catch (err) {
      error('Failed to copy parameter string');
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

  // Template management with toast notifications
  const saveTemplate = useCallback(() => {
    if (!templateName.trim()) {
      error('Please enter a template name');
      return;
    }
    
    const template = {
      utmSource, utmMedium, utmCampaign, utmContent,
      includeUtmContent,
      selectedParams, customParams, timestamp: Date.now()
    };
    
    const newTemplates = { ...savedTemplates, [templateName]: template };
    setSavedTemplates(newTemplates);
    localStorage.setItem('reddit_ads_templates', JSON.stringify(newTemplates));
    
    success(`Template "${templateName}" saved successfully!`);
    setTemplateName('');
  }, [templateName, utmSource, utmMedium, utmCampaign, utmContent, includeUtmContent, selectedParams, customParams, savedTemplates, success, error]);

  const loadTemplate = useCallback(() => {
    if (!selectedTemplate || !savedTemplates[selectedTemplate]) {
      error('Please select a template to load');
      return;
    }
    
    const template = savedTemplates[selectedTemplate];
    setUtmSource(template.utmSource);
    setUtmMedium(template.utmMedium);
    setUtmCampaign(template.utmCampaign);
    setUtmContent(template.utmContent);
    
    // Load individual toggles (with fallback for old templates)
    setIncludeUtmContent(template.includeUtmContent ?? true);
    
    setSelectedParams(template.selectedParams || {});
    setCustomParams(template.customParams || []);
    
    // Set loaded template name for preview
    setLoadedTemplateName(selectedTemplate);
    
    success(`Template "${selectedTemplate}" loaded successfully!`);
  }, [selectedTemplate, savedTemplates, success, error]);

  // Delete template functionality
  const deleteTemplate = useCallback(() => {
    if (!selectedTemplate || !savedTemplates[selectedTemplate]) {
      error('Please select a template to delete');
      return;
    }
    
    const templateToDelete = selectedTemplate;
    const newTemplates = { ...savedTemplates };
    delete newTemplates[templateToDelete];
    
    setSavedTemplates(newTemplates);
    localStorage.setItem('reddit_ads_templates', JSON.stringify(newTemplates));
    
    // Clear selection and loaded template if it was the deleted one
    setSelectedTemplate('');
    if (loadedTemplateName === templateToDelete) {
      setLoadedTemplateName('');
    }
    
    success(`Template "${templateToDelete}" deleted successfully!`);
  }, [selectedTemplate, savedTemplates, loadedTemplateName, success, error]);

  // Reset all fields
  const resetFields = useCallback(() => {
    setUtmSource('reddit');
    setUtmMedium('{{ADVERTISER_ID}}');
    setUtmCampaign('{{CAMPAIGN_ID}}-{{ADGROUP_NAME}}');
    setUtmContent('{{AD_ID}}-{{AD_NAME}}');
    setIncludeUtmContent(true);
    setSelectedParams({});
    setCustomParams([]);
    setLoadedTemplateName('');
    success('Form reset successfully!');
  }, [success]);

  // Load saved templates on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('reddit_ads_templates');
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
    { value: 'optional', label: 'Optional Additional Tracking' }
  ];

  // Get category badge color
  const getCategoryBadge = (category: string) => {
    const badges = {
      optional: { variant: 'warning' as const, label: 'Optional' }
    };
    
    const badge = badges[category as keyof typeof badges];
    return badge ? <Badge variant={badge.variant} size="sm">{badge.label}</Badge> : null;
  };

  return (
    <div className="space-y-8">
      {/* Video Tutorial Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-orange-900 dark:text-orange-100 mb-1 flex items-center gap-2">
              <Play className="w-4 h-4" />
              Reddit Ads Parameter Builder
            </h3>
            <p className="text-orange-700 dark:text-orange-300 text-xs">
              Generate URL parameter strings using Reddit's recommended UTM mapping
            </p>
          </div>
          <Button
            onClick={() => setShowVideoModal(true)}
            icon={Play}
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
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
              <h3 className="text-lg font-semibold">Reddit Ads Parameter Tutorial</h3>
              <Button onClick={() => setShowVideoModal(false)} variant="ghost" icon={X} size="sm" />
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    Reddit Ads Parameter Tutorial Placeholder
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Replace with your Reddit Ads parameter tutorial video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reddit-Recommended UTM Parameters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Reddit-Recommended UTM Parameters
          </h3>
          <Badge variant="success" size="sm">Official Mapping</Badge>
        </div>

        {/* Reddit Recommendation Notice */}
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Reddit's Official UTM Mapping</p>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                This configuration follows Reddit's recommended UTM parameter mapping for optimal campaign tracking and analysis.
              </p>
            </div>
          </div>
        </div>

        {/* REQUIRED UTM PARAMETERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Campaign Source (utm_source) *
            </label>
            <Dropdown
              options={sourceOptions}
              value={utmSource}
              onChange={setUtmSource}
              placeholder="reddit"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <strong>Purpose:</strong> Identifies Reddit as the traffic source
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
              placeholder="{{ADVERTISER_ID}}"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <strong>Purpose:</strong> Represents the advertiser (ad account)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Campaign Name (utm_campaign) *
            </label>
            <Dropdown
              options={campaignOptions}
              value={utmCampaign}
              onChange={setUtmCampaign}
              placeholder="{{CAMPAIGN_ID}}-{{ADGROUP_NAME}}"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <strong>Purpose:</strong> Combines campaign ID with ad group name
            </p>
          </div>

          {/* UTM Content - Optional but recommended */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="include-utm-content"
                checked={includeUtmContent}
                onChange={(e) => handleUtmContentToggle(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="include-utm-content" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Campaign Content (utm_content)
              </label>
            </div>
            <Dropdown
              options={contentOptions}
              value={utmContent}
              onChange={setUtmContent}
              placeholder="{{AD_ID}}-{{AD_NAME}}"
              searchable
              clearable
              allowCustom
              groupByCategory
              disabled={!includeUtmContent}
              className={`w-full ${!includeUtmContent ? 'opacity-50' : ''}`}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <strong>Purpose:</strong> Combines ad ID with ad name to track creatives
            </p>
          </div>
        </div>
      </div>

      {/* Generated Parameter String */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border-2 border-orange-200 dark:border-orange-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-orange-900 dark:text-orange-100 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Generated Reddit Ads Parameter String
          </h2>
          <Button
            onClick={copyToClipboard}
            disabled={!generatedString}
            icon={copiedString ? Check : Copy}
            variant={copiedString ? 'success' : 'primary'}
            size="lg"
          >
            {copiedString ? 'Copied!' : 'Copy Parameters'}
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-orange-200 dark:border-orange-700 shadow-inner">
          <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
            {generatedString || 'Configure parameters to generate string...'}
          </code>
        </div>
        
        {/* Example URL Section */}
        <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Example URL using Reddit's recommended values:</p>
              <code className="text-xs text-orange-700 dark:text-orange-300 mt-1 block bg-orange-200 dark:bg-orange-800/30 p-2 rounded">
                https://example.com/product123?utm_source=reddit&utm_medium={'{{ADVERTISER_ID}}'}&utm_campaign={'{{CAMPAIGN_ID}}'}-{'{{ADGROUP_NAME}}'}&utm_content={'{{AD_ID}}'}-{'{{AD_NAME}}'}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Additional Tracking Parameters */}
      <Accordion 
        title="Optional Additional Tracking Parameters" 
        icon={<Target className="w-5 h-5" />}
        defaultOpen={false}
      >
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Settings className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">For Deeper Analysis</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Although Reddit doesn't officially map these to UTMs, you can optionally include the following for deeper analysis (e.g., in BigQuery or custom dashboards).
              </p>
            </div>
          </div>
        </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParams.map(param => (
            <div key={param.id} className="flex items-start space-x-3 p-4 border border-yellow-200 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
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
                className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <label htmlFor={param.id} className="block text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                    {param.label}
                  </label>
                  {getCategoryBadge(param.category)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {param.description}
                </p>
                <div className="space-y-1">
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block">
                    {param.value}
                  </code>
                  <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                    {param.availability}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Example: {param.example}
                  </div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 italic">
                    Note: {param.note}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredParams.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No parameters found matching your search criteria</p>
          </div>
        )}
      </Accordion>

      {/* Custom Parameters */}
      <Accordion 
        title="Additional Custom Parameters" 
        icon={<Settings className="w-5 h-5" />}
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
                    placeholder="e.g., {{CUSTOM_VALUE}}"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                tooltip="Delete selected template"
              >
                Delete
              </Button>
              <Button onClick={resetFields} variant="secondary" icon={RefreshCw} size="sm">
                Reset
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Export/Import</h3>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  const exportData = {
                    templates: savedTemplates,
                    exportedAt: new Date().toISOString(),
                    platform: 'reddit',
                    version: '1.0'
                  };
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `reddit-ads-templates-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  success('Templates exported successfully!');
                }}
                icon={Download} 
                size="sm"
                disabled={Object.keys(savedTemplates).length === 0}
                className="w-full"
              >
                Export Templates
              </Button>
              
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const importData = JSON.parse(event.target?.result as string);
                          if (importData.templates && typeof importData.templates === 'object') {
                            const newTemplates = { ...savedTemplates, ...importData.templates };
                            setSavedTemplates(newTemplates);
                            localStorage.setItem('reddit_ads_templates', JSON.stringify(newTemplates));
                            success(`Templates imported successfully!`);
                          } else {
                            error('Invalid template file format');
                          }
                        } catch (err) {
                          error('Failed to import templates. Please check the file format.');
                        }
                      };
                      reader.readAsText(file);
                    }
                    // Reset the input
                    e.target.value = '';
                  }}
                  className="hidden"
                  id="import-templates-reddit"
                />
                <Button
                  onClick={() => document.getElementById('import-templates-reddit')?.click()}
                  icon={Upload}
                  size="sm"
                  variant="secondary"
                  className="w-full"
                >
                  Import Templates
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* LOADED TEMPLATE PREVIEW */}
        {loadedTemplateName && generatedString && (
          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                📋 Loaded Template: "{loadedTemplateName}"
              </h4>
              <Button
                onClick={copyCurrentTemplate}
                variant="secondary"
                size="sm"
                icon={Copy}
                className="text-orange-600 hover:text-orange-700"
              >
                Copy String
              </Button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
              <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                {generatedString}
              </code>
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-2">
              ✅ Template loaded successfully! This shows the current generated parameter string.
            </p>
          </div>
        )}
      </Accordion>

      {/* Help Section */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3">
          Reddit Ads Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
            <a href="https://advertising.reddithelp.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>📖</span> Reddit Ads Help Center
            </a>
            <a href="https://advertising.reddithelp.com/en/categories/campaign-management/tracking-and-attribution" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>🔗</span> Tracking & Attribution
            </a>
          </div>
          <div className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
            <button onClick={() => setShowVideoModal(true)} className="flex items-center gap-2 hover:underline text-left">
              <Play size={16} /> Watch Tutorial Video
            </button>
            <a href="https://advertising.reddithelp.com/en/categories/campaign-management/conversion-tracking" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>⚙️</span> Conversion Tracking Setup
            </a>
          </div>
        </div>

        {/* Reddit UTM Mapping Reference */}
        <div className="mt-6 p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-3">Reddit's Official UTM Parameter Mapping</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-orange-800 dark:text-orange-200">
            <div><strong>utm_source:</strong> <code className="bg-orange-200 dark:bg-orange-800/30 px-1 rounded">reddit</code> - Identifies Reddit as traffic source</div>
            <div><strong>utm_medium:</strong> <code className="bg-orange-200 dark:bg-orange-800/30 px-1 rounded">{'{{ADVERTISER_ID}}'}</code> - Represents the advertiser (ad account)</div>
            <div><strong>utm_campaign:</strong> <code className="bg-orange-200 dark:bg-orange-800/30 px-1 rounded">{'{{CAMPAIGN_ID}}'}-{'{{ADGROUP_NAME}}'}</code> - Combines campaign ID with ad group name</div>
            <div><strong>utm_content:</strong> <code className="bg-orange-200 dark:bg-orange-800/30 px-1 rounded">{'{{AD_ID}}'}-{'{{AD_NAME}}'}</code> - Combines ad ID with ad name to track creatives</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedditBuilder;