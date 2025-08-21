import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Search, X, Save, Download, Upload, Play, RefreshCw, Plus, Trash2, Zap, Globe, Settings, Target, Filter } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Accordion from '../common/Accordion';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';

const GoogleAdsBuilder: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('{lpurl}');
  const [utmSource, setUtmSource] = useState('google');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('{campaignname}');
  const [utmTerm, setUtmTerm] = useState('{keyword:none}');
  const [utmContent, setUtmContent] = useState('{creative}');
  
  // Individual optional parameter toggles
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

  // Google Ads ValueTrack parameters (REMOVED param1 and param2 as they are deprecated)
  const googleAdsParams = useMemo(() => [
    // Campaign & Ad Group Information
    { id: 'campaignid', value: '{campaignid}', label: 'Campaign ID', category: 'standard', description: 'Unique numeric identifier for the campaign', availability: 'All campaign types', example: '1234567890' },
    { id: 'campaignname', value: '{campaignname}', label: 'Campaign Name', category: 'standard', description: 'Name of the campaign as set in Google Ads', availability: 'All campaign types', example: 'Summer_Sale_2025' },
    { id: 'adgroupid', value: '{adgroupid}', label: 'Ad Group ID', category: 'standard', description: 'Unique numeric identifier for the ad group', availability: 'Search, Display, Shopping, Video, Performance Max', example: '9876543210' },
    { id: 'adgroupname', value: '{adgroupname}', label: 'Ad Group Name', category: 'standard', description: 'Name of the ad group as set in Google Ads', availability: 'Search, Display, Shopping, Video, Performance Max', example: 'Running_Shoes_Keywords' },

    // Creative & Ad Information
    { id: 'creative', value: '{creative}', label: 'Creative ID', category: 'standard', description: 'Unique identifier for the creative/ad', availability: 'All campaign types', example: '567890123456' },
    { id: 'finalurlsuffix', value: '{finalurlsuffix}', label: 'Final URL Suffix', category: 'standard', description: 'The final URL suffix for the keyword, ad, or extension', availability: 'All campaign types', example: 'utm_content=ad_variant_a' },

    // Keyword & Targeting
    { id: 'keyword', value: '{keyword:none}', label: 'Keyword (Default Required)', category: 'standard', description: 'The keyword that triggered the ad (requires default value)', availability: 'Search campaigns', example: '{keyword:none} → running shoes', requiresDefault: true, defaultPlaceholder: 'none' },
    { id: 'matchtype', value: '{matchtype}', label: 'Match Type', category: 'standard', description: 'The match type of the keyword that triggered the ad', availability: 'Search campaigns', example: 'e (exact), p (phrase), b (broad)' },
    { id: 'targetid', value: '{targetid}', label: 'Target ID', category: 'standard', description: 'ID of the targeting criteria that triggered the ad', availability: 'All campaign types', example: 'kwd-123456789, aud-123456789' },

    // Device & Location
    { id: 'device', value: '{device}', label: 'Device Type', category: 'standard', description: 'Type of device where the ad was clicked', availability: 'All campaign types', example: 'm (mobile), t (tablet), c (computer)' },
    { id: 'devicemodel', value: '{devicemodel}', label: 'Device Model', category: 'standard', description: 'Specific device model', availability: 'All campaign types', example: 'iPhone, Samsung Galaxy S21' },
    { id: 'loc_interest_ms', value: '{loc_interest_ms}', label: 'Location Interest ID', category: 'standard', description: 'Geographic location ID of interest', availability: 'All campaign types', example: '1023191 (New York)' },
    { id: 'loc_physical_ms', value: '{loc_physical_ms}', label: 'Physical Location ID', category: 'standard', description: 'Geographic location ID where user was located', availability: 'All campaign types', example: '1023191 (New York)' },

    // Network & Placement
    { id: 'network', value: '{network}', label: 'Network', category: 'standard', description: 'Where the ad was shown', availability: 'All campaign types', example: 'g (Google), s (Search partners), d (Display), y (YouTube)' },
    { id: 'placement', value: '{placement}', label: 'Placement', category: 'standard', description: 'Website or app where the ad appeared', availability: 'Display, Video, Discovery, Performance Max', example: 'youtube.com, example.com' },

    // Essential Tracking
    { id: 'gclid', value: '{gclid}', label: 'Google Click ID', category: 'standard', description: 'Google Click Identifier for conversion tracking', availability: 'All campaign types', example: 'CjwKCAiA...' },
    { id: 'feeditemid', value: '{feeditemid}', label: 'Feed Item ID', category: 'standard', description: 'ID of the specific ad extension that was clicked', availability: 'All campaign types with extensions', example: '987654321' },

    // Search Campaign Specific
    { id: 'querystring', value: '{querystring}', label: 'Query String', category: 'standard', description: 'Actual search query entered by user', availability: 'Search campaigns', example: 'best running shoes 2025' },
    { id: 'adposition', value: '{adposition}', label: 'Ad Position', category: 'standard', description: 'Position of the ad on the search results page', availability: 'Search campaigns', example: '1t2 (top position 2)' },

    // Shopping Campaign Parameters
    { id: 'productid', value: '{productid}', label: 'Product ID', category: 'shopping', description: 'Product ID from your Merchant Center feed', availability: 'Shopping campaigns only', example: 'SKU123456' },
    { id: 'productcountry', value: '{productcountry}', label: 'Product Country', category: 'shopping', description: 'Country of sale for the product', availability: 'Shopping campaigns only', example: 'US, CA, GB' },
    { id: 'productlanguage', value: '{productlanguage}', label: 'Product Language', category: 'shopping', description: 'Language of the product information', availability: 'Shopping campaigns only', example: 'en, es, fr' },
    { id: 'productchannel', value: '{productchannel}', label: 'Product Channel', category: 'shopping', description: 'Sales channel (online or local)', availability: 'Shopping campaigns only', example: 'online, local' },
    { id: 'merchantid', value: '{merchantid}', label: 'Merchant ID', category: 'shopping', description: 'Your Google Merchant Center ID', availability: 'Shopping campaigns only', example: '123456789' },
    { id: 'storecode', value: '{storecode}', label: 'Store Code', category: 'shopping', description: 'Store identifier for local inventory ads', availability: 'Shopping campaigns only', example: 'STORE_NYC_001' },
    { id: 'productpartitionid', value: '{productpartitionid}', label: 'Product Partition ID', category: 'shopping', description: 'ID of the product group', availability: 'Shopping campaigns only', example: '123456789' },

    // Video Campaign Parameters
    { id: 'videoid', value: '{videoid}', label: 'Video ID', category: 'video', description: 'YouTube video ID where the ad appeared', availability: 'Video campaigns only', example: 'dQw4w9WgXcQ' },
    { id: 'videotitle', value: '{videotitle}', label: 'Video Title', category: 'video', description: 'Title of the YouTube video', availability: 'Video campaigns only', example: 'How to Run Faster' },
    { id: 'channelid', value: '{channelid}', label: 'Channel ID', category: 'video', description: 'YouTube channel ID where ad appeared', availability: 'Video campaigns only', example: 'UCxxxxxxxxxxxxxx' },

    // Performance Max Campaign Parameters
    { id: 'assetgroupid', value: '{assetgroupid}', label: 'Asset Group ID', category: 'pmax', description: 'Unique identifier for the asset group', availability: 'Performance Max campaigns only', example: '456789123' },
    { id: 'assetgroupname', value: '{assetgroupname}', label: 'Asset Group Name', category: 'pmax', description: 'Name of the asset group', availability: 'Performance Max campaigns only', example: 'Summer_Assets_Group' },

    // Hotel Campaign Parameters
    { id: 'hotelid', value: '{hotelid}', label: 'Hotel ID', category: 'hotel', description: 'Unique identifier for the hotel', availability: 'Hotel campaigns only', example: '12345' },
    { id: 'hotelname', value: '{hotelname}', label: 'Hotel Name', category: 'hotel', description: 'Name of the hotel', availability: 'Hotel campaigns only', example: 'Grand_Plaza_Hotel' },
    { id: 'hotelcountry', value: '{hotelcountry}', label: 'Hotel Country', category: 'hotel', description: 'Country where the hotel is located', availability: 'Hotel campaigns only', example: 'US, FR, JP' },
    { id: 'hotelstate', value: '{hotelstate}', label: 'Hotel State', category: 'hotel', description: 'State/region where hotel is located', availability: 'Hotel campaigns only', example: 'CA, NY, FL' },
    { id: 'hotelcity', value: '{hotelcity}', label: 'Hotel City', category: 'hotel', description: 'City where the hotel is located', availability: 'Hotel campaigns only', example: 'San_Francisco' },
    { id: 'checkindate', value: '{checkindate}', label: 'Check-in Date', category: 'hotel', description: 'Check-in date for the booking', availability: 'Hotel campaigns only', example: '2025-07-15' },
    { id: 'checkoutdate', value: '{checkoutdate}', label: 'Check-out Date', category: 'hotel', description: 'Check-out date for the booking', availability: 'Hotel campaigns only', example: '2025-07-18' },
    { id: 'lengthofstay', value: '{lengthofstay}', label: 'Length of Stay', category: 'hotel', description: 'Number of nights', availability: 'Hotel campaigns only', example: '3' },
    { id: 'numberofadults', value: '{numberofadults}', label: 'Number of Adults', category: 'hotel', description: 'Number of adult guests', availability: 'Hotel campaigns only', example: '2' },
    { id: 'partnerid', value: '{partnerid}', label: 'Partner ID', category: 'hotel', description: 'Hotel partner identifier', availability: 'Hotel campaigns only', example: 'partner123' },

    // App Campaign Parameters
    { id: 'appid', value: '{appid}', label: 'App ID', category: 'standard', description: 'Unique identifier for the mobile app', availability: 'App campaigns only', example: 'com.example.app' },
    { id: 'appstore', value: '{appstore}', label: 'App Store', category: 'standard', description: 'App store where the app is available', availability: 'App campaigns only', example: 'googleplay, itunes' },
    { id: 'campaignsubtype', value: '{campaignsubtype}', label: 'Campaign Sub Type', category: 'standard', description: 'Type of app campaign', availability: 'App campaigns only', example: 'APP_INSTALLS, APP_ENGAGEMENT' },
    { id: 'osversion', value: '{osversion}', label: 'OS Version', category: 'standard', description: 'Operating system version', availability: 'App campaigns only', example: 'iOS_15, Android_12' },
    { id: 'appversion', value: '{appversion}', label: 'App Version', category: 'standard', description: 'Version of the app being promoted', availability: 'App campaigns only', example: '2.1.0' },

    // Local Campaign Parameters
    { id: 'storecode', value: '{storecode}', label: 'Store Code', category: 'standard', description: 'Unique identifier for the business location', availability: 'Local campaigns only', example: 'STORE_SF_001' },
    { id: 'locationid', value: '{locationid}', label: 'Location ID', category: 'standard', description: 'Google My Business location ID', availability: 'Local campaigns only', example: '12345678901234567890' },

    // Conditional Parameters
    { id: 'ifmobile', value: '{ifmobile:[value]}', label: 'If Mobile (Conditional)', category: 'standard', description: 'Inserts value if clicked on mobile device', availability: 'All campaign types', example: '{ifmobile:mobile_user}', isConditional: true, defaultPlaceholder: 'mobile_user' },
    { id: 'ifnotmobile', value: '{ifnotmobile:[value]}', label: 'If Not Mobile (Conditional)', category: 'standard', description: 'Inserts value if NOT clicked on mobile device', availability: 'All campaign types', example: '{ifnotmobile:desktop_user}', isConditional: true, defaultPlaceholder: 'desktop_user' },
    { id: 'ifsearch', value: '{ifsearch:[value]}', label: 'If Search (Conditional)', category: 'standard', description: 'Inserts value if ad shown on Google Search', availability: 'Search campaigns', example: '{ifsearch:search_traffic}', isConditional: true, defaultPlaceholder: 'search_traffic' },
    { id: 'ifcontent', value: '{ifcontent:[value]}', label: 'If Content (Conditional)', category: 'standard', description: 'Inserts value if ad shown on Display Network', availability: 'Display campaigns', example: '{ifcontent:display_traffic}', isConditional: true, defaultPlaceholder: 'display_traffic' },
    { id: 'ifshopping', value: '{ifshopping:[value]}', label: 'If Shopping (Conditional)', category: 'shopping', description: 'Inserts value if Shopping campaign', availability: 'Shopping campaigns', example: '{ifshopping:product_ad}', isConditional: true, defaultPlaceholder: 'product_ad' },

    // Advanced Targeting Parameters
    { id: 'interestcategory', value: '{interestcategory}', label: 'Interest Category', category: 'standard', description: 'Interest category that triggered the ad', availability: 'Display, Video, Discovery', example: 'Sports/Fitness, Technology' },
    { id: 'age', value: '{age}', label: 'Age Range', category: 'standard', description: 'Age range of the user', availability: 'Display, Video', example: '25-34, 35-44, 45-54' },
    { id: 'gender', value: '{gender}', label: 'Gender', category: 'standard', description: 'Gender targeting', availability: 'Display, Video', example: 'm (male), f (female), u (unknown)' },

    // Time & Date Parameters
    { id: 'hour', value: '{hour}', label: 'Hour', category: 'standard', description: 'Hour when the ad was clicked (24-hour format)', availability: 'All campaign types', example: '14 (2 PM), 09 (9 AM)' },
    { id: 'dayofweek', value: '{dayofweek}', label: 'Day of Week', category: 'standard', description: 'Day of the week when ad was clicked', availability: 'All campaign types', example: 'monday, tuesday, wednesday' },

    // Custom Parameters
    { id: 'experimentid', value: '{experimentid}', label: 'Experiment ID', category: 'standard', description: 'A/B test experiment identifier', availability: 'All campaign types', example: 'exp_123456' }
  ], []);

  // Filter parameters based on search and category
  const filteredParams = useMemo(() => {
    return googleAdsParams.filter(param => {
      const matchesSearch = param.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.availability.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || param.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [googleAdsParams, searchTerm, selectedCategory]);

  // Handle individual optional parameter toggles with default value restoration
  const handleUtmTermToggle = useCallback((enabled: boolean) => {
    setIncludeUtmTerm(enabled);
    
    // If enabling and field is empty, restore default
    if (enabled && !utmTerm.trim()) {
      setUtmTerm('{keyword:none}');
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
        const param = googleAdsParams.find(p => p.id === paramId);
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
              const finalValue = param.value.replace('none', defaultValue);
              params.push(`${paramId.toLowerCase()}=${finalValue}`);
            }
          } else {
            // Regular parameters
            params.push(`${paramId.toLowerCase()}=${param.value}`);
          }
        }
      }
    });
    
    const finalUrl = params.length > 0 ? `${baseUrl}?${params.join('&')}` : baseUrl;
    setGeneratedUrl(finalUrl);
  }, [baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, includeUtmTerm, includeUtmContent, selectedParams, conditionalParams, googleAdsParams]);

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
      baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, 
      includeUtmTerm, includeUtmContent, // Save individual toggles
      selectedParams, conditionalParams,
      timestamp: Date.now()
    };
    
    const newTemplates = { ...savedTemplates, [templateName]: template };
    setSavedTemplates(newTemplates);
    localStorage.setItem('google_ads_templates', JSON.stringify(newTemplates));
    
    success(`Template "${templateName}" saved successfully!`);
    setTemplateName('');
  }, [templateName, baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, includeUtmTerm, includeUtmContent, selectedParams, conditionalParams, savedTemplates, success, error]);

  const loadTemplate = useCallback(() => {
    if (!selectedTemplate || !savedTemplates[selectedTemplate]) {
      error('Please select a template to load');
      return;
    }
    
    const template = savedTemplates[selectedTemplate];
    setBaseUrl(template.baseUrl || '{lpurl}');
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
    setBaseUrl('{lpurl}');
    setUtmSource('google');
    setUtmMedium('cpc');
    setUtmCampaign('{campaignname}');
    setUtmTerm('{keyword:none}');
    setUtmContent('{creative}');
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
    const saved = localStorage.getItem('google_ads_templates');
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
    { value: 'standard', label: 'Standard Parameters' },
    { value: 'shopping', label: 'Shopping campaigns only' },
    { value: 'video', label: 'Video campaigns only' },
    { value: 'hotel', label: 'Hotel campaigns only' },
    { value: 'pmax', label: 'Performance Max campaigns' }
  ];

  // Get category badge color
  const getCategoryBadge = (category: string) => {
    const badges = {
      standard: { variant: 'info' as const, label: 'Standard' },
      shopping: { variant: 'success' as const, label: 'Shopping' },
      video: { variant: 'warning' as const, label: 'Video' },
      pmax: { variant: 'info' as const, label: 'Performance Max' },
      hotel: { variant: 'success' as const, label: 'Hotel' }
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
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-green-900 dark:text-green-100 mb-1 flex items-center gap-2">
              <Play className="w-4 h-4" />
              Google Ads Tracking Tutorial
            </h3>
            <p className="text-green-700 dark:text-green-300 text-xs">
              Master Google Ads ValueTrack parameters and tracking templates
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
            {baseUrl}
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
            helperText="Traffic source (e.g., google, googleshopping)"
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
            placeholder="{campaignname}"
            required
            helperText="Campaign identifier"
          />
        </div>

        {/* OPTIONAL UTM PARAMETERS - INLINE DESIGN */}
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
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="include-utm-term" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Campaign Term (utm_term)
                </label>
              </div>
              <Input
                value={utmTerm}
                onChange={(e) => setUtmTerm(e.target.value)}
                placeholder="{keyword:none}"
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
        title="ValueTrack Parameters" 
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
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
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
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {param.availability}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Example: {param.example}
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