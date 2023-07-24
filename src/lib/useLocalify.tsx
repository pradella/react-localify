import { ReactNode, useContext } from 'react';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

import { LocalifyContext } from './LocalifyContext';
import { addUntrackedMessage, convertMessageToKey, replaceAll } from './utils';

export type LocalifyVars = {
  [key: string]: LocalifyVar;
};

type LocalifyVar = string | number;

export const useLocalify = () => {
  const context = useContext(LocalifyContext);
  if (!context) {
    throw new Error('useLocalify must be used within a LocalifyProvider');
  }

  function getMessage(
    message: string | ReactNode,
    options?: {
      id?: string;
      vars?: LocalifyVars;
    }
  ) {
    const locale = context?.locale;

    if (!locale) return message;

    let existsInMessages = false;

    // if no id provided, generated from message
    const id = options?.id || convertMessageToKey(message);

    let returnMessage: string | undefined = undefined;
    try {
      // get label from database (labels.json)
      // for some reasons, must use || because sometimes comes undefined with _.get
      returnMessage = context.messages[id][locale];

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
    if (!existsInMessages && context.debug)
      addUntrackedMessage(message, locale);

    return returnMessage &&
      typeof returnMessage === 'string' &&
      returnMessage.includes('<')
      ? stringToReactElement(returnMessage)
      : returnMessage;
  }

  return { ...context, locl: getMessage };
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
