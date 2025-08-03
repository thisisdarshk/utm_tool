import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Search, X, Save, Download, Upload, Play, RefreshCw, Plus, Trash2, Zap, Globe, Settings, Target } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Accordion from '../common/Accordion';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';

const PinterestBuilder: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('{unescapedlpurl}');
  const [utmSource, setUtmSource] = useState('pinterest');
  const [utmMedium, setUtmMedium] = useState('paid_social');
  const [utmCampaign, setUtmCampaign] = useState('{campaignname}');
  const [utmTerm, setUtmTerm] = useState('{adgroupname}');
  const [utmContent, setUtmContent] = useState('{adid}');
  
  // Individual optional parameter toggles
  const [includeUtmTerm, setIncludeUtmTerm] = useState(true);
  const [includeUtmContent, setIncludeUtmContent] = useState(true);
  
  // Pinterest-specific parameters
  const [selectedParams, setSelectedParams] = useState<Record<string, boolean>>({});
  
  const [customParams, setCustomParams] = useState<Array<{key: string, value: string}>>([]);
  const [generatedString, setGeneratedString] = useState('');
  const [copiedString, setCopiedString] = useState(false);
  const [useLpurl, setUseLpurl] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedTemplates, setSavedTemplates] = useState<Record<string, any>>({});
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loadedTemplateName, setLoadedTemplateName] = useState('');
  const { success, error } = useToast();

  // Pinterest-specific source options
  const sourceOptions = useMemo(() => [
    { 
      value: 'pinterest', 
      label: 'pinterest', 
      category: 'Static Sources',
      description: 'Pinterest platform traffic - Use for static source tracking'
    },
    { 
      value: '{publisher}', 
      label: '{publisher}', 
      category: 'Dynamic Sources',
      description: 'Returns static value: "Pinterest" - Useful for multi-channel attribution'
    }
  ], []);

  // Pinterest-specific medium options
  const mediumOptions = useMemo(() => [
    { 
      value: 'paid_social', 
      label: 'paid_social', 
      category: 'Standard Mediums',
      description: 'Paid social media traffic - Recommended for Pinterest ads'
    },
    { 
      value: 'cpc', 
      label: 'cpc', 
      category: 'Standard Mediums',
      description: 'Cost per click campaigns - Traditional PPC tracking'
    },
    { 
      value: 'paid', 
      label: 'paid', 
      category: 'Standard Mediums',
      description: 'General paid traffic - Common for Pinterest ads'
    },
    { 
      value: 'social', 
      label: 'social', 
      category: 'Standard Mediums',
      description: 'Social media traffic - Organic social classification'
    }
  ], []);

  // Pinterest-specific campaign options
  const campaignOptions = useMemo(() => [
    { 
      value: '{campaignname}', 
      label: '{campaignname}', 
      category: 'Campaign Info',
      description: 'Campaign name (human-readable) - For utm_campaign'
    },
    { 
      value: '{campaignid}', 
      label: '{campaignid}', 
      category: 'Campaign Info',
      description: 'Numeric campaign ID - Use if ID-based grouping is preferred'
    }
  ], []);

  // Pinterest-specific term options
  const termOptions = useMemo(() => [
    { 
      value: '{adgroupname}', 
      label: '{adgroupname}', 
      category: 'Ad Group Level',
      description: 'Ad group name - For utm_term'
    },
    { 
      value: '{keyword}', 
      label: '{keyword}', 
      category: 'Keyword Level',
      description: 'Matched search keyword (percent-encoded) - For utm_term or additional segmentation'
    }
  ], []);
    
  // Pinterest-specific content options
  const contentOptions = useMemo(() => [
    { 
      value: '{adid}', 
      label: '{adid}', 
      category: 'Ad Level',
      description: 'Creative ID (Promoted Pin ID) - For utm_content'
    },
    { 
      value: '{creative_id}', 
      label: '{creative_id}', 
      category: 'Ad Level',
      description: 'Same as {adid} - Alias – use either'
    },
    { 
      value: '{product_name}', 
      label: '{product_name}', 
      category: 'Product Level',
      description: 'Product title (from feed) - Useful in catalog/collection ads'
    }
  ], []);

  // Handle individual optional parameter toggles with default value restoration
  const handleUtmTermToggle = useCallback((enabled: boolean) => {
    setIncludeUtmTerm(enabled);
    
    // If enabling and field is empty, restore default
    if (enabled && !utmTerm.trim()) {
      setUtmTerm('{adgroupname}');
    }
  }, [utmTerm]);

  const handleUtmContentToggle = useCallback((enabled: boolean) => {
    setIncludeUtmContent(enabled);
    
    // If enabling and field is empty, restore default
    if (enabled && !utmContent.trim()) {
      setUtmContent('{adid}');
    }
  }, [utmContent]);

  // Base URL options
  const baseUrlOptions = useMemo(() => [
    { 
      value: '{unescapedlpurl}', 
      label: '{unescapedlpurl}', 
      category: 'URL Parameters',
      description: 'Landing page URL (unencoded/clean) - Preferred in UTM builders'
    },
    { 
      value: '{lpurl}', 
      label: '{lpurl}', 
      category: 'URL Parameters',
      description: 'Landing page URL (escaped) - For redirect-based tracking tools'
    }
  ], []);

  // Complete Pinterest parameters based on the provided list
  const pinterestParams = useMemo(() => [
    // Campaign Level Parameters
    { 
      id: 'campaignid', 
      value: '{campaignid}', 
      label: 'Campaign ID', 
      category: 'campaign', 
      description: 'Numeric campaign ID',
      availability: 'All Pinterest campaigns',
      example: '12345678',
      useCase: 'Use if ID-based grouping is preferred'
    },
    { 
      id: 'campaignname', 
      value: '{campaignname}', 
      label: 'Campaign Name', 
      category: 'campaign', 
      description: 'Campaign name (human-readable)',
      availability: 'All Pinterest campaigns',
      example: 'Summer_Sale_2025',
      useCase: 'For utm_campaign'
    },
    
    // Ad Group Level Parameters
    { 
      id: 'adgroupid', 
      value: '{adgroupid}', 
      label: 'Ad Group ID', 
      category: 'adgroup', 
      description: 'Numeric ad group ID',
      availability: 'All Pinterest campaigns',
      example: '87654321',
      useCase: 'Alternate for deeper analytics'
    },
    { 
      id: 'adgroupname', 
      value: '{adgroupname}', 
      label: 'Ad Group Name', 
      category: 'adgroup', 
      description: 'Ad group name',
      availability: 'All Pinterest campaigns',
      example: 'US_Women_25_34',
      useCase: 'For utm_term'
    },
    
    // Ad Level Parameters
    { 
      id: 'adid', 
      value: '{adid}', 
      label: 'Ad ID', 
      category: 'ad', 
      description: 'Creative ID (Promoted Pin ID)',
      availability: 'All Pinterest campaigns',
      example: '687123456789',
      useCase: 'For utm_content'
    },
    { 
      id: 'creative_id', 
      value: '{creative_id}', 
      label: 'Creative ID', 
      category: 'ad', 
      description: 'Same as {adid}',
      availability: 'All Pinterest campaigns',
      example: '687123456789',
      useCase: 'Alias – use either'
    },
    
    // Keyword Parameters
    { 
      id: 'keyword', 
      value: '{keyword}', 
      label: 'Keyword', 
      category: 'keyword', 
      description: 'Matched search keyword (percent-encoded)',
      availability: 'Search campaigns',
      example: 'summer%20fashion',
      useCase: 'For utm_term or additional segmentation'
    },
    { 
      id: 'keyword_id', 
      value: '{keyword_id}', 
      label: 'Keyword ID', 
      category: 'keyword', 
      description: 'ID of matched keyword',
      availability: 'Search campaigns',
      example: '12345',
      useCase: 'Optional – for advanced performance mapping'
    },
    
    // Product Parameters
    { 
      id: 'product_name', 
      value: '{product_name}', 
      label: 'Product Name', 
      category: 'product', 
      description: 'Product title (from feed)',
      availability: 'Catalog/collection ads',
      example: 'Blue Denim Jacket',
      useCase: 'Useful in catalog/collection ads'
    },
    { 
      id: 'product_id', 
      value: '{product_id}', 
      label: 'Product ID', 
      category: 'product', 
      description: 'Product ID or SKU',
      availability: 'Catalog/collection ads',
      example: 'SKU12345',
      useCase: 'Track product-level performance'
    },
    { 
      id: 'product_partition_id', 
      value: '{product_partition_id}', 
      label: 'Product Partition ID', 
      category: 'product', 
      description: 'Product group/partition ID',
      availability: 'Catalog ads',
      example: '45678',
      useCase: 'For catalog feed analytics'
    },
    { 
      id: 'promoted_product_group_id', 
      value: '{promoted_product_group_id}', 
      label: 'Promoted Product Group ID', 
      category: 'product', 
      description: 'Promoted product group ID',
      availability: 'Catalog/collection ads',
      example: '98765',
      useCase: 'Used in catalog and collection ads'
    },
    
    // Device Parameters
    { 
      id: 'device', 
      value: '{device}', 
      label: 'Device Type', 
      category: 'device', 
      description: 'Device type: c (Computer), m (Mobile), t (Tablet)',
      availability: 'All Pinterest campaigns',
      example: 'c, m, t',
      useCase: 'For segmentation by device in analytics'
    },
    { 
      id: 'device_platform', 
      value: '{device_platform}', 
      label: 'Device Platform', 
      category: 'device', 
      description: 'Device platform (e.g., Android, iOS)',
      availability: 'Mobile campaigns',
      example: 'Android, iOS',
      useCase: 'Optional for mobile-specific campaigns'
    },
    
    // URL Parameters
    { 
      id: 'lpurl', 
      value: '{lpurl}', 
      label: 'Landing Page URL (escaped)', 
      category: 'url', 
      description: 'Landing page URL (escaped)',
      availability: 'All Pinterest campaigns',
      example: 'https%3A%2F%2Fexample.com',
      useCase: 'For redirect-based tracking tools'
    },
    { 
      id: 'unescapedlpurl', 
      value: '{unescapedlpurl}', 
      label: 'Unescaped Landing Page URL', 
      category: 'url', 
      description: 'Landing page URL (unencoded/clean)',
      availability: 'All Pinterest campaigns',
      example: 'https://example.com',
      useCase: 'Preferred in UTM builders'
    },
    { 
      id: 'organic_url', 
      value: '{organic_url}', 
      label: 'Organic URL', 
      category: 'url', 
      description: 'Original URL (used in collection ads)',
      availability: 'Collection ads',
      example: 'https://example.com/products',
      useCase: 'Collection ad-specific'
    },
    
    // Publisher Parameter
    { 
      id: 'publisher', 
      value: '{publisher}', 
      label: 'Publisher', 
      category: 'publisher', 
      description: 'Returns static value: "Pinterest"',
      availability: 'All Pinterest campaigns',
      example: 'Pinterest',
      useCase: 'Useful for multi-channel attribution'
    }
  ], []);

  // Filter parameters based on search and category
  const filteredParams = useMemo(() => {
    return pinterestParams.filter(param => {
      const matchesSearch = param.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.availability.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || param.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [pinterestParams, searchTerm, selectedCategory]);

  // Generate parameter string (no URL needed)
  const generateParameterString = useCallback(() => {
    const params = [];
    
    // Add UTM parameters - REQUIRED FIELDS ALWAYS INCLUDED
    if (utmSource) params.push(`utm_source=${utmSource}`);
    if (utmMedium) params.push(`utm_medium=${utmMedium}`);
    if (utmCampaign) params.push(`utm_campaign=${utmCampaign}`);
    
    // Add optional UTM parameters only if individually enabled
    if (includeUtmTerm && utmTerm) params.push(`utm_term=${utmTerm}`);
    if (includeUtmContent && utmContent) params.push(`utm_content=${utmContent}`);

    // Add selected Pinterest parameters
    Object.entries(selectedParams).forEach(([paramId, isSelected]) => {
      if (isSelected) {
        const param = pinterestParams.find(p => p.id === paramId);
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

    let finalString;
    
    if (useLpurl && baseUrl) {
      finalString = `${baseUrl}?${params.join('&')}`;
    } else {
      finalString = params.join('&');
    }
    
    setGeneratedString(finalString);
  }, [utmSource, utmMedium, utmCampaign, utmTerm, utmContent, includeUtmTerm, includeUtmContent, selectedParams, customParams, pinterestParams, useLpurl, baseUrl]);

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
      utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
      baseUrl, useLpurl,
      includeUtmTerm, includeUtmContent,
      selectedParams, customParams, timestamp: Date.now()
    };
    
    const newTemplates = { ...savedTemplates, [templateName]: template };
    setSavedTemplates(newTemplates);
    localStorage.setItem('pinterest_ads_templates', JSON.stringify(newTemplates));
    
    success(`Template "${templateName}" saved successfully!`);
    setTemplateName('');
  }, [templateName, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, baseUrl, useLpurl, includeUtmTerm, includeUtmContent, selectedParams, customParams, savedTemplates, success, error]);

  const loadTemplate = useCallback(() => {
    if (!selectedTemplate || !savedTemplates[selectedTemplate]) {
      error('Please select a template to load');
      return;
    }
    
    const template = savedTemplates[selectedTemplate];
    setUtmSource(template.utmSource);
    setUtmMedium(template.utmMedium);
    setUtmCampaign(template.utmCampaign);
    setUtmTerm(template.utmTerm);
    setUtmContent(template.utmContent);
    setBaseUrl(template.baseUrl || '{unescapedlpurl}');
    setUseLpurl(template.useLpurl ?? true);
    
    // Load individual toggles (with fallback for old templates)
    setIncludeUtmTerm(template.includeUtmTerm ?? true);
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
    localStorage.setItem('pinterest_ads_templates', JSON.stringify(newTemplates));
    
    // Clear selection and loaded template if it was the deleted one
    setSelectedTemplate('');
    if (loadedTemplateName === templateToDelete) {
      setLoadedTemplateName('');
    }
    
    success(`Template "${templateToDelete}" deleted successfully!`);
  }, [selectedTemplate, savedTemplates, loadedTemplateName, success, error]);

  // Reset all fields
  const resetFields = useCallback(() => {
    setUtmSource('pinterest');
    setUtmMedium('paid_social');
    setUtmCampaign('{campaignname}');
    setUtmTerm('{adgroupname}');
    setUtmContent('{adid}');
    setBaseUrl('{unescapedlpurl}');
    setUseLpurl(true);
    setIncludeUtmTerm(true);
    setIncludeUtmContent(true);
    setSelectedParams({});
    setCustomParams([]);
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
    { value: 'keyword', label: 'Keyword' },
    { value: 'product', label: 'Product' },
    { value: 'device', label: 'Device' },
    { value: 'url', label: 'URL' },
    { value: 'publisher', label: 'Publisher' }
  ];

  // Get category badge color
  const getCategoryBadge = (category: string) => {
    const badges = {
      campaign: { variant: 'info' as const, label: 'Campaign' },
      adgroup: { variant: 'success' as const, label: 'Ad Group' },
      ad: { variant: 'warning' as const, label: 'Ad' },
      keyword: { variant: 'default' as const, label: 'Keyword' },
      product: { variant: 'info' as const, label: 'Product' },
      device: { variant: 'success' as const, label: 'Device' },
      url: { variant: 'warning' as const, label: 'URL' },
      publisher: { variant: 'default' as const, label: 'Publisher' }
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
              Generate individual parameter fields or URL strings using Pinterest's official tracking parameters
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

      {/* Pinterest Individual Parameter Fields - NEW SECTION */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Pinterest Individual Parameter Fields
          </h3>
          <Badge variant="success" size="sm">Pinterest Format</Badge>
        </div>

        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Settings className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">Pinterest Parameter Format</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Copy individual parameter values and paste them into Pinterest's "Edit URL Parameters" interface. 
                Each parameter has its own field in Pinterest Ads Manager.
              </p>
            </div>
          </div>
        </div>

        {/* Individual Parameter Fields */}
        <div className="space-y-6">
          {/* Campaign Source */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campaign source (utm_source)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                To identify the source of traffic, for example, Pinterest
              </p>
              <div className="relative">
                <input
                  type="text"
                  value={utmSource}
                  readOnly
                  className="w-full p-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(utmSource);
                    success('Campaign source copied!');
                  }}
                  variant="ghost"
                  size="sm"
                  icon={Copy}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(utmSource);
                  success('Campaign source copied!');
                }}
                icon={Copy}
                size="sm"
                className="w-full lg:w-auto"
              >
                Copy Value
              </Button>
            </div>
          </div>

          {/* Campaign Medium */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campaign medium (utm_medium)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                To identify the advertising medium, for example, PaidSocial
              </p>
              <div className="relative">
                <input
                  type="text"
                  value={utmMedium}
                  readOnly
                  className="w-full p-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(utmMedium);
                    success('Campaign medium copied!');
                  }}
                  variant="ghost"
                  size="sm"
                  icon={Copy}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(utmMedium);
                  success('Campaign medium copied!');
                }}
                icon={Copy}
                size="sm"
                className="w-full lg:w-auto"
              >
                Copy Value
              </Button>
            </div>
          </div>

          {/* Campaign ID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campaign id (utm_campaign)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                To identify a specific campaign
              </p>
              <div className="relative">
                <input
                  type="text"
                  value={utmCampaign}
                  readOnly
                  className="w-full p-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(utmCampaign);
                    success('Campaign ID copied!');
                  }}
                  variant="ghost"
                  size="sm"
                  icon={Copy}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(utmCampaign);
                  success('Campaign ID copied!');
                }}
                icon={Copy}
                size="sm"
                className="w-full lg:w-auto"
              >
                Copy Value
              </Button>
            </div>
          </div>

          {/* Campaign Content - Only if enabled */}
          {includeUtmContent && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Campaign content (utm_content)
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  To differentiate contents within a campaign that link to the same URL
                </p>
                <div className="relative">
                  <input
                    type="text"
                    value={utmContent}
                    readOnly
                    className="w-full p-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(utmContent);
                      success('Campaign content copied!');
                    }}
                    variant="ghost"
                    size="sm"
                    icon={Copy}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(utmContent);
                    success('Campaign content copied!');
                  }}
                  icon={Copy}
                  size="sm"
                  className="w-full lg:w-auto"
                >
                  Copy Value
                </Button>
              </div>
            </div>
          )}

          {/* Campaign Term - Only if enabled */}
          {includeUtmTerm && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Campaign term (utm_term)
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  To identify paid search keywords
                </p>
                <div className="relative">
                  <input
                    type="text"
                    value={utmTerm}
                    readOnly
                    className="w-full p-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(utmTerm);
                      success('Campaign term copied!');
                    }}
                    variant="ghost"
                    size="sm"
                    icon={Copy}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(utmTerm);
                    success('Campaign term copied!');
                  }}
                  icon={Copy}
                  size="sm"
                  className="w-full lg:w-auto"
                >
                  Copy Value
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Custom Parameters Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
              Custom parameters
            </h4>
            <Button onClick={addCustomParam} icon={Plus} size="sm">
              Add parameters
            </Button>
          </div>
          
          {customParams.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No custom parameters added. Click "Add parameters" to add custom tracking parameters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {customParams.map((param, index) => (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Parameter Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., custom_param"
                          value={param.key}
                          onChange={(e) => updateCustomParam(index, 'key', e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-red-500 focus:ring-red-500/20 focus:outline-none focus:ring-4"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Value
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="e.g., {custom_value}"
                            value={param.value}
                            onChange={(e) => updateCustomParam(index, 'value', e.target.value)}
                            className="w-full p-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-red-500 focus:ring-red-500/20 focus:outline-none focus:ring-4"
                          />
                          {param.key && param.value && (
                            <Button
                              onClick={() => {
                                navigator.clipboard.writeText(param.value);
                                success(`${param.key} value copied!`);
                              }}
                              variant="ghost"
                              size="sm"
                              icon={Copy}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {param.key && param.value && (
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(param.value);
                          success(`${param.key} value copied!`);
                        }}
                        icon={Copy}
                        size="sm"
                        className="flex-1 lg:flex-none"
                      >
                        Copy Value
                      </Button>
                    )}
                    <Button
                      onClick={() => removeCustomParam(index)}
                      variant="danger"
                      icon={Trash2}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Base URL Option */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Base URL Options
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="use-lpurl"
              checked={useLpurl}
              onChange={(e) => setUseLpurl(e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="use-lpurl" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              Include Base URL in generated string
            </label>
          </div>
          {useLpurl && (
            <Dropdown
              options={baseUrlOptions}
              value={baseUrl}
              onChange={setBaseUrl}
              placeholder="Select base URL parameter"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            When enabled, the parameter string will include the base URL. This is useful for tracking templates.
          </p>
        </div>
      </div>

      {/* UTM Parameters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            UTM Parameters
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
              placeholder="e.g., pinterest"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Pinterest traffic source identifier
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
              Recommended: paid_social for Pinterest ads
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
              placeholder="e.g., {campaignname}"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Uses Pinterest's {'{campaignname}'} parameter
            </p>
          </div>
        </div>

        {/* OPTIONAL UTM PARAMETERS */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Optional UTM Parameters
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* UTM Term */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="include-utm-term"
                  checked={includeUtmTerm}
                  onChange={(e) => handleUtmTermToggle(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="include-utm-term" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Campaign Term (utm_term)
                </label>
              </div>
              <Dropdown
                options={termOptions}
                value={utmTerm}
                onChange={setUtmTerm}
                placeholder="e.g., {adgroupname}"
                searchable
                clearable
                allowCustom
                groupByCategory
                disabled={!includeUtmTerm}
                className={`w-full ${!includeUtmTerm ? 'opacity-50' : ''}`}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Typically used for ad group name or keywords
              </p>
            </div>

            {/* UTM Content */}
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
                placeholder="e.g., {adid}"
                searchable
                clearable
                allowCustom
                groupByCategory
                disabled={!includeUtmContent}
                className={`w-full ${!includeUtmContent ? 'opacity-50' : ''}`}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Typically used for creative ID or product information
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Parameter String */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-red-200 dark:border-red-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-red-900 dark:text-red-100 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Generated Pinterest Ads Parameter String
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
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-red-200 dark:border-red-700 shadow-inner">
          <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
            {generatedString || 'Configure parameters to generate string...'}
          </code>
        </div>
        
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Settings className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            {useLpurl ? (
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Pinterest Tracking Template</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Copy this tracking template and paste it into Pinterest's tracking template field in your ad campaign setup.
                  Pinterest will automatically replace the parameters with actual values.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Pinterest Parameter Usage</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Copy this parameter string and paste it into Pinterest's URL parameters field in your ad campaign setup. 
                  Pinterest will automatically replace the parameters with actual values.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pinterest Parameters */}
      <Accordion 
        title="Pinterest Parameters" 
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
                    <strong>Use Case:</strong> {param.useCase}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Example:</strong> {param.example}
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
                    placeholder="e.g., {custom_value}"
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

        {/* LOADED TEMPLATE PREVIEW */}
        {loadedTemplateName && generatedString && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-red-900 dark:text-red-100">
                📋 Loaded Template: "{loadedTemplateName}"
              </h4>
              <Button
                onClick={copyCurrentTemplate}
                variant="secondary"
                size="sm"
                icon={Copy}
                className="text-red-600 hover:text-red-700"
              >
                Copy String
              </Button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-700">
              <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                {generatedString}
              </code>
            </div>
            <p className="text-xs text-red-700 dark:text-red-300 mt-2">
              ✅ Template loaded successfully! This shows the current generated parameter string.
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

        {/* Pinterest UTM Mapping Reference */}
        <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-3">Pinterest → UTM Mapping Reference</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-red-800 dark:text-red-200">
            <div><strong>utm_campaign:</strong> <code className="bg-red-200 dark:bg-red-800/30 px-1 rounded">{'{campaignname}'}</code> - Use readable campaign name</div>
            <div><strong>Base URL:</strong>
              <code className="bg-red-200 dark:bg-red-800/30 px-1 rounded">{'{unescapedlpurl}'}</code>
              or
              <code className="bg-red-200 dark:bg-red-800/30 px-1 rounded">{'{lpurl}'}</code></div>
            <div><strong>utm_term:</strong> <code className="bg-red-200 dark:bg-red-800/30 px-1 rounded">{'{adgroupname}'}</code> - Identifies ad group</div>
            <div><strong>utm_content:</strong> <code className="bg-red-200 dark:bg-red-800/30 px-1 rounded">{'{adid}'}</code> - Pin or creative ID</div>
            <div><strong>device:</strong> <code className="bg-red-200 dark:bg-red-800/30 px-1 rounded">{'{device}'}</code> - c, m, t (Computer, Mobile, Tablet)</div>
            <div><strong>keyword:</strong> <code className="bg-red-200 dark:bg-red-800/30 px-1 rounded">{'{keyword}'}</code> - Matched keyword (percent-encoded)</div>
            <div><strong>product_name:</strong> <code className="bg-red-200 dark:bg-red-800/30 px-1 rounded">{'{product_name}'}</code> - Product-level creative differentiation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinterestBuilder;