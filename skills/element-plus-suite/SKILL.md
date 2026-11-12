---
name: element-plus-suite
description: "Use when writing Vue 3 code with element-plus-suite: component imports, props, events, slots, types, and usage examples."
---

# Element Plus Suite

Use the installed `element-plus-suite` package.

## Import

Check the app entry (`main.ts`, `main.js`, or `app.ts`) first.

Global registration exists (`app.use(ElementPlusSuite)`): do not import runtime components in the SFC. Type imports are still required.

No global registration:

```ts
import { ElButtonPro } from 'element-plus-suite'
```

Import only what is used. Put the Suite CSS import once in the app entry:

```ts
import 'element-plus-suite/dist/index.css'
```

## Rules

- Use kebab-case props in templates: `icon-placement`, `hover-gradient`.
- Import TypeScript types explicitly with `import type`.
- Do not import Suite CSS inside an SFC.
- Keep native Element Plus props, events, and slots unless a reference says otherwise.
- Use only the APIs documented in the references.

## Components

- [ElButtonPro](references/button-pro.md) — Button props and examples.
- [ElTablePro](references/table-pro.md) — Table props, columns, requests, filters, and events.
- [ElFormPro](references/form-pro.md) — Form schema, layout, buttons, and instance methods.

## Links

- https://th74100.github.io/element-plus-suite/
- https://element-plus.org/
