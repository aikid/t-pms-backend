'use client';

import { useEffect, useSyncExternalStore } from 'react';

export const brandThemes = [
  { id: 'sara', name: 'Verde', description: 'Identidade original SARA', color: '#1f6b4e' },
  { id: 'executive', name: 'Azul', description: 'Identidade executiva', color: '#1f5ca8' },
  { id: 'technology', name: 'Roxo', description: 'Identidade tecnológica', color: '#6d45a8' },
  { id: 'institutional', name: 'Vermelho', description: 'Identidade institucional', color: '#b9433c' },
] as const;

export type ThemeId = (typeof brandThemes)[number]['id'];

const STORAGE_KEY = 'sara-brand-theme';
const themeSubscribers = new Set<() => void>();

function isThemeId(value: string | null): value is ThemeId {
  return brandThemes.some((theme) => theme.id === value);
}

function getThemeSnapshot(): ThemeId {
  const savedTheme = window.localStorage.getItem(STORAGE_KEY);
  return isThemeId(savedTheme) ? savedTheme : 'sara';
}

function subscribeToTheme(callback: () => void) {
  themeSubscribers.add(callback);
  const syncAcrossTabs = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };
  window.addEventListener('storage', syncAcrossTabs);
  return () => {
    themeSubscribers.delete(callback);
    window.removeEventListener('storage', syncAcrossTabs);
  };
}

function saveTheme(theme: ThemeId) {
  window.localStorage.setItem(STORAGE_KEY, theme);
  themeSubscribers.forEach((callback) => callback());
}

export function useBrandTheme() {
  const currentTheme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => 'sara');

  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;
  }, [currentTheme]);

  return { currentTheme, selectTheme: saveTheme };
}
