import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Search, X, Save, Download, Upload, Play, RefreshCw, Plus, Trash2, Globe, Settings, Target } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Accordion from '../common/Accordion';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';

const TikTokBuilder: React.FC = () => {
  const [utmSource, setUtmSource] = useState('tiktok');
  const [utmMedium, setUtmMedium] = useState('paid');
  const [utmCampaign, setUtmCampaign] = useState('__CAMPAIGN_NAME__');
  const [utmId, setUtmId] = useState('__CAMPAIGN_ID__');
  const [utmContent, setUtmContent] = useState('__CID_NAME__');
  
  // Individual optional parameter toggles
  const [includeUtmContent, setIncludeUtmContent] = useState(true);
  
  // TikTok-specific parameters
  const [selectedParams, setSelectedParams] = useState<Record<string, boolean>>({});
  
  const [customParams, setCustomParams] = useState<Array<{key: string, value: string}>>([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Copy states for individual fields
  const [copiedFields, setCopiedFields] = useState<Record<string, boolean>>({});
  
  const { success, error } = useToast();

  // TikTok-specific source options
  const sourceOptions = useMemo(() => [
    { 
      value: 'tiktok', 
      label: 'tiktok', 
      category: 'Static Sources',
      description: 'TikTok platform traffic - Use for static source tracking'
    },
    { 
      value: '__PLACEMENT__', 
      label: '__PLACEMENT__', 
      category: 'Dynamic Sources',
      description: 'Placement type (TikTok, TikTok Pangle) - Official TikTok macro'
    }
  ], []);

  // TikTok-specific medium options
  const mediumOptions = useMemo(() => [
    { 
      value: 'paid', 
      label: 'paid', 
      category: 'Standard Mediums',
      description: 'General paid traffic - Recommended for TikTok ads'
    },
    { 
      value: 'paid_social', 
      label: 'paid_social', 
      category: 'Standard Mediums',
      description: 'Paid social media traffic - Alternative for TikTok ads'
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

  // TikTok-specific campaign options (using official macros)
  const campaignOptions = useMemo(() => [
    { 
      value: '__CAMPAIGN_NAME__', 
      label: '__CAMPAIGN_NAME__', 
      category: 'Campaign Info',
      description: 'Name of the Campaign - Official TikTok macro'
    },
    { 
      value: '__CAMPAIGN_ID__', 
      label: '__CAMPAIGN_ID__', 
      category: 'Campaign Info',
      description: 'Campaign ID - Official TikTok macro'
    }
  ], []);
    
  // TikTok-specific content options (using official macros)
  const contentOptions = useMemo(() => [
    { 
      value: '__CID_NAME__', 
      label: '__CID_NAME__', 
      category: 'Creative Level',
      description: 'Name of the Creative - Official TikTok macro'
    },
    { 
      value: '__CID__', 
      label: '__CID__', 
      category: 'Creative Level',
      description: 'Creative ID - Official TikTok macro'
    },
    { 
      value: '__AID_NAME__', 
      label: '__AID_NAME__', 
      category: 'Ad Group Level',
      description: 'Name of the Ad Group - Official TikTok macro'
    },
    { 
      value: '__AID__', 
      label: '__AID__', 
      category: 'Ad Group Level',
      description: 'Ad Group ID - Official TikTok macro'
    }
  ], []);

  // TikTok's Official Macros (excluding those mapped to UTM parameters)
  const tiktokParams = useMemo(() => [
    // Only include macros NOT mapped to UTM parameters
    { 
      id: 'aid_name', 
      value: '__AID_NAME__', 
      label: 'Ad Group Name', 
      category: 'adgroup', 
      description: 'Name of the Ad Group',
      availability: 'All TikTok campaigns',
      example: 'Shoes_Interest_Group_A'
    },
    { 
      id: 'aid', 
      value: '__AID__', 
      label: 'Ad Group ID', 
      category: 'adgroup', 
      description: 'Ad Group ID',
      availability: 'All TikTok campaigns',
      example: '1234567890123456789'
    },
    { 
      id: 'cid', 
      value: '__CID__', 
      label: 'Creative ID', 
      category: 'creative', 
      description: 'Creative ID',
      availability: 'All TikTok campaigns',
      example: '9876543210987654321'
    },
    { 
      id: 'placement', 
      value: '__PLACEMENT__', 
      label: 'Placement', 
      category: 'placement', 
      description: 'Placement type (TikTok, TikTok Pangle)',
      availability: 'All TikTok campaigns',
      example: 'TikTok, TikTok Pangle'
    }
  ], []);

  // Filter parameters based on search and category
  const filteredParams = useMemo(() => {
    return tiktokParams.filter(param => {
      const matchesSearch = param.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.availability.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || param.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tiktokParams, searchTerm, selectedCategory]);

  // Handle individual optional parameter toggles with default value restoration
  const handleUtmContentToggle = useCallback((enabled: boolean) => {
    setIncludeUtmContent(enabled);
    
    // If enabling and field is empty, restore default
    if (enabled && !utmContent.trim()) {
      setUtmContent('__CID_NAME__');
    }
  }, [utmContent]);

  // Copy individual field (parameter name or value)
  const copyField = async (fieldType: 'name' | 'value', paramName: string, value: string) => {
    try {
      const textToCopy = fieldType === 'name' ? paramName : value;
      await navigator.clipboard.writeText(textToCopy);
      
      const fieldKey = `${paramName}_${fieldType}`;
      setCopiedFields(prev => ({ ...prev, [fieldKey]: true }));
      setTimeout(() => {
        setCopiedFields(prev => ({ ...prev, [fieldKey]: false }));
      }, 2000);
      
      success(`${fieldType === 'name' ? 'Parameter name' : 'Parameter value'} copied!`);
    } catch (err) {
      error(`Failed to copy ${fieldType}`);
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
      utmSource, utmMedium, utmCampaign, utmId, utmContent,
      includeUtmContent,
      selectedParams, customParams, timestamp: Date.now()
    };
    
    const newTemplates = { ...savedTemplates, [templateName]: template };
    setSavedTemplates(newTemplates);
    localStorage.setItem('tiktok_ads_templates', JSON.stringify(newTemplates));
    
    success(`Template "${templateName}" saved successfully!`);
    setTemplateName('');
  }, [templateName, utmSource, utmMedium, utmCampaign, utmId, utmContent, includeUtmContent, selectedParams, customParams, savedTemplates, success, error]);

  const loadTemplate = useCallback(() => {
    if (!selectedTemplate || !savedTemplates[selectedTemplate]) {
      error('Please select a template to load');
      return;
    }
    
    const template = savedTemplates[selectedTemplate];
    setUtmSource(template.utmSource);
    setUtmMedium(template.utmMedium);
    setUtmCampaign(template.utmCampaign);
    setUtmId(template.utmId);
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
    localStorage.setItem('tiktok_ads_templates', JSON.stringify(newTemplates));
    
    // Clear selection and loaded template if it was the deleted one
    setSelectedTemplate('');
    if (loadedTemplateName === templateToDelete) {
      setLoadedTemplateName('');
    }
    
    success(`Template "${templateToDelete}" deleted successfully!`);
  }, [selectedTemplate, savedTemplates, loadedTemplateName, success, error]);

  // Reset all fields
  const resetFields = useCallback(() => {
    setUtmSource('tiktok');
    setUtmMedium('paid_social');
    setUtmCampaign('__CAMPAIGN_NAME__');
    setUtmId('__CAMPAIGN_ID__');
    setUtmContent('__CID_NAME__');
    setIncludeUtmContent(true);
    setSelectedParams({});
    setCustomParams([]);
    setLoadedTemplateName('');
    success('Form reset successfully!');
  }, [success]);

  // Load saved templates on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('tiktok_ads_templates');
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
    { value: 'adgroup', label: 'Ad Group Level' },
    { value: 'creative', label: 'Creative Level' },
    { value: 'placement', label: 'Placement' }
  ];

  // Get category badge color
  const getCategoryBadge = (category: string) => {
    const badges = {
      adgroup: { variant: 'success' as const, label: 'Ad Group' },
      creative: { variant: 'warning' as const, label: 'Creative' },
      placement: { variant: 'info' as const, label: 'Placement' }
    };
    
    const badge = badges[category as keyof typeof badges];
    return badge ? <Badge variant={badge.variant} size="sm">{badge.label}</Badge> : null;
  };

  return (
    <div className="space-y-8">
      {/* Video Tutorial Section */}
      <div className="bg-gradient-to-r from-black to-pink-100 dark:from-gray-900 dark:to-pink-900/20 rounded-lg p-4 border border-gray-800 dark:border-pink-800">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white dark:text-pink-100 mb-1 flex items-center gap-2">
              <Play className="w-4 h-4" />
              TikTok Ads Parameter Builder
            </h3>
            <p className="text-gray-200 dark:text-pink-300 text-xs">
              Generate individual UTM parameters for TikTok's URL parameter fields
            </p>
          </div>
          <Button
            onClick={() => setShowVideoModal(true)}
            icon={Play}
            size="sm"
            className="bg-pink-600 hover:bg-pink-700 text-white shadow-lg"
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
              <h3 className="text-lg font-semibold">TikTok Ads Parameter Tutorial</h3>
              <Button onClick={() => setShowVideoModal(false)} variant="ghost" icon={X} size="sm" />
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    TikTok Ads Parameter Tutorial Placeholder
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Replace with your TikTok Ads parameter tutorial video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UTM Parameter Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            UTM Parameters (Using TikTok Official Macros)
          </h3>
          <Badge variant="info" size="sm">TikTok Format</Badge>
        </div>

        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">TikTok URL Parameters Format</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                Configure your UTM parameters below. TikTok allows "Select a dynamic parameter or enter a value" for all UTM fields.
              </p>
            </div>
          </div>
        </div>

        {/* UTM Parameter Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Campaign Source (utm_source) *
            </label>
            <Dropdown
              options={sourceOptions}
              value={utmSource}
              onChange={setUtmSource}
              placeholder="Select or enter value"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              To identify the source of traffic, for example, TikTok
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
              placeholder="Select or enter value"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              To identify the advertising medium, for example, paid
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
              placeholder="Select or enter value"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              To identify a specific campaign
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Campaign ID (utm_id) *
            </label>
            <Input
              value={utmId}
              onChange={(e) => setUtmId(e.target.value)}
              placeholder="__CAMPAIGN_ID__"
              helperText="Uses TikTok's __CAMPAIGN_ID__ macro"
            />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="include-utm-content"
                checked={includeUtmContent}
                onChange={(e) => handleUtmContentToggle(e.target.checked)}
                className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
              />
              <label htmlFor="include-utm-content" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Campaign Content (utm_content)
              </label>
            </div>
            <Dropdown
              options={contentOptions}
              value={utmContent}
              onChange={setUtmContent}
              placeholder="Select or enter value"
              searchable
              clearable
              allowCustom
              groupByCategory
              disabled={!includeUtmContent}
              className={`w-full ${!includeUtmContent ? 'opacity-50' : ''}`}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              To differentiate contents within a campaign that link to the same URL
            </p>
          </div>
        </div>
      </div>

      {/* TikTok Individual Parameter Fields - COMPACT ALIGNED DESIGN */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            TikTok URL Parameters Format
          </h3>
        </div>

        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg">
          <p className="text-sm text-gray-800 dark:text-gray-200">
            Copy individual parameter names and values to paste into TikTok's "Edit URL Parameters" interface.
          </p>
        </div>

        {/* COMPACT ALIGNED PARAMETER FIELDS */}
        <div className="space-y-4">
          {/* Campaign source */}
          <div className="space-y-3 md:grid md:grid-cols-12 md:gap-3 md:items-center md:space-y-0">
            <div className="md:col-span-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Campaign source (utm_source)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">To identify the source of traffic, for example, TikTok</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:col-span-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">Parameter:</span>
              <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border text-center">
                utm_source
              </code>
              <Button
                onClick={() => copyField('name', 'utm_source', utmSource)}
                variant="ghost"
                size="sm"
                icon={copiedFields['utm_source_name'] ? Check : Copy}
                className="text-xs px-2 flex-shrink-0"
              >
                {copiedFields['utm_source_name'] ? '✓' : 'Copy'}
              </Button>
            </div>
            <div className="flex items-center gap-2 md:col-span-5">
              <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">Value:</span>
              <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-center">
                {utmSource}
              </code>
              <Button
                onClick={() => copyField('value', 'utm_source', utmSource)}
                variant="ghost"
                size="sm"
                icon={copiedFields['utm_source_value'] ? Check : Copy}
                className="text-xs px-2 flex-shrink-0"
              >
                {copiedFields['utm_source_value'] ? '✓' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Campaign medium */}
          <div className="space-y-3 md:grid md:grid-cols-12 md:gap-3 md:items-center md:space-y-0">
            <div className="md:col-span-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Campaign medium (utm_medium)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">To identify the advertising medium, for example, paid_social</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:col-span-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">Parameter:</span>
              <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border text-center">
                utm_medium
              </code>
              <Button
                onClick={() => copyField('name', 'utm_medium', utmMedium)}
                variant="ghost"
                size="sm"
                icon={copiedFields['utm_medium_name'] ? Check : Copy}
                className="text-xs px-2 flex-shrink-0"
              >
                {copiedFields['utm_medium_name'] ? '✓' : 'Copy'}
              </Button>
            </div>
            <div className="flex items-center gap-2 md:col-span-5">
              <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">Value:</span>
              <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-center">
                {utmMedium}
              </code>
              <Button
                onClick={() => copyField('value', 'utm_medium', utmMedium)}
                variant="ghost"
                size="sm"
                icon={copiedFields['utm_medium_value'] ? Check : Copy}
                className="text-xs px-2 flex-shrink-0"
              >
                {copiedFields['utm_medium_value'] ? '✓' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Campaign name */}
          <div className="space-y-3 md:grid md:grid-cols-12 md:gap-3 md:items-center md:space-y-0">
            <div className="md:col-span-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Campaign name (utm_campaign)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">To identify a specific campaign</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:col-span-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">Parameter:</span>
              <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border text-center">
                utm_campaign
              </code>
              <Button
                onClick={() => copyField('name', 'utm_campaign', utmCampaign)}
                variant="ghost"
                size="sm"
                icon={copiedFields['utm_campaign_name'] ? Check : Copy}
                className="text-xs px-2 flex-shrink-0"
              >
                {copiedFields['utm_campaign_name'] ? '✓' : 'Copy'}
              </Button>
            </div>
            <div className="flex items-center gap-2 md:col-span-5">
              <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">Value:</span>
              <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-center">
                {utmCampaign}
              </code>
              <Button
                onClick={() => copyField('value', 'utm_campaign', utmCampaign)}
                variant="ghost"
                size="sm"
                icon={copiedFields['utm_campaign_value'] ? Check : Copy}
                className="text-xs px-2 flex-shrink-0"
              >
                {copiedFields['utm_campaign_value'] ? '✓' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Campaign ID */}
          <div className="space-y-3 md:grid md:grid-cols-12 md:gap-3 md:items-center md:space-y-0">
            <div className="md:col-span-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Campaign ID (utm_id)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Uses TikTok's __CAMPAIGN_ID__ macro</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:col-span-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">Parameter:</span>
              <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border text-center">
                utm_id
              </code>
              <Button
                onClick={() => copyField('name', 'utm_id', utmId)}
                variant="ghost"
                size="sm"
                icon={copiedFields['utm_id_name'] ? Check : Copy}
                className="text-xs px-2 flex-shrink-0"
              >
                {copiedFields['utm_id_name'] ? '✓' : 'Copy'}
              </Button>
            </div>
            <div className="flex items-center gap-2 md:col-span-5">
              <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">Value:</span>
              <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-center">
                {utmId}
              </code>
              <Button
                onClick={() => copyField('value', 'utm_id', utmId)}
                variant="ghost"
                size="sm"
                icon={copiedFields['utm_id_value'] ? Check : Copy}
                className="text-xs px-2 flex-shrink-0"
              >
                {copiedFields['utm_id_value'] ? '✓' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Campaign content - Only show if enabled */}
          {includeUtmContent && (
            <div className="space-y-3 md:grid md:grid-cols-12 md:gap-3 md:items-center md:space-y-0">
              <div className="md:col-span-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Campaign content (utm_content)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">To differentiate contents within a campaign that link to the same URL</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:col-span-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">Parameter:</span>
                <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border text-center">
                  utm_content
                </code>
                <Button
                  onClick={() => copyField('name', 'utm_content', utmContent)}
                  variant="ghost"
                  size="sm"
                  icon={copiedFields['utm_content_name'] ? Check : Copy}
                  className="text-xs px-2 flex-shrink-0"
                >
                  {copiedFields['utm_content_name'] ? '✓' : 'Copy'}
                </Button>
              </div>
              <div className="flex items-center gap-2 md:col-span-5">
                <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">Value:</span>
                <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-center">
                  {utmContent}
                </code>
                <Button
                  onClick={() => copyField('value', 'utm_content', utmContent)}
                  variant="ghost"
                  size="sm"
                  icon={copiedFields['utm_content_value'] ? Check : Copy}
                  className="text-xs px-2 flex-shrink-0"
                >
                  {copiedFields['utm_content_value'] ? '✓' : 'Copy'}
                </Button>
              </div>
            </div>
          )}

          {/* Selected TikTok Parameters */}
          {Object.entries(selectedParams).some(([_, isSelected]) => isSelected) && (
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4 md:col-span-2">
              <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Selected TikTok Parameters
              </h5>
              <div className="space-y-3">
                {Object.entries(selectedParams)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([paramId, _]) => {
                  const param = tiktokParams.find(p => p.id === paramId);
                  if (!param) return null;

                  return (
                    <div key={paramId} className="space-y-3 md:grid md:grid-cols-12 md:gap-3 md:items-center md:space-y-0 py-2">
                      <div className="md:col-span-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{param.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{param.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:col-span-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">Parameter:</span>
                        <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border text-center">
                          {paramId}
                        </code>
                        <Button
                          onClick={() => copyField('name', paramId, param.value)}
                          variant="ghost"
                          size="sm"
                          icon={copiedFields[`${paramId}_name`] ? Check : Copy}
                          className="text-xs px-2 flex-shrink-0"
                        >
                          {copiedFields[`${paramId}_name`] ? '✓' : 'Copy'}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 md:col-span-5">
                        <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">Value:</span>
                        <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-center">
                          {param.value}
                        </code>
                        <Button
                          onClick={() => copyField('value', paramId, param.value)}
                          variant="ghost"
                          size="sm"
                          icon={copiedFields[`${paramId}_value`] ? Check : Copy}
                          className="text-xs px-2 flex-shrink-0"
                        >
                          {copiedFields[`${paramId}_value`] ? '✓' : 'Copy'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TikTok Official Macros */}
      <Accordion 
        title="TikTok Official Macros" 
        icon={<Target className="w-5 h-5" />}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParams.map(param => (
            <div key={param.id} className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/20 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/30 transition-colors">
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
                className="mt-1 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <label htmlFor={param.id} className="block text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                    {param.label}
                  </label>
                  {getCategoryBadge(param.category)}
                  <Badge variant="success" size="sm">Official Macro</Badge>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {param.description}
                </p>
                <div className="space-y-1">
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block">
                    {param.value}
                  </code>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
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
                    placeholder="e.g., __CUSTOM_VALUE__"
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


    </div>
  );
};

export default TikTokBuilder;