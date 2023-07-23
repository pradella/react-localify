import { ReactNode } from 'react';
import slugify from 'slugify';
import _ from 'lodash';

export function convertMessageToKey(
  text: string | ReactNode
): string | ReactNode {
  function replaceAll(text: string, search: string, replace: string): string {
    return text.split(search).join(replace);
  }

  function sanitizeKey(text: string): string {
    //const options = { remove: /[*+~.()'"!:@<>]/g, strict: true };
    const options = {};

    text = text.replace(/<\/?[^>]+(>|$)/g, ''); // remove html tags
    text = slugify(text, options);
    text = replaceAll(text, '"', ''); // remove "
    text = replaceAll(text, '.', '_'); // replace . for _
    text = replaceAll(text, ':', '_'); // replace : for _
    text = replaceAll(text, '!', '_'); // replace ! for _
    text = replaceAll(text, '?', '_'); // replace ? for _
    return text;
  }

  try {
    return sanitizeKey(text as string);
  } catch (err) {
    // goes here if probably has JSX code
    try {
      const convertedText = jsxToString(text);
      return sanitizeKey(convertedText);
    } catch (err) {
      return text;
    }
  }
}

function jsxToString(jsx: unknown): string {
  const string = _.map(Array.isArray(jsx) ? jsx : [jsx], (el) => {
    return el?.type && el?.props?.children
      ? `<${typeToTag(el.type, el?.props)}>${jsxToString(
          el.props.children
        )}</${typeToTag(el.type)}>`
      : el;
  });
  return string.join('');

  function typeToTag(type: unknown, props?: { [key: string]: unknown }) {
    function propsToAttr(props: { [key: string]: unknown }) {
      const keys = _.filter(_.keys(props), (key) => key !== 'children');
      return _.map(keys, (key) => `${key}="${props[key]}"`).join(' ');
    }
    const tags = ['span', 'strong', 'div', 'a'];
    return tags.includes(type as string)
      ? `${type} ${props ? propsToAttr(props) : ''}`
      : '';
  }
}
