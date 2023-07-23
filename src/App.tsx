import './App.css';
import Page from './Page';
import { LocalifyProvider } from './lib/LocalifyContext';

export default function App() {
  return (
    <LocalifyProvider messages="messages.json">
      <Page />
    </LocalifyProvider>
  );
}
