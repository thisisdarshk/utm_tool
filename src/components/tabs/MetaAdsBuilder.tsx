import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Search, X, Save, Download, Upload, Play, RefreshCw, Plus, Trash2, Zap, Globe, Settings, Target } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Accordion from '../common/Accordion';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';

const MetaAdsBuilder: React.FC = () => {
  // Removed websiteUrl state since it's not needed
  const [utmSource, setUtmSource] = useState('{{site_source_name}}');
  const [utmMedium, setUtmMedium] = useState('paid_social');
  const [utmCampaign, setUtmCampaign] = useState('{{campaign.name}}');
  const [utmContent, setUtmContent] = useState('{{ad.name}}');
  
  // Individual optional parameter toggles - REMOVED UTM_TERM
  const [includeUtmContent, setIncludeUtmContent] = useState(true); // Default to true for Meta ads
  
  // Meta-specific parameters - REMOVED PRE-SELECTED PARAMETERS
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

  // ENHANCED: Meta-specific source options with better organization and visibility
  const sourceOptions = useMemo(() => [
    // Static Sources - Most commonly used
    { 
      value: 'facebook', 
      label: 'facebook', 
      category: 'Static Sources',
      description: 'Facebook platform traffic - Use for static source tracking'
    },
    { 
      value: 'instagram', 
      label: 'instagram', 
      category: 'Static Sources',
      description: 'Instagram platform traffic - Use for static source tracking'
    },
    { 
      value: 'messenger', 
      label: 'messenger', 
      category: 'Static Sources',
      description: 'Facebook Messenger traffic - Use for static source tracking'
    },
    { 
      value: 'audience_network', 
      label: 'audience_network', 
      category: 'Static Sources',
      description: 'Facebook Audience Network traffic - Use for static source tracking'
    },
    { 
      value: 'whatsapp', 
      label: 'whatsapp', 
      category: 'Static Sources',
      description: 'WhatsApp Business traffic - Use for WhatsApp campaigns'
    },
    
    // Dynamic Sources - Meta's automatic population
    { 
      value: '{{site_source_name}}', 
      label: '{{site_source_name}}', 
      category: 'Dynamic Sources',
      description: 'Dynamic source name (fb, ig, msg, an, wa) - Automatically populated by Meta'
    }
  ], []);

  // ENHANCED: Meta-specific medium options with clear categories
  const mediumOptions = useMemo(() => [
    // Standard Mediums - Most common for Meta ads
    { 
      value: 'paid_social', 
      label: 'paid_social', 
      category: 'Standard Mediums',
      description: 'Paid social media traffic - Recommended for Meta ads'
    },
    { 
      value: 'paid', 
      label: 'paid', 
      category: 'Standard Mediums',
      description: 'General paid traffic - Most common for Meta ads'
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
    },
    
    // Dynamic Mediums - Meta's automatic population
    { 
      value: '{{placement}}', 
      label: '{{placement}}', 
      category: 'Dynamic Mediums',
      description: 'Dynamic placement information - Automatically populated by Meta'
    }
  ], []);

  // ENHANCED: Meta-specific campaign options with better organization
  const campaignOptions = useMemo(() => [
    // Campaign Information
    { 
      value: '{{campaign.name}}', 
      label: '{{campaign.name}}', 
      category: 'Campaign Info',
      description: 'Dynamic campaign name from Meta - Automatically populated'
    },
    { 
      value: '{{campaign.id}}', 
      label: '{{campaign.id}}', 
      category: 'Campaign Info',
      description: 'Dynamic campaign ID from Meta - Unique identifier'
    }
  ], []);
    
  // ENHANCED: Meta-specific content options with better structure
  const contentOptions = useMemo(() => [
    // Ad Level Information
    { 
      value: '{{ad.name}}', 
      label: '{{ad.name}}', 
      category: 'Ad Level',
      description: 'Dynamic ad name from Meta - Individual ad identifier'
    },
    { 
      value: '{{ad.id}}', 
      label: '{{ad.id}}', 
      category: 'Ad Level',
      description: 'Dynamic ad ID from Meta - Unique ad identifier'
    },
    
    // Ad Set Level Information
    { 
      value: '{{adset.name}}', 
      label: '{{adset.name}}', 
      category: 'Ad Set Level',
      description: 'Dynamic ad set name from Meta - Ad set identifier'
    },
    { 
      value: '{{adset.id}}', 
      label: '{{adset.id}}', 
      category: 'Ad Set Level',
      description: 'Dynamic ad set ID from Meta - Unique ad set identifier'
    },
    
    // Creative Variations
    { 
      value: 'creative_a', 
      label: 'creative_a', 
      category: 'Creative Variants',
      description: 'Creative variant A - Use for A/B testing different creatives'
    },
    { 
      value: 'creative_b', 
      label: 'creative_b', 
      category: 'Creative Variants',
      description: 'Creative variant B - Use for A/B testing different creatives'
    },
    { 
      value: 'video_ad', 
      label: 'video_ad', 
      category: 'Creative Variants',
      description: 'Video advertisement - Use for video creative tracking'
    },
    { 
      value: 'image_ad', 
      label: 'image_ad', 
      category: 'Creative Variants',
      description: 'Image advertisement - Use for static image creative tracking'
    },
    { 
      value: 'carousel_ad', 
      label: 'carousel_ad', 
      category: 'Creative Variants',
      description: 'Carousel advertisement - Use for carousel creative tracking'
    }
  ], []);

  // NEW: Meta-specific pre-built parameters similar to Google Ads/Microsoft Ads
  const metaParams = useMemo(() => [
    // Campaign Level Parameters
    { 
      id: 'campaign_id', 
      value: '{{campaign.id}}', 
      label: 'Campaign ID', 
      category: 'campaign', 
      description: 'Unique campaign identifier from Meta',
      availability: 'All Meta campaigns',
      example: '2384738473847384'
    },
    { 
      id: 'campaign_name', 
      value: '{{campaign.name}}', 
      label: 'Campaign Name', 
      category: 'campaign', 
      description: 'Campaign name from Meta',
      availability: 'All Meta campaigns',
      example: 'Shoes_Sale_2025'
    },
    
    // Ad Set Level Parameters
    { 
      id: 'adset_id', 
      value: '{{adset.id}}', 
      label: 'Ad Set ID', 
      category: 'adset', 
      description: 'Unique ad set identifier from Meta',
      availability: 'All Meta campaigns',
      example: '23849834834834'
    },
    { 
      id: 'adset_name', 
      value: '{{adset.name}}', 
      label: 'Ad Set Name', 
      category: 'adset', 
      description: 'Ad set name from Meta - useful for targeting analysis',
      availability: 'All Meta campaigns',
      example: 'LAL_3%_US_14D'
    },
    { 
      id: 'targeting', 
      value: '{{adset.name}}', 
      label: 'Targeting (Ad Set Name)', 
      category: 'adset', 
      description: 'Ad set name used for targeting analysis',
      availability: 'All Meta campaigns',
      example: 'LAL_3%_US_14D'
    },
    
    // Ad Level Parameters
    { 
      id: 'ad_id', 
      value: '{{ad.id}}', 
      label: 'Ad ID', 
      category: 'ad', 
      description: 'Unique ad identifier from Meta',
      availability: 'All Meta campaigns',
      example: '23849857348573'
    },
    { 
      id: 'ad_name', 
      value: '{{ad.name}}', 
      label: 'Ad Name', 
      category: 'ad', 
      description: 'Ad name from Meta - useful for creative analysis',
      availability: 'All Meta campaigns',
      example: 'Ad_Video_A_Spring'
    },
    
    // Placement & Platform Parameters
    { 
      id: 'placement', 
      value: '{{placement}}', 
      label: 'Placement', 
      category: 'placement', 
      description: 'Specific placement where ad was shown',
      availability: 'All Meta campaigns',
      example: 'facebook_feed, instagram_story'
    },
    { 
      id: 'publisher_platform', 
      value: '{{publisher_platform}}', 
      label: 'Publisher Platform', 
      category: 'placement', 
      description: 'Meta platform where ad was displayed',
      availability: 'All Meta campaigns',
      example: 'facebook, instagram'
    },
    
    // Device & Format Parameters
    { 
      id: 'device_type', 
      value: '{{device_type}}', 
      label: 'Device Type', 
      category: 'device', 
      description: 'Device type where ad was clicked',
      availability: 'All Meta campaigns',
      example: 'mobile, desktop'
    },
    { 
      id: 'ad_format', 
      value: '{{ad.format}}', 
      label: 'Ad Format', 
      category: 'creative', 
      description: 'Format of the ad creative',
      availability: 'All Meta campaigns',
      example: 'carousel, video'
    },
    
    // E-commerce Parameters (Optional)
    { 
      id: 'product_id', 
      value: '{{product.id}}', 
      label: 'Product ID', 
      category: 'ecommerce', 
      description: 'Product catalog item ID for Dynamic Product Ads',
      availability: 'Dynamic Product Ads only',
      example: '123456'
    }
  ], []);

  // Filter parameters based on search and category
  const filteredParams = useMemo(() => {
    return metaParams.filter(param => {
      const matchesSearch = param.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.availability.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || param.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [metaParams, searchTerm, selectedCategory]);

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

    // Add selected Meta parameters
    Object.entries(selectedParams).forEach(([paramId, isSelected]) => {
      if (isSelected) {
        const param = metaParams.find(p => p.id === paramId);
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
  }, [utmSource, utmMedium, utmCampaign, utmContent, includeUtmContent, selectedParams, customParams, metaParams]);

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
      includeUtmContent, // Save individual toggles
      selectedParams, customParams, timestamp: Date.now()
    };
    
    const newTemplates = { ...savedTemplates, [templateName]: template };
    setSavedTemplates(newTemplates);
    localStorage.setItem('meta_ads_templates', JSON.stringify(newTemplates));
    
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
    localStorage.setItem('meta_ads_templates', JSON.stringify(newTemplates));
    
    // Clear selection and loaded template if it was the deleted one
    setSelectedTemplate('');
    if (loadedTemplateName === templateToDelete) {
      setLoadedTemplateName('');
    }
    
    success(`Template "${templateToDelete}" deleted successfully!`);
  }, [selectedTemplate, savedTemplates, loadedTemplateName, success, error]);

  // Reset all fields
  const resetFields = useCallback(() => {
    setUtmSource('{{site_source_name}}');
    setUtmMedium('paid_social');
    setUtmCampaign('{{campaign.name}}');
    setUtmContent('{{ad.name}}');
    setIncludeUtmContent(true);
    setSelectedParams({}); // RESET TO EMPTY OBJECT
    setCustomParams([]);
    setLoadedTemplateName('');
    success('Form reset successfully!');
  }, [success]);

  // Load saved templates on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('meta_ads_templates');
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
    { value: 'placement', label: 'Placement & Platform' },
    { value: 'device', label: 'Device & Format' },
    { value: 'creative', label: 'Creative' },
    { value: 'ecommerce', label: 'E-commerce' }
  ];

  // Get category badge color
  const getCategoryBadge = (category: string) => {
    const badges = {
      campaign: { variant: 'info' as const, label: 'Campaign' },
      adset: { variant: 'success' as const, label: 'Ad Set' },
      ad: { variant: 'warning' as const, label: 'Ad' },
      placement: { variant: 'default' as const, label: 'Placement' },
      device: { variant: 'info' as const, label: 'Device' },
      creative: { variant: 'success' as const, label: 'Creative' },
      ecommerce: { variant: 'warning' as const, label: 'E-commerce' }
    };
    
    const badge = badges[category as keyof typeof badges];
    return badge ? <Badge variant={badge.variant} size="sm">{badge.label}</Badge> : null;
  };

  return (
    <div className="space-y-8">
      {/* Video Tutorial Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
              <Play className="w-4 h-4" />
              Meta Ads Parameter Builder
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-xs">
              Generate URL parameter strings for Meta's "URL Parameters" field - no website URL needed
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
              <h3 className="text-lg font-semibold">Meta Ads Parameter Tutorial</h3>
              <Button onClick={() => setShowVideoModal(false)} variant="ghost" icon={X} size="sm" />
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    Meta Ads Parameter Tutorial Placeholder
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Replace with your Meta Ads parameter tutorial video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UTM Parameters - REMOVED ACCORDION WRAPPER */}
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
              placeholder="e.g., facebook or {{site_source_name}}"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Meta may set this automatically
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
              placeholder="e.g., paid_social or {{placement}}"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Recommended: paid_social for Meta ads
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
              placeholder="e.g., summer_sale or {{campaign.name}}"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
          </div>
        </div>

        {/* STREAMLINED: OPTIONAL UTM PARAMETERS - INLINE DESIGN - REMOVED UTM_TERM */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Optional UTM Parameters
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
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
              <Dropdown
                options={contentOptions}
                value={utmContent}
                onChange={setUtmContent}
                placeholder="e.g., video_ad_variant_1 or {{ad.name}}"
                searchable
                clearable
                allowCustom
                groupByCategory
                disabled={!includeUtmContent}
                className={`w-full ${!includeUtmContent ? 'opacity-50' : ''}`}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Differentiate ads within the same campaign
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Parameter String - MOVED HERE ABOVE THE FOLD */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Generated Meta Ads Parameter String
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
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700 shadow-inner">
          <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
            {generatedString || 'Configure parameters to generate string...'}
          </code>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Usage Instructions</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Copy this parameter string and paste it into Meta's "URL Parameters" field in your ad campaign setup. 
                It will be automatically appended to your destination URLs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meta Parameters - NEW SECTION SIMILAR TO GOOGLE ADS/MICROSOFT ADS */}
      <Accordion 
        title="Meta Dynamic Parameters" 
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
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
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
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                📋 Loaded Template: "{loadedTemplateName}"
              </h4>
              <Button
                onClick={copyCurrentTemplate}
                variant="secondary"
                size="sm"
                icon={Copy}
                className="text-blue-600 hover:text-blue-700"
              >
                Copy String
              </Button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
              <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                {generatedString}
              </code>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              ✅ Template loaded successfully! This shows the current generated parameter string.
            </p>
          </div>
        )}
      </Accordion>

      {/* Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Meta Ads Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <a href="https://www.facebook.com/business/help/1016122818401732" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>📖</span> URL Parameters Guide
            </a>
            <a href="https://www.facebook.com/business/help/2040882842645560" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>🔗</span> Dynamic Parameters Documentation
            </a>
          </div>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <button onClick={() => setShowVideoModal(true)} className="flex items-center gap-2 hover:underline text-left">
              <Play size={16} /> Watch Tutorial Video
            </button>
            <a href="https://www.facebook.com/business/help/435189689870514" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
              <span>⚙️</span> Conversion Tracking Setup
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaAdsBuilder;