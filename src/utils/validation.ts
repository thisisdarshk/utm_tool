import type { ValidationResult, UrlAnalysisResult } from '../types/utm';
import { ga4Channels } from '../data/ga4Config';
import { SOURCE_CATEGORIES, type SourceCategory } from '../data/sourceCategories';

export const validateUrl = (url: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  if (!url) {
    errors.push('URL is required');
    return { isValid: false, errors, warnings, suggestions };
  }

  try {
    const urlObj = new URL(url);
    
    // Check for common issues - but be more specific about what needs encoding
    const hasUnescapedSpaces = url.includes(' ');
    if (hasUnescapedSpaces) {
      warnings.push('URL contains unescaped spaces - consider URL encoding them as %20');
      suggestions.push('Use %20 instead of spaces in URLs');
    }

    if (url.length > 2000) {
      warnings.push('URL is very long and may be truncated by some systems');
      suggestions.push('Consider shortening parameter values or using a URL shortener');
    }

    // Check for duplicate parameters
    const params = new URLSearchParams(urlObj.search);
    const paramKeys = Array.from(params.keys());
    const duplicates = paramKeys.filter((key, index) => paramKeys.indexOf(key) !== index);
    if (duplicates.length > 0) {
      warnings.push(`Duplicate parameters found: ${duplicates.join(', ')}`);
      suggestions.push('Remove duplicate parameters to avoid confusion');
    }

    // Check for empty parameter values
    const emptyParams: string[] = [];
    for (const [key, value] of params.entries()) {
      if (!value.trim()) {
        emptyParams.push(key);
      }
    }
    if (emptyParams.length > 0) {
      warnings.push(`Empty parameter values: ${emptyParams.join(', ')}`);
      suggestions.push('Provide meaningful values for all parameters');
    }

    // Only warn about special characters that actually need encoding (not standard query params)
    const problematicChars = /[<>'"]/;
    if (problematicChars.test(url)) {
      warnings.push('URL contains special characters that should be encoded: < > \' "');
      suggestions.push('URL encode special characters to prevent issues');
    }

    // Check for missing core UTM parameters
    const hasUtmSource = params.has('utm_source') && params.get('utm_source')?.trim();
    const hasUtmMedium = params.has('utm_medium') && params.get('utm_medium')?.trim();
    
    if (!hasUtmSource) {
      warnings.push('Missing utm_source parameter');
      suggestions.push('Add utm_source to identify traffic source');
    }
    
    if (!hasUtmMedium) {
      warnings.push('Missing utm_medium parameter');
      suggestions.push('Add utm_medium to identify marketing medium');
    }

  } catch (error) {
    errors.push('Invalid URL format - please check the URL structure');
    suggestions.push('Ensure URL starts with http:// or https://');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
};

export const predictGA4Channel = (source: string, medium: string, campaign: string): string => {
  const src = source.toLowerCase().trim();
  const med = medium.toLowerCase().trim();
  const camp = campaign.toLowerCase().trim();

  // 1. Direct - HIGHEST PRIORITY
  if (src === '(direct)' && (med === '(not set)' || med === '(none)')) {
    return 'Direct';
  }

  // 2. Cross-network - Check campaign name contains "cross-network"
  if (camp.includes('cross-network')) {
    return 'Cross-network';
  }

  // Get source categories for matching
  const sourceCategory = getSourceCategory(src);
  const isSearchSite = sourceCategory === 'SOURCE_CATEGORY_SEARCH';
  const isSocialSite = sourceCategory === 'SOURCE_CATEGORY_SOCIAL';
  const isShoppingSite = sourceCategory === 'SOURCE_CATEGORY_SHOPPING';
  const isVideoSite = sourceCategory === 'SOURCE_CATEGORY_VIDEO';

  // Check if medium matches paid pattern: ^(.*cp.*|ppc|retargeting|paid.*)$
  const isPaidMedium = /^(.*cp.*|ppc|retargeting|paid.*)$/.test(med);

  // Shopping campaign pattern: ^(.*(([^a-df-z]|^)shop|shopping).*)$
  const isShoppingCampaign = /^(.*(([^a-df-z]|^)shop|shopping).*)$/.test(camp);

  // 3. Paid Shopping
  if ((isShoppingSite || isShoppingCampaign) && isPaidMedium) {
    return 'Paid Shopping';
  }

  // 4. Paid Search
  if (isSearchSite && isPaidMedium) {
    return 'Paid Search';
  }

  // 5. Paid Social
  if (isSocialSite && isPaidMedium) {
    return 'Paid Social';
  }

  // 6. Paid Video
  if (isVideoSite && isPaidMedium) {
    return 'Paid Video';
  }

  // 7. Display - Medium is one of ("display", "banner", "expandable", "interstitial", "cpm")
  if (['display', 'banner', 'expandable', 'interstitial', 'cpm'].includes(med)) {
    return 'Display';
  }

  // 8. Paid Other - Only if traffic doesn't qualify for other paid channels
  if (isPaidMedium) {
    return 'Paid Other';
  }

  // 9. Organic Shopping
  if (isShoppingSite || isShoppingCampaign) {
    return 'Organic Shopping';
  }

  // 10. Organic Social
  if (isSocialSite || ['social', 'social-network', 'social-media', 'sm', 'social network', 'social media'].includes(med)) {
    return 'Organic Social';
  }

  // 11. Organic Video - Medium matches regex ^(.*video.*)$
  if (isVideoSite || /^(.*video.*)$/.test(med)) {
    return 'Organic Video';
  }

  // 12. Organic Search
  if (isSearchSite || med === 'organic') {
    return 'Organic Search';
  }

  // 13. Referral - Medium is one of ("referral", "app", "link")
  if (['referral', 'app', 'link'].includes(med)) {
    return 'Referral';
  }

  // 14. Email - Source OR Medium matches: "email", "e-mail", "e_mail", "e mail"
  if (['email', 'e-mail', 'e_mail', 'e mail'].includes(src) || ['email', 'e-mail', 'e_mail', 'e mail'].includes(med)) {
    return 'Email';
  }

  // 15. Affiliates - Medium exactly matches "affiliate"
  if (med === 'affiliate') {
    return 'Affiliates';
  }

  // 16. Audio - Medium exactly matches "audio"
  if (med === 'audio') {
    return 'Audio';
  }

  // 17. SMS - Source OR Medium exactly matches "sms"
  if (src === 'sms' || med === 'sms') {
    return 'SMS';
  }

  // 18. Mobile Push Notifications
  if (med.endsWith('push') || med.includes('mobile') || med.includes('notification') || src === 'firebase') {
    return 'Mobile Push Notifications';
  }

  // Default to Unassigned if no rules match
  return 'Unassigned';
};

// Helper function to get source category
const getSourceCategory = (source: string): SourceCategory | null => {
  const normalizedSource = source.toLowerCase().trim();
  
  for (const [category, sources] of Object.entries(SOURCE_CATEGORIES)) {
    if (sources.some(s => s.toLowerCase() === normalizedSource)) {
      return category as SourceCategory;
    }
  }
  
  return null;
};

// Enhanced URL analysis with better feedback and proper typing
export const analyzeUrl = (url: string): UrlAnalysisResult => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    
    const analysis: UrlAnalysisResult = {
      baseUrl: `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`,
      parameters: {},
      utmParameters: {},
      otherParameters: {},
      predictedChannel: '',
      channelExplanation: '',
      issues: [],
      recommendations: []
    };

    // Extract all parameters
    for (const [key, value] of params.entries()) {
      // Properly decode parameter values to handle double-encoding
      let decodedValue = value;
      try {
        // Try to decode multiple times to handle double-encoding
        let previousValue = '';
        while (decodedValue !== previousValue && decodedValue.includes('%')) {
          previousValue = decodedValue;
          decodedValue = decodeURIComponent(decodedValue);
        }
      } catch (e) {
        // If decoding fails, use the original value
        decodedValue = value;
      }
      
      analysis.parameters[key] = decodedValue;
      
      if (key.startsWith('utm_')) {
        analysis.utmParameters[key] = decodedValue;
      } else {
        analysis.otherParameters[key] = decodedValue;
      }
    }

    // Predict GA4 channel with explanation
    const source = analysis.utmParameters.utm_source || '';
    const medium = analysis.utmParameters.utm_medium || '';
    const campaign = analysis.utmParameters.utm_campaign || '';
    
    analysis.predictedChannel = predictGA4Channel(source, medium, campaign);
    
    // Add explanation for the channel prediction
    const channelData = ga4Channels.find(c => c.name === analysis.predictedChannel);
    if (channelData) {
      analysis.channelExplanation = getSimpleChannelExplanation(source, medium, campaign, analysis.predictedChannel);
    }

    // Check for common issues with better messaging
    if (!source && !medium) {
      analysis.issues.push('Missing core UTM parameters (source and medium)');
      analysis.recommendations.push('Add utm_source and utm_medium for proper tracking');
    } else {
      if (!source) {
        analysis.issues.push('UTM source is missing');
        analysis.recommendations.push('Add utm_source parameter');
      }
      
      if (!medium) {
        analysis.issues.push('UTM medium is missing');
        analysis.recommendations.push('Add utm_medium parameter');
      }
    }

    if (!campaign) {
      analysis.recommendations.push('Consider adding utm_campaign for better campaign tracking');
    }

    // Check for spaces in parameter values
    Object.entries(analysis.utmParameters).forEach(([key, value]) => {
      if (value.includes(' ')) {
        analysis.recommendations.push(`Parameter ${key} contains spaces - consider using underscores or encoding`);
      }
    });

    // Check if parameters match the predicted channel
    if (analysis.predictedChannel === 'Unassigned') {
      analysis.issues.push('Parameters do not match any GA4 channel definition');
      analysis.recommendations.push('Review your source and medium values against GA4 channel conditions');
    }

    return analysis;
  } catch (error) {
    throw new Error('Invalid URL format');
  }
};

// Helper function to provide simple English explanations for channel predictions
const getSimpleChannelExplanation = (source: string, medium: string, campaign: string, predictedChannel: string): string => {
  const src = source.toLowerCase().trim();
  const med = medium.toLowerCase().trim();
  const camp = campaign.toLowerCase().trim();

  switch (predictedChannel) {
    case 'Direct':
      return 'Users typed your URL directly or used a bookmark';
    
    case 'Cross-network':
      return 'Campaign name contains "cross-network" indicating multi-network ads';
    
    case 'Paid Shopping':
      if (camp.includes('shop')) {
        return 'Campaign name contains shopping keywords and uses paid advertising';
      }
      return 'Traffic from shopping sites using paid advertising';
    
    case 'Paid Search':
      return 'Paid ads on search engines like Google or Bing';
    
    case 'Paid Social':
      return 'Paid ads on social media platforms';
    
    case 'Paid Video':
      return 'Paid ads on video platforms like YouTube';
    
    case 'Display':
      return 'Display advertising (banners, visual ads)';
    
    case 'Paid Other':
      return 'Paid advertising that doesn\'t fit other specific categories';
    
    case 'Organic Shopping':
      return 'Non-paid links from shopping sites';
    
    case 'Organic Social':
      return 'Non-paid links from social media platforms';
    
    case 'Organic Video':
      return 'Non-paid links from video platforms';
    
    case 'Organic Search':
      return 'Non-paid search results from search engines';
    
    case 'Referral':
      return 'Links from other websites (blogs, news sites, etc.)';
    
    case 'Email':
      return 'Links from email campaigns';
    
    case 'Affiliates':
      return 'Links from affiliate marketing partners';
    
    case 'Audio':
      return 'Ads on audio platforms like podcasts';
    
    case 'SMS':
      return 'Links from text messages';
    
    case 'Mobile Push Notifications':
      return 'Links from mobile app notifications';
    
    default:
      return 'Parameters don\'t match any standard GA4 channel definition';
  }
};