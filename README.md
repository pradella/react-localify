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
import { LocalifyProvider, Locl, locl, useLocalify } from 'react-localify';
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

5. Sometimes, during development, you might use plain text directly in your components, such as error messages or placeholder texts. Localize texts when they are strings or plain texts in your code using the `locl` function:

```jsx
<input placeholder={locl('Enter your name')} />
```

6. Implement a language toggle

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

## Using Variables

To handle dynamic content and personalize your localized text, you can use variables in both the `<Locl>` component and the ` locl` function. The syntax for defining variables is `[[variableName]]`.

### Example with <Locl> Component:

```jsx
const ExampleComponent = () => {
  const PROJECT_NAME = 'My Project';

  return (
    <div>
      <Locl vars={{ projectName: PROJECT_NAME }}>
        Welcome to [[projectName]]
      </Locl>
    </div>
  );
};
```

In the above example, we used the vars prop in the `<Locl>` component to pass the `PROJECT_NAME`variable. The variable is then referenced in the text as `[[projectName]]`.

### Example with locl Function:

```jsx
const AnotherComponent = () => {
  const PROJECT_NAME = 'My Project';

  return (
    <div>
      <button
        onClick={() =>
          locl(`Welcome to [[projectName]]`, {
            vars: { projectName: PROJECT_NAME },
          })
        }
      >
        Click me
      </button>
    </div>
  );
};
```

In this case, we used the locl function directly in the `onClick` event of a button. The variable `PROJECT_NAME` is passed as part of the vars object and referenced in the text as `[[projectName]]`.

By utilizing variables, you can easily adapt your localized text to include dynamic content and make your app feel more personalized to users.

## Retrieve non-localized texts

When using the `<Locl>` component or the `locl` function, these texts are automatically added to the localization system with a slugified key.

To retrieve all the pending texts that need to be localized, you can call the `getMergedMessages` function. This function will print on the console the updated `messages` object, which contains all the localized messages and any untracked messages that need to be translated.

Here's an example of how to use `getMergedMessages` in your code:

```jsx
const UntrackedMessages = () => {
  // Call getMergedMessages to get all untracked messages
  const { getMergedMessages } = useLocalify();

  return (
    // Your component JSX
    <button onClick={() => console.log(getMergedMessages())}>
      Show non-localized texts on console
    </button>
  );
};
```

After running your application and interacting with it, you can check the console output to see the list of untracked messages. Make sure to add these messages to your messages object to ensure complete app localization.

## Contribute

We welcome contributions from the community! If you find a bug, have a feature request, or want to improve the library, please open an issue or submit a pull request on our GitHub repository.

## License

This project is licensed under the MIT License.
