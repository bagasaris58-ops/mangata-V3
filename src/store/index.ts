import { useEffect, useSyncExternalStore, useRef } from 'react';

type Settings = {
  driveApiKey?: string;
  driveRootFolderId?: string;
  defaults: { weight?: number; stock?: number; preorder?: boolean };
  compression: { maxDimension: number; targetSize: number; quality: number; format: 'webp' | 'jpeg' };
  csvMapping: Record<string, string>;
  branding: { storeName?: string; titleTemplate?: string; watermark?: boolean };
};

const DEFAULT_SETTINGS: Settings = {
  driveApiKey: '',
  driveRootFolderId: '',
  defaults: { weight: 0, stock: 0, preorder: false },
  compression: { maxDimension: 2000, targetSize: 2, quality: 0.85, format: 'webp' },
  csvMapping: { Name: 'title', Description: 'description', Price: 'price', Stock: 'stock', Weight: 'weight', Images: 'imagesPicked' },
  branding: { storeName: '', titleTemplate: '{TITLE} - {BRAND}', watermark: false },
};

const LS_KEY = 'mk_settings';

function readSettings(): Settings {
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed,
      defaults: { ...DEFAULT_SETTINGS.defaults, ...(parsed?.defaults || {}) },
      compression: { ...DEFAULT_SETTINGS.compression, ...(parsed?.compression || {}) },
      branding: { ...DEFAULT_SETTINGS.branding, ...(parsed?.branding || {}) },
      csvMapping: { ...DEFAULT_SETTINGS.csvMapping, ...(parsed?.csvMapping || {}) },
    };
  } catch { return DEFAULT_SETTINGS; }
}

let state: Settings = readSettings();
const subs = new Set<() => void>();

function saveSettings(newSettings: Settings) {
  state = newSettings;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
    localStorage.setItem('driveApiKey', state.driveApiKey || '');
    localStorage.setItem('rootFolderId', state.driveRootFolderId || '');
  }
  subs.forEach((cb) => cb());
}

function updateSettings(partial: Partial<Settings>) {
  const next: Settings = {
    ...state,
    ...partial,
    defaults: { ...state.defaults, ...(partial.defaults || {}) },
    compression: { ...state.compression, ...(partial.compression || {}) },
    branding: { ...state.branding, ...(partial.branding || {}) },
    csvMapping: { ...state.csvMapping, ...(partial.csvMapping || {}) },
  };
  saveSettings(next);
}

function replaceSettings(next: Settings) {
  const merged: Settings = {
    ...DEFAULT_SETTINGS,
    ...next,
    defaults: { ...DEFAULT_SETTINGS.defaults, ...(next?.defaults || {}) },
    compression: { ...DEFAULT_SETTINGS.compression, ...(next?.compression || {}) },
    branding: { ...DEFAULT_SETTINGS.branding, ...(next?.branding || {}) },
    csvMapping: { ...DEFAULT_SETTINGS.csvMapping, ...(next?.csvMapping || {}) },
  };
  saveSettings(merged);
}

function clearSettings() { saveSettings(DEFAULT_SETTINGS); }

function subscribe(cb: () => void) { subs.add(cb); return () => subs.delete(cb); }

export function useAppStore() {
  const snapshot = useSyncExternalStore(subscribe, () => state, () => state);
  const initRef = useRef(false);
  useEffect(() => {
    if (!initRef.current) { state = readSettings(); initRef.current = true; }
  }, []);
  return { settings: snapshot, updateSettings, replaceSettings, clearSettings, DEFAULT_SETTINGS };
}
