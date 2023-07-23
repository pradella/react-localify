import Locale from './lib/Locale';

export default function Page() {
  return (
    <div>
      <h1>
        <Locale>Hello, world</Locale>
      </h1>
      <button>en-US</button>
      <button>pt-BR</button>
    </div>
  );
}
