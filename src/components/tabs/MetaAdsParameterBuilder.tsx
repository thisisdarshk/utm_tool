import React, { useState, useCallback } from 'react';
import { Copy, Check, Info, AlertTriangle, Zap } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';

const MetaAdsParameterBuilder: React.FC = () => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const { success, error } = useToast();

  // The complete Meta Ads URL parameter string
  const metaUrlParameters = 'utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_source_platform={{publisher_platform}}&utm_creative_format={{ad_format}}&placement={{placement}}&publisher_platform={{publisher_platform}}&campaign_id={{campaign.id}}&ad_id={{ad.id}}&adset_id={{adset.id}}&device_type={{device_type}}&targeting={{adset.name}}&adset_name={{adset.name}}';

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(metaUrlParameters);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
      success('Meta Ads URL parameters copied to clipboard!');
    } catch (err) {
      error('Failed to copy URL parameters');
      console.error('Failed to copy:', err);
    }
  };

  // Parameter mapping data for display
  const utmParameters = [
    { param: 'utm_source', value: '{{site_source_name}}', description: 'Dynamic source name (fb, ig, msg, an, wa)' },
    { param: 'utm_medium', value: 'paid_social', description: 'Static value for paid social traffic' },
    { param: 'utm_campaign', value: '{{campaign.name}}', description: 'Dynamic campaign name from Meta' },
    { param: 'utm_content', value: '{{ad.name}}', description: 'Dynamic ad name for content differentiation' },
    { param: 'utm_source_platform', value: '{{publisher_platform}}', description: 'Platform where ad was shown' },
    { param: 'utm_creative_format', value: '{{ad_format}}', description: 'Ad format type (video, image, carousel, etc.)' }
  ];

  const customParameters = [
    { param: 'placement', value: '{{placement}}', description: 'Specific placement location' },
    { param: 'publisher_platform', value: '{{publisher_platform}}', description: 'Publisher platform identifier' },
    { param: 'campaign_id', value: '{{campaign.id}}', description: 'Unique campaign identifier' },
    { param: 'adset_id', value: '{{adset.id}}', description: 'Unique ad set identifier' },
    { param: 'ad_id', value: '{{ad.id}}', description: 'Unique ad identifier' },
    { param: 'device_type', value: '{{device_type}}', description: 'Device type (mobile, desktop, tablet)' },
    { param: 'targeting', value: '{{adset.name}}', description: 'Targeting criteria from ad set name' },
    { param: 'adset_name', value: '{{adset.name}}', description: 'Ad set name for reference' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Meta Ads UTM Parameter Builder
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          GA4-compliant URL parameters with Meta's dynamic parameter mapping
        </p>
      </div>

      {/* Generated URL Parameters */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Meta Ads URL Parameters
          </h2>
          <Button
            onClick={copyToClipboard}
            icon={copiedUrl ? Check : Copy}
            variant={copiedUrl ? 'success' : 'primary'}
            size="lg"
          >
            {copiedUrl ? 'Copied!' : 'Copy Parameters'}
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700 shadow-inner">
          <code className="text-sm break-all text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
            {metaUrlParameters}
          </code>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Usage Instructions</p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Copy this string and paste it into Meta's "URL Parameters" field in your ad campaign setup. 
                It will be automatically appended to your destination URLs.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Standard GA4 UTM Parameters */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Badge variant="info" size="sm">Standard</Badge>
          GA4 UTM Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {utmParameters.map((param, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                  {param.param}
                </code>
                {param.value === 'paid_social' && (
                  <Badge variant="success" size="sm">Static</Badge>
                )}
                {param.value.includes('{{') && (
                  <Badge variant="info" size="sm">Dynamic</Badge>
                )}
              </div>
              <div className="mb-2">
                <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {param.value}
                </code>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {param.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Custom GA4 Parameters */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Badge variant="warning" size="sm">Custom</Badge>
          GA4 Event-Scoped Dimensions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customParameters.map((param, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
                  {param.param}
                </code>
                <Badge variant="info" size="sm">Dynamic</Badge>
              </div>
              <div className="mb-2">
                <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {param.value}
                </code>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {param.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Implementation Guide */}
      <Card className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
          Implementation Guide
        </h3>
        <div className="space-y-4 text-sm text-green-800 dark:text-green-200">
          <div>
            <h4 className="font-semibold mb-2">Step 1: Copy Parameters</h4>
            <p>Click the "Copy Parameters" button above to copy the complete URL parameter string.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Step 2: Add to Meta Ads</h4>
            <p>In your Meta Ads campaign setup, navigate to the "URL Parameters" field and paste the copied string.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Step 3: Configure GA4</h4>
            <p>Set up custom dimensions in GA4 for the custom parameters (placement, campaign_id, etc.) to capture the additional data.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Step 4: Test</h4>
            <p>Run a test campaign and verify that all parameters are being populated correctly in your GA4 reports.</p>
          </div>
        </div>
      </Card>

      {/* Important Notes */}
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              Important Notes
            </h3>
            <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
              <li>• <strong>No utm_term:</strong> Excluded as Meta doesn't use keyword-based advertising</li>
              <li>• <strong>Separate placement parameters:</strong> Uses both 'placement' and 'publisher_platform' instead of 'full_placement'</li>
              <li>• <strong>Lowercase naming:</strong> All parameter names follow lowercase convention</li>
              <li>• <strong>No leading question mark:</strong> String is ready to append to any URL</li>
              <li>• <strong>Dynamic population:</strong> Meta will automatically replace {{}} placeholders with actual values</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Meta Dynamic Parameters Reference */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Meta Dynamic Parameters Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Site Source Values</h4>
            <div className="space-y-1 text-gray-600 dark:text-gray-400">
              <div><code>fb</code> - Facebook</div>
              <div><code>ig</code> - Instagram</div>
              <div><code>msg</code> - Messenger</div>
              <div><code>an</code> - Audience Network</div>
              <div><code>wa</code> - WhatsApp</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Common Ad Formats</h4>
            <div className="space-y-1 text-gray-600 dark:text-gray-400">
              <div><code>single_image</code> - Single Image</div>
              <div><code>single_video</code> - Single Video</div>
              <div><code>carousel</code> - Carousel</div>
              <div><code>collection</code> - Collection</div>
              <div><code>slideshow</code> - Slideshow</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MetaAdsParameterBuilder;