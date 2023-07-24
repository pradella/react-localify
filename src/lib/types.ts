export type LocaleId =
  | 'en-US'
  | 'zh-CN'
  | 'es-ES'
  | 'pt-BR'
  | 'ru-RU'
  | 'ja-JP'
  | 'de-DE'
  | 'fr-FR'
  | 'hi-IN'
  | 'ar-SA'
  | 'it-IT'
  | string;

export type Languages = { [locale in LocaleId]: Language };

export type Language = {
  locale: LocaleId;
  language: string;
  region: string;
};

export type Messages = {
  [key: string]: Message;
};

export type Message = {
  [locale: string]: string;
};
