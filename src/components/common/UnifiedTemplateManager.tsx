import React, { useState, useCallback, useEffect } from 'react';
import { Save, Download, Upload, Trash2, Copy, RefreshCw, Search, Filter } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';
import Badge from './Badge';
import { useToast } from '../../hooks/useToast';

interface Template {
  id: string;
  name: string;
  platform: string;
  data: any;
  timestamp: number;
  description?: string;
  tags?: string[];
}

interface UnifiedTemplateManagerProps {
  platform: string;
  currentData: any;
  onLoadTemplate: (data: any) => void;
  onSaveTemplate?: (name: string, data: any) => void;
  className?: string;
}

const UnifiedTemplateManager: React.FC<UnifiedTemplateManagerProps> = ({
  platform,
  currentData,
  onLoadTemplate,
  onSaveTemplate,
  className = ''
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'save' | 'load' | 'import' | 'export'>('save');
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [importData, setImportData] = useState('');
  
  const { success, error } = useToast();

  // Load templates from localStorage
  const loadTemplates = useCallback(() => {
    try {
      const saved = localStorage.getItem('unified_templates');
      if (saved) {
        const parsedTemplates = JSON.parse(saved);
        setTemplates(Array.isArray(parsedTemplates) ? parsedTemplates : []);
      }
    } catch (err) {
      console.error('Failed to load templates:', err);
      setTemplates([]);
    }
  }, []);

  // Save templates to localStorage
  const saveTemplates = useCallback((newTemplates: Template[]) => {
    try {
      localStorage.setItem('unified_templates', JSON.stringify(newTemplates));
      setTemplates(newTemplates);
    } catch (err) {
      console.error('Failed to save templates:', err);
      error('Failed to save templates');
    }
  }, [error]);

  // Filter templates
  const filteredTemplates = React.useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPlatform = filterPlatform === 'all' || template.platform === filterPlatform;
      return matchesSearch && matchesPlatform;
    });
  }, [templates, searchTerm, filterPlatform]);

  // Get unique platforms
  const platforms = React.useMemo(() => {
    const uniquePlatforms = [...new Set(templates.map(t => t.platform))];
    return uniquePlatforms.sort();
  }, [templates]);

  // Save template
  const handleSaveTemplate = useCallback(() => {
    if (!templateName.trim()) {
      error('Please enter a template name');
      return;
    }

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: templateName.trim(),
      platform,
      data: currentData,
      timestamp: Date.now(),
      description: templateDescription.trim() || undefined
    };

    const updatedTemplates = [...templates, newTemplate];
    saveTemplates(updatedTemplates);
    
    if (onSaveTemplate) {
      onSaveTemplate(templateName, currentData);
    }
    
    success(`Template "${templateName}" saved successfully!`);
    setIsModalOpen(false);
    setTemplateName('');
    setTemplateDescription('');
  }, [templateName, templateDescription, platform, currentData, templates, saveTemplates, onSaveTemplate, success, error]);

  // Load template
  const handleLoadTemplate = useCallback(() => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) {
      error('Please select a template to load');
      return;
    }

    onLoadTemplate(template.data);
    success(`Template "${template.name}" loaded successfully!`);
    setIsModalOpen(false);
    setSelectedTemplate('');
  }, [selectedTemplate, templates, onLoadTemplate, success, error]);

  // Delete template
  const handleDeleteTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const updatedTemplates = templates.filter(t => t.id !== templateId);
    saveTemplates(updatedTemplates);
    success(`Template "${template.name}" deleted successfully!`);
  }, [templates, saveTemplates, success]);

  // Export templates
  const handleExportTemplates = useCallback(() => {
    const exportData = {
      templates: filteredTemplates,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utm-templates-${platform}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    success('Templates exported successfully!');
    setIsModalOpen(false);
  }, [filteredTemplates, platform, success]);

  // Import templates
  const handleImportTemplates = useCallback(() => {
    try {
      const parsed = JSON.parse(importData);
      
      if (!parsed.templates || !Array.isArray(parsed.templates)) {
        throw new Error('Invalid template format');
      }

      const importedTemplates = parsed.templates.map((template: any) => ({
        ...template,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now()
      }));

      const updatedTemplates = [...templates, ...importedTemplates];
      saveTemplates(updatedTemplates);
      
      success(`${importedTemplates.length} templates imported successfully!`);
      setIsModalOpen(false);
      setImportData('');
    } catch (err) {
      error('Failed to import templates. Please check the file format.');
    }
  }, [importData, templates, saveTemplates, success, error]);

  // Copy template data
  const handleCopyTemplate = useCallback((template: Template) => {
    navigator.clipboard.writeText(JSON.stringify(template.data, null, 2));
    success('Template data copied to clipboard!');
  }, [success]);

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const openModal = (mode: 'save' | 'load' | 'import' | 'export') => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const renderModalContent = () => {
    switch (modalMode) {
      case 'save':
        return (
          <div className="space-y-4">
            <Input
              label="Template Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Summer Campaign 2025"
              required
            />
            <Input
              label="Description (Optional)"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Brief description of this template"
            />
          </div>
        );

      case 'load':
        return (
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>
              <div className="w-40">
                <select
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                >
                  <option value="all">All Platforms</option>
                  {platforms.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Template List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Save className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No templates found</p>
                </div>
              ) : (
                filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {template.name}
                          </h4>
                          <Badge variant="info" size="sm">{template.platform}</Badge>
                        </div>
                        {template.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {template.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(template.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyTemplate(template);
                          }}
                          variant="ghost"
                          size="sm"
                          icon={Copy}
                          tooltip="Copy template data"
                        />
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTemplate(template.id);
                          }}
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          tooltip="Delete template"
                          className="text-red-500 hover:text-red-700"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'import':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Import Template Data
              </label>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste exported template JSON data here..."
                className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 font-mono text-sm"
              />
            </div>
          </div>
        );

      case 'export':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Export {filteredTemplates.length} template(s) to a JSON file.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Templates to Export:
              </h4>
              <div className="space-y-1">
                {filteredTemplates.map(template => (
                  <div key={template.id} className="flex items-center gap-2">
                    <Badge variant="info" size="sm">{template.platform}</Badge>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {template.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getModalFooter = () => {
    switch (modalMode) {
      case 'save':
        return (
          <>
            <Button onClick={() => setIsModalOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
              Save Template
            </Button>
          </>
        );

      case 'load':
        return (
          <>
            <Button onClick={() => setIsModalOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleLoadTemplate} disabled={!selectedTemplate}>
              Load Template
            </Button>
          </>
        );

      case 'import':
        return (
          <>
            <Button onClick={() => setIsModalOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleImportTemplates} disabled={!importData.trim()}>
              Import Templates
            </Button>
          </>
        );

      case 'export':
        return (
          <>
            <Button onClick={() => setIsModalOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleExportTemplates}>
              Export Templates
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <Button onClick={() => openModal('save')} icon={Save} size="sm">
          Save Template
        </Button>
        <Button onClick={() => openModal('load')} icon={Upload} size="sm" variant="secondary">
          Load Template
        </Button>
        <Button onClick={() => openModal('export')} icon={Download} size="sm" variant="secondary">
          Export
        </Button>
        <Button onClick={() => openModal('import')} icon={Upload} size="sm" variant="secondary">
          Import
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${modalMode.charAt(0).toUpperCase() + modalMode.slice(1)} Template`}
        footer={getModalFooter()}
        size={modalMode === 'load' ? 'lg' : 'md'}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default UnifiedTemplateManager;