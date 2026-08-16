import { describe, expect, it } from 'vitest';
import { isValidRepositoryName, slugify } from './slug';

describe('slugify', () => {
  it('remove acentos, símbolos e separadores duplicados', () => {
    expect(slugify('  Projeto: Ágil — Web 2025!  ')).toBe('projeto-agil-web-2025');
  });

  it('remove hífens nas extremidades', () => {
    expect(slugify('---Nome---')).toBe('nome');
  });
});

describe('isValidRepositoryName', () => {
  it('aceita nomes no padrão do GPSisCom', () => {
    expect(isValidRepositoryName('scraper-agronews')).toBe(true);
    expect(isValidRepositoryName('projeto2025')).toBe(true);
  });

  it('rejeita maiúsculas, espaços e hífens fora do padrão', () => {
    expect(isValidRepositoryName('Scraper-AgroNews')).toBe(false);
    expect(isValidRepositoryName('scraper agronews')).toBe(false);
    expect(isValidRepositoryName('-scraper')).toBe(false);
    expect(isValidRepositoryName('scraper-')).toBe(false);
  });
});
