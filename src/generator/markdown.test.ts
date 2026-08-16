import { describe, expect, it } from 'vitest';
import { EXAMPLE_PROJECT } from '../example';
import type { ProjectData } from '../types';
import { generateAuthorsTable, generateReadme } from './markdown';

function makeProject(overrides: Partial<ProjectData> = {}): ProjectData {
  return {
    ...EXAMPLE_PROJECT,
    ...overrides,
    objectives: overrides.objectives ?? ['Objetivo principal'],
    technologies: overrides.technologies ?? ['TypeScript'],
    installSteps: overrides.installSteps ?? [],
    executionSteps: overrides.executionSteps ?? [
      { description: 'Execute o projeto:', command: 'npm run dev' },
    ],
    authors: overrides.authors ?? [
      { name: 'Pessoa Teste', github: 'pessoa-teste', role: 'Desenvolvedor' },
    ],
  };
}

describe('generateReadme', () => {
  it('omite Funcionamento quando a opção está desativada', () => {
    const readme = generateReadme(
      makeProject({ includeFunctioning: false, functioningIntro: 'Não deve aparecer.' }),
    );
    expect(readme).not.toContain('## Funcionamento');
  });

  it('omite Objetivos quando a lista está vazia ou só contém espaços', () => {
    const readme = generateReadme(makeProject({ objectives: ['  ', ''] }));
    expect(readme).not.toContain('## Objetivos');
  });

  it('gera blocos bash para instalação e execução', () => {
    const readme = generateReadme(
      makeProject({
        installSteps: [{ description: 'Instale dependências:', command: 'npm install' }],
        executionSteps: [{ description: 'Inicie:', command: 'npm run dev' }],
        usesEnv: true,
      }),
    );
    expect(readme).toContain('git clone git@github.com:gpsiscomifmg/scraper-agronews.git');
    expect(readme).toContain('```bash\nnpm install\n```');
    expect(readme).toContain('```bash\nnpm run dev\n```');
    expect(readme).toContain('cp .env.example .env');
  });

  it('mantém Autores como última seção', () => {
    const readme = generateReadme(makeProject());
    expect(readme.lastIndexOf('## Autores')).toBeGreaterThan(readme.lastIndexOf('## Execução'));
    expect(readme.trim().endsWith('</table>')).toBe(true);
  });

  it('limita a tabela a quatro autores por linha', () => {
    const authors = Array.from({ length: 5 }, (_, index) => ({
      name: `Pessoa ${index + 1}`,
      github: `pessoa-${index + 1}`,
      role: 'Pesquisador',
    }));
    const table = generateAuthorsTable(authors);
    expect((table.match(/<tr>/g) ?? []).length).toBe(2);
  });

  it('escapa conteúdo dos autores antes de gerar HTML', () => {
    const table = generateAuthorsTable([
      { name: '<script>alert(1)</script>', github: 'teste', role: 'R&D <lead>' },
    ]);
    expect(table).not.toContain('<script>');
    expect(table).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(table).toContain('R&amp;D &lt;lead&gt;');
  });

  it('gera um README equivalente ao exemplo Scraper - AgroNews', () => {
    const readme = generateReadme(EXAMPLE_PROJECT);
    expect(readme).toContain('# Scraper - AgroNews');
    expect(readme).toContain('## Funcionamento');
    expect(readme).toContain('Cadastrar fonte\n      ↓\nIdentificar links de notícias');
    expect(readme).toContain('## Autores');
    expect(readme).toContain('https://github.com/ciniro.png');
  });
});
