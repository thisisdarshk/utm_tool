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
    </footer>
  );
};

export default Footer;