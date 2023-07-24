import { ReactNode, Fragment, useMemo } from 'react';

import { useLocalify } from './useLocalify';
import { addUntrackedMessage } from './utils';

type LoclProps = {
  children: string | ReactNode;
  id?: string;
};

export function Locl({ children, id }: LoclProps) {
  const { getMessage, locale } = useLocalify();

  const message = useMemo(() => {
    const existingMessage = getMessage(children, id);
    if (!existingMessage) addUntrackedMessage(children, locale);
    return existingMessage || children;
  }, [children, getMessage, locale, id]);

  return <Fragment>{message}</Fragment>;
}
