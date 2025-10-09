// LocalifyContext.tsx
import { ReactNode, useEffect, useRef } from 'react';

import { defaultLocale } from './const';
import { useLocalifyStore } from './localifyStore';
import { LocaleId, Messages } from './types';

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

  // Check if we're in SSR/prerendering environment
  const isSSR = typeof window === 'undefined';

  // For SSR/prerendering: Initialize synchronously before first render
  if (isSSR && !initializedRef.current) {
    initialize({
      messages,
      locale,
      debug,
      originLocale,
      persistLocaleChange,
    });
    initializedRef.current = true;
  }

  // For browser: Initialize in useEffect
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

  // During SSR, render immediately without waiting for ready flag
  // In browser, wait for ready flag
  return <>{isSSR || ready ? children : null}</>;
};
