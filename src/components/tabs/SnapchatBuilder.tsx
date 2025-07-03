import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Search, X, Save, Download, Upload, Play, RefreshCw, Plus, Trash2, Zap, Globe, Settings, Target } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Accordion from '../common/Accordion';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';

const SnapchatBuilder: React.FC = () => {
  const [utmSource, setUtmSource] = useState('snapchat');
  const [utmMedium, setUtmMedium] = useState('paid_social');
  const [utmCampaign, setUtmCampaign] = useState('{{campaign.name}}');
  const [utmContent, setUtmContent] = useState('{{ad.name}}');
  
  // Individual optional parameter toggles
  const [includeUtmContent, setIncludeUtmContent] = useState(true);
  
  // Snapchat-specific parameters
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

  // Snapchat-specific source options
  const sourceOptions = useMemo(() => [
    { 
      value: 'snapchat', 
      label: 'snapchat', 
      category: 'Static Sources',
      description: 'Snapchat platform traffic - Use for static source tracking'
    },
    { 
      value: '{{site_source_name}}', 
      label: '{{site_source_name}}', 
      category: 'Dynamic Sources',
      description: 'Source placement (e.g., publisher/app name) - Official Snapchat macro'
    }
  ], []);

  // Snapchat-specific medium options
  const mediumOptions = useMemo(() => [
    { 
      value: 'paid_social', 
      label: 'paid_social', 
      category: 'Standard Mediums',
      description: 'Paid social media traffic - Recommended for Snapchat ads'
    },
    { 
      value: 'paid', 
      label: 'paid', 
      category: 'Standard Mediums',
      description: 'General paid traffic - Common for Snapchat ads'
    },
    { 
      value: 'cpc', 
      label: 'cpc', 
      category: 'Standard Mediums',
      description: 'Cost per click campaigns - Traditional PPC tracking'
    },
    { 
      value: 'social', 
      label: 'social', 
      category: 'Standard Mediums',
      description: 'Social media traffic - Organic social classification'
    }
  ], []);

  // Snapchat-specific campaign options (using official macros)
  const campaignOptions = useMemo(() => [
    { 
      value: '{{campaign.name}}', 
      label: '{{campaign.name}}', 
      category: 'Campaign Info',
      description: 'Campaign name - Official Snapchat macro'
    },
    { 
      value: '{{campaign.id}}', 
      label: '{{campaign.id}}', 
      category: 'Campaign Info',
      description: 'Unique identifier for the campaign - Official Snapchat macro'
    }
  ], []);
    
  // Snapchat-specific content options (using official macros)
  const contentOptions = useMemo(() => [
    { 
      value: '{{ad.name}}', 
      label: '{{ad.name}}', 
      category: 'Ad Level',
      description: 'Name of the ad or creative - Official Snapchat macro'
    },
    { 
      value: '{{ad.id}}', 
      label: '{{ad.id}}', 
      category: 'Ad Level',
      description: 'Identifier for the individual ad - Official Snapchat macro'
    },
    { 
      value: '{{adSet.name}}', 
      label: '{{adSet.name}}', 
      category: 'Ad Set Level',
      description: 'Name of the ad set - Official Snapchat macro'
    },
    { 
      value: '{{adSet.id}}', 
      label: '{{adSet.id}}', 
      category: 'Ad Set Level',
      description: 'Identifier for the ad set (ad group) - Official Snapchat macro'
    },
    { 
      value: '{{creative.name}}', 
      label: '{{creative.name}}', 
      category: 'Creative Level',
      description: 'Name of the creative asset - Official Snapchat macro'
    },
    { 
      value: '{{creative.id}}', 
      label: '{{creative.id}}', 
      category: 'Creative Level',
      description: 'ID of the creative asset - Official Snapchat macro'
    }
  ], []);

  // Snapchat's 14 Official Dynamic URL Macros (from your table)
  const snapchatParams = useMemo(() => [
    // Campaign Level Parameters - Official Snapchat Macros
    { 
      id: 'campaign_id', 
      value: '{{campaign.id}}', 
      label: 'Campaign ID', 
      category: 'campaign', 
      description: 'Unique identifier for the campaign',
      availability: 'All Snapchat campaigns',
      example: '12345678-1234-1234-1234-123456789012',
      isOfficial: true
    },
    { 
      id: 'campaign_name', 
      value: '{{campaign.name}}', 
      label: 'Campaign Name', 
      category: 'campaign', 
      description: 'Campaign name',
      availability: 'All Snapchat campaigns',
      example: 'Summer_Launch_2025',
      isOfficial: true
    },
    
    // Ad Set Level Parameters - Official Snapchat Macros
    { 
      id: 'adset_id', 
      value: '{{adSet.id}}', 
      label: 'Ad Set ID', 
      category: 'adset', 
      description: 'Identifier for the ad set (ad group)',
      availability: 'All Snapchat campaigns',
      example: '87654321-4321-4321-4321-210987654321',
      isOfficial: true
    },
    { 
      id: 'adset_name', 
      value: '{{adSet.name}}', 
      label: 'Ad Set Name', 
      category: 'adset', 
      description: 'Name of the ad set',
      availability: 'All Snapchat campaigns',
      example: 'Gen_Z_Interests_18-24',
      isOfficial: true
    },
    
    // Ad Level Parameters - Official Snapchat Macros
    { 
      id: 'ad_id', 
      value: '{{ad.id}}', 
      label: 'Ad ID', 
      category: 'ad', 
      description: 'Identifier for the individual ad',
      availability: 'All Snapchat campaigns',
      example: '11223344-5566-7788-9900-112233445566',
      isOfficial: true
    },
    { 
      id: 'ad_name', 
      value: '{{ad.name}}', 
      label: 'Ad Name', 
      category: 'ad', 
      description: 'Name of the ad or creative',
      availability: 'All Snapchat campaigns',
      example: 'Video_Creative_A_Summer',
      isOfficial: true
    },
    
    // Creative Level Parameters - Official Snapchat Macros
    { 
      id: 'creative_id', 
      value: '{{creative.id}}', 
      label: 'Creative ID', 
      category: 'creative', 
      description: 'ID of the creative asset',
      availability: 'All Snapchat campaigns',
      example: '99887766-5544-3322-1100-998877665544',
      isOfficial: true
    },
    { 
      id: 'creative_name', 
      value: '{{creative.name}}', 
      label: 'Creative Name', 
      category: 'creative', 
      description: 'Name of the creative asset',
      availability: 'All Snapchat campaigns',
      example: 'Summer_Video_Creative_A',
      isOfficial: true
    },
    
    // Placement & Source Parameters - Official Snapchat Macros
    { 
      id: 'site_source_name', 
      value: '{{site_source_name}}', 
      label: 'Site Source Name', 
      category: 'placement', 
      description: 'Source placement (e.g., publisher/app name)',
      availability: 'All Snapchat campaigns',
      example: 'snapchat_app, discover_feed',
      isOfficial: true
    },
    
    // Device & Location Parameters - Official Snapchat Macros
    { 
      id: 'device_os', 
      value: '{{device_os}}', 
      label: 'Device OS', 
      category: 'device', 
      description: 'Device operating system (e.g., iOS, Android)',
      availability: 'All Snapchat campaigns',
      example: 'iOS, Android',
      isOfficial: true
    },
    { 
      id: 'device_type', 
      value: '{{device_type}}', 
      label: 'Device Type', 
      category: 'device', 
      description: 'Type of device (e.g., iPhone, Android)',
      availability: 'All Snapchat campaigns',
      example: 'iPhone, Samsung Galaxy',
      isOfficial: true
    },
    { 
      id: 'country', 
      value: '{{country}}', 
      label: 'Country', 
      category: 'location', 
      description: 'User\'s country based on IP',
      availability: 'All Snapchat campaigns',
      example: 'US, CA, GB',
      isOfficial: true
    },
    { 
      id: 'language', 
      value: '{{language}}', 
      label: 'Language', 
      category: 'location', 
      description: 'Device language',
      availability: 'All Snapchat campaigns',
      example: 'en, es, fr',
      isOfficial: true
    },
    { 
      id: 'city', 
      value: '{{city}}', 
      label: 'City', 
      category: 'location', 
      description: 'User\'s city based on IP',
      availability: 'All Snapchat campaigns',
      example: 'New York, Los Angeles, London',
      isOfficial: true
    }
  ], []);

  // Filter parameters based on search and category
  const filteredParams = useMemo(() => {
    return snapchatParams.filter(param => {
      const matchesSearch = param.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.availability.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || param.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [snapchatParams, searchTerm, selectedCategory]);

  // Handle individual optional parameter toggles with default value restoration
  const handleUtmContentToggle = useCallback((enabled: boolean) => {
    setIncludeUtmContent(enabled);
    
    // If enabling and field is empty, restore default
    if (enabled && !utmContent.trim()) {
      setUtmContent('{{ad.name}}');
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

    // Add selected Snapchat parameters
    Object.entries(selectedParams).forEach(([paramId, isSelected]) => {
      if (isSelected) {
        const param = snapchatParams.find(p => p.id === paramId);
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
  }, [utmSource, utmMedium, utmCampaign, utmContent, includeUtmContent, selectedParams, customParams, snapchatParams]);

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
    localStorage.setItem('snapchat_ads_templates', JSON.stringify(newTemplates));
    
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
    localStorage.setItem('snapchat_ads_templates', JSON.stringify(newTemplates));
    
    // Clear selection and loaded template if it was the deleted one
    setSelectedTemplate('');
    if (loadedTemplateName === templateToDelete) {
      setLoadedTemplateName('');
    }
    
    success(`Template "${templateToDelete}" deleted successfully!`);
  }, [selectedTemplate, savedTemplates, loadedTemplateName, success, error]);

  // Reset all fields
  const resetFields = useCallback(() => {
    setUtmSource('snapchat');
    setUtmMedium('paid_social');
    setUtmCampaign('{{campaign.name}}');
    setUtmContent('{{ad.name}}');
    setIncludeUtmContent(true);
    setSelectedParams({});
    setCustomParams([]);
    setLoadedTemplateName('');
    success('Form reset successfully!');
  }, [success]);

  // Load saved templates on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('snapchat_ads_templates');
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
    { value: 'adset', label: 'Ad Set Level' },
    { value: 'ad', label: 'Ad Level' },
    { value: 'creative', label: 'Creative Level' },
    { value: 'placement', label: 'Placement & Source' },
    { value: 'device', label: 'Device & OS' },
    { value: 'location', label: 'Location & Language' }
  ];

  // Get category badge color
  const getCategoryBadge = (category: string) => {
    const badges = {
      campaign: { variant: 'info' as const, label: 'Campaign' },
      adset: { variant: 'success' as const, label: 'Ad Set' },
      ad: { variant: 'warning' as const, label: 'Ad' },
      creative: { variant: 'default' as const, label: 'Creative' },
      placement: { variant: 'info' as const, label: 'Placement' },
      device: { variant: 'success' as const, label: 'Device' },
      location: { variant: 'warning' as const, label: 'Location' }
    };
    
    const badge = badges[category as keyof typeof badges];
    return badge ? <Badge variant={badge.variant} size="sm">{badge.label}</Badge> : null;
  };

  return (
    <div className="space-y-8">
      {/* Video Tutorial Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Snapchat Ads Parameter Builder
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              Generate URL parameter strings using Snapchat's official 14 dynamic URL macros
            </p>
          </div>
          <Button
            onClick={() => setShowVideoModal(true)}
            icon={Play}
            className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg"
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
              <h3 className="text-lg font-semibold">Snapchat Ads Parameter Tutorial</h3>
              <Button onClick={() => setShowVideoModal(false)} variant="ghost" icon={X} size="sm" />
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    Snapchat Ads Parameter Tutorial Placeholder
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Replace with your Snapchat Ads parameter tutorial video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UTM Parameters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            UTM Parameters (Using Snapchat Official Macros)
          </h3>
        </div>

        {/* REQUIRED UTM PARAMETERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Campaign Source (utm_source) *
            </label>
            <Dropdown
              options={sourceOptions}
              value={utmSource}
              onChange={setUtmSource}
              placeholder="e.g., snapchat"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Snapchat traffic source identifier
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
              placeholder="e.g., paid_social"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Recommended: paid_social for Snapchat ads
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Campaign Name (utm_campaign) *
            </label>
            <Dropdown
              options={campaignOptions}
              value={utmCampaign}
              onChange={setUtmCampaign}
              placeholder="e.g., {{campaign.name}}"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Uses Snapchat's {'{{campaign.name}}'} macro
            </p>
          </div>
        </div>

        {/* OPTIONAL UTM PARAMETERS */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Optional UTM Parameters (Snapchat Official Macros)
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
            {/* UTM Content */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="include-utm-content"
                  checked={includeUtmContent}
                  onChange={(e) => handleUtmContentToggle(e.target.checked)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <label htmlFor="include-utm-content" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Campaign Content (utm_content)
                </label>
              </div>
              <Dropdown
                options={contentOptions}
                value={utmContent}
                onChange={setUtmContent}
                placeholder="e.g., {{ad.name}}"
                searchable
                clearable
                allowCustom
                groupByCategory
                disabled={!includeUtmContent}
                className={`w-full ${!includeUtmContent ? 'opacity-50' : ''}`}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Uses Snapchat's official macros for content differentiation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Parameter String */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-6 border-2 border-yellow-200 dark:border-yellow-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Generated Snapchat Ads Parameter String
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
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-yellow-200 dark:border-yellow-700 shadow-inner">
          <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
            {generatedString || 'Configure parameters to generate string...'}
          </code>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Settings className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Snapchat Official Macros</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                This string uses Snapchat's official 14 dynamic URL macros. Copy and paste into Snapchat's URL parameters field 
                in your ad campaign setup. Snapchat will automatically replace the macros with actual values.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Snapchat Official Dynamic URL Macros */}
      <Accordion 
        title="Snapchat Official Dynamic URL Macros" 
        icon={<Target className="w-5 h-5" />}
        defaultOpen={true}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParams.map(param => (
            <div key={param.id} className={`flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${param.isOfficial ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-600'}`}>
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
                className="mt-1 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <label htmlFor={param.id} className="block text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                    {param.label}
                  </label>
                  {getCategoryBadge(param.category)}
                  {param.isOfficial && (
                    <Badge variant="success" size="sm">Official Macro</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {param.description}
                </p>
                <div className="space-y-1">
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block">
                    {param.value}
                  </code>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                    {param.availability}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Example: {param.example}
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
                    placeholder="e.g., {{custom.value}}"
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
                tooltip="Delete selected template"
              >
                Delete
              </Button>
              <Button onClick={resetFields} variant="secondary" icon={RefreshCw} size="sm">
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* LOADED TEMPLATE PREVIEW */}
        {loadedTemplateName && generatedString && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                📋 Loaded Template: "{loadedTemplateName}"
              </h4>
              <Button
                onClick={copyCurrentTemplate}
                variant="secondary"
                size="sm"
                icon={Copy}
                className="text-yellow-600 hover:text-yellow-700"
              >
                Copy String
              </Button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700">
              <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                {generatedString}
              </code>
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
              ✅ Template loaded successfully! This shows the current generated parameter string.
            </p>
          </div>
        )}
      </Accordion>

      {/* Help Section */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
          Snapchat Ads Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
            <a href="https://businesshelp.snapchat.com/s/article/snap-pixel-about" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>📖</span> Snap Pixel & Tracking
            </a>
            <a href="https://businesshelp.snapchat.com/s/article/conversion-tracking" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>🔗</span> Conversion Tracking Guide
            </a>
          </div>
          <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
            <button onClick={() => setShowVideoModal(true)} className="flex items-center gap-2 hover:underline text-left">
              <Play size={16} /> Watch Tutorial Video
            </button>
            <a href="https://businesshelp.snapchat.com/s/article/ads-manager" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>⚙️</span> Ads Manager Setup
            </a>
          </div>
        </div>
        
        {/* Snapchat Official Macros Reference */}
        <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
          <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Snapchat's 14 Official Dynamic URL Macros</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-yellow-800 dark:text-yellow-200">
            <div><code className="bg-yellow-200 dark:bg-yellow-800/30 px-2 py-1 rounded">{'{{campaign.id}}'}</code> - Campaign ID</div>
            <div><code className="bg-yellow-200 dark:bg-yellow-800/30 px-2 py-1 rounded">{'{{campaign.name}}'}</code> - Campaign Name</div>
            <div><code className="bg-yellow-200 dark:bg-yellow-800/30 px-2 py-1 rounded">{'{{adSet.id}}'}</code> - Ad Set ID</div>
            <div><code className="bg-yellow-200 dark:bg-yellow-800/30 px-2 py-1 rounded">{'{{adSet.name}}'}</code> - Ad Set Name</div>
            <div><code className="bg-yellow-200 dark:bg-yellow-800/30 px-2 py-1 rounded">{'{{ad.id}}'}</code> - Ad ID</div>
            <div><code className="bg-yellow-200 dark:bg-yellow-800/30 px-2 py-1 rounded">{'{{ad.name}}'}</code> - Ad Name</div>
            <div><code className="bg-yellow-200 dark:bg-yellow-800/30 px-2 py-1 rounded">{'{{creative.id}}'}</code> - Creative ID</div>
            <div><code className="bg-yellow-200 dark:bg-yellow-800/30 px-2 py-1 rounded">{'{{creative.name}}'}</code> - Creative Name</div>
            <div><code className="bg-yellow-200 dark:bg-yellow-800/30 px-2 py-1 rounded">{'{{site_source_name}}'}</code> - Source Placement</div>
            <div><code className="bg-yellow-200 dark:bg-yellow-800/30 px-2 py-1 rounded">{'{{device_os}}'}</code> - Device OS</div>
            <div><code className="bg-yellow-200 dark:bg-yellow-800/30 px-2 py-1 rounded">{'{{device_type}}'}</code> - Device Type</div>
            <div><code className="bg-yellow-200 dark:bg-yellow-800/30 px-2 py-1 rounded">{'{{country}}'}</code> - User Country</div>
            <div><code className="bg-yellow-200 dark:bg-yellow-800/30 px-2 py-1 rounded">{'{{language}}'}</code> - Device Language</div>
            <div><code className="bg-yellow-200 dark:bg-yellow-800/30 px-2 py-1 rounded">{'{{city}}'}</code> - User City</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnapchatBuilder;