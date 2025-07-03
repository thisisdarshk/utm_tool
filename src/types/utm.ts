export interface UtmParameter {
  id: string;
  label: string;
  tooltip: string;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'select' | 'checkbox';
  options?: string[];
  category?: string;
}

export interface TabData {
  baseUrl: string;
  parameters: Record<string, string>;
  options: Record<string, boolean | string | number>;
  lastModified: number;
}

export interface UtmState {
  activeTab: string;
  ga4: TabData;
  googleAds: TabData;
  microsoftAds: TabData;
  metaAds: TabData;
  tiktok: TabData;
  reddit: TabData;
  pinterest: TabData;
  snapchat: TabData;
  presets: Record<string, ConfigurationPreset>;
  history: string[];
}

export interface ConfigurationPreset {
  baseUrl: string;
  parameters: Record<string, string>;
  options: Record<string, boolean | string | number>;
  selectedChannel?: string;
  spaceEncoding?: 'percent' | 'plus' | 'underscore';
  timestamp: number;
  version: string;
  name?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

export interface UrlAnalysisResult {
  baseUrl: string;
  parameters: Record<string, string>;
  utmParameters: Record<string, string>;
  otherParameters: Record<string, string>;
  predictedChannel: string;
  channelExplanation: string;
  issues: string[];
  recommendations: string[];
}

export type UtmAction = 
  | { type: 'SET_ACTIVE_TAB'; payload: { tab: string } }
  | { type: 'UPDATE_PARAMETER'; payload: { tab: string; key: string; value: string } }
  | { type: 'UPDATE_BASE_URL'; payload: { tab: string; url: string } }
  | { type: 'UPDATE_OPTIONS'; payload: { tab: string; options: Record<string, boolean | string | number> } }
  | { type: 'RESET_TAB'; payload: { tab: string } }
  | { type: 'SAVE_PRESET'; payload: { name: string; data: ConfigurationPreset } }
  | { type: 'LOAD_PRESET'; payload: ConfigurationPreset }
  | { type: 'IMPORT_DATA'; payload: UtmState }
  | { type: 'ADD_TO_HISTORY'; payload: { url: string } };

export interface Channel {
  name: string;
  description: string;
  condition: string;
  recommendedMediums: string[];
  recommendedSources: string[];
}

export interface DropdownOption {
  value: string;
  label: string;
  category?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}