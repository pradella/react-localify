import { ReactElement, ReactNode } from 'react';
import slugify from 'slugify';
import { renderToString } from 'react-dom/server';
import { LocaleId, Message, Messages } from './types';
import { languages } from './const';

export function convertMessageToKey(text: string | ReactNode): string {
  function sanitizeKey(text: string): string {
    //const options = { remove: /[*+~.()'"!:@<>]/g, strict: true };
    const options = {};

    text = text.replace(/<\/?[^>]+(>|$)/g, ''); // remove html tags
    text = slugify(text, options);
    text = replaceAll(text, '"', ''); // remove "
    text = replaceAll(text, '.', '_'); // replace . for _
    text = replaceAll(text, ':', '_'); // replace : for _
    text = replaceAll(text, '!', '_'); // replace ! for _
    text = replaceAll(text, '?', '_'); // replace ? for _
    return text;
  }

  try {
    return sanitizeKey(text as string);
  } catch (err) {
    // goes here if probably has JSX code
    const convertedText = jsxToString(text);
    return sanitizeKey(convertedText);
  }
}

export function jsxToString(jsx: unknown): string {
  const asString = renderToString(jsx as ReactElement);
  return asString;
}

let untrackedMessages: Messages = {};

export function addUntrackedMessage(
  message: string | ReactNode,
  locale: LocaleId
) {
  const id = convertMessageToKey(message);

  if (untrackedMessages[id]) return;

  const messageAsString =
    typeof message === 'string' ? message : jsxToString(message);

  const untrackedMessage: Message = { [locale]: messageAsString };
  const existing: Message = untrackedMessages[id] || {};

  untrackedMessages = {
    ...untrackedMessages,
    [id]: {
      ...existing,
      ...untrackedMessage,
    },
  };

  console.warn('[react-localify] untrackedMessages updated', untrackedMessages);
}

export function getUntrackedMessages() {
  return untrackedMessages;
}

export function getBrowserLocale(): LocaleId | string | undefined {
  let browserLocale: string | undefined = undefined;

  // Check if navigator exists (browser environment)
  if (typeof navigator !== 'undefined') {
    if (navigator.languages && navigator.languages.length) {
      // Use the first language from the list of preferred languages
      browserLocale = navigator.languages[0];
    } else {
      // Fallback to navigator.language if navigator.languages is not available
      browserLocale = navigator.language;
    }
  }

  return browserLocale;
}

const localStorageLocaleKey = 'locale';
export function getLocalStorageLocale() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(localStorageLocaleKey) || undefined;
  }
  return undefined;
}

export function setLocalStorageLocale(locale: LocaleId) {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.setItem(localStorageLocaleKey, locale);
  }
}

export function removeLocalStorageLocale() {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(localStorageLocaleKey);
  }
}

export function replaceAll(str: string, search: string, replacement: string) {
  // Escape special characters in the search string
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create a regular expression with the 'g' flag for global search
  const regex = new RegExp(escapedSearch, 'g');

  // Use the replace method of the string with the regex to perform the replacements
  return str.replace(regex, replacement);
}

// list of available languages, based on the existing messages
export function getAvailableLanguages(messages: Messages = {}) {
  const [firstKey] = Object.keys(messages);
  if (!firstKey) return [];
  const availableLocales = Object.keys(messages[firstKey]);
  return availableLocales.map(
    (locale) =>
      languages[locale] || {
        locale,
        language: locale,
        region: locale,
        languageLocalized: locale,
        regionLocalized: locale,
      }
  );
}

// an available locale means that locale exists on messages
export function isLocaleAvailable(
  locale: string | undefined,
  messages: Messages = {}
) {
  const availableLanguages = getAvailableLanguages(messages);
  return !!availableLanguages.find((l) => l.locale === locale);
}
