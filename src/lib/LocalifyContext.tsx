// LocalifyContext.tsx
import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

import {
  getBrowserLocale,
  getLocalStorageLocale,
  isLocaleAvailable,
  removeLocalStorageLocale,
  setLocalStorageLocale,
} from './utils';
import { Languages, LocaleId, Messages } from './types';
import { defaultLocale, languages } from './const';

// Define the shape of the context value
interface LocalifyContextValue extends State {
  debug?: boolean;
  originLocale: LocaleId;
  languages: Languages;
  setMessages: (newMessages: Messages) => void;
  setMessage: (id: string, locale: LocaleId, message: string) => void;
  setLocale: (locale: LocaleId) => void;
}

// Action types with discriminant properties
type Action =
  | {
      type: 'SET_MESSAGES';
      payload: Messages;
    }
  | {
      type: 'SET_MESSAGE';
      payload: { id: string; locale: LocaleId; message: string };
    }
  | {
      type: 'SET_LOCALE';
      payload: LocaleId;
    };

// Reducer function
const localifyReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_MESSAGES': {
      return {
        ...state,
        messages: {
          ...state.messages,
          ...action.payload,
        },
      };
    }
    case 'SET_MESSAGE': {
      const { id, locale, message } = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [id]: {
            ...state.messages[id],
            [locale]: message,
          },
        },
      };
    }
    case 'SET_LOCALE': {
      return {
        ...state,
        locale: action.payload,
      };
    }
    default:
      return state;
  }
};

type State = {
  messages: Messages;
  locale: LocaleId;
};

// Create the initial state with your messages
const initialState: State = {
  messages: {},
  locale: defaultLocale,
};

// Create the context
export const LocalifyContext = createContext<LocalifyContextValue | undefined>(
  undefined
);

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
  const [state, dispatch] = useReducer(localifyReducer, initialState);
  const [ready, setReady] = useState(false);

  // Load messages from messages.json and set as initialState
  useEffect(() => {
    dispatch({ type: 'SET_MESSAGES', payload: messages });
    setReady(true);
  }, [messages]);

  const messagesRef = useRef<Messages>(state.messages);
  messagesRef.current = state.messages;

  // Set the locale value from the prop
  useEffect(() => {
    // make sure messages is in context
    if (!ready) return;

    setInitialLocale();

    function isLocaleInvalid(locale?: string) {
      return !isLocaleAvailable(locale, messagesRef.current);
    }

    function setInitialLocale() {
      // 1. use locale from props
      // 2. restore from localstorage
      // 3. auto detect locale
      // 4. use origin locale
      // At the end, check if valid; otherwise, use default locale

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
        // 3.1. based on browser locale
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

      // ready to set!
      dispatch({ type: 'SET_LOCALE', payload: initialLocale || defaultLocale });

      // in case persist is not enabled, delete from storage
      if (!persistLocaleChange) removeLocalStorageLocale();
    }
  }, [locale, originLocale, persistLocaleChange, ready]);

  const setMessages = (newMessages: Messages) => {
    dispatch({ type: 'SET_MESSAGES', payload: newMessages });
  };

  const setMessage = (id: string, locale: LocaleId, message: string) => {
    dispatch({
      type: 'SET_MESSAGE',
      payload: { id, locale, message },
    });
  };

  const setLocale = (locale: LocaleId) => {
    dispatch({
      type: 'SET_LOCALE',
      payload: locale,
    });
    if (persistLocaleChange) setLocalStorageLocale(locale);
  };

  const contextValue: LocalifyContextValue = {
    ...state,
    languages,
    debug,
    originLocale,
    setMessages,
    setMessage,
    setLocale,
  };

  return (
    <LocalifyContext.Provider value={contextValue}>
      {ready && children}
    </LocalifyContext.Provider>
  );
};
