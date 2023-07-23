import Locale from './lib/Locale';
import { useLocale } from './lib/useLocale';

export default function Page() {
  const { setLocale, locale } = useLocale();

  console.log({ locale });

  return (
    <div>
      <h1>
        <Locale>Hello, world</Locale>
      </h1>
      <button onClick={() => setLocale('en-US')} disabled={locale === 'en-US'}>
        en-US
      </button>
      <button onClick={() => setLocale('pt-BR')} disabled={locale === 'pt-BR'}>
        pt-BR
      </button>
    </div>
  );
}
