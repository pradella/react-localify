import './App.css';
import Page from './Page';
import { LocalifyProvider } from './lib/LocalifyContext';
import messages from './messages.json';

export default function App() {
  return (
    <LocalifyProvider
      messages={messages}
      persistLocaleChange={true}
      debug={import.meta.env.DEV}
    >
      <Page />
    </LocalifyProvider>
  );
}
