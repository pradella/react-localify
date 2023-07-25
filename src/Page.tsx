import { Locl } from './lib/Locl';
import { useLocalify } from './lib/useLocalify';
import { version } from '../package.json';

export default function Page() {
  const { setLocale, locale, getAvailableLanguages } = useLocalify();

  return (
    <div>
      <h1>
        <Locl>Hello, world</Locl>
      </h1>
      <button onClick={() => setLocale('en-US')} disabled={locale === 'en-US'}>
        English
      </button>
      <button onClick={() => setLocale('pt-BR')} disabled={locale === 'pt-BR'}>
        Portuguese
      </button>
      <h3>{locale}</h3>
      <p>
        <Locl>This is the lorem-ipsun paragraph.</Locl>
      </p>
      <button onClick={() => console.log(getAvailableLanguages())}>
        Get available languages
      </button>
      <p>
        <small>
          <Locl vars={{ version }}>
            Current version: [[version]].{' '}
            <a href="https://github.com/pradella/react-localify">
              Go github repo
            </a>
          </Locl>
        </small>
      </p>
    </div>
  );
}
