import { ReactElement, ReactNode } from 'react';
import slugify from 'slugify';
import { renderToString } from 'react-dom/server';

import { LocaleId, Message, Messages } from './LocalifyContext';

export function convertMessageToKey(text: string | ReactNode): string {
  function replaceAll(text: string, search: string, replace: string): string {
    return text.split(search).join(replace);
  }

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

  console.warn('untrackedMessages updated', untrackedMessages);
}

export function getUntrackedMessages() {
  return untrackedMessages;
}

export function getBrowserLocale() {
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
