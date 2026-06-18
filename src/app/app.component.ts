import { Component } from '@angular/core';

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
export class AppComponent {
  readonly defaultPrintJson: JsonPrintDocument = {
    title: 'Administration of IV Heparin',
    kind: 'Skill Evaluation',
    page: {
      size: 'A4',
      margin: '18mm'
    },
    styles: {
      body: {
        color: '#1f2937',
        font: '13px/1.5 Arial, sans-serif',
        margin: 0
      },
      page: {
        margin: '20px auto',
        maxWidth: '820px',
        padding: '28px'
      },
      header: {
        alignItems: 'flex-start',
        borderBottom: '2px solid #1f2937',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '24px',
        paddingBottom: '16px'
      },
      title: {
        fontSize: '26px',
        margin: '0 0 6px'
      },
      sectionTitle: {
        fontSize: '14px',
        margin: '0 0 8px',
        textTransform: 'uppercase'
      },
      muted: {
        color: '#5f6f84'
      },
      table: {
        borderCollapse: 'collapse',
        fontSize: '12px',
        marginTop: '20px',
        width: '100%'
      },
      note: {
        background: '#f6f8fb',
        border: '1px solid #d8dee8',
        marginTop: '18px',
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
                  { type: 'text', tag: 'h1', className: 'title', text: 'Skill Evaluation' },
                  { type: 'text', tag: 'div', className: 'muted', text: 'Administration of IV Heparin' }
                ]
              },
              {
                type: 'container',
                tag: 'div',
                children: [
                  { type: 'text', tag: 'strong', text: 'Publish Date: May 22, 2026' },
                  { type: 'text', tag: 'div', className: 'muted', text: 'Educational checklist' }
                ]
              }
            ]
          },
          {
            type: 'container',
            tag: 'section',
            className: 'note',
            children: [
              { type: 'text', tag: 'p', text: 'This checklist identifies the steps needed to administer IV heparin and provides rationales explaining why the steps are performed.' },
              { type: 'text', tag: 'p', text: 'Referenced and adapted from DynaHealth. (n.d.). Administering IV heparin to adults; and Smythe, M. A., Priziola, J., Dobesh, P. P., Wirth, D., Cuker, A., & Wittkowsky, A. K. (2016). Guidance for the practical management of the heparin anticoagulants in the treatment of venous thromboembolism. Journal of Thrombosis and Thrombolysis, 41(1), 165-86. https://doi.org/10.1007/s11239-015-1315-2' },
              { type: 'text', tag: 'p', text: 'This content is for educational purposes only and should be used as a guide, subject to organizational protocols and applicable regulations.' }
            ]
          },
          {
            type: 'table',
            className: 'table',
            columns: ['#', 'Step', 'Checklist Item', 'Rationale'],
            rows: [
              [1, 'Check', 'Verify the five rights of medication administration by checking the medication label to the MAR three times: upon removal from storage, before preparation, and before administration.', 'Prevents medication errors'],
              [2, 'Check', 'Check the medication expiration date and any medication allergies or contraindications to the medication.', 'Prevents medication errors'],
              [3, 'Check', 'Ensure that protamine sulfate is available in case of heparin overdose. Verify the organization protocol for heparin reversal and emergency management.', 'Heparin overdose can lead to hemorrhage, and protamine sulfate is the reversal agent.'],
              [4, 'Supplies', 'Gather supplies including the heparin infusion, primary IV tubing, infusion pump, flush syringe, and antiseptic wipes.', 'Supports efficiency and prevents disruption during the procedure'],
              [5, 'Rights', 'Support privacy, safety, comfort, and dignity during the entire procedure.', 'Protects the individual rights'],
              [6, 'Identify', 'Identify yourself by name and confirm the individual identity per organizational policy.', 'Minimizes anxiety and prevents medical errors'],
              [7, 'Explain', 'Explain the procedure and allow time for questions. Inform the individual about how heparin works and its side effects. Instruct the individual to report signs of bleeding.', 'Engages the individual and alleviates anxiety'],
              [8, 'Infection Control', 'Perform hand hygiene. Use infection control measures and standard precautions during the entire procedure.', 'Prevents the transmission of microorganisms'],
              [9, 'Scope Of Practice', 'Confirm that you are permitted to administer IV heparin infusions based on your competency, training, and scope of practice. Review the protocol if needed.', 'Heparin infusions require increased monitoring and care.'],
              [10, 'Review Indications', 'Review the medical record and identify the provider stated indication for the heparin infusion. If unclear, seek clarification. Contact the provider if potential contraindications exist.', 'Heparin is a HIGH ALERT medication. Checking contraindications promotes safe medication administration.'],
              [11, 'Labs', 'Review baseline coagulation labs, platelet levels, and hematocrit. Draw baseline labs if indicated and review the most recent platelet level.', 'Coagulation studies guide titration. Platelet trends help determine if HIT has developed.'],
              [12, 'Weight', 'Obtain the individual most recent weight in kilograms.', 'Heparin is often dosed by weight.'],
              [13, 'Obtain Medication', 'Obtain the pre-mixed heparin IV bag. Confirm the medication concentration in the bag matches the provider order.', 'A premixed IV bag helps prevent medication errors. Nurses should not mix heparin for IV infusion.'],
              [14, 'Infusion Rate', 'Determine the starting heparin dose and infusion rate. Protocols may include an 80 unit/kg bolus followed by 18 units/kg/hr, with maximums specified when needed.', 'The rate may be determined by protocol or physician order.'],
              [15, 'IV Access', 'Position the individual to attach the infusion to IV access. Preferably use a dedicated IV line. Consult pharmacy if compatibility is uncertain.', 'Prevents incompatibilities and inadvertent boluses that can cause adverse events.'],
              [16, 'Prime Heparin', 'Hang the heparin bag, prime the IV tubing, insert the primed line into the pump, and label the tubing.', 'Priming prevents air bubbles and minimizes pump alarms that delay administration.'],
              [17, 'Program Pump', 'Program the IV pump with the bolus dose and infusion rate. Confirm the pump is set to Guardrails mode or another dose-error reduction system.', 'Programming the pump correctly helps prevent medication errors.'],
              [18, 'Verification', 'Before starting, have a second RN compare the heparin setup to the MAR, including rights, applicable lab values, and concentration. Document the second check.', 'Two-nurse verification adds a safety layer against medication errors.'],
              [19, 'Clean Injection Port', 'Disinfect the injection port with antiseptic according to policy. Allow it to dry before attaching tubing.', 'A clean injection port prevents the spread of microorganisms.'],
              [20, 'Attach Tubing To Patient', 'Attach heparin tubing to IV access, preferably at the y-site nearest the individual when applicable. Ensure no incompatible medications run in the same IV line. Start the infusion.', 'Ensures medication enters the vein and prevents incompatibilities or inadvertent boluses.'],
              [21, 'Labs', 'Draw coagulation labs at appropriate intervals. Monitor for decreasing platelet levels and notify the provider if HIT is suspected.', 'Monitoring informs infusion rate changes and helps identify HIT.'],
              [22, 'Monitor', 'Provide ongoing monitoring per policy. Check the pump with a second RN during shift changes, rate changes, new bags, relief coverage, and routine intervals. Monitor for bleeding.', 'Frequent checks catch errors and monitoring for bleeding can prevent significant adverse effects.'],
              [23, 'Infection Control', 'Dispose of contaminated supplies and perform hand hygiene.', 'Prevents cross-contamination and transmission of microorganisms'],
              [24, 'Document', 'Document in the MAR.', 'Tracks all care activities']
            ]
          }
        ]
      }
    ]
  };

  jsonInput = JSON.stringify(this.defaultPrintJson, null, 2);
  activePrintJson = this.defaultPrintJson;
  documentTitle = this.defaultPrintJson.title;
  documentKind = this.defaultPrintJson.kind;
  errorMessage = '';

  generateDocumentFromJson(): boolean {
    const parsedJson = this.parseJsonInput();

    if (!parsedJson) {
      return false;
    }

    this.activePrintJson = parsedJson;
    this.documentTitle = parsedJson.title;
    this.documentKind = parsedJson.kind;
    this.errorMessage = '';
    return true;
  }

  printDocument(): void {
    if (!this.generateDocumentFromJson()) {
      return;
    }

    const html = this.createPrintableDocument(this.activePrintJson);
    this.openPrintWindow(html, this.activePrintJson.title);
  }

  updateJsonInput(event: Event): void {
    this.jsonInput = (event.target as HTMLTextAreaElement).value;
  }

  resetJsonInput(): void {
    this.jsonInput = JSON.stringify(this.defaultPrintJson, null, 2);
    this.activePrintJson = this.defaultPrintJson;
    this.documentTitle = this.defaultPrintJson.title;
    this.documentKind = this.defaultPrintJson.kind;
    this.errorMessage = '';
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

  private openPrintWindow(html: string, title: string): void {
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      this.errorMessage = 'Print window was blocked. Please allow pop-ups and try again.';
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.document.title = title;
    printWindow.focus();
    printWindow.setTimeout(() => {
      printWindow.print();
    }, 600);
  }
}
