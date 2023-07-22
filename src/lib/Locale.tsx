import { ReactNode, Fragment, useEffect, useRef } from 'react';

type LocaleProps = {
  children: string | ReactNode;
};

export default function Locale({ children }: LocaleProps) {
  const isMounted = useRef<boolean>(false);

  useEffect(() => {
    if (isMounted.current) return;

    console.log(children);
    isMounted.current = true;
  }, [children]);

  return <Fragment>{children}</Fragment>;
}
