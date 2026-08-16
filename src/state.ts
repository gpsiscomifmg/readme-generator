import type { Author, CommandStep, DraftState, ProjectData } from './types';

export const STORAGE_KEY = 'gpsicom-readme-draft-v1';

export function createEmptyProject(): ProjectData {
  return {
    projectName: '',
    repositoryName: '',
    shortDescription: '',
    about: '',
    objectives: [''],
    includeFunctioning: false,
    functioningIntro: '',
    functioningSteps: [],
    functioningOutro: '',
    technologies: [''],
    installSteps: [],
    usesEnv: false,
    executionSteps: [{ description: '', command: '' }],
    executionOutro: '',
    executionUrl: '',
    authors: [{ name: '', github: '', role: '' }],
  };
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.map(asString);
}

function asCommandSteps(value: unknown): CommandStep[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const step = item as Record<string, unknown> | null;
    return {
      description: asString(step?.description),
      command: asString(step?.command),
    };
  });
}

function asAuthors(value: unknown): Author[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const author = item as Record<string, unknown> | null;
    return {
      name: asString(author?.name),
      github: asString(author?.github),
      role: asString(author?.role),
    };
  });
}

export function normalizeProject(value: unknown): ProjectData {
  const raw = (value ?? {}) as Record<string, unknown>;
  const empty = createEmptyProject();
  const objectives = asStringArray(raw.objectives, empty.objectives);
  const technologies = asStringArray(raw.technologies, empty.technologies);
  const executionSteps = asCommandSteps(raw.executionSteps);
  const authors = asAuthors(raw.authors);

  return {
    projectName: asString(raw.projectName),
    repositoryName: asString(raw.repositoryName),
    shortDescription: asString(raw.shortDescription),
    about: asString(raw.about),
    objectives: objectives.length > 0 ? objectives : empty.objectives,
    includeFunctioning: raw.includeFunctioning === true,
    functioningIntro: asString(raw.functioningIntro),
    functioningSteps: asStringArray(raw.functioningSteps, []),
    functioningOutro: asString(raw.functioningOutro),
    technologies: technologies.length > 0 ? technologies : empty.technologies,
    installSteps: asCommandSteps(raw.installSteps),
    usesEnv: raw.usesEnv === true,
    executionSteps:
      executionSteps.length > 0 ? executionSteps : empty.executionSteps,
    executionOutro: asString(raw.executionOutro),
    executionUrl: asString(raw.executionUrl),
    authors: authors.length > 0 ? authors : empty.authors,
  };
}

export function loadDraft(): DraftState | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      data: normalizeProject(parsed.data),
      repositoryAuto: parsed.repositoryAuto !== false,
    };
  } catch {
    return null;
  }
}

export function saveDraft(state: DraftState): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage can be unavailable in private browsing or restricted contexts.
  }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing else is required when local storage cannot be accessed.
  }
}
