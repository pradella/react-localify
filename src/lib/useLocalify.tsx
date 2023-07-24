import { ReactNode, useContext } from 'react';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

import { LocalifyContext } from './LocalifyContext';
import { convertMessageToKey } from './utils';

export const useLocalify = () => {
  const context = useContext(LocalifyContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleContextProvider');
  }

  function getMessage(text: string | ReactNode) {
    const locale = context?.locale;

    if (!locale) return text;

    const key = convertMessageToKey(text);

    let label: string | undefined = undefined;
    try {
      // get label from database (labels.json)
      // for some reasons, must use || because sometimes comes undefined with _.get
      label = context.messages[key as string][locale];

      // replace wildcards (if exists)
      //   label = replaceWildcards(label, {
      //     additionalWildcards: options?.additionalWildcards,
      //   });
    } catch (err) {
      //
    }

    return label && typeof label === 'string' && label.includes('<')
      ? stringToReactElement(label)
      : label;
  }

  return { ...context, getMessage };
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
