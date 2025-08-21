import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Search, X, Save, Download, Upload, Play, RefreshCw, Plus, Trash2, Zap, Globe, Settings, Target, Filter } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Accordion from '../common/Accordion';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';

const GoogleAdsBuilder: React.FC = () => {
  const [utmSource, setUtmSource] = useState('google');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('{campaignid}');
  const [utmTerm, setUtmTerm] = useState('{keyword}');
  const [utmContent, setUtmContent] = useState('{creative}');
  
  // Individual optional parameter toggles
  const [includeUtmTerm, setIncludeUtmTerm] = useState(true);
  const [includeUtmContent, setIncludeUtmContent] = useState(true);
  
  const [selectedParams, setSelectedParams] = useState<Record<string, boolean>>({});
  const [conditionalParams, setConditionalParams] = useState<Record<string, string>>({});
  const [customParams, setCustomParams] = useState<Array<{key: string, value: string}>>([]);
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

  // Categories for filtering - MOVED TO TOP BEFORE ANY USAGE
  const categories = [
    { value: 'all', label: 'All Parameters' },
    { value: 'universal', label: 'Standard Parameters' },
    { value: 'conditional', label: 'Conditional Logic' },
    { value: 'shopping', label: 'Shopping Campaigns' },
    { value: 'video', label: 'Video Campaigns' },
    { value: 'hotel', label: 'Hotel Campaigns' },
    { value: 'pmax', label: 'Performance Max' }
  ];

  // Enhanced ValueTrack parameters with complete Google Ads data
  const valueTrackParams = useMemo(() => [
    // Standard Parameters (Available across most campaign types)
    { id: 'adgroupid', value: '{adgroupid}', label: 'Ad Group ID', category: 'universal', description: 'The ad group ID', availability: 'All campaign types' },
    { id: 'campaignid', value: '{campaignid}', label: 'Campaign ID', category: 'universal', description: 'The campaign ID', availability: 'All campaign types' },
    { id: 'feeditemid', value: '{feeditemid}', label: 'Feed Item ID', category: 'universal', description: 'The ID of the feed-based or legacy asset that was clicked', availability: 'All campaign types' },
    { id: 'extensionid', value: '{extensionid}', label: 'Extension ID', category: 'universal', description: 'The ID of the asset-based or upgraded asset that was clicked', availability: 'All campaign types' },
    { id: 'targetid', value: '{targetid}', label: 'Target ID', category: 'universal', description: 'The ID of the keyword, dynamic search ad target, remarketing list, or product partition that triggered the ad', availability: 'All campaign types' },
    { id: 'loc_interest_ms', value: '{loc_interest_ms}', label: 'Location Interest ID', category: 'universal', description: 'The ID of the location of interest', availability: 'All campaign types' },
    { id: 'loc_physical_ms', value: '{loc_physical_ms}', label: 'Location Physical ID', category: 'universal', description: 'The ID of the geographical location of the click', availability: 'All campaign types' },
    { id: 'matchtype', value: '{matchtype}', label: 'Match Type', category: 'universal', description: 'The match type of the keyword ("e" for exact, "p" for phrase, or "b" for broad)', availability: 'All campaign types' },
    { id: 'network', value: '{network}', label: 'Network', category: 'universal', description: 'Where the click came from ("g" for Google search, "s" for search partners, "d" for Display Network, etc.)', availability: 'All campaign types' },
    { id: 'device', value: '{device}', label: 'Device Type', category: 'universal', description: 'The device the click came from ("m" for mobile, "t" for tablet, and "c" for computer)', availability: 'All campaign types' },
    { id: 'devicemodel', value: '{devicemodel}', label: 'Device Model', category: 'universal', description: 'The model of the phone or tablet', availability: 'All campaign types' },
    { id: 'gclid', value: '{gclid}', label: 'Google Click ID', category: 'universal', description: 'The Google click identifier', availability: 'All campaign types' },
    { id: 'creative', value: '{creative}', label: 'Creative ID', category: 'universal', description: 'A unique ID for your ad', availability: 'All campaign types' },
    { id: 'keyword', value: '{keyword}', label: 'Keyword', category: 'universal', description: 'The keyword from your account that matches the search query', availability: 'All campaign types' },
    { id: 'placement', value: '{placement}', label: 'Placement', category: 'universal', description: 'The content site where your ad was clicked', availability: 'All campaign types' },
    { id: 'target', value: '{target}', label: 'Target', category: 'universal', description: 'A placement category', availability: 'All campaign types' },
    { id: 'param1', value: '{param1}', label: 'Creative Parameter 1', category: 'universal', description: 'Creative parameter #1', availability: 'All campaign types' },
    { id: 'param2', value: '{param2}', label: 'Creative Parameter 2', category: 'universal', description: 'Creative parameter #2', availability: 'All campaign types' },
    { id: 'random', value: '{random}', label: 'Random Number', category: 'universal', description: 'A random Google-generated number', availability: 'All campaign types' },
    { id: 'lpurl', value: '{lpurl}', label: 'Landing Page URL', category: 'universal', description: 'The final URL', availability: 'All campaign types' },

    // Parameters with "IF" Functions (Conditional Logic)
    { id: 'ifmobile', value: '{ifmobile:[value]}', label: 'If Mobile', category: 'conditional', description: 'The defined value if the click is from a mobile phone', availability: 'All campaign types', isConditional: true, defaultPlaceholder: 'mobile_visitor' },
    { id: 'ifnotmobile', value: '{ifnotmobile:[value]}', label: 'If Not Mobile', category: 'conditional', description: 'The defined value if the click is from a computer or tablet', availability: 'All campaign types', isConditional: true, defaultPlaceholder: 'desktop_visitor' },
    { id: 'ifsearch', value: '{ifsearch:[value]}', label: 'If Search', category: 'conditional', description: 'The defined value if the click is from the Google Search Network', availability: 'All campaign types', isConditional: true, defaultPlaceholder: 'search_traffic' },
    { id: 'ifcontent', value: '{ifcontent:[value]}', label: 'If Content', category: 'conditional', description: 'The defined value if the click is from the Google Display Network', availability: 'All campaign types', isConditional: true, defaultPlaceholder: 'display_traffic' },

    // Shopping Campaigns Only
    { id: 'adtype', value: '{adtype}', label: 'Ad Type', category: 'shopping', description: 'The type of Shopping ad ("pla", "pla_multichannel", etc.)', availability: 'Shopping campaigns only' },
    { id: 'merchant_id', value: '{merchant_id}', label: 'Merchant ID', category: 'shopping', description: 'The ID of the Merchant Center account', availability: 'Shopping campaigns only' },
    { id: 'product_channel', value: '{product_channel}', label: 'Product Channel', category: 'shopping', description: 'The shopping channel ("online" or "local")', availability: 'Shopping campaigns only' },
    { id: 'product_id', value: '{product_id}', label: 'Product ID', category: 'shopping', description: 'The ID of the product', availability: 'Shopping campaigns only' },
    { id: 'product_country', value: '{product_country}', label: 'Product Country', category: 'shopping', description: 'The country of sale for the product', availability: 'Shopping campaigns only' },
    { id: 'product_language', value: '{product_language}', label: 'Product Language', category: 'shopping', description: 'The language of your product information', availability: 'Shopping campaigns only' },
    { id: 'product_partition_id', value: '{product_partition_id}', label: 'Product Partition ID', category: 'shopping', description: 'The unique ID for the product group', availability: 'Shopping campaigns only' },
    { id: 'store_code', value: '{store_code}', label: 'Store Code', category: 'shopping', description: 'The unique ID of the local store', availability: 'Shopping campaigns only' },

    // Video Campaigns Only
    { id: 'video_campaignid', value: '{campaignid}', label: 'Video Campaign ID', category: 'video', description: 'The campaign ID', availability: 'Video campaigns only' },
    { id: 'video_adgroupid', value: '{adgroupid}', label: 'Video Ad Group ID', category: 'video', description: 'The ad group ID', availability: 'Video campaigns only' },
    { id: 'video_creative', value: '{creative}', label: 'Video Creative ID', category: 'video', description: 'A unique ID for your ad', availability: 'Video campaigns only' },
    { id: 'video_device', value: '{device}', label: 'Video Device', category: 'video', description: 'The device the click came from', availability: 'Video campaigns only' },
    { id: 'video_loc_interest_ms', value: '{loc_interest_ms}', label: 'Video Location Interest', category: 'video', description: 'The ID of the location of interest', availability: 'Video campaigns only' },
    { id: 'video_loc_physical_ms', value: '{loc_physical_ms}', label: 'Video Location Physical', category: 'video', description: 'The ID of the geographical location of the click', availability: 'Video campaigns only' },
    { id: 'video_network', value: '{network}', label: 'Video Network', category: 'video', description: 'Where the click came from', availability: 'Video campaigns only' },
    { id: 'video_placement', value: '{placement}', label: 'Video Placement', category: 'video', description: 'The content site where your ad was clicked', availability: 'Video campaigns only' },
    { id: 'sourceid', value: '{sourceid}', label: 'Source ID', category: 'video', description: 'The source ID', availability: 'Video campaigns only' },

    // Hotel Campaigns Only
    { id: 'hotelcenter_id', value: '{hotelcenter_id}', label: 'Hotel Center ID', category: 'hotel', description: 'The ID of the Hotel Center account', availability: 'Hotel campaigns only' },
    { id: 'hotel_id', value: '{hotel_id}', label: 'Hotel ID', category: 'hotel', description: 'The hotel ID', availability: 'Hotel campaigns only' },
    { id: 'hotel_partition_id', value: '{hotel_partition_id}', label: 'Hotel Partition ID', category: 'hotel', description: 'The unique ID of the hotel group', availability: 'Hotel campaigns only' },
    { id: 'hotel_adtype', value: '{adtype}', label: 'Hotel Ad Type', category: 'hotel', description: 'The type of Hotel ad ("Hotel" or "Room")', availability: 'Hotel campaigns only' },
    { id: 'travel_start_day', value: '{travel_start_day}', label: 'Travel Start Day', category: 'hotel', description: 'The check-in date\'s day', availability: 'Hotel campaigns only' },
    { id: 'travel_start_month', value: '{travel_start_month}', label: 'Travel Start Month', category: 'hotel', description: 'The check-in date\'s month', availability: 'Hotel campaigns only' },
    { id: 'travel_start_year', value: '{travel_start_year}', label: 'Travel Start Year', category: 'hotel', description: 'The check-in date\'s year', availability: 'Hotel campaigns only' },
    { id: 'travel_end_day', value: '{travel_end_day}', label: 'Travel End Day', category: 'hotel', description: 'The check-out day', availability: 'Hotel campaigns only' },
    { id: 'travel_end_month', value: '{travel_end_month}', label: 'Travel End Month', category: 'hotel', description: 'The check-out month', availability: 'Hotel campaigns only' },
    { id: 'travel_end_year', value: '{travel_end_year}', label: 'Travel End Year', category: 'hotel', description: 'The check-out year', availability: 'Hotel campaigns only' },
    { id: 'advanced_booking_window', value: '{advanced_booking_window}', label: 'Advanced Booking Window', category: 'hotel', description: 'The number of days between the ad click and the check-in date', availability: 'Hotel campaigns only' },
    { id: 'date_type', value: '{date_type}', label: 'Date Type', category: 'hotel', description: '"default" or "selected."', availability: 'Hotel campaigns only' },
    { id: 'number_of_adults', value: '{number_of_adults}', label: 'Number of Adults', category: 'hotel', description: 'The number of adults shown in the ad', availability: 'Hotel campaigns only' },
    { id: 'price_displayed_total', value: '{price_displayed_total}', label: 'Price Displayed Total', category: 'hotel', description: 'The total cost of the room', availability: 'Hotel campaigns only' },
    { id: 'price_displayed_tax', value: '{price_displayed_tax}', label: 'Price Displayed Tax', category: 'hotel', description: 'The amount of taxes and fees', availability: 'Hotel campaigns only' },
    { id: 'user_currency', value: '{user_currency}', label: 'User Currency', category: 'hotel', description: 'The three-letter currency code', availability: 'Hotel campaigns only' },
    { id: 'user_language', value: '{user_language}', label: 'User Language', category: 'hotel', description: 'The two-letter language code', availability: 'Hotel campaigns only' },
    { id: 'rate_rule_id', value: '{rate_rule_id}', label: 'Rate Rule ID', category: 'hotel', description: 'The identifier of any special price', availability: 'Hotel campaigns only' },

    // Performance Max Parameters
    { id: 'pmax_assetgroupid', value: '{assetgroupid}', label: 'Asset Group ID', category: 'pmax', supportLevel: 'full', description: 'The asset group ID', availability: 'Performance Max (Full Support)' },
    { id: 'pmax_campaignid', value: '{campaignid}', label: 'Campaign ID', category: 'pmax', supportLevel: 'full', description: 'Campaign ID - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'pmax_device', value: '{device}', label: 'Device Type', category: 'pmax', supportLevel: 'full', description: 'Device type - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'pmax_ifmobile', value: '{ifmobile:[value]}', label: 'If Mobile', category: 'pmax', supportLevel: 'full', description: 'Mobile conditional - Full Support in PMAX', availability: 'Performance Max (Full Support)', isConditional: true, defaultPlaceholder: 'mobile_visitor' },
    { id: 'pmax_ifnotmobile', value: '{ifnotmobile:[value]}', label: 'If Not Mobile', category: 'pmax', supportLevel: 'full', description: 'Non-mobile conditional - Full Support in PMAX', availability: 'Performance Max (Full Support)', isConditional: true, defaultPlaceholder: 'desktop_visitor' },
    { id: 'pmax_loc_interest_ms', value: '{loc_interest_ms}', label: 'Location Interest ID', category: 'pmax', supportLevel: 'full', description: 'Interest location - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'pmax_loc_physical_ms', value: '{loc_physical_ms}', label: 'Location Physical ID', category: 'pmax', supportLevel: 'full', description: 'Physical location - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'pmax_lpurl', value: '{lpurl}', label: 'Landing Page URL', category: 'pmax', supportLevel: 'full', description: 'Landing page URL - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'pmax_random', value: '{random}', label: 'Random Number', category: 'pmax', supportLevel: 'full', description: 'Random number - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'pmax_adtype', value: '{adtype}', label: 'Ad Type', category: 'pmax', supportLevel: 'limited', description: 'Ad type - Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'pmax_gclid', value: '{gclid}', label: 'Google Click ID', category: 'pmax', supportLevel: 'limited', description: 'Google Click ID - Has limited support', availability: 'Performance Max (Limited Support)' },
    { id: 'pmax_merchant_id', value: '{merchant_id}', label: 'Merchant ID', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'pmax_product_channel', value: '{product_channel}', label: 'Product Channel', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'pmax_product_country', value: '{product_country}', label: 'Product Country', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'pmax_product_id', value: '{product_id}', label: 'Product ID', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'pmax_product_language', value: '{product_language}', label: 'Product Language', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' }
  ], []);

  // Filter parameters based on search and category
  const filteredParams = useMemo(() => {
    return valueTrackParams.filter(param => {
      const matchesSearch = param.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.availability.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || param.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [valueTrackParams, searchTerm, selectedCategory]);

  // Performance Max parameters organized by support level
  const pmaxParametersBySupport = useMemo(() => {
    const pmaxParameters = valueTrackParams.filter(param => param.category === 'pmax');
    
    const fullSupport = pmaxParameters
      .filter(param => param.supportLevel === 'full')
      .sort((a, b) => a.label.localeCompare(b.label));
    
    const limitedSupport = pmaxParameters
      .filter(param => param.supportLevel === 'limited')
      .sort((a, b) => a.label.localeCompare(b.label));
    
    return { fullSupport, limitedSupport };
  }, [valueTrackParams]);

  // Handle individual optional parameter toggles with default value restoration
  const handleUtmTermToggle = useCallback((enabled: boolean) => {
    setIncludeUtmTerm(enabled);
    
    // If enabling and field is empty, restore default
    if (enabled && !utmTerm.trim()) {
      setUtmTerm('{keyword}');
    }
  }, [utmTerm]);

  const handleUtmContentToggle = useCallback((enabled: boolean) => {
    setIncludeUtmContent(enabled);
    
    // If enabling and field is empty, restore default
    if (enabled && !utmContent.trim()) {
      setUtmContent('{creative}');
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
        const param = valueTrackParams.find(p => p.id === paramId);
        if (param) {
          if (param.isConditional) {
            // Handle conditional parameters
            const customValue = conditionalParams[paramId];
            if (customValue && customValue.trim()) {
              // Replace [value] with actual custom value
              const finalValue = param.value.replace('[value]', customValue);
              params.push(`${paramId.toLowerCase()}=${finalValue}`);
            }
          } else {
            // Regular parameters
            params.push(`${paramId.toLowerCase()}=${param.value}`);
          }
        }
      }
    });

    // Add custom parameters
    customParams.forEach(param => {
      if (param.key && param.value) {
        params.push(`${param.key}=${param.value}`);
      }
    });
    
    const baseUrl = '{lpurl}';
    const finalUrl = params.length > 0 ? `${baseUrl}?${params.join('&')}` : baseUrl;
    setGeneratedUrl(finalUrl);
  }, [utmSource, utmMedium, utmCampaign, utmTerm, utmContent, includeUtmTerm, includeUtmContent, selectedParams, conditionalParams, customParams, valueTrackParams]);

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
      includeUtmTerm, includeUtmContent,
      selectedParams, conditionalParams, customParams,
      timestamp: Date.now()
    };
    
    const newTemplates = { ...savedTemplates, [templateName]: template };
    setSavedTemplates(newTemplates);
    localStorage.setItem('google_ads_templates', JSON.stringify(newTemplates));
    
    success(`Template "${templateName}" saved successfully!`);
    setTemplateName('');
  }, [templateName, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, includeUtmTerm, includeUtmContent, selectedParams, conditionalParams, customParams, savedTemplates, success, error]);

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
    localStorage.setItem('google_ads_templates', JSON.stringify(newTemplates));
    
    // Clear selection and loaded template if it was the deleted one
    setSelectedTemplate('');
    if (loadedTemplateName === templateToDelete) {
      setLoadedTemplateName('');
    }
    
    success(`Template "${templateToDelete}" deleted successfully!`);
  }, [selectedTemplate, savedTemplates, loadedTemplateName, success, error]);

  // Reset all fields
  const resetFields = useCallback(() => {
    setUtmSource('google');
    setUtmMedium('cpc');
    setUtmCampaign('{campaignid}');
    setUtmTerm('{keyword}');
    setUtmContent('{creative}');
    setIncludeUtmTerm(true);
    setIncludeUtmContent(true);
    setSelectedParams({});
    setConditionalParams({});
    setCustomParams([]);
    setSearchTerm('');
    setSelectedCategory('all');
    setLoadedTemplateName('');
    success('Form reset successfully!');
  }, [success]);

  // Load saved templates on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('google_ads_templates');
    if (saved) {
      try {
        setSavedTemplates(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved templates:', error);
      }
    }
  }, []);

  // Get category badge color
  const getCategoryBadge = (category: string) => {
    const badges = {
      universal: { variant: 'info' as const, label: 'Standard' },
      conditional: { variant: 'warning' as const, label: 'Conditional' },
      shopping: { variant: 'success' as const, label: 'Shopping' },
      video: { variant: 'default' as const, label: 'Video' },
      hotel: { variant: 'info' as const, label: 'Hotel' },
      pmax: { variant: 'success' as const, label: 'Performance Max' }
    };
    
    const badge = badges[category as keyof typeof badges];
    return badge ? <Badge variant={badge.variant} size="sm">{badge.label}</Badge> : null;
  };

  // Check if parameter needs special input handling
  const needsSpecialInput = (param: any) => {
    return param.isConditional;
  };

  // Render Performance Max parameters with support levels
  const renderPmaxParameters = () => (
    <div className="space-y-6">
      {/* Full Support Parameters */}
      <div>
        <h4 className="text-md font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
          <Badge variant="success" size="sm">Full Support</Badge>
          Fully Supported in Performance Max
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pmaxParametersBySupport.fullSupport.map(param => (
            <div key={param.id} className="flex items-start space-x-3 p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <input
                type="checkbox"
                id={param.id}
                checked={selectedParams[param.id] || false}
                onChange={(e) => {
                  setSelectedParams(prev => ({
                    ...prev,
                    [param.id]: e.target.checked
                  }));
                  
                  // Initialize conditional value if needed
                  if (needsSpecialInput(param) && e.target.checked && !conditionalParams[param.id]) {
                    setConditionalParams(prev => ({
                      ...prev,
                      [param.id]: param.defaultPlaceholder || ''
                    }));
                  }
                }}
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <label htmlFor={param.id} className="block text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                    {param.label}
                  </label>
                  <Badge variant="success" size="sm">Full Support</Badge>
                  {param.isConditional && (
                    <Badge variant="warning" size="sm">Conditional</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {param.description}
                </p>
                <div className="space-y-1">
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block">
                    {param.value}
                  </code>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {param.availability}
                  </div>
                </div>
                
                {/* Special Input for Conditional Parameters */}
                {needsSpecialInput(param) && selectedParams[param.id] && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <Input
                      label="Custom Value"
                      placeholder={param.defaultPlaceholder}
                      value={conditionalParams[param.id] || ''}
                      onChange={(e) => setConditionalParams(prev => ({
                        ...prev,
                        [param.id]: e.target.value
                      }))}
                      helperText="This value will be passed when the condition is met"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Limited Support Parameters */}
      <div>
        <h4 className="text-md font-semibold text-yellow-900 dark:text-yellow-100 mb-4 flex items-center gap-2">
          <Badge variant="warning" size="sm">Limited Support</Badge>
          Limited Support in Performance Max
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pmaxParametersBySupport.limitedSupport.map(param => (
            <div key={param.id} className="flex items-start space-x-3 p-4 border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
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
                  <Badge variant="warning" size="sm">Limited Support</Badge>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unsupported Parameters Notice */}
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <h4 className="text-md font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
          <Badge variant="error" size="sm">Unsupported</Badge>
          Not Supported for Demand Gen Campaigns
        </h4>
        <p className="text-sm text-red-800 dark:text-red-200 mb-2">
          The following parameters are not supported for Demand Gen campaigns (a type of Performance Max campaign):
        </p>
        <div className="flex flex-wrap gap-2">
          {['{placement}', '{target}', '{keyword}', '{ifsearch:[value]}', '{ifcontent:[value]}', '{network}'].map(param => (
            <code key={param} className="text-xs bg-red-100 dark:bg-red-800/30 px-2 py-1 rounded">
              {param}
            </code>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Video Tutorial Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-green-900 dark:text-green-100 mb-1 flex items-center gap-2">
              <Play className="w-4 h-4" />
              Google Ads Tracking Tutorial
            </h3>
            <p className="text-green-700 dark:text-green-300 text-xs">
              Master Google Ads tracking templates and ValueTrack parameters
            </p>
          </div>
          <Button
            onClick={() => setShowVideoModal(true)}
            icon={Play}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
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
              <h3 className="text-lg font-semibold">Google Ads Tracking Tutorial</h3>
              <Button onClick={() => setShowVideoModal(false)} variant="ghost" icon={X} size="sm" />
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    Google Ads Tutorial Placeholder
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Replace with your Google Ads tracking tutorial video
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
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Base URL (Dynamic)
          </label>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg font-mono text-sm">
            {'{lpurl}'}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This will be dynamically replaced by Google Ads with your ad's final URL
          </p>
        </div>

        {/* REQUIRED UTM PARAMETERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            label="Campaign Source"
            value={utmSource}
            onChange={(e) => setUtmSource(e.target.value)}
            placeholder="google"
            required
            helperText="Traffic source (e.g., google, youtube)"
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
            placeholder="{campaignid}"
            required
            helperText="Campaign identifier"
          />
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
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="include-utm-term" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Campaign Term (utm_term)
                </label>
              </div>
              <Input
                value={utmTerm}
                onChange={(e) => setUtmTerm(e.target.value)}
                placeholder="{keyword}"
                disabled={!includeUtmTerm}
                helperText="Keywords for paid search"
                className={!includeUtmTerm ? 'opacity-50' : ''}
              />
            </div>

            {/* UTM Content */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="include-utm-content"
                  checked={includeUtmContent}
                  onChange={(e) => handleUtmContentToggle(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="include-utm-content" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Campaign Content (utm_content)
                </label>
              </div>
              <Input
                value={utmContent}
                onChange={(e) => setUtmContent(e.target.value)}
                placeholder="{creative}"
                disabled={!includeUtmContent}
                helperText="Ad identifier"
                className={!includeUtmContent ? 'opacity-50' : ''}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Generated Template */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-green-900 dark:text-green-100 flex items-center gap-2">
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
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-green-200 dark:border-green-700 shadow-inner">
          <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
            {generatedUrl || 'Configure parameters to generate template...'}
          </code>
        </div>
      </div>

      {/* ValueTrack Parameters */}
      <Accordion 
        title="Google Ads ValueTrack Parameters" 
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

        {/* Performance Max Special Rendering */}
        {selectedCategory === 'pmax' ? renderPmaxParameters() : (
          /* Regular Parameters Grid */
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
                    
                    // Initialize conditional value if needed
                    if (needsSpecialInput(param) && e.target.checked && !conditionalParams[param.id]) {
                      setConditionalParams(prev => ({
                        ...prev,
                        [param.id]: param.defaultPlaceholder || ''
                      }));
                    }
                  }}
                  className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <label htmlFor={param.id} className="block text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                      {param.label}
                    </label>
                    {getCategoryBadge(param.category)}
                    {param.isConditional && (
                      <Badge variant="warning" size="sm">Conditional</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {param.description}
                  </p>
                  <div className="space-y-1">
                    <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block">
                      {param.value}
                    </code>
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {param.availability}
                    </div>
                  </div>
                  
                  {/* Special Input for Conditional Parameters */}
                  {needsSpecialInput(param) && selectedParams[param.id] && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <Input
                        label="Custom Value"
                        placeholder={param.defaultPlaceholder}
                        value={conditionalParams[param.id] || ''}
                        onChange={(e) => setConditionalParams(prev => ({
                          ...prev,
                          [param.id]: e.target.value
                        }))}
                        helperText="This value will be passed when the condition is met"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredParams.length === 0 && selectedCategory !== 'pmax' && (
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
                    platform: 'googleAds',
                    version: '1.0'
                  };
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `google-ads-templates-${new Date().toISOString().split('T')[0]}.json`;
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
                            localStorage.setItem('google_ads_templates', JSON.stringify(newTemplates));
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
                  id="import-templates-google"
                />
                <Button
                  onClick={() => document.getElementById('import-templates-google')?.click()}
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
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-100">
                📋 Loaded Template: "{loadedTemplateName}"
              </h4>
              <Button
                onClick={copyCurrentTemplate}
                variant="secondary"
                size="sm"
                icon={Copy}
                className="text-green-600 hover:text-green-700"
              >
                Copy URL
              </Button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
              <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                {generatedUrl}
              </code>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 mt-2">
              ✅ Template loaded successfully! This shows the current generated URL based on the loaded parameters.
            </p>
          </div>
        )}
      </Accordion>
    </div>
  );
};

export default GoogleAdsBuilder;