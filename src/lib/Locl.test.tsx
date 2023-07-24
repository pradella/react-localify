// Reference:
// https://mayashavin.com/articles/test-react-hooks-with-vitest

import { it, expect, describe } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

import { Locl } from './Locl';
import { LocalifyProvider } from './LocalifyContext';
import { useLocalify } from './useLocalify';

const messages = {
  'Hello-world': {
    'en-US': 'Hello, world',
    'pt-BR': 'Olá mundo',
    'es-ES': 'Hola mundo',
  },
  'Create-an-account': {
    'en-US': 'Create an account',
    'pt-BR': 'Criar uma conta',
    'es-ES': 'Crear una cuenta',
  },
  'Choose-a-file-or-drag-it-here_': {
    'en-US': '<strong>Choose a file </strong><span>or drag it here</span>.',
    'pt-BR':
      '<strong>Selecione um arquivo </strong><span>ou arraste ele aqui</span>.',
    'es-ES':
      '<strong>Seleccione un archivo </strong><span>o arrástrelo aquí</span>.',
  },
  'Current-version_-version_-Go-github-repo': {
    'en-US':
      'Current version: [[version]].<!-- --> <a href="https://github.com/pradella/react-localify" target="_blank">Go github repo</a>',
    'pt-BR':
      'Versão atual: [[version]].<!-- --> <a href="https://github.com/pradella/react-localify" target="_blank">Ir para github repo</a>',
  },
  'Course-created-successfully_': {
    'en-US': 'Course created successfully!',
    'pt-BR': 'Curso criado com sucesso!',
    'es-ES': '¡Curso creado con éxito!',
  },
  "Don't-have-a-LMS-yet-Let's-have-a-conversation-with-one-of-ours-especialists-and-meet-the-platform-that-increases-employee-engagement-up-to-4-times_":
    {
      'en-US':
        "Don't have a LMS yet? Let's have a conversation with one of ours especialists and meet the platform that increases employee engagement up to 4 times.",
      'pt-BR':
        'Ainda não tem um LMS? Fale agora com nosso time de especialistas e conheça a plataforma que aumenta em 4x o engajamento dos colaboradores.',
      'es-ES':
        '¿Aún no tienes un LMS? Hable con nuestro equipo de expertos ahora y conozca la plataforma que aumenta el compromiso de los empleados 4 veces.',
    },
  'Upload-your-PowerPoint-file-(or-PDF)_': {
    'en-US': 'Upload your PowerPoint file, PDF or video:',
    'pt-BR': 'Faça o upload do seu arquivo PowerPoint, PDF ou vídeo:',
    'es-ES': 'Sube tu archivo de PowerPoint, PDF o video:',
  },
  'custom-id': {
    'en-US': 'Text from custom id',
    'pt-BR': 'Texto de um id personalizado',
    'es-ES': 'Texto del id personalizado',
  },
};

describe('Locl', () => {
  it('render text', async () => {
    const text = 'Hello, world';
    render(
      <LocalifyProvider messages={messages}>
        <Locl>{text}</Locl>
      </LocalifyProvider>
    );
    expect(screen.getByText(text)).toBeDefined();
  });

  it('render in portuguese', async () => {
    const text = 'Create an account';
    const translated = 'Criar uma conta';
    render(
      <LocalifyProvider messages={messages} locale="pt-BR">
        <Locl>{text}</Locl>
      </LocalifyProvider>
    );
    expect(screen.getByText(translated)).toBeDefined();
  });

  it('render in portuguese with !', async () => {
    const text = 'Course created successfully!';
    const translated = 'Curso criado com sucesso!';
    render(
      <LocalifyProvider messages={messages} locale="pt-BR">
        <Locl>{text}</Locl>
      </LocalifyProvider>
    );
    expect(screen.getByText(translated)).toBeDefined();
  });

  it('render in portuguese with ?', async () => {
    const text = `Don't have a LMS yet? Let's have a conversation with one of ours especialists and meet the platform that increases employee engagement up to 4 times.`;
    const translated = `Ainda não tem um LMS? Fale agora com nosso time de especialistas e conheça a plataforma que aumenta em 4x o engajamento dos colaboradores.`;
    render(
      <LocalifyProvider messages={messages} locale="pt-BR">
        <Locl>{text}</Locl>
      </LocalifyProvider>
    );
    expect(screen.getByText(translated)).toBeDefined();
  });

  it('render in portuguese with :', async () => {
    const text = `Upload your PowerPoint file (or PDF):`;
    const translated = `Faça o upload do seu arquivo PowerPoint, PDF ou vídeo:`;
    render(
      <LocalifyProvider messages={messages} locale="pt-BR">
        <Locl>{text}</Locl>
      </LocalifyProvider>
    );
    expect(screen.getByText(translated)).toBeDefined();
  });

  it('render using label function', async () => {
    const text = 'Create an account';
    const translated = 'Criar uma conta';

    const wrapper = ({ children }: { children: ReactNode }) => (
      <LocalifyProvider messages={messages} locale="pt-BR">
        {children}
      </LocalifyProvider>
    );

    const { result } = renderHook(useLocalify, {
      wrapper: wrapper,
    });
    expect(result.current.locl(text)).toBe(translated);
  });

  it('render in portuguese with SPAN tag', async () => {
    const text = 'Create an account';
    const translated = 'Criar uma conta';
    render(
      <LocalifyProvider messages={messages} locale="pt-BR">
        <Locl>
          <span>{text}</span>
        </Locl>
      </LocalifyProvider>
    );
    expect(screen.getByText(translated)).toBeDefined();
  });

  it('render in portuguese with STRONG and SPAN tags', async () => {
    render(
      <LocalifyProvider messages={messages} locale="pt-BR">
        <div data-testid="with-tag">
          <Locl>
            <strong>Choose a file </strong>
            <span>or drag it here</span>.
          </Locl>
        </div>
      </LocalifyProvider>
    );
    const element = screen.getByTestId('with-tag');
    expect(element.outerHTML).toBe(
      '<div data-testid="with-tag"><strong>Selecione um arquivo </strong><span>ou arraste ele aqui</span>.</div>'
    );
  });

  it('render with custom id', async () => {
    const text = messages['custom-id']['en-US'];
    const translated = messages['custom-id']['pt-BR'];
    render(
      <LocalifyProvider messages={messages} locale="pt-BR">
        <Locl id="custom-id">{text}</Locl>
      </LocalifyProvider>
    );
    expect(screen.getByText(translated)).toBeDefined();
  });

  it('render with vars', async () => {
    render(
      <LocalifyProvider messages={messages} locale="pt-BR">
        <div data-testid="with-vars">
          <Locl vars={{ version: '0.0.7' }}>
            Current version: [[version]].{' '}
            <a href="https://github.com/pradella/react-localify">
              Go github repo
            </a>
          </Locl>
        </div>
      </LocalifyProvider>
    );
    const element = screen.getByTestId('with-vars');
    expect(element.outerHTML).toBe(
      '<div data-testid="with-vars">Versão atual: 0.0.7. <a href="https://github.com/pradella/react-localify">Ir para github repo</a></div>'
    );
  });
});
