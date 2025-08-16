import React from 'react';
import { ExternalLink, Heart, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/company/elevar', label: 'LinkedIn' }
  ];

  return (
    <footer className="mt-20 pt-12 border-t border-gray-200/60 dark:border-gray-700/60">
      <div className="space-y-8">
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
      <div className="text-center mt-4">
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