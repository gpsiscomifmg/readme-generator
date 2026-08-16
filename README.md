# Gerador de README do GPSisCom

Aplicação web estática para criar arquivos `README.md` padronizados para os projetos do Grupo de Pesquisa em Sistemas Computacionais (GPSisCom).

## Executar localmente

Requisitos: Node.js 22 ou superior e npm.

```bash
npm install
npm run dev
```

O Vite exibirá o endereço local no terminal.

## Comandos disponíveis

```bash
npm run dev      # inicia o servidor de desenvolvimento
npm run test     # executa os testes unitários
npm run build    # gera o build de produção em dist/
npm run preview  # serve o build localmente
```

## Arquitetura

- `src/types.ts`: contratos do estado do formulário;
- `src/state.ts`: estado inicial e rascunho em `localStorage`;
- `src/generator/`: slug, validação e geração pura do Markdown;
- `src/ui/`: formulário, listas dinâmicas e preview sanitizado;
- `src/example.ts`: dados do exemplo Scraper - AgroNews;
- `src/main.ts`: composição da interface e ações de copiar/baixar.

O Markdown renderizado usa `marked` e é sanitizado com `DOMPurify` antes de ser inserido no DOM. Nenhum dado é enviado para um servidor e o avatar dos autores usa apenas os URLs públicos convencionais do GitHub.

## GitHub Pages

O Vite está configurado com a base `/readme-generator/`, correspondente ao Project Page esperado:

```text
https://gpsiscomifmg.github.io/readme-generator/
```

O workflow `.github/workflows/deploy.yml` executa em pushes para `main`, instala as dependências, gera `dist/` e publica o artefato usando as actions oficiais do GitHub Pages.
