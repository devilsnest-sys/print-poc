import { Component, HostListener, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

type DocumentKind = 'Sample HTML' | 'PDF' | 'Image' | 'Text';
type ViewerMode = 'frame' | 'image' | 'pdf-mobile';

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
  rawDocumentUrl = 'sample-document.html';
  viewerMode: ViewerMode = 'frame';
  selectedFileName = '';
  errorMessage = '';

  private objectUrl?: string;

  constructor(private readonly sanitizer: DomSanitizer) {
    this.documentUrl = this.sanitizeUrl(this.rawDocumentUrl);
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
    this.setDocumentSource('sample-document.html', 'frame');
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
    if (this.viewerMode === 'pdf-mobile') {
      this.openDocumentInNewTab();
      return;
    }

    if (this.viewerMode === 'image') {
      this.printFromTemporaryFrame();
      return;
    }

    const viewer = document.getElementById('documentFrame') as HTMLIFrameElement | null;
    const viewerWindow = viewer?.contentWindow;

    if (!viewerWindow) {
      this.errorMessage = 'The document is still loading. Try again in a moment.';
      return;
    }

    viewerWindow.focus();
    viewerWindow.print();
  }

  openDocumentInNewTab(): void {
    window.open(this.rawDocumentUrl, '_blank', 'noopener,noreferrer');
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.documentKind === 'PDF') {
      this.viewerMode = this.isMobileViewer() ? 'pdf-mobile' : 'frame';
    }
  }

  private showBlob(blob: Blob, kind: DocumentKind): void {
    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(blob);
    this.documentKind = kind;
    this.setDocumentSource(this.objectUrl, this.getViewerMode(kind));
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

  private setDocumentSource(url: string, mode: ViewerMode): void {
    this.rawDocumentUrl = url;
    this.documentUrl = this.sanitizeUrl(url);
    this.viewerMode = mode;
  }

  private sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private getViewerMode(kind: DocumentKind): ViewerMode {
    if (kind === 'Image') {
      return 'image';
    }

    if (kind === 'PDF' && this.isMobileViewer()) {
      return 'pdf-mobile';
    }

    return 'frame';
  }

  private isMobileViewer(): boolean {
    return window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
  }

  private printFromTemporaryFrame(): void {
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
