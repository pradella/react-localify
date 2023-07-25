# React Localify: Effortless App Localization for React

[![npm version](https://badge.fury.io/js/react-localify.svg)](https://badge.fury.io/js/react-localify)

## Overview

react-localify is a lightweight and user-friendly React library for effortless app localization. Simplify your localization workflow without the need for message IDs. It provides a straightforward approach to make your React applications accessible to global audiences by supporting multiple languages with ease.

## Features

- Easy installation with npm: `npm install react-localify`
- Effortless configuration and setup
- Support for multiple languages out of the box
- Simple API for language toggling

## Installation

To start using react-localify in your React project, simply run the following npm command:

```bash
npm install react-localify
```

## Get Started

1. Import the necessary components into your app:

```jsx
import { LocalifyProvider, Locl, useLocalify } from 'react-localify';
```

2. Set up your messages for different languages

```jsx
const messages = {
  'Hello-world': {
    'en-US': 'Hello, world',
    'pt-BR': 'Olá, mundo',
  },
  Goodbye: {
    'en-US': 'Goodbye',
    'pt-BR': 'Adeus',
  },
};
```

3. Wrap your app with the LocalifyProvider and pass the messages prop:

```jsx
const App = () => {
  return (
    <LocalifyProvider messages={messages}>
      {/* Your app components */}
    </LocalifyProvider>
  );
};
```

4. Use the <Locl> component to localize your text:

```jsx
const ExampleComponent = () => {
  return (
    <div>
      <Locl>Hello, world</Locl>
    </div>
  );
};
```

5. Implement a language toggle

```jsx
const LanguageToggle = () => {
  const { setLocale } = useLocalify();

  const handleLanguageChange = (locale) => {
    setLocale(locale);
  };

  return (
    <div>
      <button onClick={() => handleLanguageChange('en-US')}>English</button>
      <button onClick={() => handleLanguageChange('pt-BR')}>Portuguese</button>
      {/* Add more language options as needed */}
    </div>
  );
};
```

## Contribute

We welcome contributions from the community! If you find a bug, have a feature request, or want to improve the library, please open an issue or submit a pull request on our GitHub repository.

## License

This project is licensed under the MIT License.
