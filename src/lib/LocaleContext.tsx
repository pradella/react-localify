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
  locale: LocaleId;
  getMessage: (id: string, locale: LocaleId) => string | undefined;
  setMessages: (newMessages: Messages) => void;
  setMessage: (id: string, locale: LocaleId, message: string) => void;
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
    };

// Reducer function
const localeReducer = (state: Messages, action: Action): Messages => {
  switch (action.type) {
    case 'SET_MESSAGES': {
      return { ...action.payload };
    }
    case 'SET_MESSAGE': {
      const { id, locale, message } = action.payload;
      return {
        ...state,
        [id]: {
          ...state[id],
          [locale]: message,
        },
      };
    }
    default:
      return state;
  }
};

// Create the initial state with your messages
const initialState: { messages: Messages; locale?: LocaleId } = {
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
  const [state, dispatch] = useReducer(localeReducer, initialState.messages);
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

  const getMessage = (id: string, locale: LocaleId) => {
    return state[id]?.[locale];
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

  const contextValue: LocaleContextValue = {
    messages: state,
    locale: locale, // Set the locale value from the prop
    getMessage,
    setMessages,
    setMessage,
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      {!loading && children}
    </LocaleContext.Provider>
  );
};
