# Canva Test - Photobook Editor

This repository contains a photobook editor web app built with React and Vite.

The main application is inside `photobook-editor`.

## Project Structure

- `photobook-editor/` - Main React application
- `package.json` (root) - Minimal dependency file

## Prerequisites

- Node.js 18 or newer (Node.js 20 recommended)
- npm (comes with Node.js)

## Setup

1. Open a terminal in this folder.
2. Go to the app folder:

   ```bash
   cd photobook-editor
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Run in Development

From `photobook-editor`:

```bash
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`).
Open it in your browser.

## Build for Production

From `photobook-editor`:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Lint

From `photobook-editor`:

```bash
npm run lint
```

## How to Use the Editor

1. Upload one or more images from the left panel.
2. Choose a layout from the layouts panel.
3. Click or drag uploaded images into layout frames.
4. Select an image to adjust zoom and positioning.
5. Add text boxes and customize font, size, and color.
6. Add or remove pages using the page strip at the bottom.
7. Use **Save** to download the project as JSON.
8. Use **Export PDF** to export all pages into a PDF.

## Notes

- Maximum pages supported: 30.
- Exported PDF file name: `photobook.pdf`.
- Saved project file name: `photobook-project.json`.
