import type { Author, CommandStep } from '../types';

const inputClass = 'text-input dynamic-input';

function createRemoveButton(onRemove: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'remove-button';
  button.textContent = 'Remover';
  button.setAttribute('aria-label', 'Remover item');
  button.addEventListener('click', onRemove);
  return button;
}

function createError(path: string, id?: string): HTMLParagraphElement {
  const error = document.createElement('p');
  error.className = 'field-error dynamic-error';
  error.dataset.errorFor = path;
  if (id) error.id = `${id}-error`;
  return error;
}

export function renderStringList(
  container: HTMLElement,
  values: string[],
  options: {
    field: string;
    label: string;
    placeholder: string;
    onChange: (index: number, value: string) => void;
    onRemove: (index: number) => void;
  },
): void {
  container.replaceChildren();

  values.forEach((value, index) => {
    const row = document.createElement('div');
    row.className = 'dynamic-row';

    const label = document.createElement('label');
    label.className = 'sr-only';
    label.htmlFor = `${options.field}-${index}`;
    label.textContent = `${options.label} ${index + 1}`;

    const input = document.createElement('input');
    input.id = `${options.field}-${index}`;
    input.type = 'text';
    input.className = inputClass;
    input.placeholder = options.placeholder;
    input.value = value;
    input.dataset.fieldPath = `${options.field}.${index}`;
    input.setAttribute('aria-describedby', `${input.id}-error`);
    input.addEventListener('input', () => options.onChange(index, input.value));

    row.append(label, input, createRemoveButton(() => options.onRemove(index)));
    row.append(createError(`${options.field}.${index}`, input.id));
    container.append(row);
  });
}

export function renderCommandList(
  container: HTMLElement,
  steps: CommandStep[],
  options: {
    field: string;
    label: string;
    onChange: (index: number, key: keyof CommandStep, value: string) => void;
    onRemove: (index: number) => void;
  },
): void {
  container.replaceChildren();

  steps.forEach((step, index) => {
    const row = document.createElement('div');
    row.className = 'dynamic-card';

    const heading = document.createElement('div');
    heading.className = 'dynamic-card-heading';
    const title = document.createElement('span');
    title.className = 'dynamic-card-title';
    title.textContent = `${options.label} ${index + 1}`;
    heading.append(title, createRemoveButton(() => options.onRemove(index)));
    row.append(heading);

    const fields = document.createElement('div');
    fields.className = 'dynamic-card-fields';

    const descriptionField = createLabeledInput(
      `${options.field}-${index}-description`,
      'Descrição',
      step.description,
      `Ex.: Crie um ambiente virtual:`,
      `${options.field}.${index}.description`,
      (value) => options.onChange(index, 'description', value),
    );
    const commandField = createLabeledInput(
      `${options.field}-${index}-command`,
      'Comando',
      step.command,
      'Ex.: python -m venv .venv',
      `${options.field}.${index}.command`,
      (value) => options.onChange(index, 'command', value),
    );
    fields.append(descriptionField, commandField);
    row.append(fields);
    container.append(row);
  });
}

function createLabeledInput(
  id: string,
  labelText: string,
  value: string,
  placeholder: string,
  path: string,
  onChange: (value: string) => void,
): HTMLDivElement {
  const field = document.createElement('div');
  field.className = 'field';

  const label = document.createElement('label');
  label.className = 'field-label';
  label.htmlFor = id;
  label.textContent = labelText;

  const input = document.createElement('input');
  input.id = id;
  input.type = 'text';
  input.className = inputClass;
  input.value = value;
  input.placeholder = placeholder;
  input.dataset.fieldPath = path;
  input.setAttribute('aria-describedby', `${id}-error`);
  input.addEventListener('input', () => onChange(input.value));

  field.append(label, input, createError(path, id));
  return field;
}

export function renderAuthorList(
  container: HTMLElement,
  authors: Author[],
  onChange: (index: number, key: keyof Author, value: string) => void,
  onRemove: (index: number) => void,
): void {
  container.replaceChildren();

  authors.forEach((author, index) => {
    const card = document.createElement('div');
    card.className = 'dynamic-card';

    const heading = document.createElement('div');
    heading.className = 'dynamic-card-heading';
    const title = document.createElement('span');
    title.className = 'dynamic-card-title';
    title.textContent = `Autor ${index + 1}`;
    heading.append(title, createRemoveButton(() => onRemove(index)));
    card.append(heading);

    const fields = document.createElement('div');
    fields.className = 'dynamic-card-fields author-fields';
    fields.append(
      createLabeledInput(
        `author-${index}-name`,
        'Nome de exibição',
        author.name,
        'Ex.: Dr. Ciniro Nametala',
        `authors.${index}.name`,
        (value) => onChange(index, 'name', value),
      ),
      createLabeledInput(
        `author-${index}-github`,
        'Usuário do GitHub',
        author.github,
        'Ex.: ciniro',
        `authors.${index}.github`,
        (value) => onChange(index, 'github', value),
      ),
      createLabeledInput(
        `author-${index}-role`,
        'Cargo / função',
        author.role,
        'Ex.: Professor responsável',
        `authors.${index}.role`,
        (value) => onChange(index, 'role', value),
      ),
    );
    card.append(fields);
    container.append(card);
  });
}
