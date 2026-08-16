import './style.css';
import { getExampleProject } from './example';
import { generateReadme } from './generator/markdown';
import { validateProject } from './generator/validation';
import { clearDraft, createEmptyProject, loadDraft, saveDraft } from './state';
import { initializeForm, type FormController } from './ui/form';
import { initializePreview } from './ui/preview';
import type { ProjectData, ValidationError } from './types';

let form: FormController;
let currentData: ProjectData;
let currentErrors: ValidationError[] = [];
let currentMarkdown = '';

const preview = initializePreview();
const initialDraft = loadDraft();

function showStatus(message: string): void {
  const status = document.getElementById('action-status');
  if (!status) return;
  status.textContent = message;
  window.setTimeout(() => {
    if (status.textContent === message) status.textContent = '';
  }, 3000);
}

function refresh(data: ProjectData, repositoryAuto: boolean): void {
  currentData = data;
  currentMarkdown = generateReadme(data);
  currentErrors = validateProject(data);
  form.setErrors(currentErrors);
  preview.update(currentMarkdown);
  saveDraft({ data, repositoryAuto });

  const copyButton = document.getElementById('copy-readme') as HTMLButtonElement | null;
  const downloadButton = document.getElementById('download-readme') as HTMLButtonElement | null;
  if (copyButton) copyButton.disabled = currentErrors.length > 0;
  if (downloadButton) downloadButton.disabled = currentErrors.length > 0;
}

function fallbackCopy(value: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  return copied;
}

async function copyReadme(): Promise<void> {
  if (currentErrors.length > 0) {
    showStatus('Corrija os campos indicados antes de copiar.');
    return;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(currentMarkdown);
    } else if (!fallbackCopy(currentMarkdown)) {
      throw new Error('Não foi possível copiar o conteúdo.');
    }
    showStatus('README copiado.');
  } catch {
    showStatus('Não foi possível copiar. Selecione o conteúdo na aba Markdown.');
  }
}

function downloadReadme(): void {
  if (currentErrors.length > 0) {
    showStatus('Corrija os campos indicados antes de baixar.');
    return;
  }

  const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'README.md';
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showStatus('README.md baixado.');
}

function bindActions(): void {
  document.getElementById('copy-readme')?.addEventListener('click', () => void copyReadme());
  document.getElementById('download-readme')?.addEventListener('click', downloadReadme);

  document.getElementById('load-example')?.addEventListener('click', () => {
    form.setData(getExampleProject(), false);
    showStatus('Exemplo Scraper - AgroNews carregado.');
  });

  document.getElementById('clear-form')?.addEventListener('click', () => {
    clearDraft();
    form.setData(createEmptyProject(), true);
    clearDraft();
    showStatus('Formulário limpo.');
  });
}

form = initializeForm(
  (data, repositoryAuto) => refresh(data, repositoryAuto),
  initialDraft?.data ?? createEmptyProject(),
  initialDraft?.repositoryAuto ?? true,
);

bindActions();
refresh(form.getData(), initialDraft?.repositoryAuto ?? true);
