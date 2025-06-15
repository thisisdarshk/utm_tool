import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Search, X, Save, Download, Upload, Play, RefreshCw, Plus, Trash2, Zap, Globe, Settings, Target } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Accordion from '../common/Accordion';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';

const MetaAdsBuilder: React.FC = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');
  
  // Individual optional parameter toggles
  const [includeUtmTerm, setIncludeUtmTerm] = useState(false);
  const [includeUtmContent, setIncludeUtmContent] = useState(false);
  
  const [customParams, setCustomParams] = useState<Array<{key: string, value: string}>>([]);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
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
    { 
      value: 'paidsocial', 
      label: 'paidsocial', 
      category: 'Standard Mediums',
      description: 'Paid social media traffic - Clear paid social classification'
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

  // Handle individual optional parameter toggles with default value restoration
  const handleUtmTermToggle = useCallback((enabled: boolean) => {
    setIncludeUtmTerm(enabled);
    
    // If enabling and field is empty, restore default
    if (enabled && !utmTerm.trim()) {
      setUtmTerm('{{audience.name}}');
    }
  }, [utmTerm]);

  const handleUtmContentToggle = useCallback((enabled: boolean) => {
    setIncludeUtmContent(enabled);
    
    // If enabling and field is empty, restore default
    if (enabled && !utmContent.trim()) {
      setUtmContent('{{ad.name}}');
    }
  }, [utmContent]);

  // Generate URL
  const generateUrl = useCallback(() => {
    if (!websiteUrl) {
      setGeneratedUrl('');
      return;
    }

    try {
      const url = new URL(websiteUrl);
      const params = new URLSearchParams();

      // Add UTM parameters - REQUIRED FIELDS ALWAYS INCLUDED
      if (utmSource) params.append('utm_source', utmSource);
      if (utmMedium) params.append('utm_medium', utmMedium);
      if (utmCampaign) params.append('utm_campaign', utmCampaign);
      
      // Add optional UTM parameters only if individually enabled
      if (includeUtmTerm && utmTerm) params.append('utm_term', utmTerm);
      if (includeUtmContent && utmContent) params.append('utm_content', utmContent);

      // Add custom parameters
      customParams.forEach(param => {
        if (param.key && param.value) {
          params.append(param.key, param.value);
        }
      });

      const finalUrl = params.toString() ? `${url.origin}${url.pathname}?${params.toString()}` : websiteUrl;
      setGeneratedUrl(finalUrl);
    } catch (error) {
      setGeneratedUrl('Invalid URL format');
    }
  }, [websiteUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, includeUtmTerm, includeUtmContent, customParams]);

  // Auto-generate when parameters change
  React.useEffect(() => {
    generateUrl();
  }, [generateUrl]);

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
      success('URL copied to clipboard!');
    } catch (err) {
      error('Failed to copy URL');
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
      websiteUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
      includeUtmTerm, includeUtmContent, // Save individual toggles
      customParams, timestamp: Date.now()
    };
    
    const newTemplates = { ...savedTemplates, [templateName]: template };
    setSavedTemplates(newTemplates);
    localStorage.setItem('meta_ads_templates', JSON.stringify(newTemplates));
    
    success(`Template "${templateName}" saved successfully!`);
    setTemplateName('');
  }, [templateName, websiteUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, includeUtmTerm, includeUtmContent, customParams, savedTemplates, success, error]);

  const loadTemplate = useCallback(() => {
    if (!selectedTemplate || !savedTemplates[selectedTemplate]) {
      error('Please select a template to load');
      return;
    }
    
    const template = savedTemplates[selectedTemplate];
    setWebsiteUrl(template.websiteUrl);
    setUtmSource(template.utmSource);
    setUtmMedium(template.utmMedium);
    setUtmCampaign(template.utmCampaign);
    setUtmTerm(template.utmTerm);
    setUtmContent(template.utmContent);
    
    // Load individual toggles (with fallback for old templates)
    setIncludeUtmTerm(template.includeUtmTerm ?? false);
    setIncludeUtmContent(template.includeUtmContent ?? false);
    
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
    setWebsiteUrl('');
    setUtmSource('');
    setUtmMedium('');
    setUtmCampaign('');
    setUtmTerm('');
    setUtmContent('');
    setIncludeUtmTerm(false);
    setIncludeUtmContent(false);
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

  return (
    <div className="space-y-8">
      {/* Video Tutorial Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Meta Ads Tracking Tutorial
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              Learn how to set up dynamic UTM parameters for Facebook and Instagram ads
            </p>
          </div>
          <Button
            onClick={() => setShowVideoModal(true)}
            icon={Play}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
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
              <h3 className="text-lg font-semibold">Meta Ads Tracking Tutorial</h3>
              <Button onClick={() => setShowVideoModal(false)} variant="ghost" icon={X} size="sm" />
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    Meta Ads Tutorial Placeholder
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Replace with your Meta Ads tracking tutorial video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Website URL */}
      <Accordion 
        title="Website URL" 
        icon={<Globe className="w-5 h-5" />}
        badge={<Badge variant="info" size="sm">Required</Badge>}
        defaultOpen={true}
      >
        <Input
          label="Website URL"
          placeholder="https://www.yourwebsite.com"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          required
          tooltip="Your full landing page URL"
        />
      </Accordion>

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
              placeholder="e.g., paid or {{placement}}"
              searchable
              clearable
              allowCustom
              groupByCategory
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Meta may set this to 'paid'
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
                placeholder="e.g., {{audience.name}} or specific_audience"
                disabled={!includeUtmTerm}
                helperText="Identify paid keywords or audience targeting"
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

      {/* Generated URL - MOVED HERE ABOVE THE FOLD */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Generated Meta Ads URL
          </h2>
          <Button
            onClick={copyToClipboard}
            disabled={!generatedUrl || generatedUrl === 'Invalid URL format'}
            icon={copiedUrl ? Check : Copy}
            variant={copiedUrl ? 'success' : 'primary'}
            size="lg"
          >
            {copiedUrl ? 'Copied!' : 'Copy URL'}
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700 shadow-inner">
          <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
            {generatedUrl || 'Enter website URL and parameters to generate URL...'}
          </code>
        </div>
      </div>

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
                    placeholder="e.g., ad_id"
                    value={param.key}
                    onChange={(e) => updateCustomParam(index, 'key', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Parameter Value"
                    placeholder="e.g., {{ad.id}}"
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

      {/* Meta-specific Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dynamic Placeholders */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Dynamic Placeholders
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <div><code>{"{{campaign.name}}"}</code> - Campaign name</div>
            <div><code>{"{{campaign.id}}"}</code> - Campaign ID</div>
            <div><code>{"{{ad.name}}"}</code> - Ad name</div>
            <div><code>{"{{ad.id}}"}</code> - Ad ID</div>
            <div><code>{"{{adset.name}}"}</code> - Ad set name</div>
            <div><code>{"{{adset.id}}"}</code> - Ad set ID</div>
            <div><code>{"{{placement}}"}</code> - Placement location</div>
            <div><code>{"{{site_source_name}}"}</code> - Source platform</div>
          </div>
        </div>

        {/* Site Source Values */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
            Site Source Values
          </h3>
          <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
            <div><code>fb</code> - Facebook</div>
            <div><code>ig</code> - Instagram</div>
            <div><code>msg</code> - Messenger</div>
            <div><code>an</code> - Audience Network</div>
            <div><code>wa</code> - WhatsApp</div>
          </div>
        </div>
      </div>

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