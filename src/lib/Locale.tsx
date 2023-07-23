import { ReactNode, Fragment, useMemo } from 'react';

import { useLocale } from './useLocale';

type LocaleProps = {
  children: string | ReactNode;
};

export default function Locale({ children }: LocaleProps) {
  const { getMessage, locale } = useLocale();

  const message = useMemo(() => {
    return getMessage(children) || children;
  }, [children, locale, getMessage]);

  return <Fragment>{message}</Fragment>;
}
