import DOMPurify from 'dompurify';
import { marked } from 'marked';

export interface PreviewController {
  update(markdown: string): void;
}

export function initializePreview(): PreviewController {
  const visualTab = document.getElementById('visual-tab');
  const markdownTab = document.getElementById('markdown-tab');
  const visualPreview = document.getElementById('visual-preview');
  const markdownPreview = document.getElementById('markdown-preview') as HTMLTextAreaElement | null;

  if (!visualTab || !markdownTab || !visualPreview || !markdownPreview) {
    throw new Error('Elementos do preview não foram encontrados.');
  }

  const setTab = (tab: 'visual' | 'markdown'): void => {
    const visualActive = tab === 'visual';
    visualTab.classList.toggle('is-active', visualActive);
    markdownTab.classList.toggle('is-active', !visualActive);
    visualTab.setAttribute('aria-selected', String(visualActive));
    markdownTab.setAttribute('aria-selected', String(!visualActive));
    visualPreview.classList.toggle('hidden', !visualActive);
    markdownPreview.classList.toggle('hidden', visualActive);
  };

  visualTab.addEventListener('click', () => setTab('visual'));
  markdownTab.addEventListener('click', () => setTab('markdown'));

  return {
    update(markdown: string): void {
      const rendered = marked.parse(markdown, { async: false });
      visualPreview.innerHTML = DOMPurify.sanitize(String(rendered));
      markdownPreview.value = markdown;
    },
  };
}
