# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run lint` — run ESLint
- `npm run preview` — preview production build locally

No test framework is configured.

## Architecture

This is a Japanese business document (invoice/quotation/delivery note/receipt) generator built with React 19 + Vite. It renders pixel-accurate replicas of documents from accounting platforms and supports PDF export via html2canvas + jsPDF.

### Platform Registry Pattern

The app is designed to support multiple accounting platforms. Each platform is registered in `src/data/registry.js` with an id, display names, and a list of supported document types. Currently only MoneyForward is implemented.

**To add a new platform:**
1. Add an entry to `platforms` array in `src/data/registry.js`
2. Create `src/data/<platform>.js` with document data (sender, recipient, items, etc.)
3. Create `src/pages/<Platform>Page.jsx` (and `.css`) for the platform-specific viewer UI
4. Add a route in `src/App.jsx` matching the pattern `/<platformId>/:docType`

### Key Files

- `src/components/Document.jsx` — shared invoice/document renderer used by all platforms. Handles line item tables, tax calculation (grouped by rate), totals, bank info, and notes. All currency formatting uses `ja-JP` locale.
- `src/data/moneyforward.js` — document data definitions (invoice, quotation, delivery, receipt) with sample sender/recipient/items.
- `src/pages/MoneyForwardPage.jsx` — MoneyForward acceptance page replica with document preview, accept button, and PDF download.

### Routing

Uses react-router-dom with `BrowserRouter`. Routes follow `/:platformId/:docType` pattern. Vercel rewrites configured in `vercel.json` for SPA client-side routing.

## Code Style

- JSX (no TypeScript)
- ESLint with react-hooks and react-refresh plugins
- Unused vars rule ignores capitalized/underscore-prefixed names (`varsIgnorePattern: '^[A-Z_]'`)
- All UI text is in Japanese
