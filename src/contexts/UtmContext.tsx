import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { utmReducer, initialState } from '../reducers/utmReducer';
import type { UtmState, UtmAction, ConfigurationPreset } from '../types/utm';

interface UtmContextType {
  state: UtmState;
  dispatch: React.Dispatch<UtmAction>;
  updateParameter: (tab: string, key: string, value: string) => void;
  resetTab: (tab: string) => void;
  generateUrl: (tab: string) => string;
  savePreset: (name: string, data: ConfigurationPreset) => void;
  loadPreset: (name: string) => void;
  exportData: () => string;
  importData: (data: string) => boolean;
  validateConfiguration: (tab: string) => { isValid: boolean; errors: string[] };
}

const UtmContext = createContext<UtmContextType | undefined>(undefined);

export const useUtm = () => {
  const context = useContext(UtmContext);
  if (!context) {
    throw new Error('useUtm must be used within a UtmProvider');
  }
  return context;
};

export const UtmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(utmReducer, initialState);

  const updateParameter = useCallback((tab: string, key: string, value: string) => {
    dispatch({ type: 'UPDATE_PARAMETER', payload: { tab, key, value } });
  }, []);

  const resetTab = useCallback((tab: string) => {
    dispatch({ type: 'RESET_TAB', payload: { tab } });
  }, []);

  const generateUrl = useCallback((tab: string): string => {
    const tabData = state[tab as keyof UtmState];
    if (!tabData || typeof tabData === 'string' || Array.isArray(tabData)) return '';

    const params = new URLSearchParams();
    Object.entries(tabData.parameters).forEach(([key, value]) => {
      if (value && value.trim()) {
        params.append(key, value);
      }
    });

    const baseUrl = tabData.baseUrl || '';
    if (!baseUrl) return '';

    try {
      const url = new URL(baseUrl);
      // Merge existing params with new ones
      const existingParams = new URLSearchParams(url.search);
      params.forEach((value, key) => {
        existingParams.set(key, value);
      });
      
      url.search = existingParams.toString();
      return url.toString();
    } catch {
      // Fallback for invalid URLs
      const separator = baseUrl.includes('?') ? '&' : '?';
      return params.toString() ? `${baseUrl}${separator}${params.toString()}` : baseUrl;
    }
  }, [state]);

  const savePreset = useCallback((name: string, data: ConfigurationPreset) => {
    const presets = JSON.parse(localStorage.getItem('utm_presets') || '{}');
    presets[name] = { ...data, timestamp: Date.now() };
    localStorage.setItem('utm_presets', JSON.stringify(presets));
    dispatch({ type: 'SAVE_PRESET', payload: { name, data } });
  }, []);

  const loadPreset = useCallback((name: string) => {
    const presets = JSON.parse(localStorage.getItem('utm_presets') || '{}');
    if (presets[name]) {
      dispatch({ type: 'LOAD_PRESET', payload: presets[name] });
    }
  }, []);

  const exportData = useCallback((): string => {
    const exportData = {
      ...state,
      exportedAt: new Date().toISOString(),
      version: '2.0'
    };
    return JSON.stringify(exportData, null, 2);
  }, [state]);

  const importData = useCallback((data: string): boolean => {
    try {
      const parsed = JSON.parse(data);
      
      // Validate the imported data structure
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid data format');
      }
      
      // Ensure required properties exist
      const requiredTabs = ['ga4', 'googleAds', 'microsoftAds', 'metaAds', 'klaviyo'];
      for (const tab of requiredTabs) {
        if (!parsed[tab]) {
          parsed[tab] = { baseUrl: '', parameters: {}, options: {}, lastModified: Date.now() };
        }
      }
      
      dispatch({ type: 'IMPORT_DATA', payload: parsed });
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }, []);

  const validateConfiguration = useCallback((tab: string) => {
    const tabData = state[tab as keyof UtmState];
    const errors: string[] = [];
    
    if (!tabData || typeof tabData === 'string' || Array.isArray(tabData)) {
      errors.push('Invalid tab configuration');
      return { isValid: false, errors };
    }

    if (!tabData.baseUrl) {
      errors.push('Base URL is required');
    } else {
      try {
        new URL(tabData.baseUrl);
      } catch {
        errors.push('Invalid base URL format');
      }
    }

    // Check for required UTM parameters
    if (!tabData.parameters.utm_source?.trim()) {
      errors.push('UTM source is required');
    }
    
    if (!tabData.parameters.utm_medium?.trim()) {
      errors.push('UTM medium is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [state]);

  return (
    <UtmContext.Provider value={{
      state,
      dispatch,
      updateParameter,
      resetTab,
      generateUrl,
      savePreset,
      loadPreset,
      exportData,
      importData,
      validateConfiguration
    }}>
      {children}
    </UtmContext.Provider>
  );
};