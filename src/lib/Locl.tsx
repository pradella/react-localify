import { ReactNode, Fragment, useMemo } from 'react';

import { useLocalify } from './useLocalify';
import { addUntrackedMessage } from './utils';

type LoclProps = {
  children: string | ReactNode;
};

export function Locl({ children }: LoclProps) {
  const { getMessage, locale } = useLocalify();

  const message = useMemo(() => {
    const existingMessage = getMessage(children);
    if (!existingMessage) addUntrackedMessage(children, locale);
    return existingMessage || children;
  }, [children, getMessage, locale]);

  return <Fragment>{message}</Fragment>;
}
