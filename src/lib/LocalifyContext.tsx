// LocalifyContext.tsx
import { ReactNode, useEffect, useRef } from 'react';

import { defaultLocale } from './const';
import { LocaleId, Messages } from './types';
import { useLocalifyStore } from './localifyStore';

// Props for LocalifyProvider
interface LocalifyProviderProps {
  messages: Messages;
  locale?: 'auto' | LocaleId;
  children: ReactNode;
  persistLocaleChange?: boolean;
  debug?: boolean;
  originLocale?: LocaleId;
}

// Create a provider component to wrap your app and provide the context value
export const LocalifyProvider = ({
  messages,
  locale = 'auto',
  children,
  persistLocaleChange = false,
  debug = false,
  originLocale = defaultLocale,
}: LocalifyProviderProps) => {
  const initialize = useLocalifyStore((state) => state.initialize);
  const ready = useLocalifyStore((state) => state.ready);
  const initializedRef = useRef(false);

  // Initialize the store once on mount
  useEffect(() => {
    if (!initializedRef.current) {
      initialize({
        messages,
        locale,
        debug,
        originLocale,
        persistLocaleChange,
      });
      initializedRef.current = true;
    }
  }, [initialize, messages, locale, debug, originLocale, persistLocaleChange]);

  return <>{ready ? children : null}</>;
};
