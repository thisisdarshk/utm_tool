import type { UtmState, UtmAction, TabData, ConfigurationPreset } from '../types/utm';

const createInitialTabData = (): TabData => ({
  baseUrl: '',
  parameters: {},
  options: {},
  lastModified: Date.now()
});

export const initialState: UtmState = {
  activeTab: 'ga4',
  ga4: createInitialTabData(),
  googleAds: createInitialTabData(),
  microsoftAds: createInitialTabData(),
  metaAds: createInitialTabData(),
  presets: {},
  history: []
};

export const utmReducer = (state: UtmState, action: UtmAction): UtmState => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload.tab
      };

    case 'UPDATE_PARAMETER': {
      const { tab, key, value } = action.payload;
      const tabData = state[tab as keyof UtmState];
      
      if (!tabData || typeof tabData === 'string' || Array.isArray(tabData)) {
        return state;
      }
      
      return {
        ...state,
        [tab]: {
          ...tabData,
          parameters: {
            ...tabData.parameters,
            [key]: value
          },
          lastModified: Date.now()
        }
      };
    }

    case 'UPDATE_BASE_URL': {
      const { tab, url } = action.payload;
      const tabData = state[tab as keyof UtmState];
      
      if (!tabData || typeof tabData === 'string' || Array.isArray(tabData)) {
        return state;
      }
      
      return {
        ...state,
        [tab]: {
          ...tabData,
          baseUrl: url,
          lastModified: Date.now()
        }
      };
    }

    case 'UPDATE_OPTIONS': {
      const { tab, options } = action.payload;
      const tabData = state[tab as keyof UtmState];
      
      if (!tabData || typeof tabData === 'string' || Array.isArray(tabData)) {
        return state;
      }
      
      return {
        ...state,
        [tab]: {
          ...tabData,
          options: {
            ...tabData.options,
            ...options
          },
          lastModified: Date.now()
        }
      };
    }

    case 'RESET_TAB':
      return {
        ...state,
        [action.payload.tab]: createInitialTabData()
      };

    case 'SAVE_PRESET':
      return {
        ...state,
        presets: {
          ...state.presets,
          [action.payload.name]: action.payload.data
        }
      };

    case 'LOAD_PRESET': {
      const preset = action.payload;
      return {
        ...state,
        [state.activeTab]: {
          baseUrl: preset.baseUrl || '',
          parameters: preset.parameters || {},
          options: preset.options || {},
          lastModified: Date.now()
        }
      };
    }

    case 'IMPORT_DATA': {
      const importedData = action.payload;
      return {
        ...importedData,
        history: [...state.history, ...(importedData.history || [])].slice(0, 50) // Keep last 50
      };
    }

    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [action.payload.url, ...state.history.slice(0, 19)] // Keep last 20
      };

    default:
      return state;
  }
};