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
  'Only-the-first-dollar10-slides-were-converted_': {
    'en-US':
      'Only the first [[ANONYMOUS_MAX_SLIDE_CONVERSION]] slides were converted. ',
    'pt-BR':
      'Apenas os primeiros [[ANONYMOUS_MAX_SLIDE_CONVERSION]] slides foram convertidos. ',
    'es-ES':
      'Solo se convirtieron las primeras [[ANONYMOUS_MAX_SLIDE_CONVERSION]] diapositivas. ',
  },
  'Your-trial-will-expire-in-DAYS_LEFT-day(s)_-Upgrade-now-to-Pro': {
    'en-US':
      'Your trial will expire in [[DAYS_LEFT]] day(s). <a href="/#/pricing">Upgrade now to Pro</a>',
    'pt-BR':
      'Seu trial irá expirar em [[DAYS_LEFT]] dia(s). <a href="/#/pricing">Mude para o Pro agora</a>',
    'es-ES':
      'Tu trial vencerá en [[DAYS_LEFT]] día(s). <a href="/#/pricing">Cambiar a Pro ahora</a>',
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
    expect(result.current.getMessage(text)).toBe(translated);
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

  // it('render in portuguese with global wildcard', async () => {
  //   const ANONYMOUS_MAX_SLIDE_CONVERSION = 10;
  //   render(
  //     <LabelProvider
  //       labels={labels}
  //       language="pt-BR"
  //       wildcards={{
  //         '[[ANONYMOUS_MAX_SLIDE_CONVERSION]]': ANONYMOUS_MAX_SLIDE_CONVERSION,
  //       }}
  //     >
  //       <div data-testid="with-global-wildcard">
  //         <Label>
  //           Only the first ${ANONYMOUS_MAX_SLIDE_CONVERSION} slides were
  //           converted.{' '}
  //         </Label>
  //       </div>
  //     </LabelProvider>
  //   );
  //   const element = screen.getByTestId('with-global-wildcard');
  //   expect(element).toContainHTML(
  //     '<div data-testid="with-global-wildcard">Apenas os primeiros 10 slides foram convertidos. </div>'
  //   );
  // });

  // it('render in portuguese with props wildcard', async () => {
  //   render(
  //     <LabelProvider labels={labels} language="pt-BR">
  //       <div data-testid="with-props-wildcard">
  //         <Label wildcards={{ '[[DAYS_LEFT]]': 3 }}>
  //           Your trial will expire in [[DAYS_LEFT]] day(s).{' '}
  //           <a href="/#/pricing">Upgrade now to Pro</a>
  //         </Label>
  //       </div>
  //     </LabelProvider>
  //   );
  //   const element = screen.getByTestId('with-props-wildcard');
  //   expect(element).toContainHTML(
  //     '<div data-testid="with-props-wildcard">Seu trial irá expirar em 3 dia(s). <a href="/#/pricing">Mude para o Pro agora</a></div>'
  //   );
  // });
});
