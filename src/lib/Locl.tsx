import { ReactNode, Fragment, useMemo } from 'react';

import { LocalifyVars, useLocalify } from './useLocalify';
import { addUntrackedMessage } from './utils';

type LoclProps = {
  children: string | ReactNode;
  id?: string;
  vars?: LocalifyVars;
};

export function Locl({ children, id, vars }: LoclProps) {
  const { getMessage, locale } = useLocalify();

  const message = useMemo(() => {
    const existingMessage = getMessage(children, { id, vars });
    if (!existingMessage) addUntrackedMessage(children, locale);
    return existingMessage || children;
  }, [children, getMessage, locale, id, vars]);

  return <Fragment>{message}</Fragment>;
}
