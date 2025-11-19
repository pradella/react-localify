// localifyStore.ts
import { create } from 'zustand';
import { LocaleId, Messages } from './types';
import { defaultLocale } from './const';
import {
  getBrowserLocale,
  getLocalStorageLocale,
  isLocaleAvailable,
  removeLocalStorageLocale,
  setLocalStorageLocale,
} from './utils';

interface LocalifyState {
  messages: Messages;
  locale: LocaleId;
  ready: boolean;
  debug: boolean;
  originLocale: LocaleId;
  persistLocaleChange: boolean;
  setLocaleTouched: boolean;
}

interface LocalifyActions {
  initMessages: (messages: Messages) => void;
  setMessages: (newMessages: Messages) => void;
  setMessage: (id: string, locale: LocaleId, message: string) => void;
  setLocale: (locale: LocaleId) => void;
  initialize: (config: {
    messages: Messages;
    locale?: 'auto' | LocaleId;
    debug?: boolean;
    originLocale?: LocaleId;
    persistLocaleChange?: boolean;
  }) => void;
  reset: () => void;
}

export type LocalifyStore = LocalifyState & LocalifyActions;

const initialState: LocalifyState = {
  messages: {},
  locale: defaultLocale,
  ready: false,
  debug: false,
  originLocale: defaultLocale,
  persistLocaleChange: false,
  setLocaleTouched: false,
};

export const useLocalifyStore = create<LocalifyStore>((set, get) => ({
  ...initialState,

  initMessages: (messages: Messages) => {
    set({
      messages: {
        ...get().messages,
        ...messages,
      },
      ready: true,
    });
  },

  setMessages: (newMessages: Messages) => {
    const currentMessages = get().messages;
    const mergedMessages = { ...currentMessages };

    // Deep merge each message key to preserve existing locale translations
    Object.keys(newMessages).forEach((messageKey) => {
      mergedMessages[messageKey] = {
        ...currentMessages[messageKey],
        ...newMessages[messageKey],
      };
    });

    set({ messages: mergedMessages });
  },

  setMessage: (id: string, locale: LocaleId, message: string) => {
    const currentMessages = get().messages;
    set({
      messages: {
        ...currentMessages,
        [id]: {
          ...currentMessages[id],
          [locale]: message,
        },
      },
    });
  },

  setLocale: (locale: LocaleId) => {
    const { persistLocaleChange } = get();
    set({
      locale,
      setLocaleTouched: true,
    });
    if (persistLocaleChange) {
      setLocalStorageLocale(locale);
    }
  },

  initialize: (config) => {
    const {
      messages,
      locale = 'auto',
      debug = false,
      originLocale = defaultLocale,
      persistLocaleChange = false,
    } = config;

    // Set initial config
    set({
      debug,
      originLocale,
      persistLocaleChange,
    });

    // Initialize messages
    get().initMessages(messages);

    // Determine initial locale
    const isLocaleInvalid = (locale?: string) => {
      return !isLocaleAvailable(locale, get().messages);
    };

    let initialLocale: string | undefined = undefined;

    // 1. use locale from props
    if (!!locale && locale !== 'auto') {
      initialLocale = locale;
    }

    // 2. restore from localstorage
    if (isLocaleInvalid(initialLocale) && persistLocaleChange) {
      initialLocale = getLocalStorageLocale();
    }

    // 3. auto detect locale
    if (isLocaleInvalid(initialLocale) && locale === 'auto') {
      initialLocale = getBrowserLocale();
    }

    // 4. use origin locale
    if (isLocaleInvalid(initialLocale) && originLocale) {
      initialLocale = originLocale;
    }

    // if still invalid locale, use default
    if (isLocaleInvalid(initialLocale)) {
      initialLocale = defaultLocale;
    }

    // Set the locale without marking as touched (this is initialization)
    set({
      locale: initialLocale || defaultLocale,
    });

    // in case persist is not enabled, delete from storage
    if (!persistLocaleChange) {
      removeLocalStorageLocale();
    }
  },

  reset: () => {
    set(initialState);
  },
}));
