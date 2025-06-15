import { SOURCE_CATEGORIES } from './sourceCategories';

export interface Channel {
  name: string;
  description: string;
  condition: string;
  recommendedMediums: string[];
  recommendedSources: string[];
}

export interface Parameter {
  id: string;
  label: string;
  placeholder: string;
  tooltip: string;
}

export const ga4Parameters = {
  optional: [
    {
      id: 'utm_term',
      label: 'Campaign Term',
      placeholder: 'running+shoes',
      tooltip: 'Keywords for paid search campaigns'
    },
    {
      id: 'utm_content',
      label: 'Campaign Content',
      placeholder: 'logolink',
      tooltip: 'Used to differentiate similar content or links within the same ad'
    },
    {
      id: 'utm_id',
      label: 'Campaign ID',
      placeholder: 'campaign_123',
      tooltip: 'A unique identifier for your campaign'
    },
    {
      id: 'utm_source_platform',
      label: 'Source Platform',
      placeholder: 'Google Ads',
      tooltip: 'Platform where marketing activity is managed'
    },
    {
      id: 'utm_creative_format',
      label: 'Creative Format',
      placeholder: 'display_banner_300x250',
      tooltip: 'Type of creative (display, video, search, etc.)'
    },
    {
      id: 'utm_marketing_tactic',
      label: 'Marketing Tactic',
      placeholder: 'remarketing_dynamic',
      tooltip: 'Targeting criteria (remarketing, prospecting, etc.)'
    }
  ] as Parameter[]
};

export const ga4Channels: Channel[] = [
  {
    name: 'Direct',
    description: 'Direct is the channel by which users arrive at your site/app via a saved link or by entering your URL.',
    condition: 'Source exactly matches "(direct)" AND Medium is one of ("(not set)", "(none)")',
    recommendedMediums: ['(not set)', '(none)'],
    recommendedSources: ['(direct)']
  },
  {
    name: 'Cross-network',
    description: 'Cross-network is the channel by which users arrive at your site/app via ads that appear on a variety of networks (e.g., Search and Display). Cross-network includes Demand Gen, Performance Max and Smart Shopping.',
    condition: 'Campaign Name contains "cross-network"',
    recommendedMediums: [], // GA4 documentation specifies NO medium requirements for Cross-network
    recommendedSources: [] // GA4 documentation specifies NO source requirements for Cross-network
  },
  {
    name: 'Paid Shopping',
    description: 'Paid Shopping is the channel by which users arrive at your site/app via paid ads on shopping sites like Amazon or ebay or on individual retailer sites.',
    condition: '(Source matches a list of shopping sites OR Campaign Name matches regex ^(.*(([^a-df-z]|^)shop|shopping).*)$) AND Medium matches regex ^(.*cp.*|ppc|retargeting|paid.*)$',
    recommendedMediums: ['cpc', 'ppc', 'paid', 'retargeting'],
    recommendedSources: SOURCE_CATEGORIES.SOURCE_CATEGORY_SHOPPING
  },
  {
    name: 'Paid Search',
    description: 'Paid Search is the channel by which users arrive at your site/app via ads on search-engine sites like Bing, Baidu, or Google.',
    condition: 'Source matches a list of search sites AND Medium matches regex ^(.*cp.*|ppc|retargeting|paid.*)$',
    recommendedMediums: ['cpc', 'ppc', 'paid', 'retargeting'],
    recommendedSources: SOURCE_CATEGORIES.SOURCE_CATEGORY_SEARCH
  },
  {
    name: 'Paid Social',
    description: 'Paid Social is the channel by which users arrive at your site/app via ads on social sites like Facebook, TikTok, and Twitter.',
    condition: 'Source matches a regex list of social sites AND Medium matches regex ^(.*cp.*|ppc|retargeting|paid.*)$',
    recommendedMediums: ['cpc', 'ppc', 'paid', 'retargeting'],
    recommendedSources: SOURCE_CATEGORIES.SOURCE_CATEGORY_SOCIAL
  },
  {
    name: 'Paid Video',
    description: 'Paid Video is the channel by which users arrive at your site/app via ads on video sites like TikTok, Vimeo, and YouTube.',
    condition: 'Source matches a list of video sites AND Medium matches regex ^(.*cp.*|ppc|retargeting|paid.*)$',
    recommendedMediums: ['cpc', 'ppc', 'paid', 'retargeting'],
    recommendedSources: SOURCE_CATEGORIES.SOURCE_CATEGORY_VIDEO
  },
  {
    name: 'Display',
    description: 'Display is the channel by which users arrive at your site/app via display ads, including ads on the Google Display Network.',
    condition: 'Medium is one of ("display", "banner", "expandable", "interstitial", "cpm")',
    recommendedMediums: ['display', 'banner', 'expandable', 'interstitial', 'cpm'],
    recommendedSources: [] // GA4 documentation specifies NO source requirements for Display channel
  },
  {
    name: 'Paid Other',
    description: 'Paid Other is the channel by which users arrive at your site/app via ads, but not through an ad identified as Search, Social, Shopping, or Video.',
    condition: 'Medium matches regex ^(.*cp.*|ppc|retargeting|paid.*)$',
    recommendedMediums: ['cpc', 'ppc', 'paid', 'retargeting'],
    recommendedSources: []
  },
  {
    name: 'Organic Shopping',
    description: 'Organic Shopping is the channel by which users arrive at your site/app via non-ad links on shopping sites like Amazon or ebay.',
    condition: 'Source matches a list of shopping sites OR Campaign name matches regex ^(.*(([^a-df-z]|^)shop|shopping).*)$',
    recommendedMediums: ['organic', 'referral'],
    recommendedSources: SOURCE_CATEGORIES.SOURCE_CATEGORY_SHOPPING
  },
  {
    name: 'Organic Social',
    description: 'Organic Social is the channel by which users arrive at your site/app via non-ad links on social sites like Facebook, TikTok, or Twitter.',
    condition: 'Source matches a regex list of social sites OR Medium is one of ("social", "social-network", "social-media", "sm", "social network", "social media")',
    recommendedMediums: ['social', 'social-network', 'social-media', 'sm', 'social network', 'social media'],
    recommendedSources: SOURCE_CATEGORIES.SOURCE_CATEGORY_SOCIAL
  },
  {
    name: 'Organic Video',
    description: 'Organic Video is the channel by which users arrive at your site/app via non-ad links on video sites like YouTube, TikTok, or Vimeo.',
    condition: 'Source matches a list of video sites OR Medium matches regex ^(.*video.*)$',
    recommendedMediums: ['video', 'referral'],
    recommendedSources: SOURCE_CATEGORIES.SOURCE_CATEGORY_VIDEO
  },
  {
    name: 'Organic Search',
    description: 'Organic Search is the channel by which users arrive at your site/app via non-ad links in organic-search results.',
    condition: 'Source matches a list of search sites listed under "SOURCE_CATEGORY_SEARCH" OR Medium exactly matches organic',
    recommendedMediums: ['organic'],
    recommendedSources: SOURCE_CATEGORIES.SOURCE_CATEGORY_SEARCH
  },
  {
    name: 'Referral',
    description: 'Referral is the channel by which users arrive at your site via non-ad links on other sites/apps (e.g., blogs, news sites).',
    condition: 'Medium is one of ("referral", "app", or "link")',
    recommendedMediums: ['referral', 'app', 'link'],
    recommendedSources: [] // GA4 documentation specifies NO source requirements for Referral channel
  },
  {
    name: 'Email',
    description: 'Email is the channel by which users arrive at your site/app via links in email.',
    condition: 'Source = email|e-mail|e_mail|e mail OR Medium = email|e-mail|e_mail|e mail',
    recommendedMediums: ['email', 'e-mail', 'e_mail', 'e mail'],
    recommendedSources: ['email', 'e-mail', 'e_mail', 'e mail'] // ONLY the 4 official email variations
  },
  {
    name: 'Affiliates',
    description: 'Affiliates is the channel by which users arrive at your site/app via links on affiliate sites.',
    condition: 'Medium = affiliate',
    recommendedMediums: ['affiliate'],
    recommendedSources: [] // GA4 documentation specifies NO source requirements for Affiliates channel
  },
  {
    name: 'Audio',
    description: 'Audio is the channel by which users arrive at your site/app via ads on audio platforms (e.g., podcast platforms).',
    condition: 'Medium exactly matches audio',
    recommendedMediums: ['audio'],
    recommendedSources: [] // GA4 documentation specifies NO source requirements for Audio channel
  },
  {
    name: 'SMS',
    description: 'SMS is the channel by which users arrive at your site/app via links from text messages.',
    condition: 'Source exactly matches sms OR Medium exactly matches sms',
    recommendedMediums: ['sms'],
    recommendedSources: ['sms'] // ONLY 'sms' as per GA4 condition
  },
  {
    name: 'Mobile Push Notifications',
    description: 'Mobile Push Notifications is the channel by which users arrive at your site/app via links in mobile-device messages when they\'re not actively using the app.',
    condition: 'Medium ends with "push" OR Medium contains "mobile" or "notification" OR Source exactly matches "firebase"',
    recommendedMediums: ['push', 'mobile', 'notification', 'mobile_push', 'app_push'],
    recommendedSources: ['firebase'] // ONLY 'firebase' as per GA4 condition
  }
];

// Helper functions to get recommended values for channels
export const getRecommendedMediumsForChannel = (channelName: string): string[] => {
  const channel = ga4Channels.find(ch => ch.name === channelName);
  return channel ? channel.recommendedMediums : [];
};

export const getRecommendedSourcesForChannel = (channelName: string): string[] => {
  const channel = ga4Channels.find(ch => ch.name === channelName);
  return channel ? channel.recommendedSources : [];
};