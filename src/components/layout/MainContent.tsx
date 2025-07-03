import React, { Suspense } from 'react';
import { useUtm } from '../../contexts/UtmContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';

// Lazy load tab components for better performance
const GA4Builder = React.lazy(() => import('../tabs/GA4Builder'));
const GoogleAdsBuilder = React.lazy(() => import('../tabs/GoogleAdsBuilder'));
const MicrosoftAdsBuilder = React.lazy(() => import('../tabs/MicrosoftAdsBuilder'));
const MetaAdsBuilder = React.lazy(() => import('../tabs/MetaAdsBuilder'));
const TikTokBuilder = React.lazy(() => import('../tabs/TikTokBuilder'));
const RedditBuilder = React.lazy(() => import('../tabs/RedditBuilder'));
const PinterestBuilder = React.lazy(() => import('../tabs/PinterestBuilder'));
const SnapchatBuilder = React.lazy(() => import('../tabs/SnapchatBuilder'));

const MainContent: React.FC = () => {
  const { state } = useUtm();

  const renderActiveTab = () => {
    switch (state.activeTab) {
      case 'ga4':
        return <GA4Builder />;
      case 'googleAds':
        return <GoogleAdsBuilder />;
      case 'microsoftAds':
        return <MicrosoftAdsBuilder />;
      case 'metaAds':
        return <MetaAdsBuilder />;
      case 'tiktok':
        return <TikTokBuilder />;
      case 'reddit':
        return <RedditBuilder />;
      case 'pinterest':
        return <PinterestBuilder />;
      case 'snapchat':
        return <SnapchatBuilder />;
      default:
        return <GA4Builder />;
    }
  };

  const LoadingFallback = () => (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="lg" text="Loading builder..." variant="primary" />
    </div>
  );

  const ErrorFallback = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Failed to load the builder. Please refresh the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen">
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<LoadingFallback />}>
          <div
            id={`${state.activeTab}-panel`}
            role="tabpanel"
            aria-labelledby={`${state.activeTab}-tab`}
            className="focus:outline-none"
          >
            {renderActiveTab()}
          </div>
        </Suspense>
      </ErrorBoundary>
    </main>
  );
};

export default MainContent;