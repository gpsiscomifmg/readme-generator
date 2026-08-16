import type { Author, CommandStep, ProjectData } from '../types';

function trim(value: string): string {
  return value.trim();
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character] ?? character;
  });
}

function usernamePath(username: string): string {
  return encodeURIComponent(trim(username));
}

function renderCommandStep(step: CommandStep): string {
  return [
    trim(step.description),
    '',
    '```bash',
    trim(step.command),
    '```',
  ].join('\n');
}

function renderCommandSteps(steps: CommandStep[]): string {
  return steps
    .filter((step) => trim(step.description) || trim(step.command))
    .map(renderCommandStep)
    .join('\n\n');
}

function renderFlow(steps: string[]): string {
  const cleanSteps = steps.map(trim).filter(Boolean);
  if (cleanSteps.length === 0) return '';

  return ['```text', cleanSteps.join('\n      ↓\n'), '```'].join('\n');
}

export function generateAuthorsTable(authors: Author[]): string {
  const completeAuthors = authors.filter(
    (author) => trim(author.name) && trim(author.github) && trim(author.role),
  );
  const rows: string[] = [];

  for (let index = 0; index < completeAuthors.length; index += 4) {
    const group = completeAuthors.slice(index, index + 4);
    const cells = group.map((author) => {
      const name = escapeHtml(trim(author.name));
      const username = usernamePath(author.github);
      const role = escapeHtml(trim(author.role));

      return [
        '<td align="center">',
        `  <a href="https://github.com/${username}">`,
        '    <img',
        `      src="https://github.com/${username}.png"`,
        '      width="100px"',
        `      alt="Foto de perfil de ${name}"`,
        '    /><br>',
        `    <sub><b>${name}</b></sub>`,
        '  </a>',
        '  <br>',
        `  <sub>${role}</sub>`,
        '</td>',
      ].join('\n');
    });

    rows.push(['<tr>', cells.map((cell) => `  ${cell.replace(/\n/g, '\n  ')}`).join('\n'), '</tr>'].join('\n'));
  }

  return ['<table>', rows.join('\n'), '</table>'].join('\n');
}

export function generateAuthorsSection(authors: Author[]): string {
  return ['## Autores', '', generateAuthorsTable(authors)].join('\n');
}

function generateInstallation(project: ProjectData): string {
  const repository = trim(project.repositoryName);
  const parts = [
    [
      'Clone o repositório:',
      '',
      '```bash',
      `git clone git@github.com:gpsiscomifmg/${repository}.git`,
      '```',
      '',
      'Acesse o diretório:',
      '',
      '```bash',
      `cd ${repository}`,
      '```',
    ].join('\n'),
  ];

  const additionalSteps = renderCommandSteps(project.installSteps);
  if (additionalSteps) parts.push(additionalSteps);

  if (project.usesEnv) {
    parts.push(
      [
        'Caso o projeto utilize variáveis de ambiente, copie o arquivo de exemplo:',
        '',
        '```bash',
        'cp .env.example .env',
        '```',
        '',
        'Configure, então, as variáveis necessárias no arquivo `.env`.',
      ].join('\n'),
    );
  }

  return parts.join('\n\n');
}

function generateExecution(project: ProjectData): string {
  const parts: string[] = [];
  const steps = renderCommandSteps(project.executionSteps);
  if (steps) parts.push(steps);
  if (trim(project.executionOutro)) parts.push(trim(project.executionOutro));
  if (trim(project.executionUrl)) {
    parts.push(['```text', trim(project.executionUrl), '```'].join('\n'));
  }
  return parts.join('\n\n');
}

function generateFunctioning(project: ProjectData): string {
  const parts: string[] = [];
  if (trim(project.functioningIntro)) parts.push(trim(project.functioningIntro));
  const flow = renderFlow(project.functioningSteps);
  if (flow) parts.push(flow);
  if (trim(project.functioningOutro)) parts.push(trim(project.functioningOutro));
  return ['## Funcionamento', '', parts.join('\n\n')].join('\n');
}

export function generateReadme(project: ProjectData): string {
  const sections = [
    `# ${trim(project.projectName)}`,
    [
      trim(project.shortDescription),
      '',
      '> Projeto desenvolvido no âmbito do **GPSisCom — Grupo de Pesquisa em Sistemas Computacionais**.',
    ].join('\n'),
    '---',
    ['## Sobre o projeto', '', trim(project.about)].join('\n'),
    [
      '## Objetivos',
      '',
      project.objectives
        .map(trim)
        .filter(Boolean)
        .map((objective) => `* ${objective}`)
        .join('\n'),
    ].join('\n'),
    ...(project.includeFunctioning ? [generateFunctioning(project)] : []),
    [
      '## Tecnologias',
      '',
      project.technologies
        .map(trim)
        .filter(Boolean)
        .map((technology) => `* ${technology}`)
        .join('\n'),
    ].join('\n'),
    ['## Instalação', '', generateInstallation(project)].join('\n'),
    ['## Execução', '', generateExecution(project)].join('\n'),
    '---',
    generateAuthorsSection(project.authors),
  ];

  return `${sections.join('\n\n').trim()}\n`;
}
