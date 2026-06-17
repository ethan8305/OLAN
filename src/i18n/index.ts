/**
 * i18n setup. FOUR languages: English (en), Mandarin (zh), Malay (ms), Tamil (ta).
 *
 * - English is the source of truth and the fallback for any missing key, so a
 *   half-translated locale degrades gracefully to English rather than showing
 *   raw keys.
 * - The user's choice is persisted in localStorage and restored on launch;
 *   default is English.
 * - Recycling-critical instructions (item accept/reject + WHY) are NOT stored
 *   here — they live in data/recyclables.ts in English on purpose, because a
 *   mistranslated instruction misinforms and is worse than English-only. Human-
 *   reviewed translations are a tracked TODO.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ms from './locales/ms.json';
import ta from './locales/ta.json';

export const SUPPORTED_LANGS = ['en', 'zh', 'ms', 'ta'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

const STORAGE_KEY = 'reloop.lang';

export function getStoredLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (SUPPORTED_LANGS as readonly string[]).includes(stored)) {
    return stored as Lang;
  }
  return 'en';
}

export function setLang(lang: Lang): void {
  localStorage.setItem(STORAGE_KEY, lang);
  void i18n.changeLanguage(lang);
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    ms: { translation: ms },
    ta: { translation: ta },
  },
  lng: getStoredLang(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
