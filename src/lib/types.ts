export type LocaleId =
  | 'en-US'
  | 'zh-CN'
  | 'es-ES'
  | 'pt-BR'
  | 'ru-RU'
  | 'ja-JP'
  | 'de-DE'
  | 'fr-FR'
  | 'hi-IN' // Hindi
  | 'ar-SA' // Arabic
  | 'it-IT'
  | 'pl-PL' // Polish
  | 'nl-NL' // Dutch
  | string;

export type Languages = { [locale in LocaleId]: Language };

export type Language = {
  locale: LocaleId;
  language: string;
  region: string;
  languageLocalized: string;
  regionLocalized: string;
};

export type Messages = {
  [key: string]: Message;
};

export type Message = {
  [locale: string]: string;
};
