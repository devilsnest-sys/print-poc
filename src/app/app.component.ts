import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

type JsonStyle = Record<string, string | number>;

interface JsonTextBlock {
  type: 'text';
  tag: 'h1' | 'h2' | 'p' | 'strong' | 'span' | 'div';
  text: string;
  className?: string;
  style?: JsonStyle;
}

interface JsonContainerBlock {
  type: 'container';
  tag: 'article' | 'header' | 'section' | 'div' | 'footer';
  className?: string;
  style?: JsonStyle;
  children: JsonBlock[];
}

interface JsonTableBlock {
  type: 'table';
  className?: string;
  style?: JsonStyle;
  columns: string[];
  rows: Array<Array<string | number>>;
  footer?: Array<string | number>;
}

type JsonBlock = JsonTextBlock | JsonContainerBlock | JsonTableBlock;

interface JsonPrintDocument {
  title: string;
  kind: string;
  page: {
    size: string;
    margin: string;
  };
  styles: Record<string, JsonStyle>;
  body: JsonBlock[];
}

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  readonly defaultPrintJson: JsonPrintDocument = {
    title: 'Invoice generated from JSON',
    kind: 'Runtime JSON',
    page: {
      size: 'A4',
      margin: '18mm'
    },
    styles: {
      body: {
        color: '#202938',
        font: '14px/1.5 Arial, sans-serif',
        margin: 0
      },
      page: {
        margin: '28px auto',
        maxWidth: '760px',
        padding: '32px'
      },
      header: {
        alignItems: 'flex-start',
        borderBottom: '2px solid #202938',
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: '18px'
      },
      title: {
        fontSize: '28px',
        margin: '0 0 6px'
      },
      sectionTitle: {
        fontSize: '14px',
        margin: '0 0 8px',
        textTransform: 'uppercase'
      },
      muted: {
        color: '#637083'
      },
      grid: {
        display: 'grid',
        gap: '24px',
        gridTemplateColumns: 'repeat(2, 1fr)',
        margin: '28px 0'
      },
      table: {
        borderCollapse: 'collapse',
        marginTop: '18px',
        width: '100%'
      },
      note: {
        background: '#f4f7fb',
        border: '1px solid #d9e1ec',
        marginTop: '26px',
        padding: '14px'
      }
    },
    body: [
      {
        type: 'container',
        tag: 'article',
        className: 'page',
        children: [
          {
            type: 'container',
            tag: 'header',
            className: 'header',
            children: [
              {
                type: 'container',
                tag: 'div',
                children: [
                  { type: 'text', tag: 'h1', className: 'title', text: 'Invoice' },
                  { type: 'text', tag: 'div', className: 'muted', text: 'Print POC Services' }
                ]
              },
              {
                type: 'container',
                tag: 'div',
                children: [
                  { type: 'text', tag: 'strong', text: 'INV-2048' },
                  { type: 'text', tag: 'div', className: 'muted', text: 'Issued: May 8, 2026' }
                ]
              }
            ]
          },
          {
            type: 'container',
            tag: 'section',
            className: 'grid',
            children: [
              {
                type: 'container',
                tag: 'div',
                children: [
                  { type: 'text', tag: 'h2', className: 'sectionTitle', text: 'Bill To' },
                  { type: 'text', tag: 'strong', text: 'Acme Operations' },
                  { type: 'text', tag: 'p', text: '42 Market Street, Bengaluru, KA' }
                ]
              },
              {
                type: 'container',
                tag: 'div',
                children: [
                  { type: 'text', tag: 'h2', className: 'sectionTitle', text: 'Payment' },
                  { type: 'text', tag: 'p', text: 'Due on receipt' },
                  { type: 'text', tag: 'p', text: 'Status: Ready for print' }
                ]
              }
            ]
          },
          {
            type: 'table',
            className: 'table',
            columns: ['Item', 'Qty', 'Amount'],
            rows: [
              ['Document viewer setup', 1, 'Rs. 4,500.00'],
              ['Print workflow validation', 1, 'Rs. 2,000.00']
            ],
            footer: ['Total', '', 'Rs. 6,500.00']
          },
          {
            type: 'text',
            tag: 'p',
            className: 'note',
            text: 'This PDF-ready document is generated completely from JSON when the app runs.'
          }
        ]
      }
    ]
  };

  jsonInput = JSON.stringify(this.defaultPrintJson, null, 2);
  activePrintJson = this.defaultPrintJson;
  documentTitle = this.defaultPrintJson.title;
  documentKind = this.defaultPrintJson.kind;
  documentUrl: SafeResourceUrl;
  rawDocumentUrl = '';
  errorMessage = '';

  private objectUrl?: string;

  constructor(private readonly sanitizer: DomSanitizer) {
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.generateDocumentFromJson();
  }

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  generateDocumentFromJson(): boolean {
    const parsedJson = this.parseJsonInput();

    if (!parsedJson) {
      return false;
    }

    this.activePrintJson = parsedJson;
    const html = this.createPrintableDocument(parsedJson);

    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    this.rawDocumentUrl = this.objectUrl;
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
    this.documentTitle = parsedJson.title;
    this.documentKind = parsedJson.kind;
    this.errorMessage = '';
    return true;
  }

  printDocument(): void {
    if (!this.generateDocumentFromJson()) {
      return;
    }

    this.printFromGeneratedDocument();
  }

  updateJsonInput(event: Event): void {
    this.jsonInput = (event.target as HTMLTextAreaElement).value;
  }

  resetJsonInput(): void {
    this.jsonInput = JSON.stringify(this.defaultPrintJson, null, 2);
    this.generateDocumentFromJson();
  }

  openDocumentInNewTab(): void {
    window.open(this.rawDocumentUrl, '_blank', 'noopener,noreferrer');
  }

  private createPrintableDocument(documentJson: JsonPrintDocument): string {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${this.escapeHtml(documentJson.title)}</title>
    <style>
      ${this.createCss(documentJson)}
    </style>
  </head>
  <body>
    ${documentJson.body.map((block) => this.renderBlock(block)).join('')}
  </body>
</html>`;
  }

  private parseJsonInput(): JsonPrintDocument | null {
    try {
      const parsed = JSON.parse(this.jsonInput) as unknown;

      if (!this.isJsonPrintDocument(parsed)) {
        this.errorMessage = 'Invalid JSON schema. Include title, kind, page, styles, and body blocks.';
        return null;
      }

      return parsed;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown parsing error.';
      this.errorMessage = `Invalid JSON: ${message}`;
      return null;
    }
  }

  private isJsonPrintDocument(value: unknown): value is JsonPrintDocument {
    if (!this.isRecord(value)) {
      return false;
    }

    return typeof value['title'] === 'string'
      && typeof value['kind'] === 'string'
      && this.isPageConfig(value['page'])
      && this.isStylesConfig(value['styles'])
      && Array.isArray(value['body'])
      && value['body'].every((block) => this.isJsonBlock(block));
  }

  private isPageConfig(value: unknown): value is JsonPrintDocument['page'] {
    return this.isRecord(value)
      && typeof value['size'] === 'string'
      && typeof value['margin'] === 'string';
  }

  private isStylesConfig(value: unknown): value is Record<string, JsonStyle> {
    return this.isRecord(value)
      && Object.values(value).every((style) => this.isJsonStyle(style));
  }

  private isJsonStyle(value: unknown): value is JsonStyle {
    return this.isRecord(value)
      && Object.values(value).every((styleValue) => typeof styleValue === 'string' || typeof styleValue === 'number');
  }

  private isJsonBlock(value: unknown): value is JsonBlock {
    if (!this.isRecord(value) || typeof value['type'] !== 'string') {
      return false;
    }

    if (value['type'] === 'text') {
      return typeof value['tag'] === 'string'
        && ['h1', 'h2', 'p', 'strong', 'span', 'div'].includes(value['tag'])
        && typeof value['text'] === 'string'
        && this.hasValidOptionalBlockAttributes(value);
    }

    if (value['type'] === 'container') {
      return typeof value['tag'] === 'string'
        && ['article', 'header', 'section', 'div', 'footer'].includes(value['tag'])
        && Array.isArray(value['children'])
        && value['children'].every((child) => this.isJsonBlock(child))
        && this.hasValidOptionalBlockAttributes(value);
    }

    if (value['type'] === 'table') {
      return Array.isArray(value['columns'])
        && value['columns'].every((column) => typeof column === 'string')
        && Array.isArray(value['rows'])
        && value['rows'].every((row) => Array.isArray(row) && row.every((cell) => this.isPrintableCell(cell)))
        && (value['footer'] === undefined || (Array.isArray(value['footer']) && value['footer'].every((cell) => this.isPrintableCell(cell))))
        && this.hasValidOptionalBlockAttributes(value);
    }

    return false;
  }

  private hasValidOptionalBlockAttributes(value: Record<string, unknown>): boolean {
    return (value['className'] === undefined || typeof value['className'] === 'string')
      && (value['style'] === undefined || this.isJsonStyle(value['style']));
  }

  private isPrintableCell(value: unknown): value is string | number {
    return typeof value === 'string' || typeof value === 'number';
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private createCss(documentJson: JsonPrintDocument): string {
    const classRules = Object.entries(documentJson.styles)
      .map(([className, style]) => {
        const selector = className === 'body' ? 'body' : `.${this.toKebabCase(className)}`;
        return `${selector} { ${this.createStyleDeclaration(style)} }`;
      })
      .join('\n');

    return `
      @page { size: ${documentJson.page.size}; margin: ${documentJson.page.margin}; }
      ${classRules}
      th, td { border-bottom: 1px solid #d8dee8; padding: 12px 8px; text-align: left; }
      th:last-child, td:last-child { text-align: right; }
      tfoot td { border-bottom: 0; font-weight: 700; }
      @media print {
        .page { margin: 0; max-width: none; padding: 0; }
      }
    `;
  }

  private renderBlock(block: JsonBlock): string {
    if (block.type === 'text') {
      return this.renderTextBlock(block);
    }

    if (block.type === 'table') {
      return this.renderTableBlock(block);
    }

    const children = block.children.map((child) => this.renderBlock(child)).join('');
    return `<${block.tag}${this.createAttributes(block.className, block.style)}>${children}</${block.tag}>`;
  }

  private renderTextBlock(block: JsonTextBlock): string {
    return `<${block.tag}${this.createAttributes(block.className, block.style)}>${this.escapeHtml(block.text)}</${block.tag}>`;
  }

  private renderTableBlock(block: JsonTableBlock): string {
    const header = block.columns.map((column) => `<th>${this.escapeHtml(String(column))}</th>`).join('');
    const rows = block.rows
      .map((row) => `<tr>${row.map((cell) => `<td>${this.escapeHtml(String(cell))}</td>`).join('')}</tr>`)
      .join('');
    const footer = block.footer
      ? `<tfoot><tr>${block.footer.map((cell) => `<td>${this.escapeHtml(String(cell))}</td>`).join('')}</tr></tfoot>`
      : '';

    return `<table${this.createAttributes(block.className, block.style)}>
      <thead><tr>${header}</tr></thead>
      <tbody>${rows}</tbody>
      ${footer}
    </table>`;
  }

  private createAttributes(className?: string, style?: JsonStyle): string {
    const attributes: string[] = [];

    if (className) {
      attributes.push(`class="${this.toKebabCase(className)}"`);
    }

    if (style) {
      attributes.push(`style="${this.escapeHtml(this.createStyleDeclaration(style))}"`);
    }

    return attributes.length ? ` ${attributes.join(' ')}` : '';
  }

  private createStyleDeclaration(style: JsonStyle): string {
    return Object.entries(style)
      .map(([property, value]) => `${this.toKebabCase(property)}: ${value}`)
      .join('; ');
  }

  private toKebabCase(value: string): string {
    return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }
  }

  private printFromGeneratedDocument(): void {
    const frame = document.createElement('iframe');
    frame.style.left = '-9999px';
    frame.style.position = 'fixed';
    frame.style.top = '0';
    frame.style.width = '1px';
    frame.style.height = '1px';
    frame.src = this.rawDocumentUrl;
    document.body.appendChild(frame);

    frame.onload = () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      window.setTimeout(() => frame.remove(), 1000);
    };
  }
}
