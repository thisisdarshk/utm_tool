import React, { useState, useCallback, useEffect } from 'react';
import { Save, Download, Upload, Trash2, Copy, RefreshCw, Search, Filter, Share2, Star } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import Card from '../common/Card';
import { useToast } from '../../hooks/useToast';

// Platform logo components
const GoogleLogo = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MicrosoftLogo = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
    <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
    <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
    <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
  </svg>
);

const MetaLogo = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
);

const TikTokLogo = ({ size = 16 }: { size?: number }) => (
  <img src="/tiktok-logo-2-3.svg" alt="TikTok" width={size} height={size} />
);

const RedditLogo = ({ size = 16 }: { size?: number }) => (
  <img src="/reddit-4.svg" alt="Reddit" width={size} height={size} />
);

const PinterestLogo = ({ size = 16 }: { size?: number }) => (
  <img src="/pinterest-2-1.svg" alt="Pinterest" width={size} height={size} />
);

const SnapchatLogo = ({ size = 16 }: { size?: number }) => (
  <img src="/snapchat-1.svg" alt="Snapchat" width={size} height={size} />
);

const GA4Logo = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
  <img src="/facebook-2020-2-1.svg" alt="Meta" width={size} height={size} />
);

interface GlobalTemplate {
  id: string;
  name: string;
  platform: string;
  data: any;
  timestamp: number;
  description?: string;
  tags?: string[];
  isFavorite?: boolean;
  isShared?: boolean;
  version?: string;
}

interface GlobalTemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (platform: string, data: any) => void;
}

const GlobalTemplateManager: React.FC<GlobalTemplateManagerProps> = ({
  isOpen,
  onClose,
  onLoadTemplate
}) => {
  const [templates, setTemplates] = useState<GlobalTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'platform' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { success, error } = useToast();

  // Platform logo mapping
  const platformLogos: Record<string, React.ComponentType<{ size?: number }>> = {
    ga4: GA4Logo,
    googleAds: GoogleLogo,
    microsoftAds: MicrosoftLogo,
    metaAds: MetaLogo,
    tiktok: TikTokLogo,
    reddit: RedditLogo,
    pinterest: PinterestLogo,
    snapchat: SnapchatLogo
  };

  // Load templates from localStorage
  const loadTemplates = useCallback(() => {
    try {
      const platforms = ['ga4', 'googleAds', 'microsoftAds', 'metaAds', 'tiktok', 'reddit', 'pinterest', 'snapchat'];
      const allTemplates: GlobalTemplate[] = [];

      platforms.forEach(platform => {
        const saved = localStorage.getItem(`${platform}_templates`);
        if (saved) {
          const platformTemplates = JSON.parse(saved);
          Object.entries(platformTemplates).forEach(([name, data]: [string, any]) => {
            allTemplates.push({
              id: `${platform}_${name}_${data.timestamp || Date.now()}`,
              name,
              platform,
              data,
              timestamp: data.timestamp || Date.now(),
              description: data.description,
              tags: data.tags || [],
              isFavorite: data.isFavorite || false,
              isShared: data.isShared || false,
              version: data.version || '1.0'
            });
          });
        }
      });

      setTemplates(allTemplates);
    } catch (err) {
      console.error('Failed to load templates:', err);
      error('Failed to load templates');
    }
  }, [error]);

  // Get unique platforms
  const platforms = React.useMemo(() => {
    const uniquePlatforms = [...new Set(templates.map(t => t.platform))];
    return uniquePlatforms.sort();
  }, [templates]);

  // Filter and sort templates
  const filteredAndSortedTemplates = React.useMemo(() => {
    let filtered = templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (template.tags && template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesPlatform = filterPlatform === 'all' || template.platform === filterPlatform;
      const matchesFavorites = !filterFavorites || template.isFavorite;
      
      return matchesSearch && matchesPlatform && matchesFavorites;
    });

    // Sort templates
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'platform':
          comparison = a.platform.localeCompare(b.platform);
          break;
        case 'date':
          comparison = a.timestamp - b.timestamp;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [templates, searchTerm, filterPlatform, filterFavorites, sortBy, sortOrder]);

  // Toggle favorite
  const toggleFavorite = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const updatedTemplate = { ...template, isFavorite: !template.isFavorite };
    
    // Update in localStorage
    const saved = localStorage.getItem(`${template.platform}_templates`);
    if (saved) {
      const platformTemplates = JSON.parse(saved);
      if (platformTemplates[template.name]) {
        platformTemplates[template.name] = { ...platformTemplates[template.name], isFavorite: updatedTemplate.isFavorite };
        localStorage.setItem(`${template.platform}_templates`, JSON.stringify(platformTemplates));
      }
    }

    // Update local state
    setTemplates(prev => prev.map(t => t.id === templateId ? updatedTemplate : t));
    success(updatedTemplate.isFavorite ? 'Added to favorites' : 'Removed from favorites');
  }, [templates, success]);

  // Delete template
  const deleteTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    // Remove from localStorage
    const saved = localStorage.getItem(`${template.platform}_templates`);
    if (saved) {
      const platformTemplates = JSON.parse(saved);
      delete platformTemplates[template.name];
      localStorage.setItem(`${template.platform}_templates`, JSON.stringify(platformTemplates));
    }

    // Update local state
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    success(`Template "${template.name}" deleted successfully!`);
  }, [templates, success]);

  // Bulk delete
  const bulkDelete = useCallback(() => {
    if (selectedTemplates.size === 0) return;

    selectedTemplates.forEach(templateId => {
      deleteTemplate(templateId);
    });

    setSelectedTemplates(new Set());
    success(`${selectedTemplates.size} templates deleted successfully!`);
  }, [selectedTemplates, deleteTemplate, success]);

  // Export templates
  const exportTemplates = useCallback(() => {
    const templatesToExport = selectedTemplates.size > 0 
      ? templates.filter(t => selectedTemplates.has(t.id))
      : filteredAndSortedTemplates;

    const exportData = {
      templates: templatesToExport,
      exportedAt: new Date().toISOString(),
      version: '2.0',
      totalCount: templatesToExport.length
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utm-templates-global-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    success(`${templatesToExport.length} templates exported successfully!`);
  }, [selectedTemplates, templates, filteredAndSortedTemplates, success]);

  // Load template
  const loadTemplate = useCallback((template: GlobalTemplate) => {
    onLoadTemplate(template.platform, template.data);
    success(`Template "${template.name}" loaded for ${template.platform}!`);
    onClose();
  }, [onLoadTemplate, success, onClose]);

  // Copy template data
  const copyTemplate = useCallback((template: GlobalTemplate) => {
    navigator.clipboard.writeText(JSON.stringify(template.data, null, 2));
    success('Template data copied to clipboard!');
  }, [success]);

  // Toggle template selection
  const toggleSelection = useCallback((templateId: string) => {
    setSelectedTemplates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(templateId)) {
        newSet.delete(templateId);
      } else {
        newSet.add(templateId);
      }
      return newSet;
    });
  }, []);

  // Select all filtered templates
  const selectAll = useCallback(() => {
    setSelectedTemplates(new Set(filteredAndSortedTemplates.map(t => t.id)));
  }, [filteredAndSortedTemplates]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedTemplates(new Set());
  }, []);

  // Load templates when modal opens
  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen, loadTemplates]);

  const getPlatformColor = (platform: string) => {
    const colors = {
      ga4: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      googleAds: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      microsoftAds: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      metaAds: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      tiktok: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      reddit: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      pinterest: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      snapchat: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    };
    return colors[platform as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getPlatformLogo = (platform: string) => {
    const LogoComponent = platformLogos[platform];
    return LogoComponent ? <LogoComponent size={16} /> : null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Global Template Manager"
      size="full"
      className="max-h-[90vh]"
    >
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search and Filters */}
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
                <option value="all">All Platforms</option>
                {platforms.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'platform' | 'date')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="platform">Sort by Platform</option>
              </select>
              
              <Button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                variant="secondary"
                size="sm"
                className="px-3"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => setFilterFavorites(!filterFavorites)}
              variant={filterFavorites ? 'primary' : 'secondary'}
              size="sm"
              icon={Star}
            >
              Favorites
            </Button>
            
            <Button
              onClick={exportTemplates}
              variant="secondary"
              size="sm"
              icon={Download}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Selection Controls */}
        {selectedTemplates.size > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {selectedTemplates.size} template(s) selected
            </span>
            <div className="flex gap-2">
              <Button onClick={bulkDelete} variant="danger" size="sm" icon={Trash2}>
                Delete Selected
              </Button>
              <Button onClick={clearSelection} variant="secondary" size="sm">
                Clear Selection
              </Button>
            </div>
          </div>
        )}

        {/* Templates Grid/List */}
        <div className="min-h-[400px]">
          {filteredAndSortedTemplates.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Save className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p>Try adjusting your search criteria or create some templates first.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
              : 'space-y-3'
            }>
              {filteredAndSortedTemplates.map(template => (
                <Card
                  key={template.id}
                  className={`relative transition-all duration-200 ${
                    selectedTemplates.has(template.id) 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:shadow-md'
                  }`}
                  padding="md"
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3">
                    <input
                      type="checkbox"
                      checked={selectedTemplates.has(template.id)}
                      onChange={() => toggleSelection(template.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {/* Favorite Star */}
                  <div className="absolute top-3 right-3">
                    <Button
                      onClick={() => toggleFavorite(template.id)}
                      variant="ghost"
                      size="sm"
                      icon={Star}
                      className={template.isFavorite ? 'text-yellow-500' : 'text-gray-400'}
                    />
                  </div>

                  <div className="pt-6">
                    {/* Template Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {template.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            className={getPlatformColor(template.platform)}
                            size="sm"
                          >
                            <div className="flex items-center gap-1">
                              {getPlatformLogo(template.platform)}
                              <span>{template.platform}</span>
                            </div>
                          </Badge>
                          {template.isShared && (
                            <Badge variant="info" size="sm">
                              <Share2 className="w-3 h-3 mr-1" />
                              Shared
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {template.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {template.description}
                      </p>
                    )}

                    {/* Tags */}
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                            +{template.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                      <div>Created: {new Date(template.timestamp).toLocaleDateString()}</div>
                      {template.version && <div>Version: {template.version}</div>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => loadTemplate(template)}
                        size="sm"
                        className="flex-1"
                      >
                        Load
                      </Button>
                      <Button
                        onClick={() => copyTemplate(template)}
                        variant="secondary"
                        size="sm"
                        icon={Copy}
                      />
                      <Button
                        onClick={() => deleteTemplate(template.id)}
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedTemplates.length} of {templates.length} templates
          </div>
          
          <div className="flex gap-2">
            {filteredAndSortedTemplates.length > 0 && (
              <Button onClick={selectAll} variant="secondary" size="sm">
                Select All
              </Button>
            )}
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GlobalTemplateManager;