import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Search, X, Save, Download, Upload, Play, RefreshCw, Zap, Filter, Settings, Target, Globe, Info, AlertTriangle, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Accordion from '../common/Accordion';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';

const MicrosoftAdsBuilder: React.FC = () => {
  const [utmSource, setUtmSource] = useState('bing');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('{Campaign}');
  const [utmTerm, setUtmTerm] = useState('{keyword:default}');
  const [utmContent, setUtmContent] = useState('{AdId}');
  
  // UPDATED: Individual optional parameter toggles
  const [includeUtmTerm, setIncludeUtmTerm] = useState(true);
  const [includeUtmContent, setIncludeUtmContent] = useState(true);
  
  const [selectedParams, setSelectedParams] = useState<Record<string, boolean>>({});
  const [conditionalParams, setConditionalParams] = useState<Record<string, string>>({});
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedTemplates, setSavedTemplates] = useState<Record<string, any>>({});
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loadedTemplateName, setLoadedTemplateName] = useState('');
  const { success, error } = useToast();

  // Enhanced Microsoft Ads parameters with comprehensive data - REORGANIZED WITH CONDITIONAL AND DEFAULT VALUE PARAMS
  const msAdsParams = useMemo(() => [
    // General Campaign & Ad Parameters - SORTED A-Z
    { id: 'AdGroup', value: '{AdGroup}', label: 'Ad Group Name', category: 'general', description: 'The name of the ad group', availability: 'All campaign types' },
    { id: 'AdGroupId', value: '{AdGroupId}', label: 'Ad Group ID', category: 'general', description: 'The unique numeric ID of the ad group', availability: 'All campaign types' },
    { id: 'AdId', value: '{AdId}', label: 'Ad ID', category: 'general', description: 'The unique numeric ID of the ad', availability: 'All campaign types' },
    { id: 'Campaign', value: '{Campaign}', label: 'Campaign Name', category: 'general', description: 'The name of the campaign', availability: 'All campaign types' },
    { id: 'CampaignId', value: '{CampaignId}', label: 'Campaign ID', category: 'general', description: 'The unique numeric ID of the campaign', availability: 'All campaign types' },

    // Targeting & Matching - SORTED A-Z
    { id: 'BidMatchType', value: '{BidMatchType}', label: 'Bid Match Type', category: 'targeting', description: 'The match type you are actually bidding on for the keyword. Values: be (bidded exact), bp (bidded phrase), bb (bidded broad)', availability: 'Search campaigns' },
    { id: 'loc_interest_ms', value: '{loc_interest_ms}', label: 'Location Interest ID', category: 'targeting', description: 'The geographical location code for the location of interest that triggered the ad', availability: 'All campaign types' },
    { id: 'loc_physical_ms', value: '{loc_physical_ms}', label: 'Location Physical ID', category: 'targeting', description: 'The geographical location code of where the user was physically located when they clicked', availability: 'All campaign types' },
    { id: 'MatchType', value: '{MatchType}', label: 'Match Type', category: 'targeting', description: 'The match type of the user\'s search query that delivered the ad. Values: e (exact), p (phrase), b (broad/expanded)', availability: 'Search campaigns' },
    { id: 'TargetId', value: '{TargetId}', label: 'Target ID', category: 'targeting', description: 'The ID of the specific targeting criteria that triggered the ad (e.g., keyword, remarketing list, audience). Can contain multiple IDs', availability: 'All campaign types' },

    // Network & Device - SORTED A-Z
    { id: 'Device', value: '{Device}', label: 'Device Type', category: 'network', description: 'The type of device the ad was clicked on. Values: m (mobile), t (tablet), c (computer/laptop)', availability: 'All campaign types' },
    { id: 'Network', value: '{Network}', label: 'Network', category: 'network', description: 'The ad network where the ad was served. Values: o (owned & operated: Bing, AOL, Yahoo), s (syndicated partners), a (audience network)', availability: 'All campaign types' },

    // Tracking & Keyword Details - SORTED A-Z - NOW INCLUDES DEFAULT VALUE PARAMS
    { id: 'feeditemid', value: '{feeditemid}', label: 'Feed Item ID', category: 'tracking', description: 'The ID of the specific ad extension that was clicked', availability: 'All campaign types with extensions' },
    { id: 'keyword', value: '{keyword:default}', label: 'Keyword (Default Required)', category: 'tracking', description: 'The keyword that matched the user\'s search. You must provide a default value (e.g., {keyword:none})', availability: 'Search campaigns', requiresDefault: true, defaultPlaceholder: 'none' },
    { id: 'msclkid', value: '{msclkid}', label: 'MS Click ID', category: 'tracking', description: 'A unique click ID generated by Microsoft Advertising for conversion tracking. Essential for auto-tagging', availability: 'All campaign types' },
    { id: 'QueryString', value: '{QueryString}', label: 'Query String', category: 'tracking', description: 'The exact search query text the user entered', availability: 'Search campaigns' },

    // Conditional Parameters - SORTED A-Z - NOW PART OF MAIN DROPDOWN
    { id: 'IfMobile', value: '{IfMobile:[value]}', label: 'If Mobile (Conditional)', category: 'conditional', description: 'Inserts your defined string if the ad is displayed on a mobile device', availability: 'All campaign types', isConditional: true, defaultPlaceholder: 'mobile_visitor' },
    { id: 'IfNative', value: '{IfNative:[value]}', label: 'If Native (Conditional)', category: 'conditional', description: 'Inserts your defined string if the ad is displayed as a Microsoft Audience ad', availability: 'Audience campaigns', isConditional: true, defaultPlaceholder: 'audience_ad_traffic' },
    { id: 'IfNotMobile', value: '{IfNotMobile:[value]}', label: 'If Not Mobile (Conditional)', category: 'conditional', description: 'Inserts your defined string if the ad is displayed on a computer, laptop, or tablet', availability: 'All campaign types', isConditional: true, defaultPlaceholder: 'desktop_visitor' },
    { id: 'IfPLA', value: '{IfPLA:[value]}', label: 'If PLA (Conditional)', category: 'conditional', description: 'Inserts your defined string if the ad is displayed as a Product Listing Ad (Shopping)', availability: 'Shopping campaigns', isConditional: true, defaultPlaceholder: 'product_ad_traffic' },
    { id: 'IfSearch', value: '{IfSearch:[value]}', label: 'If Search (Conditional)', category: 'conditional', description: 'Inserts your defined string if the ad is displayed on search placements', availability: 'Search campaigns', isConditional: true, defaultPlaceholder: 'search_traffic' },

    // Microsoft Shopping Campaigns Only - SORTED A-Z
    { id: 'CriterionId', value: '{CriterionId}', label: 'Criterion ID', category: 'shopping', description: 'The ID of the Microsoft Shopping product group. Same as {OrderItemId}', availability: 'Shopping campaigns only' },
    { id: 'product_channel', value: '{product_channel}', label: 'Product Channel', category: 'shopping', description: 'The product\'s shopping channel (online or local)', availability: 'Shopping campaigns only' },
    { id: 'product_country', value: '{product_country}', label: 'Product Country', category: 'shopping', description: 'The country of sale for the product (e.g., US)', availability: 'Shopping campaigns only' },
    { id: 'product_language', value: '{product_language}', label: 'Product Language', category: 'shopping', description: 'The language of the product info (e.g., EN)', availability: 'Shopping campaigns only' },
    { id: 'ProductId', value: '{ProductId}', label: 'Product ID', category: 'shopping', description: 'The numeric ID of the product from your Merchant Center catalog', availability: 'Shopping campaigns only' },
    { id: 'seller_name', value: '{seller_name}', label: 'Seller Name', category: 'shopping', description: 'The seller or store name from the product feed', availability: 'Shopping campaigns only' },

    // Microsoft Lodging Campaigns Only - SORTED A-Z
    { id: 'hotelcenter_id', value: '{hotelcenter_id}', label: 'Hotel Center ID', category: 'hotel', description: 'The ID of the Hotel Center account', availability: 'Hotel campaigns only' },
    { id: 'hotel_adtype', value: '{hotel_adtype}', label: 'Hotel Ad Type', category: 'hotel', description: 'Hotel or Room depending on the ad clicked', availability: 'Hotel campaigns only' },
    { id: 'hotel_partition_id', value: '{hotel_partition_id}', label: 'Hotel Partition ID', category: 'hotel', description: 'The unique ID of the hotel\'s property group', availability: 'Hotel campaigns only' },
    { id: 'property_id', value: '{property_id}', label: 'Property ID', category: 'hotel', description: 'The ID of the property from the property feed', availability: 'Hotel campaigns only' },
    { id: 'travel_end_day', value: '{travel_end_day}', label: 'Travel End Day', category: 'hotel', description: 'The check-out date day', availability: 'Hotel campaigns only' },
    { id: 'travel_end_month', value: '{travel_end_month}', label: 'Travel End Month', category: 'hotel', description: 'The check-out date month', availability: 'Hotel campaigns only' },
    { id: 'travel_end_year', value: '{travel_end_year}', label: 'Travel End Year', category: 'hotel', description: 'The check-out date year', availability: 'Hotel campaigns only' },
    { id: 'travel_start_day', value: '{travel_start_day}', label: 'Travel Start Day', category: 'hotel', description: 'The check-in date day', availability: 'Hotel campaigns only' },
    { id: 'travel_start_month', value: '{travel_start_month}', label: 'Travel Start Month', category: 'hotel', description: 'The check-in date month', availability: 'Hotel campaigns only' },
    { id: 'travel_start_year', value: '{travel_start_year}', label: 'Travel Start Year', category: 'hotel', description: 'The check-in date year', availability: 'Hotel campaigns only' },
    { id: 'user_currency', value: '{user_currency}', label: 'User Currency', category: 'hotel', description: 'The user\'s three-letter local currency code (e.g., USD)', availability: 'Hotel campaigns only' },
    { id: 'user_language', value: '{user_language}', label: 'User Language', category: 'hotel', description: 'The user\'s two-letter language code (e.g., en)', availability: 'Hotel campaigns only' }
  ], []);

  // Filter parameters based on search and category
  const filteredParams = useMemo(() => {
    return msAdsParams.filter(param => {
      const matchesSearch = param.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.availability.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || param.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [msAdsParams, searchTerm, selectedCategory]);

  // UPDATED: Handle individual optional parameter toggles with default value restoration
  const handleUtmTermToggle = useCallback((enabled: boolean) => {
    setIncludeUtmTerm(enabled);
    
    // If enabling and field is empty, restore default
    if (enabled && !utmTerm.trim()) {
      setUtmTerm('{keyword:default}');
    }
  }, [utmTerm]);

  const handleUtmContentToggle = useCallback((enabled: boolean) => {
    setIncludeUtmContent(enabled);
    
    // If enabling and field is empty, restore default
    if (enabled && !utmContent.trim()) {
      setUtmContent('{AdId}');
    }
  }, [utmContent]);

  // Generate tracking template
  const generateTemplate = useCallback(() => {
    const params = [];
    
    // Add UTM parameters - REQUIRED FIELDS ALWAYS INCLUDED
    if (utmSource) params.push(`utm_source=${utmSource}`);
    if (utmMedium) params.push(`utm_medium=${utmMedium}`);
    if (utmCampaign) params.push(`utm_campaign=${utmCampaign}`);
    
    // Add optional UTM parameters only if individually enabled
    if (includeUtmTerm && utmTerm) params.push(`utm_term=${utmTerm}`);
    if (includeUtmContent && utmContent) params.push(`utm_content=${utmContent}`);
    
    // Add selected parameters
    Object.entries(selectedParams).forEach(([paramId, isSelected]) => {
      if (isSelected) {
        const param = msAdsParams.find(p => p.id === paramId);
        if (param) {
          if (param.isConditional) {
            // Handle conditional parameters
            const customValue = conditionalParams[paramId];
            if (customValue && customValue.trim()) {
              // Replace [value] with actual custom value
              const finalValue = param.value.replace('[value]', customValue);
              params.push(`${paramId.toLowerCase()}=${finalValue}`);
            }
          } else if (param.requiresDefault) {
            // Handle parameters requiring default values
            const defaultValue = conditionalParams[paramId] || param.defaultPlaceholder;
            if (defaultValue && defaultValue.trim()) {
              const finalValue = param.value.replace('default', defaultValue);
              params.push(`${paramId.toLowerCase()}=${finalValue}`);
            }
          } else {
            // Regular parameters
            params.push(`${paramId.toLowerCase()}=${param.value}`);
          }
        }
      }
    });
    
    const baseUrl = '{lpurl}';
    const finalUrl = params.length > 0 ? `${baseUrl}?${params.join('&')}` : baseUrl;
    setGeneratedUrl(finalUrl);
  }, [utmSource, utmMedium, utmCampaign, utmTerm, utmContent, includeUtmTerm, includeUtmContent, selectedParams, conditionalParams, msAdsParams]);

  // Auto-generate when parameters change
  React.useEffect(() => {
    generateTemplate();
  }, [generateTemplate]);

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
      success('Template copied to clipboard!');
    } catch (err) {
      error('Failed to copy template');
      console.error('Failed to copy:', err);
    }
  };

  // Copy current generated URL (for loaded template preview)
  const copyCurrentTemplate = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      success('Current template URL copied to clipboard!');
    } catch (err) {
      error('Failed to copy template URL');
    }
  };

  // Template management with toast notifications
  const saveTemplate = useCallback(() => {
    if (!templateName.trim()) {
      error('Please enter a template name');
      return;
    }
    
    const template = {
      utmSource, utmMedium, utmCampaign, utmTerm, utmContent, 
      includeUtmTerm, includeUtmContent, // Save individual toggles
      selectedParams, conditionalParams,
      timestamp: Date.now()
    };
    
    const newTemplates = { ...savedTemplates, [templateName]: template };
    setSavedTemplates(newTemplates);
    localStorage.setItem('microsoft_ads_templates', JSON.stringify(newTemplates));
    
    success(`Template "${templateName}" saved successfully!`);
    setTemplateName('');
  }, [templateName, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, includeUtmTerm, includeUtmContent, selectedParams, conditionalParams, savedTemplates, success, error]);

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
    
    // Load individual toggles (with fallback for old templates)
    setIncludeUtmTerm(template.includeUtmTerm ?? true);
    setIncludeUtmContent(template.includeUtmContent ?? true);
    
    setSelectedParams(template.selectedParams);
    setConditionalParams(template.conditionalParams);
    
    // Set loaded template name for preview
    setLoadedTemplateName(selectedTemplate);
    
    success(`Template "${selectedTemplate}" loaded successfully!`);
  }, [selectedTemplate, savedTemplates, success, error]);

  // NEW: Delete template functionality
  const deleteTemplate = useCallback(() => {
    if (!selectedTemplate || !savedTemplates[selectedTemplate]) {
      error('Please select a template to delete');
      return;
    }
    
    const templateToDelete = selectedTemplate;
    const newTemplates = { ...savedTemplates };
    delete newTemplates[templateToDelete];
    
    setSavedTemplates(newTemplates);
    localStorage.setItem('microsoft_ads_templates', JSON.stringify(newTemplates));
    
    // Clear selection and loaded template if it was the deleted one
    setSelectedTemplate('');
    if (loadedTemplateName === templateToDelete) {
      setLoadedTemplateName('');
    }
    
    success(`Template "${templateToDelete}" deleted successfully!`);
  }, [selectedTemplate, savedTemplates, loadedTemplateName, success, error]);

  // Reset all fields
  const resetFields = useCallback(() => {
    setUtmSource('bing');
    setUtmMedium('cpc');
    setUtmCampaign('{Campaign}');
    setUtmTerm('{keyword:default}');
    setUtmContent('{AdId}');
    setIncludeUtmTerm(true);
    setIncludeUtmContent(true);
    setSelectedParams({});
    setConditionalParams({});
    setSearchTerm('');
    setSelectedCategory('all');
    setLoadedTemplateName('');
    success('Form reset successfully!');
  }, [success]);

  // Load saved templates on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('microsoft_ads_templates');
    if (saved) {
      try {
        setSavedTemplates(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved templates:', error);
      }
    }
  }, []);

  // UPDATED CATEGORIES - A-Z ORDER WITH CONDITIONAL CATEGORY
  const categories = [
    { value: 'all', label: 'All Parameters' },
    { value: 'conditional', label: 'Conditional Logic' },
    { value: 'general', label: 'General Campaign & Ad' },
    { value: 'hotel', label: 'Hotel Campaigns' },
    { value: 'network', label: 'Network & Device' },
    { value: 'shopping', label: 'Shopping Campaigns' },
    { value: 'targeting', label: 'Targeting & Matching' },
    { value: 'tracking', label: 'Tracking & Keywords' }
  ];

  // Get category badge color
  const getCategoryBadge = (category: string) => {
    const badges = {
      general: { variant: 'info' as const, label: 'General' },
      targeting: { variant: 'success' as const, label: 'Targeting' },
      network: { variant: 'warning' as const, label: 'Network' },
      tracking: { variant: 'default' as const, label: 'Tracking' },
      shopping: { variant: 'info' as const, label: 'Shopping' },
      hotel: { variant: 'success' as const, label: 'Hotel' },
      conditional: { variant: 'info' as const, label: 'Conditional' }
    };
    
    const badge = badges[category as keyof typeof badges];
    return badge ? <Badge variant={badge.variant} size="sm">{badge.label}</Badge> : null;
  };

  // Check if parameter needs special input handling
  const needsSpecialInput = (param: any) => {
    return param.isConditional || param.requiresDefault;
  };

  return (
    <div className="space-y-8">
      {/* Video Tutorial Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-purple-900 dark:text-purple-100 mb-1 flex items-center gap-2">
              <Play className="w-4 h-4" />
              Microsoft Ads Tracking Tutorial
            </h3>
            <p className="text-purple-700 dark:text-purple-300 text-xs">
              Master Microsoft Advertising tracking templates and URL parameters
            </p>
          </div>
          <Button
            onClick={() => setShowVideoModal(true)}
            icon={Play}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
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
              <h3 className="text-lg font-semibold">Microsoft Ads Tracking Tutorial</h3>
              <Button onClick={() => setShowVideoModal(false)} variant="ghost" icon={X} size="sm" />
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    Microsoft Ads Tutorial Placeholder
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Replace with your Microsoft Ads tracking tutorial video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Base URL & UTM Parameters - STREAMLINED DESIGN */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Base URL & UTM Parameters
          </h3>
          <Badge variant="info" size="sm">Required</Badge>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Base URL (Dynamic)
          </label>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg font-mono text-sm">
            {'{lpurl}'}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This will be dynamically replaced by Microsoft Advertising with your ad's final URL
          </p>
        </div>

        {/* REQUIRED UTM PARAMETERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            label="Campaign Source"
            value={utmSource}
            onChange={(e) => setUtmSource(e.target.value)}
            placeholder="bing"
            required
            helperText="Traffic source (e.g., bing, microsoft)"
          />
          <Input
            label="Campaign Medium"
            value={utmMedium}
            onChange={(e) => setUtmMedium(e.target.value)}
            placeholder="cpc"
            required
            helperText="Marketing medium (e.g., cpc, display)"
          />
          <Input
            label="Campaign Name"
            value={utmCampaign}
            onChange={(e) => setUtmCampaign(e.target.value)}
            placeholder="{Campaign}"
            required
            helperText="Campaign identifier"
          />
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
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="include-utm-term" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Campaign Term (utm_term)
                </label>
              </div>
              <Input
                value={utmTerm}
                onChange={(e) => setUtmTerm(e.target.value)}
                placeholder="{keyword:default}"
                disabled={!includeUtmTerm}
                helperText="Keywords for paid search"
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
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="include-utm-content" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Campaign Content (utm_content)
                </label>
              </div>
              <Input
                value={utmContent}
                onChange={(e) => setUtmContent(e.target.value)}
                placeholder="{AdId}"
                disabled={!includeUtmContent}
                helperText="Ad identifier"
                className={!includeUtmContent ? 'opacity-50' : ''}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Generated Template - MOVED HERE ABOVE THE FOLD */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Generated Tracking Template
          </h2>
          <Button
            onClick={copyToClipboard}
            disabled={!generatedUrl}
            icon={copiedUrl ? Check : Copy}
            variant={copiedUrl ? 'success' : 'primary'}
            size="lg"
          >
            {copiedUrl ? 'Copied!' : 'Copy Template'}
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-700 shadow-inner">
          <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
            {generatedUrl || 'Configure parameters to generate template...'}
          </code>
        </div>
      </div>

      {/* Microsoft Advertising Parameters - SIMPLIFIED SINGLE SECTION */}
      <Accordion 
        title="Microsoft Advertising Parameters" 
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
                  
                  // Initialize conditional/default value if needed
                  if (needsSpecialInput(param) && e.target.checked && !conditionalParams[param.id]) {
                    setConditionalParams(prev => ({
                      ...prev,
                      [param.id]: param.defaultPlaceholder || ''
                    }));
                  }
                }}
                className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <label htmlFor={param.id} className="block text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                    {param.label}
                  </label>
                  {getCategoryBadge(param.category)}
                  {param.isConditional && (
                    <Badge variant="info" size="sm">Conditional</Badge>
                  )}
                  {param.requiresDefault && (
                    <Badge variant="warning" size="sm">Default Required</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {param.description}
                </p>
                <div className="space-y-1">
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block">
                    {param.value}
                  </code>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    {param.availability}
                  </div>
                </div>
                
                {/* Special Input for Conditional and Default Value Parameters */}
                {needsSpecialInput(param) && selectedParams[param.id] && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <Input
                      label={param.isConditional ? "Custom Value" : "Default Value"}
                      placeholder={param.defaultPlaceholder}
                      value={conditionalParams[param.id] || ''}
                      onChange={(e) => setConditionalParams(prev => ({
                        ...prev,
                        [param.id]: e.target.value
                      }))}
                      helperText={
                        param.isConditional 
                          ? "This value will be passed when the condition is met"
                          : "This value will be used when the parameter is not available"
                      }
                    />
                  </div>
                )}
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

      {/* Template Management - UPDATED WITH DELETE BUTTON */}
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
                    platform: 'microsoftAds',
                    version: '1.0'
                  };
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `microsoft-ads-templates-${new Date().toISOString().split('T')[0]}.json`;
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
                            localStorage.setItem('microsoft_ads_templates', JSON.stringify(newTemplates));
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
                  id="import-templates-microsoft"
                />
                <Button
                  onClick={() => document.getElementById('import-templates-microsoft')?.click()}
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
        {loadedTemplateName && generatedUrl && (
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                📋 Loaded Template: "{loadedTemplateName}"
              </h4>
              <Button
                onClick={copyCurrentTemplate}
                variant="secondary"
                size="sm"
                icon={Copy}
                className="text-purple-600 hover:text-purple-700"
              >
                Copy URL
              </Button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
              <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                {generatedUrl}
              </code>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
              ✅ Template loaded successfully! This shows the current generated URL based on the loaded parameters.
            </p>
          </div>
        )}
      </Accordion>

    </div>
  );
};

export default MicrosoftAdsBuilder;