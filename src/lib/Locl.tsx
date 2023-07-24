import { ReactNode, Fragment, useMemo } from 'react';

import { LocalifyVars, useLocalify } from './useLocalify';

type LoclProps = {
  children: string | ReactNode;
  id?: string;
  vars?: LocalifyVars;
};

export function Locl({ children, id, vars }: LoclProps) {
  const { getMessage } = useLocalify();

  const message = useMemo(() => {
    const existingMessage = getMessage(children, { id, vars });
    return existingMessage || children;
  }, [children, getMessage, id, vars]);

  return <Fragment>{message}</Fragment>;
}
