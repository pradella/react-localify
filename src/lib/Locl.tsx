import { ReactNode, Fragment, useMemo } from 'react';

import { LocalifyVars, useLocalify } from './useLocalify';

type LoclProps = {
  children: string | ReactNode;
  id?: string;
  vars?: LocalifyVars;
};

export function Locl({ children, id, vars }: LoclProps) {
  const { locl } = useLocalify();

  const message = useMemo(() => {
    const existingMessage = locl(children, { id, vars });
    return existingMessage || children;
  }, [children, locl, id, vars]);

  return <Fragment>{message}</Fragment>;
}
