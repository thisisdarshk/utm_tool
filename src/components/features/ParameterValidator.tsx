import React, { useMemo } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import Badge from '../common/Badge';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import { SOURCE_CATEGORIES, getSourceCategory } from '../../data/sourceCategories';

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'warning' | 'error' | 'info';
  message?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ParameterValidatorProps {
  source: string;
  medium: string;
  campaign: string;
  predictedChannel: string;
  baseUrl?: string;
  additionalParams?: Record<string, string>;
}

const ParameterValidator: React.FC<ParameterValidatorProps> = ({
  source,
  medium,
  campaign,
  predictedChannel,
  baseUrl = '',
  additionalParams = {}
}) => {
  const validationRules = useMemo((): ValidationRule[] => {
    const rules: ValidationRule[] = [];

    // Critical validations
    rules.push({
      id: 'base-url-required',
      name: 'Base URL',
      description: 'A valid base URL is required',
      status: baseUrl ? 'pass' : 'error',
      message: baseUrl ? 'Base URL provided' : 'Base URL is required for tracking',
      severity: 'critical'
    });

    if (baseUrl) {
      try {
        new URL(baseUrl);
        rules.push({
          id: 'base-url-format',
          name: 'URL Format',
          description: 'Base URL format validation',
          status: 'pass',
          message: 'Base URL format is valid',
          severity: 'high'
        });
      } catch {
        rules.push({
          id: 'base-url-format',
          name: 'URL Format',
          description: 'Base URL format validation',
          status: 'error',
          message: 'Base URL format is invalid',
          severity: 'critical'
        });
      }
    }

    // Required parameters check
    rules.push({
      id: 'source-required',
      name: 'UTM Source',
      description: 'Source parameter is required',
      status: source ? 'pass' : 'error',
      message: source ? 'Source parameter provided' : 'UTM source is required for proper tracking',
      severity: 'critical'
    });

    rules.push({
      id: 'medium-required',
      name: 'UTM Medium',
      description: 'Medium parameter is required',
      status: medium ? 'pass' : 'error',
      message: medium ? 'Medium parameter provided' : 'UTM medium is required for proper tracking',
      severity: 'critical'
    });

    rules.push({
      id: 'campaign-required',
      name: 'UTM Campaign',
      description: 'Campaign parameter is recommended',
      status: campaign ? 'pass' : 'warning',
      message: campaign ? 'Campaign parameter provided' : 'Campaign parameter recommended for better tracking',
      severity: 'medium'
    });

    // Enhanced format validation for source
    if (source) {
      // Check if source is a known platform from our GA4 categories
      const sourceCategory = getSourceCategory(source);
      const isKnownSource = sourceCategory !== null;
      
      if (isKnownSource) {
        // If it's a known source from GA4 categories, it's automatically valid
        rules.push({
          id: 'source-format',
          name: 'Source Format',
          description: 'Source format validation',
          status: 'pass',
          message: `Valid ${sourceCategory?.replace('SOURCE_CATEGORY_', '').toLowerCase()} source from GA4 categories`,
          severity: 'low'
        });
      } else {
        // For custom sources, check format
        const hasValidFormat = /^[a-z0-9_.-]+$/i.test(source);
        rules.push({
          id: 'source-format',
          name: 'Source Format',
          description: 'Source should use recommended format',
          status: hasValidFormat ? 'pass' : 'warning',
          message: hasValidFormat 
            ? 'Custom source format follows best practices' 
            : 'Consider using only letters, numbers, underscores, dots, and hyphens',
          severity: 'low'
        });
      }

      // Check for spaces (always warn about spaces regardless of source type)
      const hasSpaces = source.includes(' ');
      if (hasSpaces) {
        rules.push({
          id: 'source-spaces',
          name: 'Source Spaces',
          description: 'Source contains spaces',
          status: 'warning',
          message: 'Spaces in source may cause tracking issues - consider using underscores or URL encoding',
          severity: 'medium'
        });
      }
    }

    // Enhanced format validation for medium
    if (medium) {
      // List of standard GA4 mediums that are always valid
      const standardMediums = [
        'organic', 'cpc', 'ppc', 'paid', 'retargeting', 'display', 'banner', 
        'expandable', 'interstitial', 'cpm', 'social', 'social-network', 
        'social-media', 'sm', 'social network', 'social media', 'video', 
        'referral', 'app', 'link', 'email', 'e-mail', 'e_mail', 'e mail', 
        'affiliate', 'audio', 'sms', 'push', 'mobile', 'notification',
        '(not set)', '(none)'
      ];
      
      const isStandardMedium = standardMediums.includes(medium.toLowerCase());
      
      if (isStandardMedium) {
        rules.push({
          id: 'medium-format',
          name: 'Medium Format',
          description: 'Medium format validation',
          status: 'pass',
          message: 'Standard GA4 medium',
          severity: 'low'
        });
      } else {
        // For custom mediums, check format
        const hasValidFormat = /^[a-z0-9_.-]+$/i.test(medium);
        rules.push({
          id: 'medium-format',
          name: 'Medium Format',
          description: 'Medium should follow standard conventions',
          status: hasValidFormat ? 'pass' : 'warning',
          message: hasValidFormat
            ? 'Custom medium format follows best practices'
            : 'Consider using only letters, numbers, underscores, dots, and hyphens',
          severity: 'low'
        });
      }

      // Check for spaces (always warn about spaces regardless of medium type)
      const hasSpaces = medium.includes(' ');
      if (hasSpaces) {
        rules.push({
          id: 'medium-spaces',
          name: 'Medium Spaces',
          description: 'Medium contains spaces',
          status: 'warning',
          message: 'Spaces in medium may cause tracking issues - consider using underscores or URL encoding',
          severity: 'medium'
        });
      }
    }

    // Channel prediction
    if (source && medium) {
      rules.push({
        id: 'channel-prediction',
        name: 'Channel Classification',
        description: 'Parameters will be classified correctly in GA4',
        status: predictedChannel !== 'Unassigned' ? 'pass' : 'warning',
        message: predictedChannel !== 'Unassigned'
          ? `Will be classified as "${predictedChannel}" channel`
          : 'Parameters may not match any GA4 channel definition',
        severity: predictedChannel !== 'Unassigned' ? 'low' : 'high'
      });
    }

    // Additional parameter validation
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value && value.includes(' ')) {
        rules.push({
          id: `${key}-spaces`,
          name: `${key} Format`,
          description: `Parameter ${key} contains spaces`,
          status: 'warning',
          message: `Parameter ${key} contains spaces - consider URL encoding`,
          severity: 'low'
        });
      }
    });

    // URL length check
    if (baseUrl && source && medium) {
      const estimatedLength = baseUrl.length + source.length + medium.length + (campaign?.length || 0) + 100; // rough estimate
      if (estimatedLength > 2000) {
        rules.push({
          id: 'url-length',
          name: 'URL Length',
          description: 'Generated URL may be too long',
          status: 'warning',
          message: 'URL may exceed browser limits - consider shorter parameter values',
          severity: 'medium'
        });
      }
    }

    return rules;
  }, [source, medium, campaign, predictedChannel, baseUrl, additionalParams]);

  const stats = useMemo(() => {
    const passCount = validationRules.filter(r => r.status === 'pass').length;
    const warningCount = validationRules.filter(r => r.status === 'warning').length;
    const errorCount = validationRules.filter(r => r.status === 'error').length;
    const infoCount = validationRules.filter(r => r.status === 'info').length;
    const total = validationRules.length;
    const score = total > 0 ? Math.round((passCount / total) * 100) : 0;

    return { passCount, warningCount, errorCount, infoCount, total, score };
  }, [validationRules]);

  const getIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'pass': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getProgressColor = () => {
    if (stats.score >= 80) return 'green';
    if (stats.score >= 60) return 'yellow';
    return 'red';
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Parameter Validation
        </h3>
        <div className="flex gap-2">
          {stats.errorCount > 0 && <Badge variant="error" size="sm">{stats.errorCount} errors</Badge>}
          {stats.warningCount > 0 && <Badge variant="warning" size="sm">{stats.warningCount} warnings</Badge>}
          <Badge variant="success" size="sm">{stats.passCount} passed</Badge>
        </div>
      </div>

      {/* Overall Score */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Configuration Quality Score
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {stats.score}%
          </span>
        </div>
        <ProgressBar 
          progress={stats.score} 
          color={getProgressColor()}
          size="md"
          animated
        />
      </div>

      {/* Validation Rules */}
      <div className="space-y-3">
        {validationRules.map((rule) => (
          <div key={rule.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            {getIcon(rule.status)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {rule.name}
                </h4>
                <Badge variant={getBadgeVariant(rule.status)} size="sm">
                  {rule.status}
                </Badge>
                <span className={`text-xs font-medium ${getSeverityColor(rule.severity)}`}>
                  {rule.severity}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {rule.message || rule.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {stats.total > 0 && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Summary:</strong> {stats.passCount} passed, {stats.warningCount} warnings, {stats.errorCount} errors
            {stats.score >= 80 && (
              <span className="text-green-600 dark:text-green-400 font-medium"> - Excellent configuration!</span>
            )}
            {stats.score >= 60 && stats.score < 80 && (
              <span className="text-yellow-600 dark:text-yellow-400 font-medium"> - Good configuration with room for improvement</span>
            )}
            {stats.score < 60 && (
              <span className="text-red-600 dark:text-red-400 font-medium"> - Configuration needs attention</span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ParameterValidator;