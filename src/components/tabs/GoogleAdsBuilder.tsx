import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Search, X, Save, Download, Upload, Play, RefreshCw, Zap, Filter, Settings, Target, Globe, Info, AlertTriangle, Trash2 } from 'lucide-react';
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

  // Enhanced ValueTrack parameters with complete Google Ads data - SORTED A-Z
  // REMOVED Param1 & Param2 from Universal category
  const valueTrackParams = useMemo(() => [
    // Universal Parameters (Available across most campaign types) - SORTED A-Z
    { id: 'adgroupid', value: '{adgroupid}', label: 'Ad Group ID', category: 'universal', description: 'Ad group ID - Works best if tracking at campaign/account level', availability: 'Final URL, Tracking Template' },
    { id: 'param1', value: '{param1}', label: 'Ad Parameter 1', category: 'universal', description: 'Creative parameter #1', availability: 'Final URL, Tracking Template' },
    { id: 'param2', value: '{param2}', label: 'Ad Parameter 2', category: 'universal', description: 'Creative parameter #2', availability: 'Final URL, Tracking Template' },
    { id: 'param1', value: '{param1}', label: 'Ad Parameter 1', category: 'universal', description: 'Creative parameter #1', availability: 'Final URL, Tracking Template' },
    { id: 'param2', value: '{param2}', label: 'Ad Parameter 2', category: 'universal', description: 'Creative parameter #2', availability: 'Final URL, Tracking Template' },
    { id: 'param1', value: '{param1}', label: 'Ad Parameter 1', category: 'universal', description: 'Creative parameter #1', availability: 'Final URL, Tracking Template' },
    { id: 'param2', value: '{param2}', label: 'Ad Parameter 2', category: 'universal', description: 'Creative parameter #2', availability: 'Final URL, Tracking Template' },
    { id: 'param1', value: '{param1}', label: 'Ad Parameter 1', category: 'universal', description: 'Creative parameter #1', availability: 'Final URL, Tracking Template' },
    { id: 'param2', value: '{param2}', label: 'Ad Parameter 2', category: 'universal', description: 'Creative parameter #2', availability: 'Final URL, Tracking Template' },
    { id: 'param1', value: '{param1}', label: 'Ad Parameter 1', category: 'universal', description: 'Creative parameter #1', availability: 'Final URL, Tracking Template' },
    { id: 'param2', value: '{param2}', label: 'Ad Parameter 2', category: 'universal', description: 'Creative parameter #2', availability: 'Final URL, Tracking Template' },
    { id: 'param1', value: '{param1}', label: 'Ad Parameter 1', category: 'universal', description: 'Creative parameter #1', availability: 'Final URL, Tracking Template' },
    { id: 'param2', value: '{param2}', label: 'Ad Parameter 2', category: 'universal', description: 'Creative parameter #2', availability: 'Final URL, Tracking Template' },
    { id: 'campaignid', value: '{campaignid}', label: 'Campaign ID', category: 'universal', description: 'Campaign ID - Helpful for account-level tracking', availability: 'Final URL, Tracking Template' },
    { id: 'creative', value: '{creative}', label: 'Creative ID', category: 'universal', description: 'Unique ID for the ad', availability: 'Final URL, Tracking Template' },
    { id: 'device', value: '{device}', label: 'Device Type', category: 'universal', description: 'Device type: m=Mobile, t=Tablet, c=Computer', availability: 'Final URL, Tracking Template' },
    { id: 'extensionid', value: '{extensionid}', label: 'Extension ID', category: 'universal', description: 'ID of clicked upgraded asset - Not available on Display', availability: 'Final URL, Tracking Template' },
    { id: 'feeditemid', value: '{feeditemid}', label: 'Feed Item ID (Legacy)', category: 'universal', description: 'ID of clicked legacy asset - Not available on Display', availability: 'Final URL, Tracking Template' },
    { id: 'gclid', value: '{gclid}', label: 'Google Click ID', category: 'universal', description: 'Google Click ID - Not available in all PMAX ads', availability: 'Final URL, Tracking Template' },
    { id: 'keyword', value: '{keyword}', label: 'Keyword', category: 'universal', description: 'Matched keyword - Blank for PMAX/DSA', availability: 'Final URL, Tracking Template' },
    { id: 'devicemodel', value: '{devicemodel}', label: 'Mobile Device Model', category: 'universal', description: 'The model of the phone or tablet', availability: 'Final URL, Tracking Template' },
    { id: 'devicemodel', value: '{devicemodel}', label: 'Mobile Device Model', category: 'universal', description: 'The model of the phone or tablet', availability: 'Final URL, Tracking Template' },
    { id: 'devicemodel', value: '{devicemodel}', label: 'Mobile Device Model', category: 'universal', description: 'The model of the phone or tablet', availability: 'Final URL, Tracking Template' },
    { id: 'devicemodel', value: '{devicemodel}', label: 'Mobile Device Model', category: 'universal', description: 'The model of the phone or tablet', availability: 'Final URL, Tracking Template' },
    { id: 'devicemodel', value: '{devicemodel}', label: 'Mobile Device Model', category: 'universal', description: 'The model of the phone or tablet', availability: 'Final URL, Tracking Template' },
    { id: 'devicemodel', value: '{devicemodel}', label: 'Mobile Device Model', category: 'universal', description: 'The model of the phone or tablet', availability: 'Final URL, Tracking Template' },
    { id: 'loc_interest_ms', value: '{loc_interest_ms}', label: 'Location Interest ID', category: 'universal', description: 'Location of interest ID - Geo intent', availability: 'Final URL, Tracking Template' },
    { id: 'loc_physical_ms', value: '{loc_physical_ms}', label: 'Location Physical ID', category: 'universal', description: 'Location ID (user\'s physical location) - Geo reporting', availability: 'Final URL, Tracking Template' },
    { id: 'matchtype', value: '{matchtype}', label: 'Match Type', category: 'universal', description: 'Keyword match type: e=Exact, p=Phrase, b=Broad', availability: 'Final URL, Tracking Template' },
    { id: 'network', value: '{network}', label: 'Network', category: 'universal', description: 'Source of traffic: g=Google, s=Search partners, d=Display, ytv=YouTube, vp=Video partners', availability: 'Final URL, Tracking Template' },
    { id: 'placement', value: '{placement}', label: 'Placement', category: 'universal', description: 'Content site - Display/Placement-targeted campaigns', availability: 'Final URL, Tracking Template' },
    { id: 'random', value: '{random}', label: 'Random Number', category: 'universal', description: 'Random number - Prevents caching', availability: 'Final URL, Tracking Template' },
    { id: 'target', value: '{target}', label: 'Target', category: 'universal', description: 'Placement category - Display campaigns only', availability: 'Final URL, Tracking Template' },
    { id: 'targetid', value: '{targetid}', label: 'Target ID', category: 'universal', description: 'ID of targeting criterion - Includes kwd, dsa, pla, aud, etc.', availability: 'Final URL, Tracking Template' },
    
    // Conditional Logic Parameters - SORTED A-Z
    { id: 'ifcontent', value: '{ifcontent:[value]}', label: 'If Content', category: 'conditional', description: 'Value if click was on Display - Not for Demand Gen', availability: 'Final URL, Tracking Template' },
    { id: 'ifmobile', value: '{ifmobile:[value]}', label: 'If Mobile', category: 'conditional', description: 'Custom value on mobile click - Conditional logic', availability: 'Final URL, Tracking Template' },
    { id: 'ifnotmobile', value: '{ifnotmobile:[value]}', label: 'If Not Mobile', category: 'conditional', description: 'Custom value on desktop/tablet - Conditional logic', availability: 'Final URL, Tracking Template' },
    { id: 'ifsearch', value: '{ifsearch:[value]}', label: 'If Search', category: 'conditional', description: 'Value if click was on Search - Not for Demand Gen', availability: 'Final URL, Tracking Template' },
    
    // Hotel Campaign Parameters - SORTED A-Z
    { id: 'adtype', value: '{adtype}', label: 'Hotel Ad Type', category: 'hotel', description: 'Hotel ad type: Hotel or Room', availability: 'Hotel Campaigns' },
    { id: 'adtype', value: '{adtype}', label: 'Hotel Ad Type', category: 'hotel', description: 'Hotel ad type: Hotel or Room', availability: 'Hotel Campaigns' },
    { id: 'adtype', value: '{adtype}', label: 'Hotel Ad Type', category: 'hotel', description: 'Hotel ad type: Hotel or Room', availability: 'Hotel Campaigns' },
    { id: 'adtype', value: '{adtype}', label: 'Hotel Ad Type', category: 'hotel', description: 'Hotel ad type: Hotel or Room', availability: 'Hotel Campaigns' },
    { id: 'adtype', value: '{adtype}', label: 'Hotel Ad Type', category: 'hotel', description: 'Hotel ad type: Hotel or Room', availability: 'Hotel Campaigns' },
    { id: 'adtype', value: '{adtype}', label: 'Hotel Ad Type', category: 'hotel', description: 'Hotel ad type: Hotel or Room', availability: 'Hotel Campaigns' },
    { id: 'advanced_booking_window', value: '{advanced_booking_window}', label: 'Advanced Booking Window', category: 'hotel', description: 'Days before check-in', availability: 'Hotel Campaigns' },
    { id: 'date_type', value: '{date_type}', label: 'Date Type', category: 'hotel', description: 'Date type: default or selected', availability: 'Hotel Campaigns' },
    { id: 'price_displayed_total', value: '{price_displayed_total}', label: 'Price Displayed Total', category: 'hotel', description: 'Total displayed price', availability: 'Hotel Campaigns' },
    { id: 'rate_rule_id', value: '{rate_rule_id}', label: 'Rate Rule ID', category: 'hotel', description: 'Special pricing rule ID', availability: 'Hotel Campaigns' },
    { id: 'travel_end_day', value: '{travel_end_day}', label: 'Travel End Day', category: 'hotel', description: 'The check-out day', availability: 'Hotel campaigns only' },
    { id: 'travel_end_day', value: '{travel_end_day}', label: 'Travel End Day', category: 'hotel', description: 'The check-out day', availability: 'Hotel campaigns only' },
    { id: 'travel_end_day', value: '{travel_end_day}', label: 'Travel End Day', category: 'hotel', description: 'The check-out day', availability: 'Hotel campaigns only' },
    { id: 'travel_end_day', value: '{travel_end_day}', label: 'Travel End Day', category: 'hotel', description: 'The check-out day', availability: 'Hotel campaigns only' },
    { id: 'travel_end_day', value: '{travel_end_day}', label: 'Travel End Day', category: 'hotel', description: 'The check-out day', availability: 'Hotel campaigns only' },
    { id: 'travel_end_day', value: '{travel_end_day}', label: 'Travel End Day', category: 'hotel', description: 'The check-out day', availability: 'Hotel campaigns only' },
    { id: 'travel_end_month', value: '{travel_end_month}', label: 'Travel End Month', category: 'hotel', description: 'The check-out month', availability: 'Hotel campaigns only' },
    { id: 'travel_end_year', value: '{travel_end_year}', label: 'Travel End Year', category: 'hotel', description: 'The check-out year', availability: 'Hotel campaigns only' },
    { id: 'travel_end_year', value: '{travel_end_year}', label: 'Travel End Year', category: 'hotel', description: 'The check-out year', availability: 'Hotel campaigns only' },
    { id: 'travel_end_year', value: '{travel_end_year}', label: 'Travel End Year', category: 'hotel', description: 'The check-out year', availability: 'Hotel campaigns only' },
    { id: 'travel_end_year', value: '{travel_end_year}', label: 'Travel End Year', category: 'hotel', description: 'The check-out year', availability: 'Hotel campaigns only' },
    { id: 'travel_end_year', value: '{travel_end_year}', label: 'Travel End Year', category: 'hotel', description: 'The check-out year', availability: 'Hotel campaigns only' },
    { id: 'travel_end_year', value: '{travel_end_year}', label: 'Travel End Year', category: 'hotel', description: 'The check-out year', availability: 'Hotel campaigns only' },
    { id: 'travel_start_day', value: '{travel_start_day}', label: 'Travel Start Day', category: 'hotel', description: 'Check-in date', availability: 'Hotel Campaigns' },
    { id: 'travel_start_month', value: '{travel_start_month}', label: 'Travel Start Month', category: 'hotel', description: 'The check-in date\'s month', availability: 'Hotel campaigns only' },
    { id: 'travel_start_year', value: '{travel_start_year}', label: 'Travel Start Year', category: 'hotel', description: 'The check-in date\'s year', availability: 'Hotel campaigns only' },
    { id: 'travel_start_month', value: '{travel_start_month}', label: 'Travel Start Month', category: 'hotel', description: 'The check-in date\'s month', availability: 'Hotel campaigns only' },
    { id: 'travel_start_year', value: '{travel_start_year}', label: 'Travel Start Year', category: 'hotel', description: 'The check-in date\'s year', availability: 'Hotel campaigns only' },
    { id: 'travel_start_month', value: '{travel_start_month}', label: 'Travel Start Month', category: 'hotel', description: 'The check-in date\'s month', availability: 'Hotel campaigns only' },
    { id: 'travel_start_year', value: '{travel_start_year}', label: 'Travel Start Year', category: 'hotel', description: 'The check-in date\'s year', availability: 'Hotel campaigns only' },
    { id: 'travel_start_month', value: '{travel_start_month}', label: 'Travel Start Month', category: 'hotel', description: 'The check-in date\'s month', availability: 'Hotel campaigns only' },
    { id: 'travel_start_year', value: '{travel_start_year}', label: 'Travel Start Year', category: 'hotel', description: 'The check-in date\'s year', availability: 'Hotel campaigns only' },
    { id: 'travel_start_month', value: '{travel_start_month}', label: 'Travel Start Month', category: 'hotel', description: 'The check-in date\'s month', availability: 'Hotel campaigns only' },
    { id: 'travel_start_year', value: '{travel_start_year}', label: 'Travel Start Year', category: 'hotel', description: 'The check-in date\'s year', availability: 'Hotel campaigns only' },
    { id: 'travel_start_month', value: '{travel_start_month}', label: 'Travel Start Month', category: 'hotel', description: 'The check-in date\'s month', availability: 'Hotel campaigns only' },
    { id: 'travel_start_year', value: '{travel_start_year}', label: 'Travel Start Year', category: 'hotel', description: 'The check-in date\'s year', availability: 'Hotel campaigns only' },
    { id: 'user_currency', value: '{user_currency}', label: 'User Currency', category: 'hotel', description: '3-letter currency code', availability: 'Hotel Campaigns' },
    { id: 'user_language', value: '{user_language}', label: 'User Language', category: 'hotel', description: '2-letter language code', availability: 'Hotel Campaigns' },
    
    // Performance Max Parameters - COMBINED WITH SUPPORT LEVELS - SORTED A-Z
    { id: 'adtype', value: '{adtype}', label: 'Ad Type', category: 'pmax', supportLevel: 'limited', description: 'Ad type - Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'assetgroupid', value: '{assetgroupid}', label: 'Asset Group ID', category: 'pmax', supportLevel: 'full', description: 'The asset group ID', availability: 'Performance Max (Full Support)' },
    { id: 'campaignid', value: '{campaignid}', label: 'Campaign ID', category: 'pmax', supportLevel: 'full', description: 'Campaign ID - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'device', value: '{device}', label: 'Device Type', category: 'pmax', supportLevel: 'full', description: 'Device type - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'gclid', value: '{gclid}', label: 'Google Click ID', category: 'pmax', supportLevel: 'limited', description: 'Google Click ID - Has limited support', availability: 'Performance Max (Limited Support)' },
    { id: 'ifmobile', value: '{ifmobile:[value]}', label: 'If Mobile', category: 'pmax', supportLevel: 'full', description: 'Mobile conditional - Full Support in PMAX', availability: 'Performance Max (Full Support)', isConditional: true },
    { id: 'ifnotmobile', value: '{ifnotmobile:[value]}', label: 'If Not Mobile', category: 'pmax', supportLevel: 'full', description: 'Non-mobile conditional - Full Support in PMAX', availability: 'Performance Max (Full Support)', isConditional: true },
    { id: 'loc_interest_ms', value: '{loc_interest_ms}', label: 'Location Interest ID', category: 'pmax', supportLevel: 'full', description: 'Interest location - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'loc_physical_ms', value: '{loc_physical_ms}', label: 'Location Physical ID', category: 'pmax', supportLevel: 'full', description: 'Physical location - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'lpurl', value: '{lpurl}', label: 'Landing Page URL', category: 'pmax', supportLevel: 'full', description: 'Landing page URL - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'merchant_id', value: '{merchant_id}', label: 'Merchant ID', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'product_channel', value: '{product_channel}', label: 'Product Channel', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'product_country', value: '{product_country}', label: 'Product Country', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'product_id', value: '{product_id}', label: 'Product ID', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'product_language', value: '{product_language}', label: 'Product Language', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'random', value: '{random}', label: 'Random Number', category: 'pmax', supportLevel: 'full', description: 'Random number - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'product_id', value: '{product_id}', label: 'Product ID', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'product_language', value: '{product_language}', label: 'Product Language', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'random', value: '{random}', label: 'Random Number', category: 'pmax', supportLevel: 'full', description: 'Random number - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'product_id', value: '{product_id}', label: 'Product ID', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'product_language', value: '{product_language}', label: 'Product Language', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'random', value: '{random}', label: 'Random Number', category: 'pmax', supportLevel: 'full', description: 'Random number - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'product_id', value: '{product_id}', label: 'Product ID', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'product_language', value: '{product_language}', label: 'Product Language', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'random', value: '{random}', label: 'Random Number', category: 'pmax', supportLevel: 'full', description: 'Random number - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'product_id', value: '{product_id}', label: 'Product ID', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'product_language', value: '{product_language}', label: 'Product Language', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'random', value: '{random}', label: 'Random Number', category: 'pmax', supportLevel: 'full', description: 'Random number - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    { id: 'product_id', value: '{product_id}', label: 'Product ID', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'product_language', value: '{product_language}', label: 'Product Language', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'random', value: '{random}', label: 'Random Number', category: 'pmax', supportLevel: 'full', description: 'Random number - Full Support in PMAX', availability: 'Performance Max (Full Support)' },
    
    // Shopping Campaign Parameters - SORTED A-Z
    { id: 'adtype', value: '{adtype}', label: 'Ad Type', category: 'shopping', description: 'Shopping ad type: pla, pla_multichannel, pla_with_promotion, pla_with_pog', availability: 'Shopping Campaigns' },
    { id: 'merchant_id', value: '{merchant_id}', label: 'Merchant ID', category: 'shopping', description: 'Merchant Center Account ID', availability: 'Shopping Campaigns' },
    { id: 'product_channel', value: '{product_channel}', label: 'Product Channel', category: 'shopping', description: 'Product channel: online or local', availability: 'Shopping Campaigns' },
    { id: 'product_country', value: '{product_country}', label: 'Product Country', category: 'shopping', description: 'Country of sale', availability: 'Shopping Campaigns' },
    { id: 'product_id', value: '{product_id}', label: 'Product ID', category: 'shopping', description: 'ID from Merchant Feed', availability: 'Shopping Campaigns' },
    { id: 'product_language', value: '{product_language}', label: 'Product Language', category: 'shopping', description: 'Language from feed', availability: 'Shopping Campaigns' },
    { id: 'product_partition_id', value: '{product_partition_id}', label: 'Product Partition ID', category: 'shopping', description: 'ID of product group', availability: 'Shopping Campaigns' },
    { id: 'store_code', value: '{store_code}', label: 'Store Code', category: 'shopping', description: 'Local store ID (60 char limit)', availability: 'Shopping Campaigns' },
    
    // Video Campaign Parameters - SORTED A-Z
    { id: 'adgroupid', value: '{adgroupid}', label: 'Video Ad Group ID', category: 'video', description: 'Ad group ID for video campaigns', availability: 'Video Campaigns' },
    { id: 'campaignid', value: '{campaignid}', label: 'Video Campaign ID', category: 'video', description: 'Campaign ID for video campaigns', availability: 'Video Campaigns' },
    { id: 'creative', value: '{creative}', label: 'Video Creative ID', category: 'video', description: 'Ad creative ID for video campaigns', availability: 'Video Campaigns' },
    { id: 'device', value: '{device}', label: 'Video Device', category: 'video', description: 'Device type for video campaigns', availability: 'Video Campaigns' },
    { id: 'loc_interest_ms', value: '{loc_interest_ms}', label: 'Video Interest Location', category: 'video', description: 'Location IDs for video campaigns', availability: 'Video Campaigns' },
    { id: 'loc_physical_ms', value: '{loc_physical_ms}', label: 'Video Physical Location', category: 'video', description: 'Physical location IDs for video campaigns', availability: 'Video Campaigns' },
    { id: 'network', value: '{network}', label: 'Video Network', category: 'video', description: 'Network type for video campaigns', availability: 'Video Campaigns' },
    { id: 'placement', value: '{placement}', label: 'Video Placement', category: 'video', description: 'Placement site for video campaigns', availability: 'Video Campaigns' },
    { id: 'sourceid', value: '{sourceid}', label: 'Source ID', category: 'video', description: 'Source ID for video campaigns', availability: 'Video Campaigns' }
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

  // Get Performance Max parameters grouped by support level - REORGANIZED
  const pmaxParams = useMemo(() => {
    const pmaxParameters = valueTrackParams.filter(param => param.category === 'pmax');
    
    // Separate full support parameters into regular and conditional
    const fullSupport = pmaxParameters
      .filter(param => param.supportLevel === 'full')
      .sort((a, b) => a.label.localeCompare(b.label));

  // Sort categories alphabetically by label
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.label.localeCompare(b.label));
  }, [categories]);

  // Sort categories alphabetically by label
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.label.localeCompare(b.label));
  }, [categories]);

  // Sort categories alphabetically by label
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.label.localeCompare(b.label));
  }, [categories]);

  // UPDATED: Handle individual optional parameter toggles with default value restoration
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
    
    // Add selected ValueTrack parameters
    Object.entries(selectedParams).forEach(([paramId, isSelected]) => {
      if (isSelected) {
        const param = valueTrackParams.find(p => p.id === paramId);
        if (param) {
          // Handle conditional parameters differently
          if (param.category === 'conditional' || param.isConditional) {
            const customValue = conditionalParams[paramId];
            if (customValue && customValue.trim()) {
              // Replace [value] with actual custom value
              const finalValue = param.value.replace('[value]', customValue);
              params.push(`${paramId.toLowerCase()}=${finalValue}`);
            }
          } else {
            params.push(`${paramId.toLowerCase()}=${param.value}`);
          }
        }
      }
    });
    
    const baseUrl = '{lpurl}';
    const finalUrl = params.length > 0 ? `${baseUrl}?${params.join('&')}` : baseUrl;
    setGeneratedUrl(finalUrl);
  }, [utmSource, utmMedium, utmCampaign, utmTerm, utmContent, includeUtmTerm, includeUtmContent, selectedParams, conditionalParams, valueTrackParams]);

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
    { value: 'landing', label: 'Landing Page & URL' },
  };

  // Template management with toast notifications
  const saveTemplate = useCallback(() => {
    if (!templateName.trim()) {
      error('Please enter a template name');
      return;
    }
    
    const template = {
      landing: { variant: 'default' as const, label: 'Landing Page' },
      utmSource, utmMedium, utmCampaign, utmTerm, utmContent, 
      includeUtmTerm, includeUtmContent, // Save individual toggles
      selectedParams, conditionalParams,
      timestamp: Date.now()
    };
    
    const newTemplates = { ...savedTemplates, [templateName]: template };
    setSavedTemplates(newTemplates);
    localStorage.setItem('google_ads_templates', JSON.stringify(newTemplates));
    
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
    
    // Set loaded template name for preview (URL will be auto-generated)
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
    setUtmCampaign('{campaignname}');
    setUtmTerm('{keyword}');
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

  // Get support badge for PMAX parameters
  const getPmaxSupportBadge = (param: any) => {
    if (param.category === 'pmax') {
      if (param.supportLevel === 'full') {
        return <Badge variant="success" size="sm">Full Support</Badge>;
      } else if (param.supportLevel === 'limited') {
        return <Badge variant="warning" size="sm">Limited Support</Badge>;
      }
    }
    return null;
  };

  // Check if parameter needs conditional input
  const needsConditionalInput = (param: any) => {
    return param.category === 'conditional' || param.isConditional;
  };

  // Render Performance Max parameters with support level grouping
  const renderPmaxParameters = () => {
    if (selectedCategory !== 'pmax') return null;

    return (
      <div className="space-y-6">
        {/* Full Support Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Full Support Parameters</h4>
            <Badge variant="success" size="sm">Reliable</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pmaxParams.fullSupport.map(param => (
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
                    
                    if (needsConditionalInput(param) && e.target.checked && !conditionalParams[param.id]) {
                      setConditionalParams(prev => ({
                        ...prev,
                        [param.id]: ''
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
                    {needsConditionalInput(param) && (
                      <Badge variant="info" size="sm">Conditional logic</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {param.description}
                  </p>
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block">
                    {param.value}
                  </code>
                  
                  {needsConditionalInput(param) && selectedParams[param.id] && (
                    <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                      <Input
                        label="Custom Value"
                        placeholder="Enter your custom value"
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

        {/* Limited Support Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Limited Support Parameters</h4>
            <Badge variant="warning" size="sm">Conditional</Badge>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Limited Support Notice</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  These parameters only work on shopping formats or some asset types within Performance Max campaigns. Test thoroughly before deploying.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pmaxParams.limitedSupport.map(param => (
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
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {param.description}
                  </p>
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block">
                    {param.value}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Video Tutorial Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-green-900 dark:text-green-100 mb-1 flex items-center gap-2">
              <Play className="w-4 h-4" />
              Google Ads Tracking Tutorial
            </h3>
            <p className="text-green-700 dark:text-green-300 text-xs">
              Learn how to set up advanced tracking templates for Google Ads campaigns
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
            helperText="Traffic source (e.g., google, bing)"
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
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
              <Input
                value={utmContent}
                onChange={(e) => setUtmContent(e.target.value)}
                placeholder="{creative}"
                disabled={!includeUtmContent}
                helperText="Ad creative identifier"
                className={!includeUtmContent ? 'opacity-50' : ''}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Generated Template - MOVED HERE ABOVE THE FOLD */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800 shadow-lg">
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
        </div> {/* End of Search and Filter */}

        {/* Performance Max Special Rendering */}
    { id: 'pmax_adtype', value: '{adtype}', label: 'Ad Type', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'pmax_campaignid', value: '{campaignid}', label: 'Campaign ID', category: 'pmax', supportLevel: 'full', description: 'The campaign ID', availability: 'Performance Max (Full Support)' },
    { id: 'pmax_device', value: '{device}', label: 'Device Type', category: 'pmax', supportLevel: 'full', description: 'The device type', availability: 'Performance Max (Full Support)' },
    { id: 'pmax_gclid', value: '{gclid}', label: 'Google Click ID', category: 'pmax', supportLevel: 'limited', description: 'Has limited support', availability: 'Performance Max (Limited Support)' },
    { id: 'pmax_ifmobile', value: '{ifmobile:[value]}', label: 'If Mobile', category: 'pmax', supportLevel: 'full', description: 'Returns a value for mobile clicks', availability: 'Performance Max (Full Support)', isConditional: true },
    { id: 'pmax_ifnotmobile', value: '{ifnotmobile:[value]}', label: 'If Not Mobile', category: 'pmax', supportLevel: 'full', description: 'Returns a value for non-mobile clicks', availability: 'Performance Max (Full Support)', isConditional: true },
    { id: 'pmax_loc_interest_ms', value: '{loc_interest_ms}', label: 'Location Interest ID', category: 'pmax', supportLevel: 'full', description: 'The location of interest ID', availability: 'Performance Max (Full Support)' },
    { id: 'pmax_loc_physical_ms', value: '{loc_physical_ms}', label: 'Location Physical ID', category: 'pmax', supportLevel: 'full', description: 'The geographical location ID', availability: 'Performance Max (Full Support)' },
    { id: 'pmax_lpurl', value: '{lpurl}', label: 'Landing Page URL', category: 'pmax', supportLevel: 'full', description: 'The final URL', availability: 'Performance Max (Full Support)' },
    { id: 'pmax_merchant_id', value: '{merchant_id}', label: 'Merchant ID', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'pmax_product_channel', value: '{product_channel}', label: 'Product Channel', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'pmax_product_country', value: '{product_country}', label: 'Product Country', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'pmax_product_id', value: '{product_id}', label: 'Product ID', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' },
    { id: 'pmax_product_language', value: '{product_language}', label: 'Product Language', category: 'pmax', supportLevel: 'limited', description: 'Limited to Shopping ad types only', availability: 'Performance Max (Limited Support)' }
                      [param.id]: e.target.checked
                    }));
                    
                    if (needsConditionalInput(param) && e.target.checked && !conditionalParams[param.id]) {
                      setConditionalParams(prev => ({
                        ...prev,
                        [param.id]: ''
                      }));
                    }
                  }}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <label htmlFor={param.id} className="block text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                      {param.label}
                    </label>
                    {getPmaxSupportBadge(param)}
                    {needsConditionalInput(param) && (
                      <Badge variant="info" size="sm">Conditional logic</Badge>
                    )}
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
                  </div>
                  
                  {needsConditionalInput(param) && selectedParams[param.id] && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <Input
                        label="Custom Value"
                        placeholder="Enter your custom value"
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

        {/* LOADED TEMPLATE PREVIEW - FIXED TO SHOW CURRENT GENERATED URL */}
        {loadedTemplateName && generatedUrl && (
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
                Copy URL
              </Button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
              <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                {generatedUrl}
              </code>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              ✅ Template loaded successfully! This shows the current generated URL based on the loaded parameters.
            </p>
          </div>
        )}
      </Accordion>

    </div>
  );
};

export default GoogleAdsBuilder;