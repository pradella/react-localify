// LocalifyContext.tsx
import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

import {
  getBrowserLocale,
  getLocalStorageLocale,
  removeLocalStorageLocale,
  setLocalStorageLocale,
} from './utils';
import { Languages, LocaleId, Messages } from './types';
import { languages } from './const';

// Define the shape of the context value
interface LocalifyContextValue extends State {
  debug?: boolean;
  defaultLocale: LocaleId;
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
  locale: getBrowserLocale(), // default is browser language
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
  defaultLocale?: LocaleId;
}

// Create a provider component to wrap your app and provide the context value
export const LocalifyProvider = ({
  messages,
  locale = 'auto',
  children,
  persistLocaleChange = false,
  debug = false,
  defaultLocale = 'en-US',
}: LocalifyProviderProps) => {
  const [state, dispatch] = useReducer(localifyReducer, initialState);
  const [ready, setReady] = useState(false);

  // Load messages from messages.json and set as initialState
  useEffect(() => {
    dispatch({ type: 'SET_MESSAGES', payload: messages });
    setReady(true);
  }, [messages]);

  // Set the locale value from the prop
  useEffect(() => {
    // keep initial value, that comes from brower locale
    if (locale === 'auto') return;

    dispatch({ type: 'SET_LOCALE', payload: locale });
  }, [locale]);

  useEffect(() => {
    if (persistLocaleChange) {
      const localeFromLocalStorage = getLocalStorageLocale();
      localeFromLocalStorage &&
        dispatch({ type: 'SET_LOCALE', payload: localeFromLocalStorage });
    } else {
      removeLocalStorageLocale();
    }
  }, [persistLocaleChange]);

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
    defaultLocale,
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
