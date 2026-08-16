import type { ProjectData } from './types';

export const EXAMPLE_PROJECT: ProjectData = {
  projectName: 'Scraper - AgroNews',
  repositoryName: 'scraper-agronews',
  shortDescription:
    'Scraper visual genérico para coleta automatizada de notícias em páginas web.',
  about: `O **Scraper - AgroNews** é uma ferramenta desenvolvida para permitir a configuração visual de fontes de notícias e automatizar a coleta de conteúdos em diferentes páginas web.

A proposta é reduzir a necessidade de desenvolver um scraper específico para cada site. Em vez disso, o usuário configura visualmente quais elementos da página representam os links das notícias e quais campos devem ser extraídos de cada publicação.

Essas configurações são armazenadas e reutilizadas nas execuções posteriores, permitindo que diferentes sites sejam integrados ao sistema sem alterações específicas no código do scraper.`,
  objectives: [
    'cadastrar diferentes fontes de notícias;',
    'identificar visualmente os links de notícias disponíveis em uma página;',
    'configurar filtros para determinar quais links devem ser coletados;',
    'selecionar visualmente os campos relevantes de uma notícia;',
    'armazenar as notícias coletadas;',
    'evitar a coleta repetida de notícias já processadas;',
    'executar a coleta periodicamente;',
    'permitir a configuração de diferentes sites sem necessidade de alterar o código do scraper.',
  ],
  includeFunctioning: true,
  functioningIntro: `O sistema utiliza uma abordagem baseada em configuração visual.

Inicialmente, o usuário cadastra uma fonte de notícias. Em seguida, acessa a página da fonte por meio da interface de configuração e seleciona os elementos necessários para identificar e extrair as notícias.

As configurações resultantes são armazenadas pelo sistema e posteriormente utilizadas para realizar as coletas de forma automática.

O fluxo principal é:`,
  functioningSteps: [
    'Cadastrar fonte',
    'Identificar links de notícias',
    'Configurar filtros',
    'Selecionar os campos da notícia',
    'Armazenar configuração',
    'Executar coleta automática',
    'Armazenar notícias',
  ],
  functioningOutro: `A configuração é dividida em três etapas principais:

* **Fontes:** cadastro das páginas utilizadas como origem das notícias;
* **Links:** identificação e filtragem dos links encontrados nas fontes;
* **Estrutura da notícia:** seleção visual dos campos que deverão ser extraídos de cada publicação.

Essa separação permite que a mesma infraestrutura de scraping seja utilizada para diferentes sites, considerando as particularidades configuradas para cada fonte.`,
  technologies: ['Python', 'Django', 'HTML', 'Tailwind CSS', 'JavaScript', 'Requests', 'BeautifulSoup'],
  requirements: ['Python 3.10 ou superior', 'pip', 'Git'],
  installSteps: [
    { description: 'Crie um ambiente virtual:', command: 'python -m venv .venv' },
    { description: 'Ative o ambiente virtual:', command: 'source .venv/bin/activate' },
    { description: 'Instale as dependências:', command: 'pip install -r requirements.txt' },
  ],
  usesEnv: true,
  executionSteps: [
    { description: 'Execute as migrações do banco de dados:', command: 'python manage.py migrate' },
    { description: 'Inicie o servidor de desenvolvimento:', command: 'python manage.py runserver' },
  ],
  executionOutro: 'A aplicação estará disponível, por padrão, em:',
  executionUrl: 'http://127.0.0.1:8000/',
  authors: [
    { name: 'Dr. Ciniro Nametala', github: 'ciniro', role: 'Professor responsável' },
    { name: 'Ricardo Antônio', github: 'Ricardo-Caca', role: 'Pesquisador / Desenvolvedor' },
  ],
};

export function getExampleProject(): ProjectData {
  return JSON.parse(JSON.stringify(EXAMPLE_PROJECT)) as ProjectData;
}
