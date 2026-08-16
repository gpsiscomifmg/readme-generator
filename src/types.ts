export interface CommandStep {
  description: string;
  command: string;
}

export interface Author {
  name: string;
  github: string;
  role: string;
}

export interface ProjectData {
  projectName: string;
  repositoryName: string;
  shortDescription: string;
  about: string;
  objectives: string[];
  includeFunctioning: boolean;
  functioningIntro: string;
  functioningSteps: string[];
  functioningOutro: string;
  technologies: string[];
  installSteps: CommandStep[];
  usesEnv: boolean;
  executionSteps: CommandStep[];
  executionOutro: string;
  executionUrl: string;
  authors: Author[];
}

export interface ValidationError {
  path: string;
  message: string;
}

export interface DraftState {
  data: ProjectData;
  repositoryAuto: boolean;
}
