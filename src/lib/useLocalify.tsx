import { ReactNode } from 'react';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

import { useLocalifyStore } from './localifyStore';
import {
  addUntrackedMessage,
  convertMessageToKey,
  getAvailableLanguages,
  getUntrackedMessages,
  replaceAll,
} from './utils';
import { languages } from './const';
import { Messages } from './types';

export type LocalifyVars = {
  [key: string]: LocalifyVar;
};

type LocalifyVar = string | number;

type GetMessageOptions = {
  id?: string;
  vars?: LocalifyVars;
};

export const useLocalify = () => {
  const messages = useLocalifyStore((state) => state.messages);
  const locale = useLocalifyStore((state) => state.locale);
  const ready = useLocalifyStore((state) => state.ready);
  const debug = useLocalifyStore((state) => state.debug);
  const originLocale = useLocalifyStore((state) => state.originLocale);
  const setMessages = useLocalifyStore((state) => state.setMessages);
  const setMessage = useLocalifyStore((state) => state.setMessage);
  const setLocale = useLocalifyStore((state) => state.setLocale);

  function getMessage(
    message: string | ReactNode,
    options?: GetMessageOptions
  ) {
    if (!locale) return message;

    let existsInMessages = false;

    // if no id provided, generated from message
    const id = options?.id || convertMessageToKey(message);

    let returnMessage: string | undefined = undefined;
    try {
      // get label from database (labels.json)
      // for some reasons, must use || because sometimes comes undefined with _.get
      returnMessage = messages[id][locale];

      // means that message was found in messages
      existsInMessages = !!returnMessage;

      // replace all vars
      if (options?.vars) {
        Object.keys(options.vars).forEach((key) => {
          const replacement = options.vars ? options.vars[key] : undefined;
          if (returnMessage && replacement)
            returnMessage = replaceAll(
              returnMessage,
              `[[${key}]]`,
              `${replacement}`
            );
        });
      }
    } catch (err) {
      //
    }

    // if message does not exists, add to untracked
    if (!existsInMessages && debug) addUntrackedMessage(message, originLocale);

    return returnMessage &&
      typeof returnMessage === 'string' &&
      returnMessage.includes('<')
      ? stringToReactElement(returnMessage)
      : returnMessage;
  }

  // works only with plain text
  function locl(message: string, options?: GetMessageOptions) {
    const existingMessage = getMessage(message, options) as string;
    return existingMessage || message;
  }

  function getMergedMessages() {
    function mergeMessages(obj1: Messages, obj2: Messages) {
      const merged: Messages = {};

      // Merge keys from object1
      Object.keys(obj1).forEach((key) => {
        if (obj2[key]) {
          // Merge common keys with nested locales
          merged[key] = { ...obj1[key], ...obj2[key] };
        } else {
          // Add keys that exist only in object1
          merged[key] = obj1[key];
        }
      });

      // Merge keys from object2 that don't already exist in merged
      Object.keys(obj2).forEach((key) => {
        if (!obj1[key]) {
          merged[key] = obj2[key];
        }
      });

      return merged;
    }

    return mergeMessages(messages || {}, getUntrackedMessages());
  }

  return {
    messages,
    locale,
    ready,
    debug,
    originLocale,
    languages,
    setMessages,
    setMessage,
    setLocale,
    getMessage,
    locl,
    getMergedMessages,
    getAvailableLanguages: () => getAvailableLanguages(messages),
  };
};

function stringToReactElement(htmlString: string) {
  // Sanitize the HTML string using DOMPurify
  const sanitizedHTML = DOMPurify.sanitize(htmlString, {
    USE_PROFILES: { html: true },
  });

  // Parse the sanitized HTML string into React elements
  const reactElements = parse(sanitizedHTML);

  // Return the array of React elements
  return reactElements;
}
