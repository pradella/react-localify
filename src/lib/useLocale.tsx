import { ReactNode, useContext } from 'react';
import _ from 'lodash';
import ReactHtmlParser from 'react-html-parser';

import { LocaleContext } from './LocaleContext';
import { convertMessageToKey } from './utils';

export const useLocale = () => {
  const context = useContext(LocaleContext);
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
      label =
        (_.get(context.messages, `${key}.${locale}`) as unknown as string) ||
        context.messages[key as string][locale];


      // replace wildcards (if exists)
      //   label = replaceWildcards(label, {
      //     additionalWildcards: options?.additionalWildcards,
      //   });
    } catch (err) {
      //
    }
    return label && typeof(label) !== 'string' ? ReactHtmlParser(label) : label;
  }

  return { ...context, getMessage };
};
