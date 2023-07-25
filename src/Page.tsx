import './Page.css';

export default function Page() {
  return (
    <main id="page">
      <span className="outline">Introducing React Localify</span>
      <h1>The Definitive Library for Effortless App Localization</h1>
      <p>
        Say goodbye to message ids and embrace simplicity with React Localify
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

      <small className="created-by">
        <span>Created by</span>
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
