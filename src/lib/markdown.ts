import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: false,
});

/**
 * Convert Markdown body copy to HTML for rich-text fields.
 * marked does not execute script; keep styling in site CSS only.
 */
export function renderMarkdown(source: string | undefined | null): string {
  if (!source?.trim()) return '';
  const result = marked.parse(source, { async: false });
  return typeof result === 'string' ? result : '';
}
