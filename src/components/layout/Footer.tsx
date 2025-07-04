import React from 'react';
import { ExternalLink, Heart, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/elevar', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/elevar', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/elevar', label: 'LinkedIn' }
  ];

  const resourceLinks = [
    {
      href: "https://support.google.com/analytics/answer/10917952",
      label: "GA4 Documentation",
      description: "Official Google Analytics 4 UTM parameter guide"
    },
    {
      href: "https://support.google.com/google-ads/answer/6305348",
      label: "Google Ads ValueTrack",
      description: "ValueTrack parameters for Google Ads"
    },
    {
      href: "https://getelevar.com",
      label: "Visit Elevar",
      description: "Learn more about Elevar's analytics solutions"
    }
  ];

  return (
    <footer className="mt-20 pt-12 border-t border-gray-200/60 dark:border-gray-700/60">
      <div className="space-y-8">
        {/* Resource Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Helpful Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resourceLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {link.label}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {link.description}
                    </p>
                  </div>
                  <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors ml-2 flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200/60 dark:border-gray-700/60">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <span>© {currentYear} Elevar. Made with</span>
            <Heart size={14} className="text-red-500 fill-current" />
            <span>for modern marketing teams.</span>
          </div>
          
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Always test your tracking implementation before launching campaigns. 
            This tool generates URLs for testing purposes - validate in your analytics platform.
          </p>
        </div>
      </div>

      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Always test your tracking implementation before launching campaigns.
          This tool generates URLs for testing purposes - validate in your analytics platform.
        </p>
        
        <div className="max-w-4xl mx-auto mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            UTM Parameter Builder: The Ultimate Marketing Campaign Tracking Tool
          </h2>
          <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-400">
            <p>
              Our UTM Parameter Builder is a comprehensive solution for digital marketers looking to track campaign performance accurately across multiple platforms. UTM parameters are essential for understanding which marketing efforts drive traffic and conversions to your website.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">What Are UTM Parameters?</h3>
            <p>
              UTM parameters (Urchin Tracking Module) are tags added to URLs to track the effectiveness of online marketing campaigns. These parameters help analytics platforms like Google Analytics 4 (GA4) identify the source, medium, and campaign name that drove traffic to your website.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">Why Use Our UTM Builder?</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Platform-Specific Templates:</strong> Tailored UTM parameters for GA4, Google Ads, Microsoft Ads, Meta, TikTok, Reddit, Pinterest, Snapchat, and Klaviyo.</li>
              <li><strong>GA4 Channel Prediction:</strong> See exactly how your traffic will be categorized in Google Analytics 4.</li>
              <li><strong>Parameter Validation:</strong> Ensure your tracking follows best practices with built-in validation.</li>
              <li><strong>Save & Reuse Templates:</strong> Store your commonly used UTM configurations for future campaigns.</li>
              <li><strong>Platform-Specific Macros:</strong> Use dynamic parameters specific to each advertising platform.</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">Core UTM Parameters Explained</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>utm_source:</strong> Identifies which site sent the traffic (e.g., google, facebook, newsletter)</li>
              <li><strong>utm_medium:</strong> Identifies what type of link was used (e.g., cpc, email, social)</li>
              <li><strong>utm_campaign:</strong> Identifies a specific product promotion or strategic campaign</li>
              <li><strong>utm_term:</strong> Identifies search terms (primarily used for paid search)</li>
              <li><strong>utm_content:</strong> Identifies what specifically was clicked (useful for A/B testing)</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">GA4 Channel Grouping</h3>
            <p>
              Google Analytics 4 uses predefined channel groupings to categorize your traffic. Our tool predicts which GA4 channel your parameters will be assigned to, helping you ensure consistent tracking across campaigns.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">Best Practices for UTM Parameters</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use lowercase consistently for all parameter values</li>
              <li>Use underscores (_) or hyphens (-) instead of spaces</li>
              <li>Be consistent with naming conventions across campaigns</li>
              <li>Keep parameter values concise but descriptive</li>
              <li>Document your UTM naming strategy for team alignment</li>
            </ul>
            
            <p className="mt-4">
              Start building better UTM parameters today and gain deeper insights into your marketing campaign performance!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;