// LocalifyContext.tsx
import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { getBrowserLocale } from './utils';

// Define a union type for allowed locales
export type LocaleId =
  | 'en-US'
  | 'pt-BR'
  | 'es'
  | 'es-ES'
  | 'jp'
  | /* Add other valid locales */ string;

// Define the shape of the message object using type
export type Messages = {
  [key: string]: Message;
};

export type Message = {
  [locale: string]: string;
};

// Define the shape of the context value
interface LocalifyContextValue extends State {
  getMessage: (id: string, locale: LocaleId) => string | undefined;
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
  messages: string; // The path to the messages.json file
  locale?: 'auto' | LocaleId;
  children: ReactNode;
}

// Create a provider component to wrap your app and provide the context value
export const LocalifyProvider = ({
  messages,
  locale = 'auto',
  children,
}: LocalifyProviderProps) => {
  const [state, dispatch] = useReducer(localifyReducer, initialState);
  const [loading, setLoading] = useState(true);

  // Load messages from messages.json and set as initialState
  useEffect(() => {
    fetch(messages) // Use the provided path to fetch messages
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: 'SET_MESSAGES', payload: data });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading messages:', error);
        setLoading(false);
      });
  }, [messages]);

  // Set the locale value from the prop
  useEffect(() => {
    // keep changes
    if (locale === 'auto') return;

    dispatch({ type: 'SET_LOCALE', payload: locale });
  }, [locale]);

  const getMessage = (id: string, locale: LocaleId) => {
    return state.messages[id]?.[locale];
  };

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
  };

  const contextValue: LocalifyContextValue = {
    ...state,
    getMessage,
    setMessages,
    setMessage,
    setLocale,
  };

  return (
    <LocalifyContext.Provider value={contextValue}>
      {!loading && children}
    </LocalifyContext.Provider>
  );
};
