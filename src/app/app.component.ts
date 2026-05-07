import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

type DocumentKind = 'Sample HTML' | 'PDF' | 'Image' | 'Text';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  documentTitle = 'Sample invoice';
  documentKind: DocumentKind = 'Sample HTML';
  documentUrl: SafeResourceUrl;
  selectedFileName = '';
  errorMessage = '';

  private objectUrl?: string;

  constructor(private readonly sanitizer: DomSanitizer) {
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/sample-document.html');
  }

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  loadSampleDocument(): void {
    this.revokeObjectUrl();
    this.documentTitle = 'Sample invoice';
    this.documentKind = 'Sample HTML';
    this.selectedFileName = '';
    this.errorMessage = '';
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/sample-document.html');
  }

  openFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.errorMessage = '';
    this.selectedFileName = file.name;
    this.documentTitle = file.name;

    if (file.type === 'application/pdf') {
      this.showBlob(file, 'PDF');
      return;
    }

    if (file.type.startsWith('image/')) {
      this.showBlob(file, 'Image');
      return;
    }

    if (file.type.startsWith('text/')) {
      this.showTextFile(file);
      return;
    }

    input.value = '';
    this.errorMessage = 'This viewer supports PDF, image, and text documents without external libraries.';
  }

  printDocument(): void {
    const viewer = document.getElementById('documentFrame') as HTMLIFrameElement | null;
    const viewerWindow = viewer?.contentWindow;

    if (!viewerWindow) {
      this.errorMessage = 'The document is still loading. Try again in a moment.';
      return;
    }

    viewerWindow.focus();
    viewerWindow.print();
  }

  private showBlob(blob: Blob, kind: DocumentKind): void {
    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(blob);
    this.documentKind = kind;
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
  }

  private showTextFile(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      const text = String(reader.result ?? '');
      const html = this.createPrintableTextDocument(file.name, text);
      this.showBlob(new Blob([html], { type: 'text/html' }), 'Text');
    };

    reader.onerror = () => {
      this.errorMessage = 'The selected file could not be read.';
    };

    reader.readAsText(file);
  }

  private createPrintableTextDocument(title: string, text: string): string {
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${this.escapeHtml(title)}</title>
    <style>
      body { color: #1d2433; font: 14px/1.6 Arial, sans-serif; margin: 32px; }
      pre { font: inherit; margin: 0; white-space: pre-wrap; word-break: break-word; }
    </style>
  </head>
  <body>
    <pre>${this.escapeHtml(text)}</pre>
  </body>
</html>`;
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
}
