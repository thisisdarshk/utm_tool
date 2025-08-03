import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Search, X, Save, Download, Upload, Play, RefreshCw, Plus, Trash2, Zap, Globe, Settings, Target } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Accordion from '../common/Accordion';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';

const PinterestBuilder: React.FC = () => {
  const [utmSource, setUtmSource] = useState('pinterest');
  const [utmMedium, setUtmMedium] = useState('PaidSocial');
  const [utmCampaign, setUtmCampaign] = useState('{campaignid}');
  const [utmContent, setUtmContent] = useState('{adgroupid}');
  const [utmTerm, setUtmTerm] = useState('');
  
  // Individual optional parameter toggles - REMOVED UTM_TERM
  const [includeUtmContent, setIncludeUtmContent] = useState(true);
  const [includeUtmTerm, setIncludeUtmTerm] = useState(false);
  
  // Pinterest-specific parameters
  const [selectedParams, setSelectedParams] = useState<Record<string, boolean>>({});
  
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedTemplates, setSavedTemplates] = useState<Record<string, any>>({});
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loadedTemplateName, setLoadedTemplateName] = useState('');
  
  // Copy states for individual fields
  const [copiedFields, setCopiedFields] = useState<Record<string, boolean>>({});
  
  const { success, error } = useToast();

  // Pinterest-specific source options
  const sourceOptions = useMemo(() => [
    { 
      value: 'pinterest', 
      label: 'pinterest', 
      category: 'Pinterest Documented',
      description: 'Pinterest platform - Static value'
    }
  ], []);

  // Pinterest-specific medium options
  const mediumOptions = useMemo(() => [
    { 
      value: 'PaidSocial', 
      label: 'PaidSocial', 
      category: 'Pinterest Documented',
      description: 'Pinterest documented medium for paid social traffic'
    }
  ], []);

  // Pinterest-specific campaign options - NEW DROPDOWN OPTIONS
  const campaignOptions = useMemo(() => [
    { 
      value: '{campaignid}', 
      label: '{campaignid}', 
      category: 'Pinterest Documented',
      description: 'Pinterest documented macro for campaign ID'
    }
  ], []);

  // Pinterest-specific content options - NEW DROPDOWN OPTIONS
  const contentOptions = useMemo(() => [
    { 
      value: '{adgroupid}', 
      label: '{adgroupid}', 
      category: 'Pinterest Documented',
      description: 'Pinterest documented macro for ad group ID'
    }
  ], []);

  // Pinterest documented macros only
  const pinterestParams = useMemo(() => {
    const allParams = [
      { 
        id: 'campaignid', 
        value: '{campaignid}', 
        label: 'Campaign ID', 
        category: 'campaign', 
        description: 'Pinterest documented macro for campaign ID',
        availability: 'All Pinterest campaigns',
        example: '626736533506'
      },
      { 
        id: 'campaignname', 
        value: '{campaignname}', 
        label: 'Campaign Name', 
        category: 'campaign', 
        description: 'Pinterest documented macro for campaign name',
        availability: 'All Pinterest campaigns',
        example: 'Spring_Collection_2025'
      },
      { 
        id: 'adgroupid', 
        value: '{adgroupid}', 
        label: 'Ad Group ID', 
        category: 'adgroup', 
        description: 'Pinterest documented macro for ad group ID',
        availability: 'All Pinterest campaigns',
        example: '626736533507'
      },
      { 
        id: 'adgroupname', 
        value: '{adgroupname}', 
        label: 'Ad Group Name', 
        category: 'adgroup', 
        description: 'Pinterest documented macro for ad group name',
        availability: 'All Pinterest campaigns',
        example: 'Women_Shoes_Interest'
      },
      { 
        id: 'adid', 
        value: '{adid}', 
        label: 'Ad ID', 
        category: 'ad', 
        description: 'Pinterest documented macro for ad ID',
        availability: 'All Pinterest campaigns',
        example: '626736533508'
      },
      { 
        id: 'adname', 
        value: '{adname}', 
        label: 'Ad Name', 
        category: 'ad', 
        description: 'Pinterest documented macro for ad name',
        availability: 'All Pinterest campaigns',
        example: 'Spring_Shoes_Video_A'
      },
      { 
        id: 'interest', 
        value: '{interest}', 
        label: 'Interest', 
        category: 'targeting', 
        description: 'Pinterest documented macro for interest targeting',
        availability: 'Interest targeting campaigns',
        example: 'fitness'
      },
      { 
        id: 'creativetype', 
        value: '{creativetype}', 
        label: 'Creative Type', 
        category: 'creative', 
        description: 'Pinterest documented macro for creative type',
        availability: 'All Pinterest campaigns',
        example: 'video, image, carousel'
      },
      { 
        id: 'pinid', 
        value: '{pinid}', 
        label: 'Pin ID', 
        category: 'creative', 
        description: 'Pinterest documented macro for pin ID',
        availability: 'All Pinterest campaigns',
        example: '626736533509'
      }
    ];

    return allParams;
  }, []);

  // Filter parameters based on search and category
  const filteredParams = useMemo(() => {
    // Apply search/category filters but keep all parameters visible (don't filter out selected ones)
    return pinterestParams.filter(param => {
      const matchesSearch = param.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.availability.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || param.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [pinterestParams, searchTerm, selectedCategory]);

  // Handle individual optional parameter toggles with default value restoration
  const handleUtmContentToggle = useCallback((enabled: boolean) => {
    setIncludeUtmContent(enabled);
    if (enabled && !utmContent.trim()) {
      setUtmContent('{adgroupid}');
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

  // Template management
  const saveTemplate = useCallback(() => {
    if (!templateName.trim()) {
      error('Please enter a template name');
      return;
    }
    
    const template = {
      utmSource, utmMedium, utmCampaign, utmContent,
      utmTerm,
      includeUtmContent,
      includeUtmTerm,
      selectedParams, timestamp: Date.now()
    };
    
    const newTemplates = { ...savedTemplates, [templateName]: template };
    setSavedTemplates(newTemplates);
    localStorage.setItem('pinterest_ads_templates', JSON.stringify(newTemplates));
    
    success(`Template "${templateName}" saved successfully!`);
    setTemplateName('');
  }, [templateName, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, includeUtmContent, includeUtmTerm, selectedParams, savedTemplates, success, error]);

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
    setUtmTerm(template.utmTerm || '');
    
    setIncludeUtmContent(template.includeUtmContent ?? true);
    setIncludeUtmTerm(template.includeUtmTerm ?? false);
    
    setSelectedParams(template.selectedParams || {});
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
    localStorage.setItem('pinterest_ads_templates', JSON.stringify(newTemplates));
    
    setSelectedTemplate('');
    if (loadedTemplateName === templateToDelete) {
      setLoadedTemplateName('');
    }
    
    success(`Template "${templateToDelete}" deleted successfully!`);
  }, [selectedTemplate, savedTemplates, loadedTemplateName, success, error]);

  const resetFields = useCallback(() => {
    setUtmSource('pinterest');
    setUtmMedium('PaidSocial');
    setUtmCampaign('{campaignid}');
    setUtmContent('{adgroupid}');
    setUtmTerm('');
    setIncludeUtmContent(true);
    setIncludeUtmTerm(false);
    setSelectedParams({});
    setLoadedTemplateName('');
    success('Form reset successfully!');
  }, [success]);

  // Load saved templates on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('pinterest_ads_templates');
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
    { value: 'adgroup', label: 'Ad Group Level' },
    { value: 'ad', label: 'Ad Level' },
    { value: 'targeting', label: 'Targeting' },
    { value: 'creative', label: 'Creative' }
  ];

  // Get category badge color
  const getCategoryBadge = (category: string) => {
    const badges = {
      campaign: { variant: 'info' as const, label: 'Campaign' },
      adgroup: { variant: 'success' as const, label: 'Ad Group' },
      ad: { variant: 'warning' as const, label: 'Ad' },
      targeting: { variant: 'default' as const, label: 'Targeting' },
      creative: { variant: 'info' as const, label: 'Creative' }
    };
    
    const badge = badges[category as keyof typeof badges];
    return badge ? <Badge variant={badge.variant} size="sm">{badge.label}</Badge> : null;
  };

  return (
    <div className="space-y-8">
      {/* Video Tutorial Section */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-red-900 dark:text-red-100 mb-1 flex items-center gap-2">
              <Play className="w-4 h-4" />
              Pinterest Ads Parameter Builder
            </h3>
            <p className="text-red-700 dark:text-red-300 text-xs">
              Generate individual UTM parameters for Pinterest's URL parameter fields
            </p>
          </div>
          <Button
            onClick={() => setShowVideoModal(true)}
            icon={Play}
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
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
              <h3 className="text-lg font-semibold">Pinterest Ads Parameter Tutorial</h3>
              <Button onClick={() => setShowVideoModal(false)} variant="ghost" icon={X} size="sm" />
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    Pinterest Ads Parameter Tutorial Placeholder
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Replace with your Pinterest Ads parameter tutorial video
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
            UTM Parameter Configuration
          </h3>
          <Badge variant="info" size="sm">Pinterest Format</Badge>
        </div>

        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Settings className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">Pinterest URL Parameters Format</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Configure your UTM parameters below. Pinterest allows "Select a dynamic parameter or enter a value" for all UTM fields.
              </p>
            </div>
          </div>
        </div>

        {/* UTM Parameter Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Campaign Source (utm_source)
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
              To identify the source of traffic, for example, Pinterest
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Campaign Medium (utm_medium)
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
              To identify the advertising medium, for example, PaidSocial
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Campaign ID (utm_campaign)
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

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="include-utm-content"
                checked={includeUtmContent}
                onChange={(e) => handleUtmContentToggle(e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
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

      {/* Pinterest Individual Parameter Fields - COMPACT ALIGNED DESIGN */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Pinterest URL Parameters Format
          </h3>
        </div>

        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            Copy individual parameter names and values to paste into Pinterest's "Edit URL Parameters" interface.
          </p>
        </div>

        {/* COMPACT ALIGNED PARAMETER FIELDS */}
        <div className="space-y-4">
          {/* Campaign source */}
          <div className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-12 md:col-span-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Campaign source (utm_source)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">To identify the source of traffic, for example, Pinterest</p>
              </div>
            </div>
            <div className="col-span-6 md:col-span-3 flex items-center gap-2">
              <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border text-center">
                utm_source
              </code>
              <Button
                onClick={() => copyField('name', 'utm_source', utmSource)}
                variant="ghost"
                size="sm"
                icon={copiedFields['utm_source_name'] ? Check : Copy}
                className="text-xs px-2"
              >
                {copiedFields['utm_source_name'] ? '✓' : 'Copy'}
              </Button>
            </div>
            <div className="col-span-6 md:col-span-5 flex items-center gap-2">
              <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-center">
                {utmSource}
              </code>
              <Button
                onClick={() => copyField('value', 'utm_source', utmSource)}
                variant="ghost"
                size="sm"
                icon={copiedFields['utm_source_value'] ? Check : Copy}
                className="text-xs px-2"
              >
                {copiedFields['utm_source_value'] ? '✓' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Campaign medium */}
          <div className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-12 md:col-span-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Campaign medium (utm_medium)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">To identify the advertising medium, for example, PaidSocial</p>
              </div>
            </div>
            <div className="col-span-6 md:col-span-3 flex items-center gap-2">
              <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border text-center">
                utm_medium
              </code>
              <Button
                onClick={() => copyField('name', 'utm_medium', utmMedium)}
                variant="ghost"
                size="sm"
                icon={copiedFields['utm_medium_name'] ? Check : Copy}
                className="text-xs px-2"
              >
                {copiedFields['utm_medium_name'] ? '✓' : 'Copy'}
              </Button>
            </div>
            <div className="col-span-6 md:col-span-5 flex items-center gap-2">
              <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-center">
                {utmMedium}
              </code>
              <Button
                onClick={() => copyField('value', 'utm_medium', utmMedium)}
                variant="ghost"
                size="sm"
                icon={copiedFields['utm_medium_value'] ? Check : Copy}
                className="text-xs px-2"
              >
                {copiedFields['utm_medium_value'] ? '✓' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Campaign id */}
          <div className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-12 md:col-span-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Campaign id (utm_campaign)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">To identify a specific campaign</p>
              </div>
            </div>
            <div className="col-span-6 md:col-span-3 flex items-center gap-2">
              <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border text-center">
                utm_campaign
              </code>
              <Button
                onClick={() => copyField('name', 'utm_campaign', utmCampaign)}
                variant="ghost"
                size="sm"
                icon={copiedFields['utm_campaign_name'] ? Check : Copy}
                className="text-xs px-2"
              >
                {copiedFields['utm_campaign_name'] ? '✓' : 'Copy'}
              </Button>
            </div>
            <div className="col-span-6 md:col-span-5 flex items-center gap-2">
              <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-center">
                {utmCampaign}
              </code>
              <Button
                onClick={() => copyField('value', 'utm_campaign', utmCampaign)}
                variant="ghost"
                size="sm"
                icon={copiedFields['utm_campaign_value'] ? Check : Copy}
                className="text-xs px-2"
              >
                {copiedFields['utm_campaign_value'] ? '✓' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Campaign content - Only show if enabled */}
          {includeUtmContent && (
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-12 md:col-span-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Campaign content (utm_content)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">To differentiate contents within a campaign that link to the same URL</p>
                </div>
              </div>
              <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border text-center">
                  utm_content
                </code>
                <Button
                  onClick={() => copyField('name', 'utm_content', utmContent)}
                  variant="ghost"
                  size="sm"
                  icon={copiedFields['utm_content_name'] ? Check : Copy}
                  className="text-xs px-2"
                >
                  {copiedFields['utm_content_name'] ? '✓' : 'Copy'}
                </Button>
              </div>
              <div className="col-span-6 md:col-span-5 flex items-center gap-2">
                <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-center">
                  {utmContent}
                </code>
                <Button
                  onClick={() => copyField('value', 'utm_content', utmContent)}
                  variant="ghost"
                  size="sm"
                  icon={copiedFields['utm_content_value'] ? Check : Copy}
                  className="text-xs px-2"
                >
                  {copiedFields['utm_content_value'] ? '✓' : 'Copy'}
                </Button>
              </div>
            </div>
          )}

          {/* Campaign term - Only show if enabled (when keyword is selected) */}
          {includeUtmTerm && (
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-12 md:col-span-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Campaign term (utm_term)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">To identify paid search keywords</p>
                </div>
              </div>
              <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border text-center">
                  utm_term
                </code>
                <Button
                  onClick={() => copyField('name', 'utm_term', utmTerm)}
                  variant="ghost"
                  size="sm"
                  icon={copiedFields['utm_term_name'] ? Check : Copy}
                  className="text-xs px-2"
                >
                  {copiedFields['utm_term_name'] ? '✓' : 'Copy'}
                </Button>
              </div>
              <div className="col-span-6 md:col-span-5 flex items-center gap-2">
                <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-center">
                  {utmTerm}
                </code>
                <Button
                  onClick={() => copyField('value', 'utm_term', utmTerm)}
                  variant="ghost"
                  size="sm"
                  icon={copiedFields['utm_term_value'] ? Check : Copy}
                  className="text-xs px-2"
                >
                  {copiedFields['utm_term_value'] ? '✓' : 'Copy'}
                </Button>
              </div>
            </div>
          )}
          {/* Selected Pinterest Parameters */}
          {Object.entries(selectedParams).some(([_, isSelected]) => isSelected) && (
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
              <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Selected Pinterest Parameters
              </h5>
              <div className="space-y-3">
                {Object.entries(selectedParams)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([paramId, _]) => {
                  const param = pinterestParams.find(p => p.id === paramId);
                  if (!param) return null;

                  return (
                    <div key={paramId} className="grid grid-cols-12 gap-3 items-center py-2">
                      <div className="col-span-12 md:col-span-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{param.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{param.description}</p>
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-3 flex items-center gap-2">
                        <code className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border text-center">
                          {paramId}
                        </code>
                        <Button
                          onClick={() => copyField('name', paramId, param.value)}
                          variant="ghost"
                          size="sm"
                          icon={copiedFields[`${paramId}_name`] ? Check : Copy}
                          className="text-xs px-2"
                        >
                          {copiedFields[`${paramId}_name`] ? '✓' : 'Copy'}
                        </Button>
                      </div>
                      <div className="col-span-6 md:col-span-5 flex items-center gap-2">
                        <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-center">
                          {param.value}
                        </code>
                        <Button
                          onClick={() => copyField('value', paramId, param.value)}
                          variant="ghost"
                          size="sm"
                          icon={copiedFields[`${paramId}_value`] ? Check : Copy}
                          className="text-xs px-2"
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

      {/* Pinterest Dynamic Parameters Selection */}
      <Accordion 
        title="Pinterest Dynamic Parameters" 
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
            <div key={param.id} className="flex items-start space-x-3 p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <input
                type="checkbox"
                id={param.id}
                checked={selectedParams[param.id] || false}
                onChange={(e) => {
                  setSelectedParams(prev => ({
                    ...prev,
                    [param.id]: e.target.checked
                  }));
                  
                  // Special handling for keyword parameter - assign to utm_term
                  if (param.id === 'keyword') {
                    if (e.target.checked) {
                      setUtmTerm(param.value);
                      setIncludeUtmTerm(true);
                    } else {
                      setUtmTerm('');
                      setIncludeUtmTerm(false);
                    }
                  }
                }}
                className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
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
                  <div className="text-xs text-red-600 dark:text-red-400 font-medium">
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
                    platform: 'pinterest',
                    version: '1.0'
                  };
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `pinterest-ads-templates-${new Date().toISOString().split('T')[0]}.json`;
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
                            localStorage.setItem('pinterest_ads_templates', JSON.stringify(newTemplates));
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
                  id="import-templates-pinterest"
                />
                <Button
                  onClick={() => document.getElementById('import-templates-pinterest')?.click()}
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

        {/* Loaded Template Preview */}
        {loadedTemplateName && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
              📋 Loaded Template: "{loadedTemplateName}"
            </h4>
            <p className="text-xs text-red-700 dark:text-red-300">
              ✅ Template loaded successfully! Individual parameter fields above have been updated.
            </p>
          </div>
        )}
      </Accordion>

      {/* Help Section */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
          Pinterest Ads Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm text-red-800 dark:text-red-200">
            <a href="https://help.pinterest.com/en/business/article/track-conversions-with-the-pinterest-tag" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>📖</span> Pinterest Tag & Tracking
            </a>
            <a href="https://help.pinterest.com/en/business/article/conversion-tracking" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>🔗</span> Conversion Tracking Guide
            </a>
          </div>
          <div className="space-y-2 text-sm text-red-800 dark:text-red-200">
            <button onClick={() => setShowVideoModal(true)} className="flex items-center gap-2 hover:underline text-left">
              <Play size={16} /> Watch Tutorial Video
            </button>
            <a href="https://help.pinterest.com/en/business/article/ads-manager" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>⚙️</span> Ads Manager Setup
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinterestBuilder;