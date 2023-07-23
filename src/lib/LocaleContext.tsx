// LocaleContext.tsx
import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

// Define a union type for allowed locales
export type LocaleId =
  | 'en-US'
  | 'pt-BR'
  | 'es'
  | 'es-ES'
  | 'jp'
  | /* Add other valid locales */ string;

// Define the shape of the message object using type
type Messages = {
  [key: string]: {
    [locale: string]: string;
  };
};

// Define the shape of the context value
interface LocaleContextValue {
  messages: Messages;
  locale?: LocaleId;
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
const localeReducer = (state: State, action: Action): State => {
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
      console.log('SET_LOCALE', action.payload);
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
  locale?: LocaleId;
};

// Create the initial state with your messages
const initialState: State = {
  messages: {},
};

// Create the context
export const LocaleContext = createContext<LocaleContextValue | undefined>(
  undefined
);

// Props for LocaleContextProvider
interface LocaleContextProviderProps {
  messages: string; // The path to the messages.json file
  locale: LocaleId;
  children: ReactNode;
}

// Create a provider component to wrap your app and provide the context value
export const LocaleContextProvider = ({
  messages,
  locale,
  children,
}: LocaleContextProviderProps) => {
  const [state, dispatch] = useReducer(localeReducer, initialState);
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
    console.log('setLocale');
    dispatch({
      type: 'SET_LOCALE',
      payload: locale,
    });
  };

  const contextValue: LocaleContextValue = {
    messages: state.messages,
    locale: state.locale,
    getMessage,
    setMessages,
    setMessage,
    setLocale,
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      {!loading && children}
    </LocaleContext.Provider>
  );
};
