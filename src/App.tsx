import './App.css';
import Page from './Page';
import { LocaleContextProvider } from './lib/LocaleContext';

export default function App() {
  return (
    <LocaleContextProvider messages="./src/data/messages.json">
      <Page />
    </LocaleContextProvider>
  );
}
