import { renderAuthorList, renderCommandList, renderStringList } from './dynamic-list';
import { createEmptyProject } from '../state';
import { slugify } from '../generator/slug';
import type { Author, CommandStep, ProjectData, ValidationError } from '../types';

export interface FormController {
  getData(): ProjectData;
  setData(data: ProjectData, repositoryAuto: boolean): void;
  setErrors(errors: ValidationError[]): void;
}

type TextKey =
  | 'projectName'
  | 'repositoryName'
  | 'shortDescription'
  | 'about'
  | 'functioningIntro'
  | 'functioningOutro'
  | 'executionOutro'
  | 'executionUrl';

function elementById<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Elemento obrigatório não encontrado: #${id}`);
  return element as T;
}

function cloneData(data: ProjectData): ProjectData {
  return JSON.parse(JSON.stringify(data)) as ProjectData;
}

export function initializeForm(
  onChange: (data: ProjectData, repositoryAuto: boolean) => void,
  initialData: ProjectData,
  initialRepositoryAuto: boolean,
): FormController {
  let data = cloneData(initialData);
  let repositoryAuto = initialRepositoryAuto;

  const textInputs: Record<TextKey, HTMLInputElement | HTMLTextAreaElement> = {
    projectName: elementById('project-name'),
    repositoryName: elementById('repository-name'),
    shortDescription: elementById('short-description'),
    about: elementById('about'),
    functioningIntro: elementById('functioning-intro'),
    functioningOutro: elementById('functioning-outro'),
    executionOutro: elementById('execution-outro'),
    executionUrl: elementById('execution-url'),
  };
  const includeFunctioning = elementById<HTMLInputElement>('include-functioning');
  const usesEnv = elementById<HTMLInputElement>('uses-env');
  const functioningFields = elementById('functioning-fields');

  const emit = (): void => onChange(cloneData(data), repositoryAuto);

  (Object.keys(textInputs) as TextKey[]).forEach((key) => {
    const input = textInputs[key];
    input.addEventListener('input', () => {
      data[key] = input.value;
      if (key === 'projectName' && repositoryAuto) {
        data.repositoryName = slugify(input.value);
        textInputs.repositoryName.value = data.repositoryName;
      }
      if (key === 'repositoryName') repositoryAuto = false;
      emit();
    });
  });

  includeFunctioning.addEventListener('change', () => {
    data.includeFunctioning = includeFunctioning.checked;
    updateOptionalVisibility();
    emit();
  });

  usesEnv.addEventListener('change', () => {
    data.usesEnv = usesEnv.checked;
    emit();
  });

  const objectivesList = elementById('objectives-list');
  const technologiesList = elementById('technologies-list');
  const functioningStepsList = elementById('functioning-steps-list');
  const installStepsList = elementById('install-steps-list');
  const executionStepsList = elementById('execution-steps-list');
  const authorsList = elementById('authors-list');

  function renderLists(): void {
    renderStringList(objectivesList, data.objectives, {
      field: 'objectives',
      label: 'Objetivo',
      placeholder: 'Ex.: Automatizar a coleta de notícias.',
      onChange: (index, value) => {
        data.objectives[index] = value;
        emit();
      },
      onRemove: (index) => {
        data.objectives.splice(index, 1);
        renderLists();
        emit();
      },
    });

    renderStringList(technologiesList, data.technologies, {
      field: 'technologies',
      label: 'Tecnologia',
      placeholder: 'Ex.: Python',
      onChange: (index, value) => {
        data.technologies[index] = value;
        emit();
      },
      onRemove: (index) => {
        data.technologies.splice(index, 1);
        renderLists();
        emit();
      },
    });

    renderStringList(functioningStepsList, data.functioningSteps, {
      field: 'functioningSteps',
      label: 'Etapa',
      placeholder: 'Ex.: Cadastrar fonte',
      onChange: (index, value) => {
        data.functioningSteps[index] = value;
        emit();
      },
      onRemove: (index) => {
        data.functioningSteps.splice(index, 1);
        renderLists();
        emit();
      },
    });

    renderCommandList(installStepsList, data.installSteps, {
      field: 'installSteps',
      label: 'Passo de instalação',
      onChange: (index, key, value) => {
        const step = data.installSteps[index];
        if (step) step[key] = value;
        emit();
      },
      onRemove: (index) => {
        data.installSteps.splice(index, 1);
        renderLists();
        emit();
      },
    });

    renderCommandList(executionStepsList, data.executionSteps, {
      field: 'executionSteps',
      label: 'Passo de execução',
      onChange: (index, key, value) => {
        const step = data.executionSteps[index];
        if (step) step[key] = value;
        emit();
      },
      onRemove: (index) => {
        data.executionSteps.splice(index, 1);
        renderLists();
        emit();
      },
    });

    renderAuthorList(
      authorsList,
      data.authors,
      (index, key, value) => {
        const author = data.authors[index];
        if (author) author[key] = value;
        emit();
      },
      (index) => {
        data.authors.splice(index, 1);
        renderLists();
        emit();
      },
    );
  }

  function bindAddButton(id: string, callback: () => void): void {
    elementById<HTMLButtonElement>(id).addEventListener('click', callback);
  }

  bindAddButton('add-objective', () => {
    data.objectives.push('');
    renderLists();
    emit();
  });
  bindAddButton('add-technology', () => {
    data.technologies.push('');
    renderLists();
    emit();
  });
  bindAddButton('add-functioning-step', () => {
    data.functioningSteps.push('');
    renderLists();
    emit();
  });
  bindAddButton('add-install-step', () => {
    data.installSteps.push({ description: '', command: '' });
    renderLists();
    emit();
  });
  bindAddButton('add-execution-step', () => {
    data.executionSteps.push({ description: '', command: '' });
    renderLists();
    emit();
  });
  bindAddButton('add-author', () => {
    data.authors.push({ name: '', github: '', role: '' });
    renderLists();
    emit();
  });

  function updateOptionalVisibility(): void {
    functioningFields.classList.toggle('hidden', !data.includeFunctioning);
  }

  function setData(nextData: ProjectData, nextRepositoryAuto: boolean): void {
    data = cloneData(nextData);
    repositoryAuto = nextRepositoryAuto;
    (Object.keys(textInputs) as TextKey[]).forEach((key) => {
      textInputs[key].value = data[key];
    });
    includeFunctioning.checked = data.includeFunctioning;
    usesEnv.checked = data.usesEnv;
    updateOptionalVisibility();
    renderLists();
    emit();
  }

  function setErrors(errors: ValidationError[]): void {
    const allErrorElements = document.querySelectorAll<HTMLElement>('[data-error-for]');
    allErrorElements.forEach((element) => {
      element.textContent = '';
      element.classList.add('hidden');
    });

    document.querySelectorAll<HTMLElement>('[data-field-path]').forEach((element) => {
      element.removeAttribute('aria-invalid');
    });

    const summary = elementById('validation-summary');
    summary.replaceChildren();
    if (errors.length === 0) {
      summary.classList.add('hidden');
    } else {
      summary.classList.remove('hidden');
      const title = document.createElement('p');
      title.className = 'validation-title';
      title.textContent = 'Revise os campos abaixo antes de copiar ou baixar:';
      const list = document.createElement('ul');
      errors.forEach((error) => {
        const item = document.createElement('li');
        item.textContent = error.message;
        list.append(item);

        const errorElement = document.querySelector<HTMLElement>(
          `[data-error-for="${CSS.escape(error.path)}"]`,
        );
        if (errorElement) {
          errorElement.textContent = error.message;
          errorElement.classList.remove('hidden');
        }

        const field = document.querySelector<HTMLElement>(
          `[data-field-path="${CSS.escape(error.path)}"]`,
        );
        field?.setAttribute('aria-invalid', 'true');
      });
      summary.append(title, list);
    }
  }

  (Object.keys(textInputs) as TextKey[]).forEach((key) => {
    textInputs[key].value = data[key];
  });
  includeFunctioning.checked = data.includeFunctioning;
  usesEnv.checked = data.usesEnv;
  updateOptionalVisibility();
  renderLists();

  return { getData: () => cloneData(data), setData, setErrors };
}

export function getDefaultFormData(): ProjectData {
  return createEmptyProject();
}

export function createEmptyCommandStep(): CommandStep {
  return { description: '', command: '' };
}

export function createEmptyAuthor(): Author {
  return { name: '', github: '', role: '' };
}
