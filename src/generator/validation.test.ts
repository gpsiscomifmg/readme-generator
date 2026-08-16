import { describe, expect, it } from 'vitest';
import { EXAMPLE_PROJECT } from '../example';
import { validateProject } from './validation';

describe('validateProject', () => {
  it('exige os campos mínimos do README', () => {
    const errors = validateProject({
      ...EXAMPLE_PROJECT,
      projectName: '',
      repositoryName: 'Nome inválido',
      shortDescription: '',
      about: '',
      objectives: [''],
      technologies: [''],
      executionSteps: [{ description: '', command: '' }],
      authors: [{ name: '', github: '', role: '' }],
    });

    const messages = errors.map((error) => error.message);
    expect(messages).toContain('Informe o nome de exibição do projeto.');
    expect(messages).toContain('O nome do repositório deve usar apenas letras minúsculas, números e hífens.');
    expect(messages).toContain('Adicione pelo menos um objetivo.');
    expect(messages).toContain('Adicione pelo menos uma tecnologia.');
    expect(messages).toContain('Adicione pelo menos um passo completo de execução.');
    expect(messages).toContain('Adicione pelo menos um autor completo.');
  });

  it('aceita o exemplo completo', () => {
    expect(validateProject(EXAMPLE_PROJECT)).toEqual([]);
  });
});
