import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Copy, Check, AlertTriangle, Info, ExternalLink, Play, Search, X, Save, Download, Upload, RefreshCw, Zap, TrendingUp, ChevronDown, ChevronUp, Globe, Target, Settings } from 'lucide-react';
import { useUtm } from '../../contexts/UtmContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';
import Accordion from '../common/Accordion';
import Badge from '../common/Badge';
import UrlPreview from '../features/UrlPreview';
import ParameterValidator from '../features/ParameterValidator';
import KeyboardShortcuts from '../features/KeyboardShortcuts';
import { ga4Parameters, ga4Channels, getRecommendedSourcesForChannel, getRecommendedMediumsForChannel } from '../../data/ga4Config';
import { SOURCE_CATEGORIES } from '../../data/sourceCategories';
import { validateUrl, predictGA4Channel, analyzeUrl as analyzeUrlUtil } from '../../utils/validation';
import { useToast } from '../../hooks/useToast';

const GA4Builder: React.FC = () => {
  const { state, updateParameter, generateUrl, dispatch } = useUtm();
  const { success, error, info } = useToast();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState<Record<string, any>>({});
  const [configName, setConfigName] = useState('');
  const [selectedConfig, setSelectedConfig] = useState('');
  const [analyzeUrlInput, setAnalyzeUrlInput] = useState('');
  const [analyzedResult, setAnalyzedResult] = useState<any>(null);
  const [configFeedback, setConfigFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [urlHistory, setUrlHistory] = useState<string[]>([]);
  const [showOptionalParams, setShowOptionalParams] = useState(false);
  const [spaceEncoding, setSpaceEncoding] = useState<'percent' | 'plus' | 'underscore'>('percent');
  const [loadedConfigUrl, setLoadedConfigUrl] = useState('');

  const tabData = state.ga4;
  const generatedUrl = generateUrl('ga4');

  // Get current parameter values
  const currentSource = tabData.parameters.utm_source || '';
  const currentMedium = tabData.parameters.utm_medium || '';
  const currentCampaign = tabData.parameters.utm_campaign || '';

  // Load saved configurations on mount
  useEffect(() => {
    const saved = localStorage.getItem('ga4_configs');
    if (saved) {
      try {
        setSavedConfigs(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved configurations:', error);
      }
    }

    const history = localStorage.getItem('ga4_url_history');
    if (history) {
      try {
        setUrlHistory(JSON.parse(history));
      } catch (error) {
        console.error('Failed to load URL history:', error);
      }
    }
  }, []);

  // Enhanced dropdown options with better categorization
  const channelOptions = ga4Channels.map(channel => ({
    value: channel.name,
    label: channel.name,
    category: channel.name.includes('Paid') ? 'Paid Channels' : 
              channel.name.includes('Organic') ? 'Organic Channels' : 
              'Other Channels',
    description: channel.description
  }));

  // SMART SOURCE OPTIONS - Handle Email channel's OR condition
  const sourceOptions = useMemo(() => {
    if (selectedChannel) {
      const sources = getRecommendedSourcesForChannel(selectedChannel);
      
      // Special handling for Email channel - allow custom sources when medium is email
      if (selectedChannel === 'Email') {
        const emailVariations = ['email', 'e-mail', 'e_mail', 'e mail'];
        const isEmailMedium = emailVariations.includes(currentMedium.toLowerCase());
        
        if (isEmailMedium) {
          // If medium is email, allow any source + show email source options
          return [
            ...emailVariations.map(source => ({
              value: source,
              label: source,
              category: 'Email Sources',
              description: `Official email source variation`
            })),
            // Add common email sources
            { value: 'newsletter', label: 'newsletter', category: 'Custom Email Sources', description: 'Newsletter campaigns' },
            { value: 'mailchimp', label: 'mailchimp', category: 'Custom Email Sources', description: 'Mailchimp campaigns' },
            { value: 'constant_contact', label: 'constant_contact', category: 'Custom Email Sources', description: 'Constant Contact campaigns' },
            { value: 'sendgrid', label: 'sendgrid', category: 'Custom Email Sources', description: 'SendGrid campaigns' },
            { value: 'campaign_monitor', label: 'campaign_monitor', category: 'Custom Email Sources', description: 'Campaign Monitor' },
            { value: 'klaviyo', label: 'klaviyo', category: 'Custom Email Sources', description: 'Klaviyo campaigns' }
          ];
        } else {
          // If medium is not email, only show email source variations
          return emailVariations.map(source => ({
            value: source,
            label: source,
            category: 'Email Sources',
            description: `Email source variation - triggers Email channel`
          }));
        }
      }
      
      // For other channels, show exact sources
      return sources.map(source => ({
        value: source,
        label: source,
        category: selectedChannel,
        description: `Source for ${selectedChannel} channel`
      }));
    } else {
      // When no channel is selected, show ALL sources from ALL categories
      const allSources = [
        ...SOURCE_CATEGORIES.SOURCE_CATEGORY_SEARCH,
        ...SOURCE_CATEGORIES.SOURCE_CATEGORY_SOCIAL,
        ...SOURCE_CATEGORIES.SOURCE_CATEGORY_SHOPPING,
        ...SOURCE_CATEGORIES.SOURCE_CATEGORY_VIDEO
      ];

      const uniqueSources = [...new Set(allSources)];
      
      return uniqueSources.map(source => {
        let category = 'Other';
        if (SOURCE_CATEGORIES.SOURCE_CATEGORY_SEARCH.includes(source)) category = 'Search Engines';
        else if (SOURCE_CATEGORIES.SOURCE_CATEGORY_SOCIAL.includes(source)) category = 'Social Platforms';
        else if (SOURCE_CATEGORIES.SOURCE_CATEGORY_SHOPPING.includes(source)) category = 'Shopping Sites';
        else if (SOURCE_CATEGORIES.SOURCE_CATEGORY_VIDEO.includes(source)) category = 'Video Platforms';

        return {
          value: source,
          label: source,
          category,
          description: `${category} source`
        };
      }).sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.label.localeCompare(b.label);
      });
    }
  }, [selectedChannel, currentMedium]);

  // SMART MEDIUM OPTIONS - Handle Email channel's OR condition  
  const mediumOptions = useMemo(() => {
    if (selectedChannel) {
      const channelMediums = getRecommendedMediumsForChannel(selectedChannel);
      
      // Special handling for Email channel - allow custom mediums when source is email
      if (selectedChannel === 'Email') {
        const emailVariations = ['email', 'e-mail', 'e_mail', 'e mail'];
        const isEmailSource = emailVariations.includes(currentSource.toLowerCase());
        
        if (isEmailSource) {
          // If source is email, allow any medium + show email medium options
          return [
            ...emailVariations.map(medium => ({
              value: medium,
              label: medium,
              category: 'Email Mediums',
              description: `Official email medium variation`
            })),
            // Add common email mediums
            { value: 'newsletter', label: 'newsletter', category: 'Custom Email Mediums', description: 'Newsletter medium' },
            { value: 'promotional', label: 'promotional', category: 'Custom Email Mediums', description: 'Promotional emails' },
            { value: 'transactional', label: 'transactional', category: 'Custom Email Mediums', description: 'Transactional emails' },
            { value: 'drip', label: 'drip', category: 'Custom Email Mediums', description: 'Drip campaigns' },
            { value: 'welcome', label: 'welcome', category: 'Custom Email Mediums', description: 'Welcome series' },
            { value: 'abandoned_cart', label: 'abandoned_cart', category: 'Custom Email Mediums', description: 'Abandoned cart emails' }
          ];
        } else {
          // If source is not email, only show email medium variations
          return emailVariations.map(medium => ({
            value: medium,
            label: medium,
            category: 'Email Mediums',
            description: `Email medium variation - triggers Email channel`
          }));
        }
      }
      
      // For other channels, show exact mediums
      return channelMediums.map(medium => ({
        value: medium,
        label: medium,
        category: selectedChannel,
        description: `Medium that triggers ${selectedChannel} channel classification`
      }));
    } else {
      // When no channel is selected, show ALL possible mediums from GA4 conditions
      return [
        // Direct
        { value: '(not set)', label: '(not set)', category: 'Direct', description: 'Direct traffic medium' },
        { value: '(none)', label: '(none)', category: 'Direct', description: 'Direct traffic medium' },
        
        // Organic Search
        { value: 'organic', label: 'organic', category: 'Organic Search', description: 'Organic search traffic' },
        
        // Paid Traffic
        { value: 'cpc', label: 'cpc', category: 'Paid Traffic', description: 'Cost per click advertising' },
        { value: 'ppc', label: 'ppc', category: 'Paid Traffic', description: 'Pay per click advertising' },
        { value: 'paid', label: 'paid', category: 'Paid Traffic', description: 'Paid advertising' },
        { value: 'retargeting', label: 'retargeting', category: 'Paid Traffic', description: 'Retargeting campaigns' },
        
        // Display
        { value: 'display', label: 'display', category: 'Display', description: 'Display advertising' },
        { value: 'banner', label: 'banner', category: 'Display', description: 'Banner advertising' },
        { value: 'expandable', label: 'expandable', category: 'Display', description: 'Expandable display ads' },
        { value: 'interstitial', label: 'interstitial', category: 'Display', description: 'Interstitial ads' },
        { value: 'cpm', label: 'cpm', category: 'Display', description: 'Cost per mille advertising' },
        
        // Organic Social
        { value: 'social', label: 'social', category: 'Organic Social', description: 'Social media traffic' },
        { value: 'social-network', label: 'social-network', category: 'Organic Social', description: 'Social network traffic' },
        { value: 'social-media', label: 'social-media', category: 'Organic Social', description: 'Social media traffic' },
        { value: 'sm', label: 'sm', category: 'Organic Social', description: 'Social media traffic' },
        { value: 'social network', label: 'social network', category: 'Organic Social', description: 'Social network traffic' },
        { value: 'social media', label: 'social media', category: 'Organic Social', description: 'Social media traffic' },
        
        // Video
        { value: 'video', label: 'video', category: 'Video', description: 'Video platform traffic' },
        
        // Referral
        { value: 'referral', label: 'referral', category: 'Referral', description: 'Referral traffic' },
        { value: 'app', label: 'app', category: 'Referral', description: 'App referral traffic' },
        { value: 'link', label: 'link', category: 'Referral', description: 'Link referral traffic' },
        
        // Email - ALL OFFICIAL VARIATIONS
        { value: 'email', label: 'email', category: 'Email', description: 'Email marketing' },
        { value: 'e-mail', label: 'e-mail', category: 'Email', description: 'Email marketing' },
        { value: 'e_mail', label: 'e_mail', category: 'Email', description: 'Email marketing' },
        { value: 'e mail', label: 'e mail', category: 'Email', description: 'Email marketing' },
        
        // Affiliates
        { value: 'affiliate', label: 'affiliate', category: 'Affiliates', description: 'Affiliate marketing' },
        
        // Audio
        { value: 'audio', label: 'audio', category: 'Audio', description: 'Audio platform advertising' },
        
        // SMS
        { value: 'sms', label: 'sms', category: 'SMS', description: 'SMS marketing' },
        
        // Mobile Push Notifications
        { value: 'push', label: 'push', category: 'Mobile Push', description: 'Push notifications' },
        { value: 'mobile', label: 'mobile', category: 'Mobile Push', description: 'Mobile notifications' },
        { value: 'notification', label: 'notification', category: 'Mobile Push', description: 'Mobile notifications' }
      ];
    }
  }, [selectedChannel, currentSource]);

  // Check if selected channel has source requirements OR allows flexible sources
  const sourceInputType = useMemo(() => {
    if (!selectedChannel) return 'dropdown'; // Show dropdown when no channel selected
    
    const sources = getRecommendedSourcesForChannel(selectedChannel);
    
    // Special cases for channels that allow flexible sources
    if (selectedChannel === 'Email') {
      const emailVariations = ['email', 'e-mail', 'e_mail', 'e mail'];
      const isEmailMedium = emailVariations.includes(currentMedium.toLowerCase());
      // If medium is email, allow flexible source input
      return isEmailMedium ? 'flexible' : 'dropdown';
    }
    
    // Channels with no source requirements should allow free input
    if (sources.length === 0) {
      return 'input';
    }
    
    // Channels with specific source requirements should use dropdown
    return 'dropdown';
  }, [selectedChannel, currentMedium]);

  const handleParameterChange = useCallback((key: string, value: string) => {
    // Apply space encoding automatically
    let encodedValue = value;
    if (spaceEncoding === 'percent') {
      encodedValue = value.replace(/ /g, '%20');
    } else if (spaceEncoding === 'plus') {
      encodedValue = value.replace(/ /g, '+');
    } else if (spaceEncoding === 'underscore') {
      encodedValue = value.replace(/ /g, '_');
    }
    
    updateParameter('ga4', key, encodedValue);
    
    // Enhanced validation with real-time feedback
    if (['utm_source', 'utm_medium', 'utm_campaign'].includes(key)) {
      const validation = validateUrl(generatedUrl);
      setValidationResult(validation);
    }
  }, [updateParameter, generatedUrl, spaceEncoding]);

  const handleBaseUrlChange = useCallback((url: string) => {
    dispatch({ type: 'UPDATE_BASE_URL', payload: { tab: 'ga4', url } });
  }, [dispatch]);

  const handleChannelChange = useCallback((channelName: string) => {
    setSelectedChannel(channelName);
    
    // Clear current source and medium when channel changes to avoid confusion
    if (channelName) {
      // Clear existing values to force user to select from filtered options
      handleParameterChange('utm_source', '');
      handleParameterChange('utm_medium', '');
      
      const channelData = ga4Channels.find(c => c.name === channelName);
      const hasSourceRequirements = channelData && channelData.recommendedSources.length > 0;
      
      if (channelName === 'Email') {
        info(`Email channel selected: You can use any source with email medium, or any medium with email source.`);
      } else if (hasSourceRequirements) {
        info(`Channel selected: ${channelName}. Source and medium options are now filtered to match this channel's GA4 conditions.`);
      } else {
        info(`Channel selected: ${channelName}. You can enter any source name freely. Medium options are filtered to match GA4 conditions.`);
      }
    } else {
      info('Channel cleared. All source and medium options are now available.');
    }
  }, [handleParameterChange, info]);

  // Enhanced URL analysis with loading state and channel prediction
  const analyzeExistingUrl = useCallback(async () => {
    if (!analyzeUrlInput) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate analysis delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const analysis = analyzeUrlUtil(analyzeUrlInput);
      setAnalyzedResult(analysis);
      
      // Auto-populate fields if they're empty
      if (!currentSource && analysis.utmParameters.utm_source) {
        handleParameterChange('utm_source', analysis.utmParameters.utm_source);
      }
      if (!currentMedium && analysis.utmParameters.utm_medium) {
        handleParameterChange('utm_medium', analysis.utmParameters.utm_medium);
      }
      if (!currentCampaign && analysis.utmParameters.utm_campaign) {
        handleParameterChange('utm_campaign', analysis.utmParameters.utm_campaign);
      }
      if (!tabData.parameters.utm_term && analysis.utmParameters.utm_term) {
        handleParameterChange('utm_term', analysis.utmParameters.utm_term);
      }
      if (!tabData.parameters.utm_content && analysis.utmParameters.utm_content) {
        handleParameterChange('utm_content', analysis.utmParameters.utm_content);
      }
      
      // Update base URL if different
      if (analysis.baseUrl !== tabData.baseUrl) {
        handleBaseUrlChange(analysis.baseUrl);
      }
      
    } catch (error) {
      setAnalyzedResult({ error: 'Invalid URL format' });
    } finally {
      setIsAnalyzing(false);
    }
  }, [analyzeUrlInput, currentSource, currentMedium, currentCampaign, handleParameterChange, tabData, handleBaseUrlChange]);

  // Enhanced configuration management
  const saveConfiguration = useCallback(() => {
    if (!configName.trim()) {
      setConfigFeedback('Please enter a configuration name');
      return;
    }
    
    const config = {
      baseUrl: tabData.baseUrl,
      parameters: tabData.parameters,
      options: tabData.options,
      selectedChannel,
      spaceEncoding,
      timestamp: Date.now(),
      version: '2.0'
    };
    
    const newConfigs = { ...savedConfigs, [configName]: config };
    setSavedConfigs(newConfigs);
    localStorage.setItem('ga4_configs', JSON.stringify(newConfigs));
    setConfigName('');
    setConfigFeedback(`Configuration "${configName}" saved successfully!`);
    setTimeout(() => setConfigFeedback(''), 3000);
  }, [configName, tabData, selectedChannel, spaceEncoding, savedConfigs]);

  const loadConfiguration = useCallback(() => {
    if (!selectedConfig || !savedConfigs[selectedConfig]) {
      setConfigFeedback('Please select a configuration to load');
      return;
    }
    
    const config = savedConfigs[selectedConfig];
    
    // Update base URL
    dispatch({ type: 'UPDATE_BASE_URL', payload: { tab: 'ga4', url: config.baseUrl } });
    
    // Update all parameters
    Object.entries(config.parameters).forEach(([key, value]) => {
      updateParameter('ga4', key, value as string);
    });
    
    // Update channel selection
    if (config.selectedChannel) {
      setSelectedChannel(config.selectedChannel);
    }
    
    // Update space encoding
    if (config.spaceEncoding) {
      setSpaceEncoding(config.spaceEncoding);
    }
    
    // Force re-generation of URL after a short delay to ensure all updates are applied
    setTimeout(() => {
      const configUrl = generateUrl('ga4');
      setLoadedConfigUrl(configUrl);
    }, 100);
    
    setConfigFeedback(`Configuration "${selectedConfig}" loaded successfully!`);
    setTimeout(() => setConfigFeedback(''), 3000);
  }, [selectedConfig, savedConfigs, dispatch, updateParameter, generateUrl]);

  const deleteConfiguration = useCallback(() => {
    if (!selectedConfig) {
      setConfigFeedback('Please select a configuration to delete');
      return;
    }
    
    const newConfigs = { ...savedConfigs };
    delete newConfigs[selectedConfig];
    setSavedConfigs(newConfigs);
    localStorage.setItem('ga4_configs', JSON.stringify(newConfigs));
    setSelectedConfig('');
    setLoadedConfigUrl('');
    setConfigFeedback(`Configuration deleted successfully!`);
    setTimeout(() => setConfigFeedback(''), 3000);
  }, [selectedConfig, savedConfigs]);

  // Enhanced export/import functionality
  const exportConfiguration = useCallback(() => {
    const config = {
      baseUrl: tabData.baseUrl,
      parameters: tabData.parameters,
      options: tabData.options,
      selectedChannel,
      spaceEncoding,
      exportDate: new Date().toISOString(),
      version: '2.0',
      tool: 'GA4 UTM Builder'
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ga4-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    success('Configuration exported successfully!');
  }, [tabData, selectedChannel, spaceEncoding, success]);

  const importConfiguration = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        
        dispatch({ type: 'UPDATE_BASE_URL', payload: { tab: 'ga4', url: config.baseUrl || '' } });
        
        Object.entries(config.parameters || {}).forEach(([key, value]) => {
          updateParameter('ga4', key, value as string);
        });
        
        if (config.selectedChannel) {
          setSelectedChannel(config.selectedChannel);
        }
        
        if (config.spaceEncoding) {
          setSpaceEncoding(config.spaceEncoding);
        }
        
        success('Configuration imported successfully!');
      } catch (error) {
        error('Failed to import configuration. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  }, [dispatch, updateParameter, success, error]);

  // URL History management
  const saveToHistory = useCallback(() => {
    if (!generatedUrl || urlHistory.includes(generatedUrl)) return;
    
    const newHistory = [generatedUrl, ...urlHistory.slice(0, 9)]; // Keep last 10
    setUrlHistory(newHistory);
    localStorage.setItem('ga4_url_history', JSON.stringify(newHistory));
  }, [generatedUrl, urlHistory]);

  const loadFromHistory = useCallback((url: string) => {
    setAnalyzeUrlInput(url);
    analyzeExistingUrl();
  }, [analyzeExistingUrl]);

  // Enhanced copy functionality with proper state management
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopiedUrl(true);
      saveToHistory();
      setTimeout(() => setCopiedUrl(false), 2000);
      success('URL copied to clipboard!');
    } catch (err) {
      error('Failed to copy URL');
      console.error('Failed to copy URL:', err);
    }
  };

  // Copy loaded configuration URL
  const copyLoadedConfigUrl = async () => {
    try {
      await navigator.clipboard.writeText(loadedConfigUrl);
      success('Configuration URL copied!');
    } catch (err) {
      error('Failed to copy configuration URL');
    }
  };

  // Reset all fields
  const resetFields = useCallback(() => {
    dispatch({ type: 'RESET_TAB', payload: { tab: 'ga4' } });
    setSelectedChannel('');
    setSpaceEncoding('percent');
    setAnalyzeUrlInput('');
    setAnalyzedResult(null);
    setLoadedConfigUrl('');
    success('All fields reset successfully!');
  }, [dispatch, success]);

  const predictedChannel = predictGA4Channel(currentSource, currentMedium, currentCampaign);
  const selectedChannelData = ga4Channels.find(c => c.name === selectedChannel);

  return (
    <div className="space-y-6">
      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onCopy={copyToClipboard}
        onSave={saveConfiguration}
        onReset={resetFields}
        onExport={exportConfiguration}
      />

      {/* Compact Tutorial Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
              <Play className="w-4 h-4" />
              Learn How to Use This Tool
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-xs">
              Watch our comprehensive tutorial to master GA4 UTM parameter building
            </p>
          </div>
          <Button
            onClick={() => setShowVideoModal(true)}
            icon={Play}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
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
              <h3 className="text-lg font-semibold">GA4 UTM Builder Tutorial</h3>
              <Button
                onClick={() => setShowVideoModal(false)}
                variant="ghost"
                icon={X}
                size="sm"
              />
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    Video Tutorial Placeholder
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Replace this section with your actual video embed code
                  </p>
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Embed your video using iframe, video tag, or third-party player (YouTube, Vimeo, etc.)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Channel Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          GA4 Channel Configuration
        </h2>
        
        <div className="space-y-3">
          <div>
            <Dropdown
              label="Target GA4 Channel (Optional)"
              options={channelOptions}
              value={selectedChannel}
              onChange={handleChannelChange}
              placeholder="Select a GA4 channel to filter sources and mediums"
              searchable
              clearable
              groupByCategory
              className="w-full"
              helperText="Selecting a channel shows ONLY sources/mediums that match GA4 conditions"
            />
          </div>

          {selectedChannelData && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-1">
                    {selectedChannelData.name} Channel
                  </h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                    {selectedChannelData.description}
                  </p>
                  <div className="bg-blue-100 dark:bg-blue-800/50 rounded-md p-2">
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
                      GA4 Condition:
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-mono">
                      {selectedChannelData.condition}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compact Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Base Configuration - Compact */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Base URL
          </h2>
          
          <div className="space-y-3">
            <Input
              label="Website URL"
              placeholder="https://www.example.com"
              value={tabData.baseUrl}
              onChange={(e) => handleBaseUrlChange(e.target.value)}
              required
            />

            {/* Compact Space Encoding */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Space Encoding
              </label>
              <div className="space-y-1">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="spaceEncoding"
                    value="percent"
                    checked={spaceEncoding === 'percent'}
                    onChange={(e) => setSpaceEncoding(e.target.value as 'percent')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    Encode (%20)
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="spaceEncoding"
                    value="plus"
                    checked={spaceEncoding === 'plus'}
                    onChange={(e) => setSpaceEncoding(e.target.value as 'plus')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    Plus (+)
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="spaceEncoding"
                    value="underscore"
                    checked={spaceEncoding === 'underscore'}
                    onChange={(e) => setSpaceEncoding(e.target.value as 'underscore')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    Underscore (_)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Core UTM Parameters - Compact */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Core UTM Parameters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* UTM Source - Smart Input/Dropdown */}
            <div>
              {sourceInputType === 'dropdown' ? (
                // Show dropdown when channel has specific source requirements
                <Dropdown
                  label="Source (utm_source)"
                  options={sourceOptions}
                  value={currentSource}
                  onChange={(value) => handleParameterChange('utm_source', value)}
                  placeholder="e.g., google, facebook"
                  searchable
                  clearable
                  groupByCategory
                  allowCustom
                  className="w-full"
                  required
                />
              ) : sourceInputType === 'flexible' ? (
                // Show dropdown with custom options for Email channel when medium is email
                <Dropdown
                  label="Source (utm_source)"
                  options={sourceOptions}
                  value={currentSource}
                  onChange={(value) => handleParameterChange('utm_source', value)}
                  placeholder="e.g., newsletter, mailchimp"
                  searchable
                  clearable
                  groupByCategory
                  allowCustom
                  customPlaceholder="Enter your email source name..."
                  className="w-full"
                  required
                  helperText="Email medium allows any source name"
                />
              ) : (
                // Show regular input when no specific source requirements
                <Input
                  label="Source (utm_source)"
                  placeholder="e.g., spotify, podcast, radio"
                  value={currentSource}
                  onChange={(e) => handleParameterChange('utm_source', e.target.value)}
                  required
                  helperText={selectedChannel ? `${selectedChannel} channel accepts any source` : undefined}
                />
              )}
            </div>

            {/* UTM Medium */}
            <div>
              <Dropdown
                label="Medium (utm_medium)"
                options={mediumOptions}
                value={currentMedium}
                onChange={(value) => handleParameterChange('utm_medium', value)}
                placeholder="e.g., cpc, email"
                searchable
                clearable
                groupByCategory
                allowCustom
                customPlaceholder="Enter your custom medium..."
                className="w-full"
                required
                helperText={selectedChannel === 'Email' && currentSource && ['email', 'e-mail', 'e_mail', 'e mail'].includes(currentSource.toLowerCase()) ? "Email source allows any medium name" : undefined}
              />
            </div>

            {/* UTM Campaign */}
            <div>
              <Input
                label="Campaign (utm_campaign)"
                placeholder="e.g., spring_sale_2024"
                value={tabData.parameters.utm_campaign || ''}
                onChange={(e) => handleParameterChange('utm_campaign', e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Optional Parameters - Compact */}
      <Accordion 
        title="Optional Parameters" 
        icon={<Settings className="w-4 h-4" />}
        defaultOpen={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ga4Parameters.optional.map((param) => (
            <Input
              key={param.id}
              label={param.label}
              placeholder={param.placeholder}
              value={tabData.parameters[param.id] || ''}
              onChange={(e) => handleParameterChange(param.id, e.target.value)}
              tooltip={param.tooltip}
            />
          ))}
        </div>
      </Accordion>

      {/* Generated URL - PROMINENT POSITION */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-green-900 dark:text-green-100 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Generated Campaign URL
          </h2>
          
          <Button
            onClick={copyToClipboard}
            disabled={!generatedUrl}
            icon={copiedUrl ? Check : Copy}
            variant={copiedUrl ? 'success' : 'primary'}
            size="lg"
          >
            {copiedUrl ? 'Copied!' : 'Copy URL'}
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-green-200 dark:border-green-700 shadow-inner">
          <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
            {generatedUrl || 'Enter parameters to generate URL...'}
          </code>
        </div>

        {validationResult && validationResult.warnings.length > 0 && (
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Recommendations:
                </p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 list-disc list-inside">
                  {validationResult.warnings.map((warning: string, index: number) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced URL Analyzer with Integrated URL Preview and Parameter Validation */}
      <Accordion 
        title="Analyze Existing Campaign URL" 
        icon={<Search className="w-4 h-4" />}
        defaultOpen={false}
      >
        <div className="space-y-6">
          {/* URL Input and Analysis */}
          <div className="space-y-4">
            <Input
              label="Paste Campaign URL"
              placeholder="https://example.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale"
              value={analyzeUrlInput}
              onChange={(e) => setAnalyzeUrlInput(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={analyzeExistingUrl} 
                disabled={!analyzeUrlInput || isAnalyzing}
                icon={isAnalyzing ? RefreshCw : Zap}
                className={isAnalyzing ? 'animate-spin' : ''}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze URL'}
              </Button>
              
              {analyzeUrlInput && (
                <Button 
                  onClick={() => setAnalyzeUrlInput('')} 
                  variant="ghost"
                  icon={X}
                  size="sm"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Analysis Results */}
          {analyzedResult && !analyzedResult.error && (
            <div className="space-y-6">
              {/* Channel Prediction Analysis */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Channel Prediction Analysis
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Predicted Channel: <span className="text-blue-600 dark:text-blue-400">{analyzedResult.predictedChannel}</span>
                  </p>
                  {analyzedResult.predictedChannel !== 'Unassigned' && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Matching Condition:
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-mono">
                        {ga4Channels.find(c => c.name === analyzedResult.predictedChannel)?.condition}
                      </p>
                    </div>
                  )}
                </div>
                
                {analyzedResult.issues.length > 0 && (
                  <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      Issues Found:
                    </p>
                    <ul className="text-xs text-yellow-700 dark:text-yellow-300 list-disc list-inside space-y-1">
                      {analyzedResult.issues.map((issue: string, index: number) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Integrated URL Preview */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  URL Preview & Breakdown
                </h4>
                <UrlPreview
                  url={analyzeUrlInput}
                  baseUrl={analyzedResult.baseUrl}
                  parameters={analyzedResult.parameters}
                  showAnalytics={true}
                />
              </div>

              {/* Integrated Parameter Validation */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Parameter Validation
                </h4>
                <ParameterValidator
                  source={analyzedResult.utmParameters.utm_source || ''}
                  medium={analyzedResult.utmParameters.utm_medium || ''}
                  campaign={analyzedResult.utmParameters.utm_campaign || ''}
                  predictedChannel={analyzedResult.predictedChannel}
                  baseUrl={analyzedResult.baseUrl}
                  additionalParams={analyzedResult.otherParameters}
                />
              </div>
            </div>
          )}

          {analyzedResult?.error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-700 dark:text-red-300">{analyzedResult.error}</p>
            </div>
          )}

          {/* URL History */}
          {urlHistory.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent URLs</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {urlHistory.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => loadFromHistory(url)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline block truncate w-full text-left"
                  >
                    {url}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Accordion>

      {/* Enhanced Configuration Management */}
      <Accordion 
        title="Configuration Management" 
        icon={<Save className="w-4 h-4" />}
        defaultOpen={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Save Configuration</h3>
            <Input
              placeholder="Configuration name (e.g., Summer Campaign 2024)"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
            />
            <Button onClick={saveConfiguration} icon={Save} disabled={!configName.trim()}>
              Save Configuration
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Load Configuration</h3>
            <select
              value={selectedConfig}
              onChange={(e) => setSelectedConfig(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            >
              <option value="">Select configuration...</option>
              {Object.entries(savedConfigs).map(([name, config]) => (
                <option key={name} value={name}>
                  {name} ({new Date(config.timestamp).toLocaleDateString()})
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button onClick={loadConfiguration} disabled={!selectedConfig} size="sm">
                Load
              </Button>
              <Button onClick={deleteConfiguration} variant="danger" disabled={!selectedConfig} size="sm">
                Delete
              </Button>
            </div>
            
            {/* Display loaded configuration URL with copy option */}
            {loadedConfigUrl && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Loaded Configuration URL:
                  </p>
                  <Button
                    onClick={copyLoadedConfigUrl}
                    variant="ghost"
                    size="sm"
                    icon={Copy}
                    className="text-green-600 hover:text-green-700"
                  >
                    Copy
                  </Button>
                </div>
                <code className="text-xs text-green-700 dark:text-green-300 break-all font-mono">
                  {loadedConfigUrl}
                </code>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">Import/Export</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                How to use Import/Export:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• <strong>Export:</strong> Downloads your current configuration as a JSON file for backup or sharing</li>
                <li>• <strong>Import:</strong> Loads a previously exported configuration file to restore settings</li>
                <li>• Perfect for team collaboration, backup purposes, or moving between devices</li>
                <li>• Files include all parameters, channel selection, and encoding preferences</li>
              </ul>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={exportConfiguration} icon={Download} size="sm">
                Export Configuration
              </Button>
              <label className="cursor-pointer">
                <Button as="span" icon={Upload} size="sm">
                  Import Configuration
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importConfiguration}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {configFeedback && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">{configFeedback}</p>
          </div>
        )}
      </Accordion>

      {/* Enhanced Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Need Help?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <ExternalLink size={16} />
              <a 
                href="https://support.google.com/analytics/answer/10917952" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                GA4 UTM Parameter Documentation
              </a>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink size={16} />
              <a 
                href="https://ga-dev-tools.google/campaign-url-builder/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Google's Official Campaign URL Builder
              </a>
            </div>
          </div>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <ExternalLink size={16} />
              <a 
                href="https://support.google.com/analytics/answer/9267735" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                GA4 Default Channel Groups
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Play size={16} />
              <button 
                onClick={() => setShowVideoModal(true)}
                className="hover:underline text-left"
              >
                Watch Tutorial Video
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GA4Builder;