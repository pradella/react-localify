import { ReactElement, ReactNode } from 'react';
import slugify from 'slugify';
import { renderToString } from 'react-dom/server';
import { LocaleId, Message, Messages } from './types';

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

  untrackedMessages = {
    ...untrackedMessages,
    [id]: {
      ...untrackedMessages[id],
      ...untrackedMessage,
    },
  };

  console.warn('[react-localify] untrackedMessages updated', untrackedMessages);
}

export function getUntrackedMessages() {
  return untrackedMessages;
}

export function getBrowserLocale(): LocaleId | string {
  let browserLocale: string | undefined = undefined;

  if (navigator.languages && navigator.languages.length) {
    // Use the first language from the list of preferred languages
    browserLocale = navigator.languages[0];
  } else {
    // Fallback to navigator.language if navigator.languages is not available
    browserLocale = navigator.language || 'en-US';
  }

  return browserLocale;
}

const localStorageLocaleKey = 'locale';
export function getLocalStorageLocale() {
  return window.localStorage.getItem(localStorageLocaleKey);
}

export function setLocalStorageLocale(locale: LocaleId) {
  return window.localStorage.setItem(localStorageLocaleKey, locale);
}

export function removeLocalStorageLocale() {
  window.localStorage.removeItem(localStorageLocaleKey);
}

export function replaceAll(str: string, search: string, replacement: string) {
  // Escape special characters in the search string
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create a regular expression with the 'g' flag for global search
  const regex = new RegExp(escapedSearch, 'g');

  // Use the replace method of the string with the regex to perform the replacements
  return str.replace(regex, replacement);
}
