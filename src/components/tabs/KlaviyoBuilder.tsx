import React from 'react';
import { Play } from 'lucide-react';

const KlaviyoBuilder: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-2xl">
        <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-6">
          <div className="text-center p-8">
            <Play className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <p className="text-gray-600 dark:text-gray-400 text-xl font-medium">
              Klaviyo Integration Tutorial
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              Coming soon: Learn how to integrate Klaviyo with your marketing campaigns
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Klaviyo Email Marketing Integration
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This section will provide tools for creating UTM parameters specifically designed for Klaviyo email marketing campaigns.
          Stay tuned for updates!
        </p>
      </div>
    </div>
  );
};

export default KlaviyoBuilder;