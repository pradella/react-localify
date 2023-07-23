import Locale from './lib/Locale';
import { useLocale } from './lib/useLocale';

export default function Page() {
  const { setLocale, locale } = useLocale();

  return (
    <div>
      <h1>
        <Locale>Hello, world</Locale>
      </h1>
      <button onClick={() => setLocale('en-US')} disabled={locale === 'en-US'}>
        English
      </button>
      <button onClick={() => setLocale('pt-BR')} disabled={locale === 'pt-BR'}>
        Portuguese
      </button>
      <h3>
        <Locale>Headline comes here</Locale>
      </h3>
      <p>
        <Locale>This is the lorem-ipsun paragraph.</Locale>
      </p>
    </div>
  );
}
