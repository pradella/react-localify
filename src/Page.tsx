import './Page.css';
import { Locl, useLocalify } from './lib';

export default function Page() {
  const { setLocale, getAvailableLanguages } = useLocalify();

  const languages = getAvailableLanguages();

  return (
    <main id="page">
      <span className="outline">
        <Locl>Introducing React Localify</Locl>
      </span>
      <h1>
        <Locl>The Definitive Library for Effortless App Localization</Locl>
      </h1>
      <p>
        <Locl>Make localization easier for all developers.</Locl> <br />
        <Locl>
          Say goodbye to message ids and embrace simplicity with React Localify
        </Locl>
      </p>

      <pre>
        <code>npm install react-localify</code>
      </pre>

      <p>
        <small>
          <a href="https://github.com/pradella/react-localify" target="blank">
            GitHub
          </a>{' '}
          •{' '}
          <a href="https://www.npmjs.com/package/react-localify" target="blank">
            NPM
          </a>
        </small>
      </p>

      <hr />

      <h3>
        <Locl>See in action</Locl>:
      </h3>

      <select onChange={(e) => setLocale(e.currentTarget.value)}>
        {languages.map((lang) => (
          <option key={lang.locale} value={lang.locale}>
            {lang.language}
          </option>
        ))}
      </select>

      <hr />

      <small className="created-by">
        <span>
          <Locl>Created by</Locl>
        </span>
        <a href="https://twitter.com/pradella" target="_blank">
          <img
            alt=""
            src="https://lh3.googleusercontent.com/a/AAcHTtdz4dGoWzQneSROkeQS9B8SPwPk1kK48mPiuEvU5A=s96-c"
            width="26"
            height="26"
            decoding="async"
            data-nimg="1"
            loading="lazy"
            style={{ color: 'transparent' }}
          ></img>
          <span>Maurício Pradella</span>
        </a>
      </small>
    </main>
  );
}
