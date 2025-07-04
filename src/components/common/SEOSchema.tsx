import React from 'react';

const SEOSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "UTM Parameter Builder",
    "applicationCategory": "MarketingApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Professional marketing campaign tracking tool for creating UTM parameters for GA4, Google Ads, Meta, TikTok, Pinterest, Reddit, Snapchat, and Klaviyo.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "156"
    },
    "author": {
      "@type": "Organization",
      "name": "Elevar",
      "url": "https://getelevar.com"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default SEOSchema;