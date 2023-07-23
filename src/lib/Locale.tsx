import { ReactNode, Fragment, useMemo } from 'react';

import { useLocale } from './useLocale';
import { addUntrackedMessage } from './utils';

type LocaleProps = {
  children: string | ReactNode;
};

export default function Locale({ children }: LocaleProps) {
  const { getMessage, locale } = useLocale();

  const message = useMemo(() => {
    const existingMessage = getMessage(children);
    if (!existingMessage) addUntrackedMessage(children, locale);
    return existingMessage || children;
  }, [children, getMessage, locale]);

  return <Fragment>{message}</Fragment>;
}
