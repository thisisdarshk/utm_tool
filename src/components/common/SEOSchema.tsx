import React from 'react';

const SEOSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "UTM Parameter Builder",
    "applicationCategory": "MarketingApplication",
    "operatingSystem": "Web"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default SEOSchema;