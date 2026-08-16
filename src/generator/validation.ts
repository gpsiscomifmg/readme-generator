import { isValidRepositoryName } from './slug';
import type { ProjectData, ValidationError } from '../types';

const required = (value: string): boolean => value.trim().length > 0;

export function validateProject(project: ProjectData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!required(project.projectName)) {
    errors.push({ path: 'projectName', message: 'Informe o nome de exibição do projeto.' });
  }

  if (!required(project.repositoryName)) {
    errors.push({ path: 'repositoryName', message: 'Informe o nome do repositório.' });
  } else if (!isValidRepositoryName(project.repositoryName.trim())) {
    errors.push({
      path: 'repositoryName',
      message: 'O nome do repositório deve usar apenas letras minúsculas, números e hífens.',
    });
  }

  if (!required(project.shortDescription)) {
    errors.push({ path: 'shortDescription', message: 'Informe uma descrição curta do projeto.' });
  }

  if (!required(project.about)) {
    errors.push({ path: 'about', message: 'Explique o contexto e a proposta do projeto.' });
  }

  validateStringList(
    project.technologies,
    'technologies',
    'Adicione pelo menos uma tecnologia.',
    'Preencha esta tecnologia ou remova a linha.',
    errors,
  );

  validateCommandList(project.installSteps, 'installSteps', errors, false);
  validateCommandList(project.executionSteps, 'executionSteps', errors, true);

  if (project.includeFunctioning) {
    validateStringList(
      project.functioningSteps,
      'functioningSteps',
      '',
      'Preencha esta etapa ou remova a linha.',
      errors,
    );
  }

  const completeAuthors = project.authors.filter(
    (author) => required(author.name) && required(author.github) && required(author.role),
  );

  if (completeAuthors.length === 0) {
    errors.push({ path: 'authors', message: 'Adicione pelo menos um autor completo.' });
  }

  project.authors.forEach((author, index) => {
    const isBlank = !required(author.name) && !required(author.github) && !required(author.role);
    if (isBlank && project.authors.length === 1) return;

    if (isBlank) return;
    if (!required(author.name)) {
      errors.push({ path: `authors.${index}.name`, message: 'Informe o nome do autor.' });
    }
    if (!required(author.github)) {
      errors.push({ path: `authors.${index}.github`, message: 'Informe o usuário do GitHub.' });
    }
    if (!required(author.role)) {
      errors.push({ path: `authors.${index}.role`, message: 'Informe a função do autor.' });
    }
  });

  return errors;
}

function validateStringList(
  values: string[],
  path: string,
  missingMessage: string,
  blankMessage: string,
  errors: ValidationError[],
): void {
  const nonEmptyValues = values.filter(required);
  if (missingMessage && nonEmptyValues.length === 0) {
    errors.push({ path, message: missingMessage });
  }

  values.forEach((value, index) => {
    if (value.length > 0 && !required(value)) {
      errors.push({ path: `${path}.${index}`, message: blankMessage });
    }
  });
}

function validateCommandList(
  steps: ProjectData['installSteps'],
  path: string,
  errors: ValidationError[],
  isRequired: boolean,
): void {
  const completeSteps = steps.filter(
    (step) => required(step.description) && required(step.command),
  );
  if (isRequired && completeSteps.length === 0) {
    errors.push({ path, message: 'Adicione pelo menos um passo completo de execução.' });
  }

  steps.forEach((step, index) => {
    const isBlank = !required(step.description) && !required(step.command);
    if (isBlank) return;

    if (!required(step.description)) {
      errors.push({ path: `${path}.${index}.description`, message: 'Informe a descrição do passo.' });
    }
    if (!required(step.command)) {
      errors.push({ path: `${path}.${index}.command`, message: 'Informe o comando do passo.' });
    }
  });
}
