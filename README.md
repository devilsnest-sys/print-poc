# Print POC

Angular 21 NgModule-based document print proof of concept.

## Run

Install Node.js first. Angular 21 requires Node.js `^20.19.0 || ^22.12.0 || ^24.0.0`.

```bash
npm install
npm start
```

Then open `http://localhost:4200`.

## What It Does

- Uses `AppModule` and `platformBrowserDynamic`; standalone components are disabled.
- Opens the document inside the app in a browser-native iframe viewer.
- Prints the embedded document with `iframe.contentWindow.print()`.
- Uses no document rendering libraries.
- Supports the bundled HTML sample plus user-selected PDF, image, and text files.

DOC/DOCX files are not browser-renderable without conversion or an external parser, so this POC intentionally does not claim support for them.
