import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction } from '../types';
import { appReducer, defaultState } from './reducer';

const STORAGE_KEY = 'cloud-closet-state';
const STATE_VERSION = 'v5'; // bumped: Plan button now adds to fitPlanItems pool

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<AppState> & { _version?: string };
    // If version mismatch, discard and start fresh
    if (parsed._version !== STATE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return defaultState;
    }
    // Always reset closet from defaultState to avoid stale delivery statuses
    // and missing fields (condition, defects, etc.) from old persisted state.
    // Only persist user preferences and waitlist across sessions.
    return {
      ...defaultState,
      user: parsed.user ?? defaultState.user,
      waitlist: parsed.waitlist ?? defaultState.waitlist,
      outfitHistory: parsed.outfitHistory ?? defaultState.outfitHistory,
      toasts: [],
      activeModal: null,
    };
  } catch {
    return defaultState;
  }
}

interface AppStoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppStoreContext = createContext<AppStoreContextValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState);

  useEffect(() => {
    try {
      const { toasts: _t, activeModal: _m, ...persistable } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...persistable, _version: STATE_VERSION }));
    } catch {
      // Silently ignore storage errors
    }
  }, [state]);

  return (
    <AppStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreContextValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider');
  return ctx;
}
